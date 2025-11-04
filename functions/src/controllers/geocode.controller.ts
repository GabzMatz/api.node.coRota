import { Request, Response } from "express";
import { GeocodeService } from "../services/geocode.service.js";

export class GeocodeController {
  public static async search(req: Request, res: Response) {
    const q = String(req.query.q || "");

    res.status(200).send(await new GeocodeService().search(q));
  }
}
