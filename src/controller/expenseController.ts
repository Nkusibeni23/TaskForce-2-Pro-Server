import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { expenseService } from "../services/expenseService";

// Create Expense Controller
export const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const expense = await expenseService.createExpense({
      ...req.body,
      userId,
    });

    res.status(201).json({
      message: "Expense created successfully",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// Get Expenses Controller
export const getExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const expenses = await expenseService.getExpenses(userId, req.query);

    res.status(200).json({
      message: "Expenses retrieved successfully",
      data: expenses,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Expense Controller
export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const expense = await expenseService.deleteExpense(req.params.id, userId);

    res.status(200).json({
      message: "Expense deleted successfully",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};
