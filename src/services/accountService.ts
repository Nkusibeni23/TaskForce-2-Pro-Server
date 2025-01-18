import {
  CreateAccountDto,
  UpdateAccountDto,
} from "../interfaces/account.interface";
import AccountModel from "../models/AccountModel";
import { CustomError } from "../utils/customError";

export class AccountService {
  async createAccount(data: CreateAccountDto) {
    const { name, type, balance, userId } = data;

    const existingAccount = await AccountModel.findOne({
      name,
      userId,
    });

    if (existingAccount) {
      throw new CustomError("Account with this name already exists", 400);
    }

    const account = new AccountModel({
      name,
      type,
      balance,
      userId,
    });

    return await account.save();
  }

  async getAllAccounts(userId: string) {
    return await AccountModel.find({ userId }).sort({ name: 1 });
  }

  async getAccountById(id: string, userId: string) {
    const account = await AccountModel.findOne({ _id: id, userId });

    if (!account) {
      throw new CustomError("Account not found", 404);
    }

    return account;
  }

  async updateAccount(id: string, userId: string, updates: UpdateAccountDto) {
    // Check if account exists and belongs to user
    const account = await AccountModel.findOne({ _id: id, userId });
    if (!account) {
      throw new CustomError("Account not found", 404);
    }

    // If changing name, check for duplicates
    if (updates.name && updates.name !== account.name) {
      const duplicateName = await AccountModel.findOne({
        name: updates.name,
        userId,
        _id: { $ne: id },
      });

      if (duplicateName) {
        throw new CustomError("Account with this name already exists", 400);
      }
    }

    const updatedAccount = await AccountModel.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );

    if (!updatedAccount) {
      throw new CustomError("Failed to update account", 500);
    }

    return updatedAccount;
  }

  async deleteAccount(id: string, userId: string) {
    const account = await AccountModel.findOneAndDelete({ _id: id, userId });
    if (!account) {
      throw new CustomError("Account not found", 404);
    }
  }

  async getAccountBalance(id: string, userId: string) {
    const account = await this.getAccountById(id, userId);
    return account.balance;
  }

  async updateAccountBalance(id: string, userId: string, amount: number) {
    const account = await this.getAccountById(id, userId);
    account.balance = amount;
    return await account.save();
  }
}

export const accountService = new AccountService();
