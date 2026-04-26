import express from "express";
import asyncHandler from "express-async-handler";
import { celebrate, Segments } from "celebrate";
import { ConversationsController } from "../controllers/conversations.controller.js";
import {
  conversationIdParamSchema,
  openConversationBodySchema,
  sendMessageBodySchema,
} from "../models/conversation.model.js";

const conversationsRoute = express.Router();
const base = "/conversations";

conversationsRoute.get(
  `${base}`,
  asyncHandler(ConversationsController.listMine)
);

conversationsRoute.post(
  `${base}/open`,
  celebrate({ [Segments.BODY]: openConversationBodySchema }),
  asyncHandler(ConversationsController.open)
);

conversationsRoute.get(
  `${base}/:conversationId/messages`,
  celebrate({ [Segments.PARAMS]: conversationIdParamSchema }),
  asyncHandler(ConversationsController.listMessages)
);

conversationsRoute.post(
  `${base}/:conversationId/messages`,
  celebrate({
    [Segments.PARAMS]: conversationIdParamSchema,
    [Segments.BODY]: sendMessageBodySchema,
  }),
  asyncHandler(ConversationsController.sendMessage)
);

export default conversationsRoute;
