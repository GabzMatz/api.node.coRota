import { CollectionReference, getFirestore } from "firebase-admin/firestore";
import { Company } from "../models/company.model.js";

export class CompaniesRepository {
  constructor() {
    this.collection = getFirestore().collection("companies");
  }

  private collection: CollectionReference;
  
  public async getAll(): Promise<Company[]> {
    const snapshot = await this.collection.get();

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Company[];
  }

  public async getById(id: string): Promise<Company | null> {
    const doc = await this.collection.doc(id).get();
    return doc.data() as Company ?? null;
  }

  public async create(company: Company): Promise<void> {
    await this.collection.add(company);
  }

  public async update(company: Company): Promise<void> {
    await this.collection.doc(company.id).set(company);
  }

  public async delete(companyId: string): Promise<void> {
    await this.collection.doc(companyId).delete();
  }
}