import mongoose, { Schema } from "mongoose";
import { IIncome } from "../interfaces/Income.interface";

const IncomeSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 20,
    },

    amount: {
      type: Number,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: false,
      trim: true,
      maxLength: 50,
    },

    type: {
      type: String,
      default: "income",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      trim: true,
    },

    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
      trim: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

IncomeSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IIncome>("Income", IncomeSchema);
