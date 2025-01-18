import { Response } from "express";

export const handleError = (
  res: Response,
  message: string,
  error?: any,
  status = 500
) => {
  res
    .status(status)
    .json({ message, error: error?.message || "Internal server error" });
};
