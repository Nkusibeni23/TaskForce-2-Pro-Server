import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import {
  getNotifications,
  markNotificationAsRead,
} from "../controller/notificationController";

const router = express.Router();

router.get("/notification", requireAuth, getNotifications);
router.patch("/notification/:id/read", requireAuth, markNotificationAsRead);

export default router;
