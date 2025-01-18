import { Document } from "mongoose";

export interface ICategory extends Document {
  userId: string;
  name: string;
  parentCategory?: string;
  type: "income" | "expense" | "both";
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  userId: string;
  name: string;
  parentCategory?: string;
  type?: "income" | "expense" | "both";
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  parentCategory?: string;
  type?: "income" | "expense" | "both";
  description?: string;
  isActive?: boolean;
}
