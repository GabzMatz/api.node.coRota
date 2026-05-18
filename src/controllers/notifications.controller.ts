import { Request, Response } from "express";
import { NotificationsService } from "../services/notifications.service.js";

export class NotificationsController {
  public static async listMine(req: Request, res: Response) {
    const userId = (req as { user?: { id: string } }).user?.id;
    const items = await new NotificationsService().listForUser(userId!);
    res.status(200).json(items);
  }

  public static async unreadCount(req: Request, res: Response) {
    const userId = (req as { user?: { id: string } }).user?.id;
    const count = await new NotificationsService().countUnread(userId!);
    res.status(200).json({ count });
  }

  public static async markRead(req: Request, res: Response) {
    const userId = (req as { user?: { id: string } }).user?.id;
    const notificationId = req.params.notificationId as string;
    await new NotificationsService().markAsRead(userId!, notificationId);
    res.status(204).send();
  }

  public static async markAllRead(req: Request, res: Response) {
    const userId = (req as { user?: { id: string } }).user?.id;
    await new NotificationsService().markAllAsRead(userId!);
    res.status(204).send();
  }

  public static async registerPushToken(req: Request, res: Response) {
    const userId = (req as { user?: { id: string } }).user?.id;
    const { token, platform } = req.body as { token: string; platform: "web" | "android" | "ios" };
    await new NotificationsService().registerPushToken(userId!, token, platform || "web");
    res.status(204).send();
  }
}
