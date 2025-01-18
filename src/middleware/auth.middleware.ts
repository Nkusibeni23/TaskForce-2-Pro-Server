import { Request, Response, NextFunction } from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { CustomError } from "../utils/customError";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
    }
  }
}

export const requireAuth = [
  ClerkExpressWithAuth(),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth?.userId) {
        throw new CustomError("Unauthorized access", 401);
      }
      next();
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(new CustomError("Authentication failed", 401));
      }
    }
  },
];
