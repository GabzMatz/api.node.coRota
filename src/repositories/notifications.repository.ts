import {
  CollectionReference,
  FieldValue,
  getFirestore,
  Timestamp,
} from "firebase-admin/firestore";
import type { NotificationType } from "../models/notification.model.js";

export type NotificationFirestore = {
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  relatedId?: string;
  createdAt: Timestamp | FieldValue;
};

export class NotificationsRepository {
  private collection: CollectionReference;

  constructor() {
    this.collection = getFirestore().collection("notifications");
  }

  public async create(
    payload: Omit<NotificationFirestore, "createdAt" | "read">
  ): Promise<string> {
    const ref = await this.collection.add({
      ...payload,
      read: false,
      createdAt: FieldValue.serverTimestamp(),
    });
    return ref.id;
  }

  public async listByUser(
    userId: string,
    limit = 50
  ): Promise<(NotificationFirestore & { id: string })[]> {
    const snapshot = await this.collection
      .where("userId", "==", userId)
      .limit(limit)
      .get();

    const rows = snapshot.docs.map((doc) => ({
      ...(doc.data() as NotificationFirestore),
      id: doc.id,
    }));

    rows.sort((a, b) => {
      const ta = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;
      const tb = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;
      return tb - ta;
    });

    return rows;
  }

  public async markAsRead(notificationId: string, userId: string): Promise<void> {
    const doc = await this.collection.doc(notificationId).get();
    if (!doc.exists) {
      return;
    }
    const data = doc.data() as NotificationFirestore;
    if (data.userId !== userId) {
      return;
    }
    await doc.ref.update({ read: true });
  }

  public async markAllAsRead(userId: string): Promise<void> {
    const snapshot = await this.collection.where("userId", "==", userId).where("read", "==", false).get();
    const batch = getFirestore().batch();
    snapshot.docs.forEach((doc) => batch.update(doc.ref, { read: true }));
    if (!snapshot.empty) {
      await batch.commit();
    }
  }

  public async countUnread(userId: string): Promise<number> {
    const snapshot = await this.collection
      .where("userId", "==", userId)
      .where("read", "==", false)
      .get();
    return snapshot.size;
  }
}
