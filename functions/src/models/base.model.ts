import { Joi } from "celebrate";

export interface Base {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export type LatLng = [number, number]; 

export const idSchema = Joi.object({
  id: Joi.string().alphanum().required()
});