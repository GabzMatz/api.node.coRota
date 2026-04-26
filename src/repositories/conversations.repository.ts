import {
  CollectionReference,
  FieldValue,
  getFirestore,
  Timestamp,
} from "firebase-admin/firestore";

export type ConversationFirestore = {
  rideId: string;
  driverId: string;
  passengerId: string;
  participantIds: string[];
  lastMessageText?: string;
  lastMessageAt?: Timestamp | null;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
};

export type MessageFirestore = {
  senderId: string;
  text: string;
  createdAt: Timestamp | FieldValue;
};

export class ConversationsRepository {
  private collection: CollectionReference;

  constructor() {
    this.collection = getFirestore().collection("conversations");
  }

  public static buildDocumentId(
    rideId: string,
    userIdA: string,
    userIdB: string
  ): string {
    const [a, b] = [userIdA, userIdB].sort();
    return `${rideId}_${a}_${b}`;
  }

  public async getById(id: string): Promise<(ConversationFirestore & { id: string }) | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { ...(doc.data() as ConversationFirestore), id: doc.id };
  }

  public async createConversation(
    id: string,
    payload: Omit<ConversationFirestore, "createdAt" | "updatedAt">
  ): Promise<void> {
    const now = Timestamp.now();
    await this.collection.doc(id).set({
      ...payload,
      createdAt: now,
      updatedAt: now,
    });
  }

  public async listByParticipant(userId: string): Promise<
    (ConversationFirestore & { id: string })[]
  > {
    const snapshot = await this.collection
      .where("participantIds", "array-contains", userId)
      .limit(80)
      .get();

    const rows = snapshot.docs.map((doc) => ({
      ...(doc.data() as ConversationFirestore),
      id: doc.id,
    }));

    rows.sort((x, y) => {
      const tx = x.updatedAt instanceof Timestamp ? x.updatedAt.toMillis() : 0;
      const ty = y.updatedAt instanceof Timestamp ? y.updatedAt.toMillis() : 0;
      return ty - tx;
    });

    return rows;
  }

  public async addMessage(
    conversationId: string,
    message: Omit<MessageFirestore, "createdAt">
  ): Promise<string> {
    const ref = await this.collection
      .doc(conversationId)
      .collection("messages")
      .add({
        ...message,
        createdAt: FieldValue.serverTimestamp(),
      });
    return ref.id;
  }

  public async listMessages(
    conversationId: string,
    limit: number
  ): Promise<(MessageFirestore & { id: string })[]> {
    const snapshot = await this.collection
      .doc(conversationId)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      ...(doc.data() as MessageFirestore),
      id: doc.id,
    }));
  }

  public async updateLastMessage(
    conversationId: string,
    text: string
  ): Promise<void> {
    const now = Timestamp.now();
    await this.collection.doc(conversationId).update({
      lastMessageText: text,
      lastMessageAt: now,
      updatedAt: now,
    });
  }
}
