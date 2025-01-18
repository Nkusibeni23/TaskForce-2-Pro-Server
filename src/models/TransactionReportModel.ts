import mongoose, { Schema } from "mongoose";
import { ITransaction } from "../interfaces/transaction.interface";

// Define the transaction schema
const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true, index: true },
    amount: {
      type: Number,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
      trim: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create the transaction model
transactionSchema.index({ userId: 1, date: -1 });

export const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);
