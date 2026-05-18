import { Joi } from "celebrate";
import { Base } from "./base.model.js";
import { isValidBrazilianLicensePlate } from "../utils/license-plate.js";

export type VehicleType = "car" | "motorcycle";

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
  vehicleType?: VehicleType;
  photo?: string;
  pushTokens?: Array<{ token: string; platform: string }>;
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
  carSeats: Joi.number().integer().min(1).max(8).optional(),
  vehicleType: Joi.string().valid("car", "motorcycle").optional(),
  photo: photoSchema.optional(),
}).custom((value, helpers) => {
  if (value.hasCar && value.carInfo) {
    const plateMatch = String(value.carInfo).match(/Placa:\s*([^|]+)/i);
    const plate = plateMatch?.[1]?.trim() || "";
    if (plate && !isValidBrazilianLicensePlate(plate)) {
      return helpers.error("any.invalid", { message: "Placa inválida. Use o padrão antigo (ABC1234) ou Mercosul (ABC1D23)." });
    }
  }
  return value;
});

export const updateUserSchema = Joi.object().keys({
  phone: Joi.string().trim().optional(),
  photo: photoSchema.optional(),
  carInfo: Joi.string().trim().allow("").optional(),
  carSeats: Joi.number().integer().min(1).max(8).optional(),
  vehicleType: Joi.string().valid("car", "motorcycle").optional(),
  clearVehicle: Joi.boolean().optional(),
}).min(1).custom((value, helpers) => {
  if (value.carInfo && value.carInfo.trim()) {
    const plateMatch = String(value.carInfo).match(/Placa:\s*([^|]+)/i);
    const plate = plateMatch?.[1]?.trim() || "";
    if (plate && !isValidBrazilianLicensePlate(plate)) {
      return helpers.error("any.invalid", { message: "Placa inválida. Use o padrão antigo (ABC1234) ou Mercosul (ABC1D23)." });
    }
  }
  return value;
});

export const loginSchema = Joi.object().keys({
  corporateEmail: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const authRecoverySchema = Joi.object().keys({
  corporateEmail: Joi.string().email().required(),
});
