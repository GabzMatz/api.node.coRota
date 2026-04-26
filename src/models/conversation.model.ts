import { Joi } from "celebrate";

export interface Conversation {
  id: string;
  rideId: string;
  driverId: string;
  passengerId: string;
  participantIds: string[];
  lastMessageText?: string;
  lastMessageAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const openConversationBodySchema = Joi.object({
  rideId: Joi.string().required(),
  participantId: Joi.string().required(),
});

export const sendMessageBodySchema = Joi.object({
  text: Joi.string().trim().min(1).max(4000).required(),
});

export const conversationIdParamSchema = Joi.object({
  conversationId: Joi.string().required(),
});
