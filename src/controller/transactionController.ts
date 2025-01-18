import { Request, Response, NextFunction } from "express";
import Transaction from "../models/TransactionModel";
import { CustomError } from "../utils/customError";

// Create a new transaction
export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { amount, type, account, category, description } = req.body;

    const transaction = new Transaction({
      amount,
      type,
      account,
      category,
      description,
    });

    const savedTransaction = await transaction.save();
    res
      .status(201)
      .json({ message: "Transaction created successfully", savedTransaction });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
};

// Get all transactions
export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const transactions = await Transaction.find()
      .populate("account")
      .populate("category");
    res.status(200).json(transactions);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
};

// Get a transaction by ID
export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findById(id)
      .populate("account")
      .populate("category");

    if (!transaction) {
      throw new CustomError("Transaction not found", 404);
    }

    res.status(200).json(transaction);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
};

// Delete a transaction
export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      throw new CustomError("Transaction not found", 404);
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
      deletedTransaction,
    });
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
};
