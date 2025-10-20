import { Joi } from "celebrate";
import { Base, LatLng } from "./base.model.js";

export interface Ride extends Base {
  driverId: string;
  departureLatLng: LatLng;
  destinationLatLng: LatLng;
  date: Date;
  time: string;
  allSeats: number;
  availableSeats: number;
  pricePerPassenger: number;
  passengerIds?: string[];
  extraMeters: number;
};

export interface Route {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  long: number;
}

export interface SearchRide {
  departureLatLng: LatLng;
  destinationLatLng: LatLng;
  date: Date;
  time: string;
}

export const rideSchema = Joi.object().keys({
  driverId: Joi.string().required(),
  departureLatLng: Joi.array().items(Joi.number()).required(),
  destinationLatLng: Joi.array().items(Joi.number()).required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
  availableSeats: Joi.number().integer().min(1).required(),
  pricePerPassenger: Joi.number().precision(2).min(0).required(),
  passengerIds: Joi.array().items(Joi.string()).default([]),
  isActive: Joi.boolean().default(true),
});

export const searchRideSchema = Joi.object().keys({
  departureLatLng: Joi.array().items(Joi.number()).required(),
  destinationLatLng: Joi.array().items(Joi.number()).required(),
  date: Joi.date().required(),
  time: Joi.string().required(),
});