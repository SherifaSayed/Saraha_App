import { Router } from "express";
import * as messageService from "./message.service.js";
import {
  authenticate,
  validation,
  responseFormatter,
} from "../../middlewares/index.js";
import {
  sendMessageSchema,
  messageIdSchema,
} from "../../validators/message.validators.js";

const messageController = Router();

messageController.post(
  "/send",
  validation(sendMessageSchema),
  responseFormatter(async (req) => {
    const data = await messageService.sendMessage(req.body);
    return { message: "Message sent", data, meta: { statusCode: 201 } };
  }),
);

messageController.get(
  "/",
  authenticate,
  responseFormatter(async (req) => {
    const data = await messageService.getMyMessages(req.user);
    return { message: "Messages fetched", data, meta: { statusCode: 200 } };
  }),
);

messageController.get(
  "/:id",
  authenticate,
  validation(messageIdSchema),
  responseFormatter(async (req) => {
    const data = await messageService.getMessageById(req.user, req.params.id);
    return { message: "Message fetched", data, meta: { statusCode: 200 } };
  }),
);

messageController.delete(
  "/:id",
  authenticate,
  validation(messageIdSchema),
  responseFormatter(async (req) => {
    const data = await messageService.deleteMessage(req.user, req.params.id);
    return { message: "Message deleted", data, meta: { statusCode: 200 } };
  }),
);

export default messageController;
