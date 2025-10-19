import { Request, Response, NextFunction } from "express";
import { RidesService } from "../services/rides.service.js";

export class RidesController {

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    res.status(200).send(await new RidesService().getAll());
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    res.status(200).send(await new RidesService().getAll());
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    await new RidesService().create(req.body);

    res.status(201).send({
      message: "Corrida criada com sucesso!"
    });
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    await new RidesService().create(req.body);

    res.status(201).send({
      message: "Corrida atualizada com sucesso!"
    });
  }

  public static async suggest(req: Request, res: Response, next: NextFunction) {
    const { origin, destination } = req.body as { origin: [number, number]; destination: [number, number] };

    const matches = await new RidesService().suggestRides(origin, destination);

    res.status(200).send({ matches });
  }
}
