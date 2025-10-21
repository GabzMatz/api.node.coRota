import { Request, Response, NextFunction } from "express";
import { AddressRepository } from "../repositories/address.repository.js";

export class AddressController {

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    res.status(200).send(await new AddressRepository().getAll());
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    const rideId = req.params.id;
    res.status(200).send(await new AddressRepository().getById(rideId));
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    await new AddressRepository().create(req.body);

    res.status(201).send({
      message: "Endereço criado com sucesso!"
    });
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    await new AddressRepository().update(req.body);

    res.status(201).send({
      message: "Endereço atualizado com sucesso!"
    });
  }

}
