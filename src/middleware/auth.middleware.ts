import { Request, Response, NextFunction } from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { CustomError } from "../utils/customError";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
      };
      userId?: string;
    }
  }
}

export const requireAuth = [
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Auth Debug:", {
      headers: req.headers,
      authorization: req.headers.authorization ? "present" : "missing",
      path: req.path,
    });
    next();
  },
  ClerkExpressWithAuth(),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth?.userId) {
        console.error("Auth Failed: No userId");
        throw new CustomError("Unauthorized access", 401);
      }
      req.userId = req.auth.userId;
      console.log("Auth Success:", {
        userId: req.auth.userId,
        path: req.path,
      });
      next();
    } catch (error) {
      console.error("Auth Error:", error);
      next(new CustomError("Authentication failed", 401));
    }
  },
];

export default requireAuth;
