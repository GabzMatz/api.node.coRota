import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { UserService } from "../services/user.service.js";

export class AuthController {
  public static async login(req: Request, res: Response): Promise<void> {
    const { corporateEmail, password } = req.body;
    const userRecord = await new AuthService().login(corporateEmail, password);
    const token = await userRecord.user.getIdToken(true);
    const user = await new UserService().getById(userRecord.user.uid);

    res.send({ token: token, id: userRecord.user.uid, email: user.corporateEmail, companyId: user.companyId });
  }

  public static async recovery(req: Request, res: Response): Promise<void> {
    const email = req.body.email;
    await new AuthService().recovery(email);

    res.end();
  }
}