import { Timestamp } from "firebase-admin/firestore";
import type { AppNotification, NotificationType } from "../models/notification.model.js";
import { NotificationsRepository } from "../repositories/notifications.repository.js";
import { UserRepository } from "../repositories/user.repository.js";

export class NotificationsService {
  constructor(
    private notificationsRepository = new NotificationsRepository(),
    private userRepository = new UserRepository()
  ) {}

  public async listForUser(userId: string): Promise<AppNotification[]> {
    const rows = await this.notificationsRepository.listByUser(userId);
    return rows.map((row) => this.toDtoFromFirestore(row));
  }

  public async countUnread(userId: string): Promise<number> {
    return this.notificationsRepository.countUnread(userId);
  }

  public async markAsRead(userId: string, notificationId: string): Promise<void> {
    await this.notificationsRepository.markAsRead(notificationId, userId);
  }

  public async markAllAsRead(userId: string): Promise<void> {
    await this.notificationsRepository.markAllAsRead(userId);
  }

  public async registerPushToken(
    userId: string,
    token: string,
    platform: "web" | "android" | "ios"
  ): Promise<void> {
    const user = await this.userRepository.getById(userId);
    if (!user) {
      return;
    }

    const pushTokens = Array.isArray((user as { pushTokens?: unknown }).pushTokens)
      ? ([...(user as { pushTokens: Array<{ token: string; platform: string }> }).pushTokens])
      : [];

    const filtered = pushTokens.filter((entry) => entry.token !== token);
    filtered.push({ token, platform });

    await this.userRepository.update(userId, {
      ...user,
      pushTokens: filtered.slice(-20),
      updatedAt: new Date(),
    } as never);
  }

  public async notifyUser(
    userId: string,
    title: string,
    body: string,
    type: NotificationType,
    relatedId?: string
  ): Promise<void> {
    await this.notificationsRepository.create({
      userId,
      title,
      body,
      type,
      relatedId,
    });
  }

  private toDtoFromFirestore(row: {
    id: string;
    userId: string;
    title: string;
    body: string;
    type: NotificationType;
    read: boolean;
    relatedId?: string;
    createdAt?: unknown;
  }): AppNotification {
    const createdAt =
      row.createdAt instanceof Timestamp ? row.createdAt.toDate() : new Date();

    return {
      id: row.id,
      userId: row.userId,
      title: row.title,
      body: row.body,
      type: row.type,
      read: row.read,
      relatedId: row.relatedId,
      createdAt,
    };
  }
}
