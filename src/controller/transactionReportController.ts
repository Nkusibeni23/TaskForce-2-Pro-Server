import { Request, Response, NextFunction } from "express";
import Transaction from "../models/TransactionModel";
import { CustomError } from "../utils/customError";
import { isValidDate } from "../utils/dateUtils";

// Generate Report based on time period or date range
export const generateReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { startDate, endDate, timePeriod } = req.query;

  let dateFilter: any = {};

  try {
    if (timePeriod) {
      const now = new Date();

      // Handle predefined time periods (daily, weekly, monthly)
      switch (timePeriod) {
        case "daily":
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setHours(0, 0, 0, 0)),
              $lte: new Date(now.setHours(23, 59, 59, 999)),
            },
          };
          break;
        case "weekly":
          const startOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay())
          );
          const endOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay() + 6)
          );
          dateFilter = {
            createdAt: {
              $gte: startOfWeek,
              $lte: endOfWeek,
            },
          };
          break;
        case "monthly":
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          dateFilter = {
            createdAt: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          };
          break;
        default:
          throw new CustomError("Invalid time period", 400);
      }
    } else if (startDate && endDate) {
      if (
        !isValidDate(startDate as string) ||
        !isValidDate(endDate as string)
      ) {
        throw new CustomError("Invalid start or end date", 400);
      }

      dateFilter = {
        createdAt: {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string),
        },
      };
    } else {
      throw new CustomError(
        "Either timePeriod or startDate and endDate must be provided",
        400
      );
    }

    // Retrieve transactions from the database based on the dateFilter
    const transactions = await Transaction.find(dateFilter)
      .populate("account")
      .populate("category");

    if (!transactions || transactions.length === 0) {
      throw new CustomError("No transactions found for the given period", 404);
    }

    // Calculate total income, total expenses, and balance
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncome += transaction.amount;
      } else if (transaction.type === "expense") {
        totalExpenses += transaction.amount;
      }
    });

    const balance = totalIncome - totalExpenses;

    // Prepare the report data
    const report = {
      totalIncome,
      totalExpenses,
      balance,
      transactionsSummary: transactions.map((transaction) => ({
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        description: transaction.description,
        date: transaction.createdAt,
      })),
    };

    res.status(200).json(report);
  } catch (error: any) {
    next(new CustomError(error.message, 500));
  }
};
