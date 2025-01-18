import mongoose, { Schema } from "mongoose";
import { IIncome } from "../interfaces/Income.interface";

const IncomeSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, maxLength: 50 },
    amount: { type: Number, required: true, trim: true },
    type: {
      type: String,
      default: "income",
    },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxLength: 20 },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

IncomeSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IIncome>("Income", IncomeSchema);
