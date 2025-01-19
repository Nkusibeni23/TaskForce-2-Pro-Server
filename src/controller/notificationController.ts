import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import * as notificationService from "../services/notificationService";

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const notifications = await notificationService.getNotifications(
      userId,
      page,
      limit
    );

    res.status(200).json({
      message: "Notifications retrieved successfully",
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.auth?.userId;
    if (!userId) throw new CustomError("Unauthorized", 401);

    const notificationId = req.params.id;

    const notification = await notificationService.markNotificationAsRead(
      notificationId,
      userId
    );

    res.status(200).json({
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};
