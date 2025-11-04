import { getAuth, UpdateRequest, UserRecord } from "firebase-admin/auth";
import { EmailAlreadyExists } from "../errors/email-already-exists.error.js";
import { getAuth as getFirebaseAuth, sendPasswordResetEmail, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { FirebaseError } from "firebase/app";
import { User } from "../models/user.model.js";

export class AuthService {
  public async create(user: User): Promise<UserRecord> {
    return await getAuth().createUser({
      email: user.corporateEmail,
	    password: user.password,
	    displayName: `${user.firstName} ${user.lastName}`,
      emailVerified: false
    })
    .catch((error) => {
      if (error.code === "auth/email-already-exists")
        throw new EmailAlreadyExists();

      throw error;
    });
  }

  public async update(id: string, user: User): Promise<void> {
    const props: UpdateRequest = {
      displayName: `${user.firstName} ${user.lastName}`,
      email: user.corporateEmail
    }

    await getAuth().updateUser(id, props);
  }

  public async delete(id: string): Promise<void> {
    await getAuth().deleteUser(id);
  }

  public async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
    .catch(error => {
      if (error instanceof FirebaseError && error.code === "auth/invalid-credential") 
        throw new UnauthorizedError();

      throw error;
    });
  }

  public async recovery(email: string): Promise<void> {
    await sendPasswordResetEmail(getFirebaseAuth(), email);
  }

  public async verifyEmail(email: string): Promise<void> {
    await getAuth().generateEmailVerificationLink(email);
  }
}