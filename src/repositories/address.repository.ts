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

    if (!doc.exists) return null;

    return {
      ...(doc.data() as Address),
      id: doc.id
    };
  }

  public async create(address: Address): Promise<Address> {
    const docRef = await this.collection.add(address);
    const doc = await docRef.get();

    return {
      ...doc.data() as Address,
      id: doc.id
    };
  }

  public async update(id: string, address: Address): Promise<void> {
    await this.collection.doc(id).set(address);
  }
}