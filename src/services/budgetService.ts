import mongoose from "mongoose";
import {
  BaseBudget,
  PopulatedAccount,
  PopulatedBudget,
  PopulatedCategory,
} from "../interfaces/budget.interface";
import AccountModel from "../models/AccountModel";
import BudgetModel from "../models/BudgetModel";
import { CustomError } from "../utils/customError";

export class BudgetService {
  async createBudget(
    budgetData: Partial<BaseBudget>,
    userId: string
  ): Promise<PopulatedBudget> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const account = await AccountModel.findById(budgetData.account).session(
        session
      );
      if (!account) {
        throw new CustomError("Associated account not found", 404);
      }

      if (budgetData.category) {
        const categoryExists = await mongoose
          .model("Category")
          .exists({
            _id: budgetData.category,
            userId,
          })
          .session(session);

        if (!categoryExists) {
          throw new CustomError("Associated category not found", 404);
        }
      }

      // Validate sufficient balance for the budget amount
      if (account.balance < (budgetData.amount || 0)) {
        throw new CustomError(
          "Insufficient funds in the associated account for this budget",
          400
        );
      }

      // Deduct budget amount from account
      account.balance -= budgetData.amount ?? 0;
      await account.save({ session });

      // Create the budget
      const newBudget = new BudgetModel({
        ...budgetData,
        userId,
        isActive: true,
        currentSpending: 0,
      });

      const savedBudget = await newBudget.save({ session });
      await session.commitTransaction();

      // Populate and return the complete budget data
      return await savedBudget.populate([
        { path: "account", select: "name" },
        { path: "category", select: "name" },
      ]);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getBudgets(userId: string): Promise<PopulatedBudget[]> {
    const budgets = await BudgetModel.find({
      userId,
      isActive: true,
    })
      .populate<{ account: PopulatedAccount }>("account", "name")
      .populate<{ category: PopulatedCategory }>("category", "name")
      .lean()
      .exec();

    return JSON.parse(JSON.stringify(budgets));
  }

  async updateBudgetAfterExpense(
    userId: string,
    category: string,
    amount: number
  ) {
    const budget = await BudgetModel.findOne({
      userId,
      category,
      isActive: true,
    });

    if (!budget)
      throw new CustomError(
        "No active budget found for the given category",
        400
      );

    const newSpending = budget.currentSpending + amount;

    if (newSpending > budget.amount) {
      throw new CustomError("Budget limit exceeded", 400);
    }

    budget.currentSpending = newSpending;
    await budget.save();
  }

  async revertBudgetAfterExpenseDeletion(
    userId: string,
    category: string,
    amount: number
  ) {
    const budget = await BudgetModel.findOne({
      userId,
      category,
      isActive: true,
    });

    if (!budget)
      throw new CustomError(
        "No active budget found for the given category",
        400
      );

    budget.currentSpending -= amount;
    await budget.save();
  }

  async checkAndHandleExpiredBudgets(userId: string): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find expired active budgets
      const expiredBudgets = await BudgetModel.find({
        userId,
        isActive: true,
        endDate: { $lt: new Date() },
      }).session(session);

      for (const budget of expiredBudgets) {
        const account = await AccountModel.findById(budget.account).session(
          session
        );

        if (account) {
          // Calculate remaining budget amount
          const remainingAmount = budget.amount - budget.currentSpending;

          if (remainingAmount > 0) {
            // Return remaining amount to account
            account.balance += remainingAmount;
            await account.save({ session });
          }
        }

        // Mark budget as inactive
        budget.isActive = false;
        await budget.save({ session });
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateBudgetSpending(
    id: string,
    spendingAmount: number,
    userId: string
  ): Promise<PopulatedBudget> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const budget = await BudgetModel.findOne({ _id: id, userId }).session(
        session
      );

      if (!budget) {
        throw new CustomError("Budget not found", 404);
      }

      if (!budget.isActive) {
        throw new CustomError("Cannot update an inactive budget", 400);
      }

      const newSpending = budget.currentSpending + spendingAmount;
      if (newSpending > budget.amount) {
        throw new CustomError("Spending would exceed budget amount", 400);
      }

      budget.currentSpending = newSpending;
      const updatedBudget = await budget.save({ session });

      await session.commitTransaction();

      return await updatedBudget.populate([
        { path: "account", select: "name" },
        { path: "category", select: "name" },
      ]);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async deleteBudget(id: string, userId: string): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const budget = await BudgetModel.findOne({ _id: id, userId }).session(
        session
      );

      if (!budget) {
        throw new CustomError("Budget not found", 404);
      }

      if (budget.isActive) {
        const account = await AccountModel.findById(budget.account).session(
          session
        );

        if (account) {
          // Return remaining amount to account
          const remainingAmount = budget.amount - budget.currentSpending;
          if (remainingAmount > 0) {
            account.balance += remainingAmount;
            await account.save({ session });
          }
        }
      }

      budget.isActive = false;
      await budget.save({ session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export const budgetService = new BudgetService();
