import { CollectionReference, getFirestore } from "firebase-admin/firestore";
import { RidesHistory } from "../models/rides-history.model.js";
import { Ride } from "../models/ride.model.js";
export class RidesHistoryRepository {
  constructor() {
    this.collection = getFirestore().collection("rides-history");
    this.ridesCollection = getFirestore().collection("rides");
  }

  private collection: CollectionReference;
  private ridesCollection: CollectionReference;
  
  public async getAll(): Promise<RidesHistory[]> {
    const snapshot = await this.collection.get();

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as RidesHistory[];
  }

  public async getById(id: string): Promise<RidesHistory | null> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) return null;
    
    return {
      ...(doc.data() as RidesHistory),
      id: doc.id
    };
  }

  

  public async getRidesHistoryByUserId(userId: string): Promise<RidesHistory[]> {
    const snapshot = await this.collection
      .where("userId", "==", userId)
      .get();

    const ridesHistory = await Promise.all(
      snapshot.docs.map(async doc => {
        const data = doc.data() as RidesHistory;

        const ride = await this.getRideById(data.rideId)

        return {
          ...data,
          id: doc.id,
          ride,
        };
      })
    );

    return ridesHistory as RidesHistory[];
  }

  public async getRidesHistoryByRideId(rideId: string): Promise<RidesHistory[]> {
    const snapshot = await this.collection
      .where("rideId", "==", rideId)
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

  public async update(id: string, rideHistory: RidesHistory): Promise<void> {
    await this.collection.doc(id).set(rideHistory);
  }

  private async getRideById(id: string): Promise<Ride | null> {
    const doc = await this.ridesCollection.doc(id).get();

    if (!doc.exists) return null;
    
    return {
      ...(doc.data() as Ride),
      id: doc.id
    };
  }
}