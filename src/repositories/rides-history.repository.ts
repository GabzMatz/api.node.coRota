import { CollectionReference, getFirestore } from "firebase-admin/firestore";
import { RidesHistory } from "../models/rides-history.model.js";

export class RidesHistoryRepository {
  constructor() {
    this.collection = getFirestore().collection("rides-history");
  }

  private collection: CollectionReference;
  
  public async getAll(): Promise<RidesHistory[]> {
    const snapshot = await this.collection.get();

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as RidesHistory[];
  }

  public async getById(id: string): Promise<RidesHistory | null> {
    const doc = await this.collection.doc(id).get();
    return doc.data() as RidesHistory ?? null;
  }

  public async getRidesHistoryByUserId(userId: string): Promise<RidesHistory[]> {
    const snapshot = await this.collection
      .where("userId", "==", userId)
      .get();

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as RidesHistory[];
  }

  public async getRidesHistoryByUserAndRideId(userId: string, rideId: string): Promise<RidesHistory> {
    const snapshot = await this.collection
      .where("userId", "==", userId)
      .where("rideId", "==", rideId)
      .get();

    return snapshot.docs.map(doc => ({
      ...(doc.data() as RidesHistory),
      id: doc.id
    }))[0];
  }

  public async create(rideHistory: RidesHistory): Promise<void> {
    await this.collection.add(rideHistory);
  }

  public async update(rideHistory: RidesHistory): Promise<void> {
    await this.collection.doc(rideHistory.id).set(rideHistory);
  }
}