import CategoryModel from "../models/CategoryModel";
import {
  CreateCategoryDto,
  ICategory,
  UpdateCategoryDto,
} from "../interfaces/category.interface";
import { CustomError } from "../utils/customError";

export class CategoryService {
  async createCategory(data: CreateCategoryDto): Promise<ICategory> {
    const { name, parentCategory, userId } = data;

    // Check if category with same name exists for this user
    const existingCategory = await CategoryModel.findOne({
      name,
      userId,
      parentCategory: parentCategory ?? null,
    });

    if (existingCategory) {
      throw new CustomError("Category with this name already exists", 400);
    }

    // If it's a subcategory, verify parent exists
    if (parentCategory) {
      const parentExists = await CategoryModel.findOne({
        _id: parentCategory,
        userId,
      });
      if (!parentExists) {
        throw new CustomError("Parent category not found", 404);
      }
    }

    const category = new CategoryModel({
      name,
      parentCategory,
      userId,
    });

    return await category.save();
  }

  async getAllCategories(userId: string): Promise<ICategory[]> {
    return await CategoryModel.find({ userId })
      .populate("parentCategory", "name")
      .sort({ name: 1 });
  }

  async getCategoryById(id: string, userId: string): Promise<ICategory> {
    const category = await CategoryModel.findOne({ _id: id, userId }).populate(
      "parentCategory",
      "name"
    );

    if (!category) {
      throw new CustomError("Category not found", 404);
    }

    return category;
  }

  async updateCategory(
    id: string,
    userId: string,
    updates: UpdateCategoryDto
  ): Promise<ICategory> {
    // Check if category exists and belongs to user
    const category = await CategoryModel.findOne({ _id: id, userId });
    if (!category) {
      throw new CustomError("Category not found", 404);
    }

    // If changing name, check for duplicates
    if (updates.name && updates.name !== category.name) {
      const duplicateName = await CategoryModel.findOne({
        name: updates.name,
        userId,
        parentCategory: category.parentCategory,
      });

      if (duplicateName) {
        throw new CustomError("Category with this name already exists", 400);
      }
    }

    // If changing parent, verify it exists and prevent circular reference
    if (updates.parentCategory) {
      // Can't set parent to itself
      if (updates.parentCategory === id) {
        throw new CustomError("Category cannot be its own parent", 400);
      }

      const parentExists = await CategoryModel.findOne({
        _id: updates.parentCategory,
        userId,
      });
      if (!parentExists) {
        throw new CustomError("Parent category not found", 404);
      }
    }

    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    ).populate("parentCategory", "name");

    if (!updatedCategory) {
      throw new CustomError("Failed to update category", 500);
    }

    return updatedCategory;
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    // Check if category exists and belongs to user
    const category = await CategoryModel.findOne({ _id: id, userId });
    if (!category) {
      throw new CustomError("Category not found", 404);
    }

    // Check if category has subcategories
    const hasSubcategories = await CategoryModel.findOne({
      parentCategory: id,
      userId,
    });
    if (hasSubcategories) {
      throw new CustomError(
        "Cannot delete category with subcategories. Delete subcategories first",
        400
      );
    }

    await CategoryModel.findOneAndDelete({ _id: id, userId });
  }
}

export const categoryService = new CategoryService();
