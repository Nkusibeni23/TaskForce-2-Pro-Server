import { Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { accountService } from "../services/accountService";

export const createAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const account = await accountService.createAccount({
      ...req.body,
      userId,
    });

    res.status(201).json(account);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to create account", error });
    }
  }
};

export const getAllAccounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const accounts = await accountService.getAllAccounts(userId);
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve accounts", error });
  }
};

export const getAccountById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const account = await accountService.getAccountById(req.params.id, userId);
    res.status(200).json(account);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to retrieve account", error });
    }
  }
};

export const updateAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const account = await accountService.updateAccount(
      req.params.id,
      userId,
      req.body
    );
    res.status(200).json(account);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to update account", error });
    }
  }
};

export const deleteAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    await accountService.deleteAccount(req.params.id, userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to delete account", error });
    }
  }
};
