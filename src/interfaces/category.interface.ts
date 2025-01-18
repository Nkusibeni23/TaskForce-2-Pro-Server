import mongoose from "mongoose";

export interface ICategory extends Document {
  name: string;
  parentCategory?: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  parentCategory?: string;
  userId: string;
}

export interface UpdateCategoryDto {
  name?: string;
  parentCategory?: string;
}
