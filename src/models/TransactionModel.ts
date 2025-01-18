import mongoose, { Schema } from "mongoose";
import { ITransaction } from "../interfaces/transaction.interface";

const TransactionSchema: Schema = new Schema(
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
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

TransactionSchema.index({ userId: 1, date: -1 });

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
