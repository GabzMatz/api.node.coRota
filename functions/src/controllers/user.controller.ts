import { Request, Response } from "express"
import { UserService } from "../services/user.service.js";
import { User } from "../models/user.model.js";

export class UsersController {
  
  public static async getAll(req: Request, res: Response) {
    res.status(200).send(await new UserService().getAll());
  }

  public static async getById(req: Request, res: Response) {
    res.status(200).send(await new UserService().getById(req.params.id));
  }

  public static async create(req: Request, res: Response) {
    await new UserService().create(req.body);

    res.status(201).send({
      message: "Usuário criado com sucesso!"
    });
  }

  public static async update(req: Request, res: Response) {
    const userId = req.params.id;
    const reqBody = req.body as User;

    await new UserService().update(userId, reqBody);
  
    res.status(200).send({
      message: "Usuário atualizado com sucesso!"
    });
  }

  public static async delete(req: Request, res: Response) {
    await new UserService().delete(req.params.id);
    res.status(204).end();
  }
}