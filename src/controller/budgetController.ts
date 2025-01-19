import mongoose from "mongoose";
import {
  BaseBudget,
  PopulatedAccount,
  PopulatedCategory,
} from "../interfaces/budget.interface";
import AccountModel from "../models/AccountModel";
import BudgetModel from "../models/BudgetModel";
import { CustomError } from "../utils/customError";
import { Request, Response, NextFunction } from "express";
import { budgetService } from "../services/budgetService";

export class BudgetController {
  getBudgets = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.auth?.userId;
      if (!userId) throw new CustomError("Unauthorized", 401);

      const budgets = await budgetService.getBudgets(userId);
      res.status(200).json({
        message: "Budgets retrieved successfully",
        data: budgets,
      });
    } catch (error) {
      console.error("Error in getBudgets:", error);
      if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to retrieve budgets", error });
      }
    }
  };

  async getAllBudgets(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.auth?.userId) {
        throw new CustomError("Authentication required", 401);
      }

      const budgets = await BudgetModel.find({
        userId: req.auth.userId,
      })
        .populate<{ account: PopulatedAccount }>("account", "name")
        .populate<{ category: PopulatedCategory }>("category", "name")
        .lean()
        .exec();

      res.status(200).json({
        message: "All budgets retrieved successfully",
        data: JSON.parse(JSON.stringify(budgets)),
      });
    } catch (error) {
      next(error);
    }
  }

  async addExpenseToBudget(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const userId = req.auth?.userId;
      const { category, amount } = req.body;

      if (!userId) {
        throw new CustomError("Authentication required", 401);
      }

      await budgetService.updateBudgetAfterExpense(userId, category, amount);

      await session.commitTransaction();
      res.status(200).json({
        message: "Expense added and budget updated successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  async deleteExpenseFromBudget(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const userId = req.auth?.userId;
      const { category, amount } = req.body;

      if (!userId) {
        throw new CustomError("Authentication required", 401);
      }

      await budgetService.revertBudgetAfterExpenseDeletion(
        userId,
        category,
        amount
      );

      await session.commitTransaction();
      res.status(200).json({
        message: "Expense removed and budget updated successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  async createBudget(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!req.auth?.userId) {
        throw new CustomError("Authentication required", 401);
      }

      const budgetData: Partial<BaseBudget> = {
        ...req.body,
        userId: req.auth.userId,
      };

      const account = await AccountModel.findById(budgetData.account).session(
        session
      );
      if (!account) {
        throw new CustomError("Associated account not found", 404);
      }
      if (!account) {
        throw new CustomError("Associated account not found", 404);
      }

      if (budgetData.category) {
        const categoryExists = await mongoose
          .model("Category")
          .exists({
            _id: budgetData.category,
            userId: req.auth.userId,
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
        userId: req.auth.userId,
        isActive: true,
        currentSpending: 0,
      });

      const savedBudget = await newBudget.save({ session });
      const populatedBudget = await savedBudget.populate<{
        account: PopulatedAccount;
        category?: PopulatedCategory;
      }>([
        { path: "account", select: "name" },
        { path: "category", select: "name" },
      ]);

      await session.commitTransaction();

      res.status(201).json({
        message: "Budget created successfully",
        data: JSON.parse(JSON.stringify(populatedBudget.toObject())),
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  async updateBudget(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!req.auth?.userId) {
        throw new CustomError("Authentication required", 401);
      }

      const { id } = req.params;
      const updates: Partial<BaseBudget> = req.body;

      const budget = await BudgetModel.findOne({
        _id: id,
        userId: req.auth.userId,
      }).session(session);

      if (!budget) {
        throw new CustomError("Budget not found", 404);
      }

      if (!budget.isActive) {
        throw new CustomError("Cannot update an inactive budget", 400);
      }

      // Handle amount updates with account balance
      if (updates.amount !== undefined && updates.amount !== budget.amount) {
        const account = await AccountModel.findById(budget.account).session(
          session
        );
        if (!account) {
          throw new CustomError("Associated account not found", 404);
        }

        // Return old amount to account and deduct new amount
        const balanceAdjustment = budget.amount - updates.amount;
        if (account.balance + balanceAdjustment < 0) {
          throw new CustomError(
            "Insufficient funds in the associated account for this update",
            400
          );
        }

        account.balance += balanceAdjustment;
        await account.save({ session });
      }

      Object.assign(budget, updates);
      const updatedBudget = await budget.save({ session });
      const populatedBudget = await updatedBudget.populate<{
        account: PopulatedAccount;
        category?: PopulatedCategory;
      }>([
        { path: "account", select: "name" },
        { path: "category", select: "name" },
      ]);

      //   await session.commitTransaction();
      //   return JSON.parse(
      //     JSON.stringify(populatedBudget.toObject())
      //   ) as PopulatedBudget;

      res.status(200).json({
        message: "Budget updated successfully",
        data: JSON.parse(JSON.stringify(populatedBudget.toObject())),
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  async updateBudgetSpending(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!req.auth?.userId) {
        throw new CustomError("Authentication required", 401);
      }

      const { budgetId } = req.params;
      const { amount: spendingAmount } = req.body; // Fixed variable name

      if (!budgetId) {
        throw new CustomError("Budget ID is required", 400);
      }

      if (!spendingAmount || typeof spendingAmount !== "number") {
        throw new CustomError("Valid spending amount is required", 400);
      }

      const budget = await BudgetModel.findOne({
        _id: budgetId,
        userId: req.auth.userId,
      }).session(session);

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
      const populatedBudget = await updatedBudget.populate<{
        account: PopulatedAccount;
        category?: PopulatedCategory;
      }>([
        { path: "account", select: "name" },
        { path: "category", select: "name" },
      ]);

      await session.commitTransaction();

      res.status(200).json({
        message: "Budget spending updated successfully",
        data: JSON.parse(JSON.stringify(populatedBudget.toObject())),
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  async checkExpiredBudgets(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!req.auth?.userId) {
        throw new CustomError("Authentication required", 401);
      }

      await this.processExpiredBudgets(req.auth.userId, session);

      await session.commitTransaction();
      res.status(200).json({
        message: "Expired budgets processed successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  async deleteBudget(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!req.auth?.userId) {
        throw new CustomError("Authentication required", 401);
      }

      const { id } = req.params;

      const budget = await BudgetModel.findOne({
        _id: id,
        userId: req.auth.userId,
      }).session(session);

      if (!budget) {
        throw new CustomError("Budget not found", 404);
      }

      if (budget.isActive) {
        const account = await AccountModel.findById(budget.account).session(
          session
        );
        if (account) {
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

      res.status(200).json({
        message: "Budget deleted successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }
  private async processExpiredBudgets(
    userId: string,
    session: mongoose.ClientSession
  ) {
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
        account.balance += budget.amount - budget.currentSpending;
        await account.save({ session });
      }
      budget.isActive = false;
      await budget.save({ session });
    }
    await session.commitTransaction();
  }
}

export const budgetController = new BudgetController();
