import mongoose, { Schema } from "mongoose";
import { IExpense } from "../interfaces/expense.interface";

const ExpenseSchema: Schema = new Schema(
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
      default: "expense",
    },

    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
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

ExpenseSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IExpense>("Expense", ExpenseSchema);
