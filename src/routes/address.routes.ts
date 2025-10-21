import express from "express";
import asyncHandler from "express-async-handler";
import { celebrate, Segments } from "celebrate";
import { AddressController } from "../controllers/address.controller.js";
import { addressSchema } from "../models/address.model.js";
import { idSchema } from "../models/base.model.js";


const addressRoute = express.Router();
const base = "/address";

addressRoute.post(`${base}`, celebrate({ [Segments.BODY]: addressSchema}), asyncHandler(AddressController.create));

addressRoute.get(`${base}`, asyncHandler(AddressController.getAll));

addressRoute.get(`${base}/:id`, celebrate({ [Segments.PARAMS]: idSchema }), asyncHandler(AddressController.getById));

addressRoute.put(`${base}`, celebrate({ [Segments.BODY]: addressSchema}), asyncHandler(AddressController.update));

export default addressRoute;
