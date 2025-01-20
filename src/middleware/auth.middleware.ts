import { Request, Response, NextFunction } from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import { CustomError } from "../utils/customError";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId?: string;
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
      authorization: req.headers.authorization
        ? `${req.headers.authorization.substring(0, 20)}...`
        : "missing",
      path: req.path,
      method: req.method,
    });
    next();
  },

  // Clerk authentication - fixed onError type
  ClerkExpressWithAuth({
    onError: (error: any) => {
      console.error("Clerk Auth Error:", error);
      return {
        status: 401,
        message: "Authentication failed",
      };
    },
  }),

  // User validation middleware
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) {
        console.error("Auth Failed: No auth object");
        throw new CustomError("Authentication required", 401);
      }

      if (!req.auth.userId) {
        console.error("Auth Failed: No userId in auth object");
        throw new CustomError("User ID not found", 401);
      }

      req.userId = req.auth.userId;

      console.log("Auth Success:", {
        userId: req.auth.userId,
        sessionId: req.auth.sessionId,
        path: req.path,
        timestamp: new Date().toISOString(),
      });

      next();
    } catch (error) {
      console.error("Auth Error:", {
        error: error instanceof Error ? error.message : "Unknown error",
        path: req.path,
        timestamp: new Date().toISOString(),
      });

      if (error instanceof CustomError) {
        next(error);
      } else {
        next(new CustomError("Authentication failed", 401));
      }
    }
  },
];

export default requireAuth;
