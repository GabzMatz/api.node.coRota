import { CollectionReference, getFirestore } from "firebase-admin/firestore";
import { Address } from "../models/address.model.js";

export class AddressRepository {
  constructor() {
    this.collection = getFirestore().collection("address");
  }

  private collection: CollectionReference;
  
  public async getAll(): Promise<Address[]> {
    const snapshot = await this.collection.get();

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Address[];
  }

  public async getById(id: string): Promise<Address | null> {
    const doc = await this.collection.doc(id).get();
    return doc.data() as Address ?? null;
  }

  public async create(address: Address): Promise<void> {
    await this.collection.add(address);
  }

  public async update(address: Address): Promise<void> {
    await this.collection.doc(address.id).set(address);
  }
}