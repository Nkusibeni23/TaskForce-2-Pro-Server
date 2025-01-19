import { CustomError } from "../utils/customError";
import { IExpense } from "../interfaces/expense.interface";
import Budget from "../models/BudgetModel";
import Expense from "../models/ExpenseModel";

export class ExpenseService {
  async createExpense(data: IExpense) {
    const { userId, title, amount, category, description, date, budget } = data;

    // Validate the budget
    const budgetData = await Budget.findOne({ _id: budget, userId });
    if (!budgetData) {
      throw new CustomError("Budget not found", 404);
    }

    // Check if the amount exceeds the remaining budget
    if (budgetData.currentSpending + amount > budgetData.limit) {
      throw new CustomError("Expense exceeds budget limit", 400);
    }

    // Create the expense
    const expense = new Expense({
      userId,
      title,
      amount,
      category,
      description,
      date,
      budget,
      type: "expense",
    });

    // Update the current spending for the budget
    budgetData.currentSpending += amount;
    await budgetData.save();

    return await expense.save();
  }

  async getExpenses(userId: string, queryParams: any = {}) {
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

  async deleteExpense(id: string, userId: string) {
    const expense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!expense) {
      throw new CustomError("Expense not found", 404);
    }

    const budget = await Budget.findById(expense.budget);
    if (budget) {
      budget.currentSpending -= expense.amount;
      await budget.save();
    }

    return expense;
  }
}

export const expenseService = new ExpenseService();
