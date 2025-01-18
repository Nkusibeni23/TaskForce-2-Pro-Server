import { Request, Response } from "express";
import { CustomError } from "../utils/customError";
import { categoryService } from "../services/categoryService";

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const category = await categoryService.createCategory({
      ...req.body,
      userId,
    });

    res.status(201).json(category);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to create category", error });
    }
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const categories = await categoryService.getAllCategories(userId);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve categories", error });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const category = await categoryService.getCategoryById(
      req.params.id,
      userId
    );
    res.status(200).json(category);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to retrieve category", error });
    }
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const category = await categoryService.updateCategory(
      req.params.id,
      userId,
      req.body
    );
    res.status(200).json(category);
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to update category", error });
    }
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    await categoryService.deleteCategory(req.params.id, userId);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    if (error instanceof CustomError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to delete category", error });
    }
  }
};
