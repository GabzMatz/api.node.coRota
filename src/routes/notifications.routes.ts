import express from "express";
import asyncHandler from "express-async-handler";
import { celebrate, Segments } from "celebrate";
import { NotificationsController } from "../controllers/notifications.controller.js";
import { registerPushTokenSchema } from "../models/notification.model.js";
import { Joi } from "celebrate";

const notificationIdParamSchema = Joi.object({
  notificationId: Joi.string().alphanum().required(),
});

const notificationsRoute = express.Router();
const base = "/notifications";

notificationsRoute.get(`${base}`, asyncHandler(NotificationsController.listMine));

notificationsRoute.get(`${base}/unread-count`, asyncHandler(NotificationsController.unreadCount));

notificationsRoute.patch(
  `${base}/read-all`,
  asyncHandler(NotificationsController.markAllRead)
);

notificationsRoute.patch(
  `${base}/:notificationId/read`,
  celebrate({ [Segments.PARAMS]: notificationIdParamSchema }),
  asyncHandler(NotificationsController.markRead)
);

notificationsRoute.post(
  `${base}/register-device`,
  celebrate({ [Segments.BODY]: registerPushTokenSchema }),
  asyncHandler(NotificationsController.registerPushToken)
);

export default notificationsRoute;
