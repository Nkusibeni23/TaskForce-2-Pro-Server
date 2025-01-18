import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interfaces/category.interface";

const CategorySchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true }
);

CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model<ICategory>("Category", CategorySchema);
