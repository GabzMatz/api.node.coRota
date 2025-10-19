import { CollectionReference, getFirestore } from "firebase-admin/firestore";
import { Ride } from "../models/ride.model.js";

export class RidesRepository {
  constructor() {
    this.collection = getFirestore().collection("rides");
  }

  private collection: CollectionReference;
  
  public async getAll(): Promise<Ride[]> {
    const snapshot = await this.collection.get();

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Ride[];
  }

  public async getById(id: string): Promise<Ride | null> {
    const doc = await this.collection.doc(id).get();
    return doc.data() as Ride ?? null;
  }

  public async getRidesByUserId(userId: string): Promise<Ride[]> {
    const driverSnapshot = await this.collection
      .where("driverId", "==", userId)
      .get();

    const passengerSnapshot = await this.collection
      .where("passengerIds", "array-contains", userId)
      .get();

    const allDocs = [...driverSnapshot.docs, ...passengerSnapshot.docs];
    const uniqueDocs = Array.from(new Map(allDocs.map(doc => [doc.id, doc])).values());

    return uniqueDocs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as Ride[];
  }

  public async create(ride: Ride): Promise<void> {
    await this.collection.add(ride);
  }

  public async update(ride: Ride): Promise<void> {
    await this.collection.doc(ride.id).set(ride);
  }
}