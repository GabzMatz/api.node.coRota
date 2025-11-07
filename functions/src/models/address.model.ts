import { Joi } from "celebrate";
import { Base } from "./base.model.js";

export interface Address extends Base {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
  lat: string;
  long: string;
}

export const addressSchema = Joi.object().keys({
  street: Joi.string().required(),
  number: Joi.string().required(),
  neighborhood: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  lat: Joi.string().required(),
  long: Joi.string().required(),
  complement: Joi.string().allow(null, "").optional().default(""),
  isActive: Joi.boolean().default(true)
});
