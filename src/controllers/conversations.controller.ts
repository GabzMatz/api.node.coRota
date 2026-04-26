import { Request, Response } from "express";
import { ConversationsService } from "../services/conversations.service.js";

export class ConversationsController {
  public static async listMine(req: Request, res: Response) {
    const userId = (req as any).user.id as string;
    const items = await new ConversationsService().listMine(userId);
    res.status(200).json(items);
  }

  public static async open(req: Request, res: Response) {
    const userId = (req as any).user.id as string;
    const { rideId, participantId } = req.body as {
      rideId: string;
      participantId: string;
    };

    const result = await new ConversationsService().openConversation(
      userId,
      rideId,
      participantId
    );

    res.status(200).json(result);
  }

  public static async listMessages(req: Request, res: Response) {
    const userId = (req as any).user.id as string;
    const { conversationId } = req.params;

    const items = await new ConversationsService().listMessages(
      userId,
      conversationId
    );

    res.status(200).json(items);
  }

  public static async sendMessage(req: Request, res: Response) {
    const userId = (req as any).user.id as string;
    const { conversationId } = req.params;
    const { text } = req.body as { text: string };

    const message = await new ConversationsService().sendMessage(
      userId,
      conversationId,
      text
    );

    res.status(201).json(message);
  }
}
