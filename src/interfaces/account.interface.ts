export interface IAccount extends Document {
  name: string;
  type: string;
  balance: number;
  createdAt: Date;
}

export interface Account {
  name: string;
  type: string;
  balance: number;
  createdAt: Date;
}

export interface CreateAccountDto {
  name: string;
  type: string;
  balance: number;
  userId: string;
}

export interface UpdateAccountDto {
  name?: string;
  type?: string;
  balance?: number;
}
