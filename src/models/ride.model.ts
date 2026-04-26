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
  pickupMode?: PickupMode;
  meetingPoint?: Route | null;
  passengerPickups?: PassengerPickup[];
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

export type PickupMode = "meeting_point" | "street_by_street";

export interface MeetingPointSuggestion extends Route {
  score: number;
  reason: string;
}

export interface PassengerPickup {
  userId: string;
  address: string;
  lat: number;
  long: number;
}

export interface SearchRide {
  departureLatLng: LatLng;
  destinationLatLng: LatLng;
  date: Date | string | null;
  time: string | null;
  minimumAvailableSeats?: number;
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
  pickupMode: Joi.string().valid("meeting_point", "street_by_street").optional().default("meeting_point"),
  meetingPoint: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().allow("").required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
  }).optional().allow(null),
  isActive: Joi.boolean().default(true),
  availableSeats: Joi.number().integer().optional().default(0),
});

export const searchRideSchema = Joi.object().keys({
  departureLatLng: Joi.array().items(Joi.number()).required(),
  destinationLatLng: Joi.array().items(Joi.number()).required(),
  date: Joi.date().optional().default(null),
  time: Joi.string().optional().default(null),
  minimumAvailableSeats: Joi.number().integer().min(1).optional().default(1),
  userId: Joi.string().optional().default(null),
});

export const chooseRideSchema = Joi.object({
  seatsRequested: Joi.number().integer().min(1).optional().default(1),
  pickupAddress: Joi.string().trim().optional().allow("").default(""),
  pickupLatLng: Joi.array().items(Joi.number()).length(2).optional(),
});

export const rideIdsSchema = Joi.object({
  rideId: Joi.string().alphanum().required(),
  userId: Joi.string().alphanum().required()
});

export const updatePickupPlanSchema = Joi.object({
  pickupMode: Joi.string().valid("meeting_point", "street_by_street").required(),
  meetingPoint: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().allow("").required(),
    lat: Joi.number().required(),
    long: Joi.number().required(),
  }).optional().allow(null),
});