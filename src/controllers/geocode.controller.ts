import { Request, Response, NextFunction } from "express";
import { GeocodeService } from "../services/geocode.service.js";

export class GeocodeController {
  public static async search(req: Request, res: Response, next: NextFunction) {
    const q = String(req.query.q || "");

    res.status(200).send(await new GeocodeService().search(q));
  }
}
