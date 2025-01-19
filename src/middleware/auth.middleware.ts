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
  // Debug middleware
  (req: Request, res: Response, next: NextFunction) => {
    console.log("Auth Debug:", {
      headers: req.headers,
      authorization: req.headers.authorization ? "present" : "missing",
      path: req.path,
    });
    next();
  },

  // Clerk Auth
  ClerkExpressWithAuth(),

  // Final auth check with logging
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth?.userId) {
        console.error("Auth Failed: No userId");
        throw new CustomError("Unauthorized access", 401);
      }

      // Set userId for convenience
      req.userId = req.auth.userId;

      console.log("Auth Success:", {
        userId: req.auth.userId,
        path: req.path,
      });
      next();
    } catch (error) {
      console.error("Auth Error:", error);
      if (error instanceof CustomError) {
        next(error);
      } else {
        next(new CustomError("Authentication failed", 401));
      }
    }
  },
];

export default requireAuth;
