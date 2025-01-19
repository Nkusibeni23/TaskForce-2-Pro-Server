import { Document, Types } from "mongoose";

export interface PopulatedAccount {
  _id: Types.ObjectId | string;
  name: string;
}

export interface PopulatedCategory {
  _id: Types.ObjectId | string;
  name: string;
}

export interface IBudget extends Document {
  _id: Types.ObjectId;
  userId: string;
  name: string;
  amount: number;
  description?: string;
  account: Types.ObjectId | string;
  category?: Types.ObjectId | string;
  limit: number;
  currentSpending: number;
  startDate: Date;
  endDate: Date;
  notificationsSent: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creating/updating budgets
export interface BaseBudget {
  userId: string;
  name: string;
  amount: number;
  description?: string;
  account: Types.ObjectId | string;
  category?: Types.ObjectId | string;
  limit: number;
  currentSpending: number;
  startDate: Date;
  endDate: Date;
  notificationsSent: boolean;
  isActive: boolean;
}

export interface PopulatedBudget {
  _id: Types.ObjectId | string;
  userId: string;
  name: string;
  amount: number;
  description?: string;
  account: PopulatedAccount;
  category?: PopulatedCategory;
  limit: number;
  currentSpending: number;
  startDate: Date;
  endDate: Date;
  notificationsSent: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
