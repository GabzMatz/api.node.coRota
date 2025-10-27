import express from "express";
import asyncHandler from "express-async-handler";
import { celebrate, Segments } from "celebrate";
import { idSchema } from "../models/base.model.js";
import { RidesHistoryController } from "../controllers/rides-history.controller.js";

const ridesHistoryRoute = express.Router();
const base = "/ride-history";

ridesHistoryRoute.get(`${base}`, asyncHandler(RidesHistoryController.getAll));

ridesHistoryRoute.get(`${base}/:id`, celebrate({ [Segments.PARAMS]: idSchema }), asyncHandler(RidesHistoryController.getById));

ridesHistoryRoute.get(`${base}/user/:id`, celebrate({ [Segments.PARAMS]: idSchema }), asyncHandler(RidesHistoryController.getByUserId));

//#endregion

export default ridesHistoryRoute;
