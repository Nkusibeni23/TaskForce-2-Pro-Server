import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { incomeService } from "../services/incomeService";

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

export const getIncomes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const { startDate, endDate, category, minAmount, maxAmount, page, limit } =
      req.query;

    const result = await incomeService.getIncomes(userId, {
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      category: category as string,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    res.status(200).json({
      data: result.incomes,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getIncomeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const income = await incomeService.getIncomeById(req.params.id, userId);
    res.status(200).json({ data: income });
  } catch (error) {
    next(error);
  }
};

export const updateIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const income = await incomeService.updateIncome(
      req.params.id,
      userId,
      req.body
    );

    res.status(200).json({
      message: "Income updated successfully",
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    await incomeService.deleteIncome(req.params.id, userId);
    res.status(200).json({
      message: "Income deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getIncomeStats = async (
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

    const stats = await incomeService.getIncomeStats(
      userId,
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.status(200).json({ data: stats });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyIncome = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const { year } = req.query;
    if (!year) {
      throw new CustomError("Year parameter is required", 400);
    }

    const monthlyData = await incomeService.getMonthlyIncome(
      userId,
      Number(year)
    );

    res.status(200).json({ data: monthlyData });
  } catch (error) {
    next(error);
  }
};
