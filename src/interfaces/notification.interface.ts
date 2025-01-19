import mongoose from "mongoose";

export interface INotification extends Document {
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
