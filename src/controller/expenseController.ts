import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { expenseService } from "../services/expenseService";

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

export const getExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const { startDate, endDate, category, minAmount, maxAmount, page, limit } =
      req.query;

    const result = await expenseService.getExpenses(userId, {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      category: category as string,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res.status(200).json({
      data: result.expenses,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const expense = await expenseService.getExpenseById(req.params.id, userId);
    res.status(200).json({ data: expense });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const expense = await expenseService.updateExpense(
      req.params.id,
      userId,
      req.body
    );

    res.status(200).json({
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    await expenseService.deleteExpense(req.params.id, userId);
    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getExpenseStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new CustomError("Start date and end date are required", 400);
    }

    const stats = await expenseService.getExpenseStats(
      userId,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.status(200).json({ data: stats });
  } catch (error) {
    next(error);
  }
};
