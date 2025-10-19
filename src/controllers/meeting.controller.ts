import { Request, Response, NextFunction } from "express";
import { MeetingService } from "../services/meeting.service.js";

export class MeetingController {
  public static async calculate(req: Request, res: Response, next: NextFunction) {
    const { personA, personB } = req.body as { personA: [number, number]; personB: [number, number] };

    const result = await new MeetingService().calculateMeetingPoint(personA, personB);

    res.status(200).send(result);
  }
}
