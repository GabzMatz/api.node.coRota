import { CollectionReference, getFirestore } from "firebase-admin/firestore";
import { User } from "../models/user.model.js";

export class UserRepository {
  constructor() {
    this.collection = getFirestore().collection("users");
  }

  private collection: CollectionReference;
  
  public async getAll(): Promise<User[]> {
    const snapshot = await this.collection.get();
  
    return snapshot.docs.map(doc => {
      return {
        id: doc.id,
        ...doc.data()
      } as User;
    });
  }

  public async getById(userId: string): Promise<User> {
    const user = await this.collection.doc(userId).get();

    return {
      id: user.id,
      ...user.data()
    } as User;
  }

  public async update(user: User): Promise<void> {
    await this.collection.doc(user.id).set(user);
  }

  public async delete(userId: string): Promise<void> {
    await this.collection.doc(userId).delete();
  }
}