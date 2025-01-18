import { Types } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  amount: number;
  type: "income" | "expense";
  account: Types.ObjectId;
  category?: Types.ObjectId;
  description?: string;
  createdAt: Date;
}

export interface CreateTransactionDto {
  userId: string;
  amount: number;
  type: "income" | "expense";
  account: string;
  category?: string;
  description?: string;
  date?: Date;
}

export interface UpdateTransactionDto {
  amount?: number;
  type?: "income" | "expense";
  account?: string;
  category?: string;
  description?: string;
  date?: Date;
}

export interface TransactionQueryParams {
  startDate?: Date;
  endDate?: Date;
  type?: "income" | "expense";
  account?: string;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}
