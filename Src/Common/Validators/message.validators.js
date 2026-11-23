import Joi from "joi";
import { generalValidators } from "./general.validator.js";

export const sendMessageSchema = {
  body: Joi.object({
    content: Joi.string().trim().min(1).max(1000).required(),
    receiverId: generalValidators._id.required(),
  }).required(),
};

export const messageIdSchema = {
  params: Joi.object({
    id: generalValidators._id.required(),
  }).required(),
};
