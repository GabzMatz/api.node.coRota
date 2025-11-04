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
      ...user.data(),
      id: user.id
    } as User;
  }

  public async update(id: string, user: User): Promise<void> {
    await this.collection.doc(id).set(user, { merge: true });
  }

  public async delete(userId: string): Promise<void> {
    await this.collection.doc(userId).delete();
  }
}