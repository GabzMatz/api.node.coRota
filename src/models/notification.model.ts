import { Joi } from "celebrate";

export type NotificationType = "ride" | "message" | "pickup" | "system";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  relatedId?: string;
  createdAt: Date;
}

export const registerPushTokenSchema = Joi.object({
  token: Joi.string().trim().min(10).required(),
  platform: Joi.string().valid("web", "android", "ios").default("web"),
});
