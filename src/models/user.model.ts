import { Joi } from "celebrate";
import { Base } from "./base.model.js";

export interface User extends Base{
  corporateEmail: string;
  cpf: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  companyId: string;
  addressId: string;
  hasCar: boolean;
  workSchedule: Date | null;
  carInfo: string;
  carSeats?: number;
  photo?: string;
};

const MAX_PHOTO_DATA_URL_LENGTH = 700000;

const photoSchema = Joi.string().allow("").custom((value, helpers) => {
  if (!value) {
    return value;
  }

  const isHttpUrl = /^https?:\/\//i.test(value);
  const isImageDataUrl = /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(value);

  if (!isHttpUrl && !isImageDataUrl) {
    return helpers.error("any.invalid");
  }

  if (isImageDataUrl && value.length > MAX_PHOTO_DATA_URL_LENGTH) {
    return helpers.error("any.invalid");
  }

  return value;
}, "photo validation");

export const createUserSchema = Joi.object().keys({
  corporateEmail: Joi.string().email().required(),
  cpf: Joi.string().pattern(/^\d{11}$/).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  password: Joi.string().min(6).required(),
  companyId: Joi.string().alphanum( ).required(),
  addressId: Joi.string().alphanum().required(),
  hasCar: Joi.boolean().required().default(false),
  isActive: Joi.boolean().default(true),
  workSchedule: Joi.date().optional().allow(null),
  carInfo: Joi.string().optional().default(""),
  carSeats: Joi.number().integer().min(2).max(8).optional(),
  photo: photoSchema.optional(),
});

export const updateUserSchema = Joi.object().keys({
  phone: Joi.string().trim().optional(),
  photo: photoSchema.optional(),
  carInfo: Joi.string().trim().allow("").optional(),
  carSeats: Joi.number().integer().min(2).max(8).optional(),
}).min(1);

export const loginSchema = Joi.object().keys({
  corporateEmail: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const authRecoverySchema = Joi.object().keys({
  corporateEmail: Joi.string().email().required(),
});
