import mongoose from "mongoose";

export interface IExpense extends mongoose.Document {
  userId: string;
  title: string;
  amount: number;
  type: string;
  description?: string;
  date: Date;
  budget: mongoose.Schema.Types.ObjectId;
  category: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
