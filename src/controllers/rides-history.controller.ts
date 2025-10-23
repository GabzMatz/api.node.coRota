import { Request, Response } from "express";
import { RidesHistoryService } from "../services/rides-history.service.js";

export class RidesHistoryController {

  public static async getAll(req: Request, res: Response) {
    res.status(200).send(await new RidesHistoryService().getAll());
  }

  public static async getById(req: Request, res: Response) {
    const rideHistoryId = req.params.id;
    res.status(200).send(await new RidesHistoryService().getById(rideHistoryId));
  }

  public static async create(req: Request, res: Response) {
    await new RidesHistoryService().create(req.body);

    res.status(201).send({
      message: "Histórico de corrida criado com sucesso!"
    });
  }

  public static async update(req: Request, res: Response) {
    const rideId = req.params.id;
    await new RidesHistoryService().update(rideId, req.body);

    res.status(201).send({
      message: "Histórico de corrida atualizado com sucesso!"
    });
  }

  public static async getByUserId(req: Request, res: Response) {
    const userId = req.params.id;
    res.status(200).send(await new RidesHistoryService().getByUserId(userId));
  }
}
