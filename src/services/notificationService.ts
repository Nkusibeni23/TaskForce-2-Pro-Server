import { ObjectId } from "mongoose";
import Notification from "../models/NotificationModel";

interface CreateNotificationParams {
  userId: string;
  type: string;
  message: string;
  relatedId?: string | ObjectId;
}

export const createNotification = async (params: CreateNotificationParams) => {
  const notification = new Notification({
    userId: params.userId,
    type: params.type,
    message: params.message,
    relatedId: params.relatedId,
  });

  await notification.save();
  return notification;
};

export const getNotifications = async (
  userId: string,
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ userId }),
  ]);

  return {
    notifications,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      perPage: limit,
    },
  };
};

export const markNotificationAsRead = async (id: string, userId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};
