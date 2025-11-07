import { Joi } from "celebrate";
import { Base, LatLng } from "./base.model.js";
import { Timestamp } from "firebase-admin/firestore";

export interface Ride extends Base {
  driverId: string;
  departureLatLng: LatLng;
  destinationLatLng: LatLng;
  date: Timestamp;
  startTime: string;
  endTime: string;
  allSeats: number;
  availableSeats: number;
  pricePerPassenger: number;
  passengerIds?: string[];
  extraMeters: number;
};

export type RideDto = Omit<Ride, 'date'> & { date: string };

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
  date: Date | null;
  time: string | null;
  userId?: string | null;
}

export const rideSchema = Joi.object().keys({
  driverId: Joi.string().required(),
  departureLatLng: Joi.array().items(Joi.number()).required(),
  destinationLatLng: Joi.array().items(Joi.number()).required(),
  date: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().required(),
  allSeats: Joi.number().integer().min(1).required(),
  pricePerPassenger: Joi.number().precision(2).min(0).required(),
  passengerIds: Joi.array().items(Joi.string()).default([]),
  isActive: Joi.boolean().default(true),
  availableSeats: Joi.number().integer().optional().default(0),
});

export const searchRideSchema = Joi.object().keys({
  departureLatLng: Joi.array().items(Joi.number()).required(),
  destinationLatLng: Joi.array().items(Joi.number()).required(),
  date: Joi.date().optional().default(null),
  time: Joi.string().optional().default(null),
  userId: Joi.string().optional().default(null),
});

export const rideIdsSchema = Joi.object({
  rideId: Joi.string().alphanum().required(),
  userId: Joi.string().alphanum().required()
});