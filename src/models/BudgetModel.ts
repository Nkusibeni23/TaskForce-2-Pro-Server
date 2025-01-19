import mongoose, { Schema } from "mongoose";
import { IBudget } from "../interfaces/budget.interface";

const BudgetSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    limit: { type: Number, required: true },
    currentSpending: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    notificationsSent: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBudget>("Budget", BudgetSchema);
