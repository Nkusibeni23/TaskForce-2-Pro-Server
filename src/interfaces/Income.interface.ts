export interface IIncome extends Document {
  title: string;
  amount: number;
  date: Date;
  category: string;
  description: string;
}

export interface CreateExpenseDto {
  userId: string;
  title: string;
  amount: number;
  category: string;
  description?: string;
  date: Date;
}

export interface UpdateExpenseDto {
  title?: string;
  amount?: number;
  category?: string;
  description?: string;
  date?: Date;
}

export interface ExpenseQueryParams {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}

export interface CreateIncomeDto {
  userId: string;
  title: string;
  amount: number;
  category: string;
  description?: string;
  date: Date;
}

export interface UpdateIncomeDto {
  title?: string;
  amount?: number;
  category?: string;
  description?: string;
  date?: Date;
}

export interface IncomeQueryParams {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
}
