import { Request, Response } from "express";
import { AddressService } from "../services/address.service.js";

export class AddressController {

  public static async getAll(req: Request, res: Response) {
    res.status(200).send(await new AddressService().getAll());
  }

  public static async getById(req: Request, res: Response) {
    const rideId = req.params.id;
    res.status(200).send(await new AddressService().getById(rideId));
  }

  public static async create(req: Request, res: Response) {
    const data = await new AddressService().create(req.body);

    res.status(200).send({
      message: "Endereço criado com sucesso!",
      data
    });
  }

  public static async update(req: Request, res: Response) {
    const id = req.params.id;
    await new AddressService().update(id, req.body);

    res.status(201).send({
      message: "Endereço atualizado com sucesso!"
    });
  }

}
