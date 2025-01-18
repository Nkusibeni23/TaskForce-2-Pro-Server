import {
  CreateExpenseDto,
  ExpenseQueryParams,
  UpdateExpenseDto,
} from "../interfaces/Income.interface";
import Expense from "../models/ExpenseModel";
import { CustomError } from "../utils/customError";

export class ExpenseService {
  async createExpense(data: CreateExpenseDto) {
    const { userId, title, amount, category, description, date } = data;

    // Validate required fields
    if (!title || !amount || !category || !date) {
      throw new CustomError("Missing required fields", 400);
    }

    // Create new expense
    const expense = new Expense({
      userId,
      title,
      amount,
      category,
      description,
      date,
      type: "expense",
    });

    return await expense.save();
  }

  async getExpenses(userId: string, queryParams: ExpenseQueryParams = {}) {
    const {
      startDate,
      endDate,
      category,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
    } = queryParams;

    // Build query
    const query: any = { userId };

    // Add date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add amount range filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = minAmount;
      if (maxAmount) query.amount.$lte = maxAmount;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [expenses, total] = await Promise.all([
      Expense.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      Expense.countDocuments(query),
    ]);

    return {
      expenses,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async getExpenseById(id: string, userId: string) {
    const expense = await Expense.findOne({ _id: id, userId });

    if (!expense) {
      throw new CustomError("Expense not found", 404);
    }

    return expense;
  }

  async updateExpense(id: string, userId: string, updates: UpdateExpenseDto) {
    // Check if expense exists and belongs to user
    const expense = await this.getExpenseById(id, userId);

    // Update the expense
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      { ...updates },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      throw new CustomError("Failed to update expense", 500);
    }

    return updatedExpense;
  }

  async deleteExpense(id: string, userId: string) {
    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      throw new CustomError("Expense not found", 404);
    }

    return expense;
  }

  async getExpenseStats(userId: string, startDate: Date, endDate: Date) {
    const stats = await Expense.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            category: "$category",
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
          avgAmount: { $avg: "$amount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          totalAmount: -1,
        },
      },
    ]);

    return stats;
  }
}

export const expenseService = new ExpenseService();
