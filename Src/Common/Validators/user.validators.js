import Joi from "joi";
import { GENDER } from "../Common/constants.js";
import { generalValidators } from "../Common/Validators/general.validator.js";

export const updateProfileSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(50),
    lastName: Joi.string().min(3).max(50),
    email: generalValidators.email,
    gender: Joi.string().valid(...Object.values(GENDER)),
    phoneNumber: Joi.string().length(11),
  })
    .min(1)
    .required(),
};

export const userIdSchema = {
  params: Joi.object({
    id: generalValidators._id.required(),
  }).required(),
};
