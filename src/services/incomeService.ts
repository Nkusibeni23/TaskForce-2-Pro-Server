import { CustomError } from "../utils/customError";
import { IIncome } from "../interfaces/Income.interface";
import Income from "../models/IncomeModel";
import Account from "../models/AccountModel";
import { createNotification } from "./notificationService";

export class IncomeService {
  async createIncome(data: IIncome) {
    const { userId, title, amount, category, description, date, account } =
      data;

    // Validate the account
    const accountData = await Account.findOne({ _id: account, userId });
    if (!accountData) {
      throw new CustomError("Account not found", 404);
    }

    // Create the income
    const income = new Income({
      userId,
      title,
      amount,
      category,
      description,
      date,
      account,
      type: "income",
    });

    // Start a transaction
    const session = await Income.startSession();
    session.startTransaction();

    try {
      // Save the income
      await income.save({ session });

      // Update the account balance
      accountData.balance += amount;
      await accountData.save({ session });

      // Create a notification
      await createNotification({
        userId,
        type: "income",
        message: `New income of ${amount} added to ${accountData.name}`,
        relatedId: income._id.toString(),
      });

      await session.commitTransaction();
      session.endSession();

      return income;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getIncomes(userId: string, queryParams: any = {}) {
    const {
      startDate,
      endDate,
      category,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
    } = queryParams;

    const query: any = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (category) query.category = category;
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = minAmount;
      if (maxAmount) query.amount.$lte = maxAmount;
    }

    const skip = (page - 1) * limit;
    const [incomes, total] = await Promise.all([
      Income.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      Income.countDocuments(query),
    ]);

    return {
      incomes,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async deleteIncome(id: string, userId: string) {
    const session = await Income.startSession();
    session.startTransaction();

    try {
      const income = await Income.findOneAndDelete(
        { _id: id, userId },
        { session }
      );

      if (!income) {
        throw new CustomError("Income not found", 404);
      }

      const account = await Account.findById(income.account);
      if (account) {
        account.balance -= income.amount;
        await account.save({ session });
      }

      await createNotification({
        userId,
        type: "income_deleted",
        message: `Income of ${income.amount} deleted`,
        relatedId: income._id.toString(),
      });

      await session.commitTransaction();
      session.endSession();

      return income;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

export const incomeService = new IncomeService();
