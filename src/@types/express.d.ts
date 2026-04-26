import { User } from "../models/user.model.ts";

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}