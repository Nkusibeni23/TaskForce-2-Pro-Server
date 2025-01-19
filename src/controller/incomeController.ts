import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { incomeService } from "../services/incomeService";

// Create Income Controller
export const createIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const income = await incomeService.createIncome({
      ...req.body,
      userId,
    });

    res.status(201).json({
      message: "Income created successfully",
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

// Get Incomes Controller
export const getIncomes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const incomes = await incomeService.getIncomes(userId, req.query);

    res.status(200).json({
      message: "Incomes retrieved successfully",
      data: incomes,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Income Controller
export const deleteIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const income = await incomeService.deleteIncome(req.params.id, userId);

    res.status(200).json({
      message: "Income deleted successfully",
      data: income,
    });
  } catch (error) {
    next(error);
  }
};
