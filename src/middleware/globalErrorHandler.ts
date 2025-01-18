import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";

export const globalErrorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof CustomError ? err.status : 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    message,
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
