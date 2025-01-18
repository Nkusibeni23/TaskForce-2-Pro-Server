import {
  CreateIncomeDto,
  IncomeQueryParams,
  UpdateIncomeDto,
} from "../interfaces/Income.interface";
import Income from "../models/IncomeModel";
import { CustomError } from "../utils/customError";

export class IncomeService {
  async createIncome(data: CreateIncomeDto) {
    const { userId, title, amount, category, description, date } = data;

    if (!title || !amount || !category || !date) {
      throw new CustomError("Missing required fields", 400);
    }

    const income = new Income({
      userId,
      title,
      amount,
      category,
      description,
      date,
      type: "income",
    });

    return await income.save();
  }

  async getIncomes(userId: string, queryParams: IncomeQueryParams = {}) {
    const {
      startDate,
      endDate,
      category,
      minAmount,
      maxAmount,
      page = 1,
      limit = 10,
    } = queryParams;

    // Build query
    const query: any = { userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    if (category) {
      query.category = category;
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = minAmount;
      if (maxAmount) query.amount.$lte = maxAmount;
    }

    const skip = (page - 1) * limit;

    const [incomes, total] = await Promise.all([
      Income.find(query).sort({ date: -1 }).skip(skip).limit(limit),
      Income.countDocuments(query),
    ]);

    return {
      incomes,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async getIncomeById(id: string, userId: string) {
    const income = await Income.findOne({ _id: id, userId });

    if (!income) {
      throw new CustomError("Income not found", 404);
    }

    return income;
  }

  async updateIncome(id: string, userId: string, updates: UpdateIncomeDto) {
    // Verify income exists and belongs to user
    await this.getIncomeById(id, userId);

    const updatedIncome = await Income.findOneAndUpdate(
      { _id: id, userId },
      { ...updates },
      { new: true, runValidators: true }
    );

    if (!updatedIncome) {
      throw new CustomError("Failed to update income", 500);
    }

    return updatedIncome;
  }

  async deleteIncome(id: string, userId: string) {
    const income = await Income.findOneAndDelete({ _id: id, userId });

    if (!income) {
      throw new CustomError("Income not found", 404);
    }

    return income;
  }

  async getIncomeStats(userId: string, startDate: Date, endDate: Date) {
    const stats = await Income.aggregate([
      {
        $match: {
          userId,
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            category: "$category",
          },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 },
          avgAmount: { $avg: "$amount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          totalAmount: -1,
        },
      },
    ]);

    return stats;
  }

  async getMonthlyIncome(userId: string, year: number) {
    return await Income.aggregate([
      {
        $match: {
          userId,
          date: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }
}

export const incomeService = new IncomeService();
