import { Joi } from "celebrate";
import { Base } from "./base.model.js";
import { Ride } from "./ride.model.js";

export enum RideRole {
  DRIVER = "driver",
  PASSENGER = "passenger",
}

export enum RideStatus {
  COMPLETED = "completed",
  CANCELED = "canceled",
  PENDING = "pending",
}

export interface RidesHistory extends Base {
  userId: string;
  rideId: string;
  role: RideRole;
  status: RideStatus;
  ride: Ride;
}

export const rideHistorySchema = Joi.object().keys({
  userId: Joi.string().required(),
  rideId: Joi.string().required(),
  role: Joi.string()
    .valid(...Object.values(RideRole))
    .required(),
  status: Joi.string()
    .valid(...Object.values(RideStatus))
    .required(),
  isActive: Joi.boolean().default(true)
});
