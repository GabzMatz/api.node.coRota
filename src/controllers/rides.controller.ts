import { Request, Response, NextFunction } from "express";
import { RidesService } from "../services/rides.service.js";
import { SearchRide } from "../models/ride.model.js";

export class RidesController {

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    res.status(200).send(await new RidesService().getAll());
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    const rideId = req.params.id;
    res.status(200).send(await new RidesService().getById(rideId));
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    await new RidesService().create(req.body);

    res.status(201).send({
      message: "Corrida criada com sucesso!"
    });
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    const rideId = req.params.id;
    await new RidesService().update(rideId, req.body);

    res.status(201).send({
      message: "Corrida atualizada com sucesso!"
    });
  }

  public static async chooseRide(req: Request, res: Response, next: NextFunction) {
    const rideId = req.params.rideId;
    const userId = req.params.userId;
    await new RidesService().chooseRide(userId, rideId);

    res.status(201).send({
      message: "Corrida escolhida com sucesso!"
    });
  }

  public static async cancelPassengerRide(req: Request, res: Response, next: NextFunction) {
    const rideId = req.params.rideId;
    const userId = req.params.userId;
    await new RidesService().cancelRide(userId, rideId);

    res.status(201).send({
      message: "Corrida cancelada com sucesso!"
    });
  }

  public static async suggest(req: Request, res: Response, next: NextFunction) {
    const search = req.body as SearchRide;

    const data = await new RidesService().suggestRides(search);

    res.status(200).send({ data });
  }
}
