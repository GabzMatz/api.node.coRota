import { Joi } from "celebrate";
import { Base } from "./base.model.js";

export interface Company extends Base {
  name: string;
  addressId: string;
  usersIds?: string[];
};

export interface SearchCompany {
  name: string;
}

export const companySchema = Joi.object().keys({
  name: Joi.string().required(),
  addressId: Joi.string().alphanum().required(),
  usersIds: Joi.array().items(Joi.string().alphanum()).default([]),
  isActive: Joi.boolean().default(true)
});

export const searchCompanySchema = Joi.object().keys({
  name: Joi.string().required()
});