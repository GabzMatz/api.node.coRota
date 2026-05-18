import { Timestamp } from "firebase-admin/firestore";
import { ForbiddenError } from "../errors/forbidden.error.js";
import { NotFoundError } from "../errors/not-found.error.js";
import { ValidationError } from "../errors/validation.error.js";
import type { ChatMessage } from "../models/chat-message.model.js";
import type { Conversation } from "../models/conversation.model.js";
import { Ride } from "../models/ride.model.js";
import {
  ConversationFirestore,
  ConversationsRepository,
} from "../repositories/conversations.repository.js";
import { RidesRepository } from "../repositories/rides.repository.js";
import { NotificationsService } from "./notifications.service.js";

export class ConversationsService {
  constructor(
    private conversationsRepository = new ConversationsRepository(),
    private ridesRepository = new RidesRepository()
  ) {}

  public async listMine(userId: string): Promise<Conversation[]> {
    const rows = await this.conversationsRepository.listByParticipant(userId);
    return rows.map((row) => this.toConversationDto(row));
  }

  public async openConversation(
    userId: string,
    rideId: string,
    participantId: string
  ): Promise<{ conversationId: string }> {
    if (!participantId || participantId === userId) {
      throw new ValidationError("Participante inválido.");
    }

    const ride = await this.ridesRepository.getById(rideId);
    if (!ride) {
      throw new NotFoundError("Corrida não encontrada!");
    }

    this.assertRideRelationship(ride, userId, participantId);

    const driverId = ride.driverId;
    const passengerId =
      userId === driverId ? participantId : userId;

    const conversationId = ConversationsRepository.buildDocumentId(
      rideId,
      driverId,
      passengerId
    );

    const existing = await this.conversationsRepository.getById(conversationId);
    if (!existing) {
      await this.conversationsRepository.createConversation(conversationId, {
        rideId,
        driverId,
        passengerId,
        participantIds: [driverId, passengerId],
      });
    }

    return { conversationId };
  }

  public async listMessages(
    userId: string,
    conversationId: string
  ): Promise<ChatMessage[]> {
    await this.requireParticipantConversation(conversationId, userId);

    const rows = await this.conversationsRepository.listMessages(
      conversationId,
      200
    );

    return rows.map((row) => ({
      id: row.id,
      conversationId,
      senderId: row.senderId,
      text: row.text,
      createdAt: this.toDate(row.createdAt as Timestamp | undefined),
    }));
  }

  public async sendMessage(
    userId: string,
    conversationId: string,
    text: string
  ): Promise<ChatMessage> {
    await this.requireParticipantConversation(conversationId, userId);

    const messageId = await this.conversationsRepository.addMessage(
      conversationId,
      {
        senderId: userId,
        text,
      }
    );

    await this.conversationsRepository.updateLastMessage(conversationId, text);

    const conversation = await this.conversationsRepository.getById(conversationId);
    if (conversation) {
      const recipientId = conversation.participantIds.find((id) => id !== userId);
      if (recipientId) {
        await new NotificationsService().notifyUser(
          recipientId,
          "Nova mensagem",
          text.length > 80 ? `${text.slice(0, 77)}...` : text,
          "message",
          conversationId
        );
      }
    }

    const createdAt = new Date();

    return {
      id: messageId,
      conversationId,
      senderId: userId,
      text,
      createdAt,
    };
  }

  private assertRideRelationship(
    ride: Ride,
    userId: string,
    otherUserId: string
  ): void {
    const passengers = ride.passengerIds ?? [];
    const isDriver = userId === ride.driverId;
    const isPassenger = passengers.includes(userId);
    const otherIsDriver = otherUserId === ride.driverId;
    const otherIsPassenger = passengers.includes(otherUserId);

    if (isDriver && otherIsPassenger) {
      return;
    }

    if (isPassenger && otherIsDriver) {
      return;
    }

    throw new ForbiddenError(
      "Você só pode conversar com o motorista ou passageiros desta corrida."
    );
  }

  private async requireParticipantConversation(
    conversationId: string,
    userId: string
  ) {
    const conversation = await this.conversationsRepository.getById(
      conversationId
    );

    if (!conversation) {
      throw new NotFoundError("Conversa não encontrada!");
    }

    if (!conversation.participantIds.includes(userId)) {
      throw new ForbiddenError();
    }

    return this.toConversationDto(conversation);
  }

  private toConversationDto(
    row: ConversationFirestore & { id: string }
  ): Conversation {
    return {
      id: row.id,
      rideId: row.rideId,
      driverId: row.driverId,
      passengerId: row.passengerId,
      participantIds: row.participantIds,
      lastMessageText: row.lastMessageText,
      lastMessageAt: row.lastMessageAt
        ? this.toDate(row.lastMessageAt as Timestamp)
        : null,
      createdAt: this.toDate(row.createdAt as Timestamp),
      updatedAt: this.toDate(row.updatedAt as Timestamp),
    };
  }

  private toDate(value: Timestamp | undefined): Date {
    if (!value || typeof (value as Timestamp).toDate !== "function") {
      return new Date();
    }

    return (value as Timestamp).toDate();
  }
}
