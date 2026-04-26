import { Request, Response } from "express";
import { RidesService } from "../services/rides.service.js";
import { PickupMode, SearchRide } from "../models/ride.model.js";
import { ValidationError } from "../errors/validation.error.js";

export class RidesController {

  public static async getAll(req: Request, res: Response) {
    res.status(200).send(await new RidesService().getAll());
  }

  public static async getById(req: Request, res: Response) {
    const rideId = req.params.id;
    res.status(200).send(await new RidesService().getById(rideId));
  }

  public static async create(req: Request, res: Response) {
    const userId = req.user?.id; 
    await new RidesService().create(req.body, userId);

    res.status(201).send({
      message: "Corrida criada com sucesso!"
    });
  }

  public static async update(req: Request, res: Response) {
    const rideId = req.params.id;
    await new RidesService().update(rideId, req.body);

    res.status(201).send({
      message: "Corrida atualizada com sucesso!"
    });
  }

  public static async chooseRide(req: Request, res: Response) {
    const rideId = req.params.rideId;
    const userId = req.params.userId;
    const seatsRequested = Number(req.body?.seatsRequested ?? 1);
    const pickupAddress = typeof req.body?.pickupAddress === "string" ? req.body.pickupAddress : "";
    const pickupLatLng = Array.isArray(req.body?.pickupLatLng) ? req.body.pickupLatLng : null;
    await new RidesService().chooseRide(userId, rideId, seatsRequested, pickupAddress, pickupLatLng);

    res.status(201).send({
      message: "Corrida escolhida com sucesso!"
    });
  }

  public static async cancelPassengerRide(req: Request, res: Response) {
    const rideId = req.params.rideId;
    const userId = req.params.userId;
    await new RidesService().cancelRide(userId, rideId);

    res.status(201).send({
      message: "Corrida cancelada com sucesso!"
    });
  }

  public static async cancelDriverRide(req: Request, res: Response) {
    const rideId = req.params.rideId;
    const userId = req.params.userId;
    await new RidesService().driverCancelRide(userId, rideId);

    res.status(201).send({
      message: "Corrida cancelada com sucesso!"
    });
  }

  public static async suggest(req: Request, res: Response) {
    const search = req.body as SearchRide;
    search.userId = req.user?.id ?? search.userId;

    const data = await new RidesService().suggestRides(search);

    res.status(200).send({ data });
  }

  public static async updatePickupPlan(req: Request, res: Response) {
    const rideId = req.params.id;
    const userId = req.user?.id;
    const pickupMode = req.body?.pickupMode as PickupMode;
    const meetingPoint = req.body?.meetingPoint ?? null;

    if (!userId) {
      throw new ValidationError("Usuário não autenticado.");
    }

    await new RidesService().updatePickupPlan(rideId, userId, pickupMode, meetingPoint);
    res.status(200).send({ message: "Plano de embarque atualizado com sucesso!" });
  }

  public static async suggestMeetingPoints(req: Request, res: Response) {
    const rideId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      throw new ValidationError("Usuário não autenticado.");
    }

    const data = await new RidesService().suggestMeetingPoints(rideId, userId);
    res.status(200).send({ data });
  }

  public static async getPickupContext(req: Request, res: Response) {
    const rideId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      throw new ValidationError("Usuário não autenticado.");
    }

    const data = await new RidesService().getRidePickupContext(rideId, userId);
    res.status(200).send({ data });
  }
}
