import express from "express";
import { MeetingController } from "../controllers/meeting.controller.js";
import { RidesController } from "../controllers/rides.controller.js";
import { GeocodeController } from "../controllers/geocode.controller.js";
import asyncHandler from "express-async-handler";
import { celebrate, Segments } from "celebrate";
import { rideSchema, rideIdsSchema, searchRideSchema } from "../models/ride.model.js";
import { idSchema } from "../models/base.model.js";

const ridesRoute = express.Router();
const base = "/ride";

//#region Geocode routes

ridesRoute.get(`${base}/geocode`, asyncHandler(GeocodeController.search));
ridesRoute.post(`${base}/meeting-point`, asyncHandler(MeetingController.calculate));
ridesRoute.post(`${base}/suggest-rides`, celebrate({ [Segments.BODY]: searchRideSchema}), asyncHandler(RidesController.suggest));

//#endregion

//#region Ride rotes

ridesRoute.post(`${base}`, celebrate({ [Segments.BODY]: rideSchema}), asyncHandler(RidesController.create));
ridesRoute.get(`${base}`, asyncHandler(RidesController.getAll));
ridesRoute.get(`${base}/:id`, celebrate({ [Segments.PARAMS]: idSchema }), asyncHandler(RidesController.getById));
ridesRoute.put(`${base}`, celebrate({ [Segments.BODY]: rideSchema}), asyncHandler(RidesController.update));
ridesRoute.put(`${base}/:rideId/choose/:userId`, celebrate({ [Segments.PARAMS]: rideIdsSchema }), asyncHandler(RidesController.chooseRide));
ridesRoute.put(`${base}/:rideId/calcel/:userId`, celebrate({ [Segments.PARAMS]: rideIdsSchema }), asyncHandler(RidesController.cancelPassengerRide));

//#endregion

export default ridesRoute;
