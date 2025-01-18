import mongoose, { Schema } from "mongoose";
import { IAccount } from "../interfaces/account.interface";

const AccountSchema: Schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    balance: { type: Number, required: true, default: 0, trim: true },
  },
  { timestamps: true }
);

// Add compound index for userId and name to ensure unique accounts per user
AccountSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model<IAccount>("Account", AccountSchema);
