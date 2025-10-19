import express from "express";
import { MeetingController } from "../controllers/meeting.controller.js";
import { RidesController } from "../controllers/rides.controller.js";
import { GeocodeController } from "../controllers/geocode.controller.js";
import asyncHandler from "express-async-handler";
import { celebrate, Segments } from "celebrate";
import { rideSchema } from "../models/ride.model.js";

const ridesRoute = express.Router();
const base = "/ride";

//#region Geocode routes

ridesRoute.get(`${base}/geocode`, asyncHandler(GeocodeController.search));
ridesRoute.post(`${base}/meeting-point`, asyncHandler(MeetingController.calculate));
ridesRoute.post(`${base}/suggest-rides`, asyncHandler(RidesController.suggest));

//#endregion

//#region Ride rotes

ridesRoute.post(`${base}`, celebrate({ [Segments.BODY]: rideSchema}), asyncHandler(RidesController.create));
ridesRoute.get(`${base}`, asyncHandler(RidesController.getAll));

//#endregion

export default ridesRoute;
