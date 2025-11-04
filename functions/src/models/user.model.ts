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
};

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
  carInfo: Joi.string().optional().default("")
});

export const updateUserSchema = Joi.object().keys({
  corporateEmail: Joi.string().email().required(),
  cpf: Joi.string().pattern(/^\d{11}$/).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
  companyId: Joi.string().required(),
  addressId: Joi.string().required(),
  hasCar: Joi.boolean().required(),
  password: Joi.string().min(6).optional(),
  isActive: Joi.boolean().default(true),
  workSchedule: Joi.date().optional().allow(null),
  carInfo: Joi.string().optional().default("")
});

export const loginSchema = Joi.object().keys({
  corporateEmail: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const authRecoverySchema = Joi.object().keys({
  corporateEmail: Joi.string().email().required(),
});
