import Transaction from "../models/TransactionModel";
import Account from "../models/AccountModel";
import { CustomError } from "../utils/customError";
import mongoose from "mongoose";
import {
  CreateTransactionDto,
  TransactionQueryParams,
} from "../interfaces/transaction.interface";

export class TransactionService {
  async createTransaction(data: CreateTransactionDto) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        userId,
        amount,
        type,
        account: accountId,
        category,
        description,
        date = new Date(),
      } = data;

      // Verify account exists and belongs to user
      const account = await Account.findOne({
        _id: accountId,
        userId,
      }).session(session);

      if (!account) {
        throw new CustomError("Account not found", 404);
      }

      // Create transaction
      const transaction = new Transaction({
        userId,
        amount,
        type,
        account: accountId,
        category,
        description,
        date,
      });

      await transaction.save({ session });

      // Update account balance
      const balanceChange = type === "income" ? amount : -amount;
      account.balance += balanceChange;
      await account.save({ session });

      // Commit the transaction
      await session.commitTransaction();

      // Populate references and return
      return await Transaction.findById(transaction._id)
        .populate("account")
        .populate("category");
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getTransactions(
    userId: string,
    queryParams: TransactionQueryParams = {}
  ) {
    const {
      startDate,
      endDate,
      type,
      account,
      category,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
    } = queryParams;

    // Build query
    const query: any = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    if (type) query.type = type;
    if (account) query.account = account;
    if (category) query.category = category;

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = minAmount;
      if (maxAmount) query.amount.$lte = maxAmount;
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate("account")
        .populate("category")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments(query),
    ]);

    return {
      transactions,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async getTransactionById(id: string, userId: string) {
    const transaction = await Transaction.findOne({ _id: id, userId })
      .populate("account")
      .populate("category");

    if (!transaction) {
      throw new CustomError("Transaction not found", 404);
    }

    return transaction;
  }

  async deleteTransaction(id: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find transaction and verify it belongs to user
      const transaction = await Transaction.findOne({
        _id: id,
        userId,
      }).session(session);

      if (!transaction) {
        throw new CustomError("Transaction not found", 404);
      }

      // Find associated account
      const account = await Account.findOne({
        _id: transaction.account,
        userId,
      }).session(session);

      if (!account) {
        throw new CustomError("Associated account not found", 404);
      }

      // Reverse the balance change
      const balanceChange =
        transaction.type === "income"
          ? -transaction.amount
          : transaction.amount;

      account.balance += balanceChange;
      await account.save({ session });

      // Delete the transaction
      await transaction.deleteOne({ session });

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getTransactionStats(userId: string, startDate: Date, endDate: Date) {
    const stats = await Transaction.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            type: "$type",
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    return stats;
  }
}

export const transactionService = new TransactionService();
