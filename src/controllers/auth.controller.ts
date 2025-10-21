import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  public static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const userRecord = await new AuthService().login(email, password);
    const token = await userRecord.user.getIdToken(true);

    res.send({ token: token });
  }

  public static async recovery(req: Request, res: Response): Promise<void> {
    const email = req.body.email;
    await new AuthService().recovery(email);

    res.end();
  }
}