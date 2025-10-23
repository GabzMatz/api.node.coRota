import { Router } from "express";
import { UsersController } from "../controllers/user.controller.js";
import asyncHandler from "express-async-handler";
import { celebrate, Segments } from "celebrate";
import { createUserSchema, updateUserSchema } from "../models/user.model.js";
import { idSchema } from "../models/base.model.js";

export const usersRoute = Router();
const base = "/users";

usersRoute.get(`${base}`, asyncHandler(UsersController.getAll));

usersRoute.get(`${base}/:id`, celebrate({ [Segments.PARAMS]: idSchema }), asyncHandler(UsersController.getById));

usersRoute.post(`${base}/register`, celebrate({ [Segments.BODY]: createUserSchema }), asyncHandler(UsersController.create));

usersRoute.put(`${base}/:id`, celebrate({ [Segments.PARAMS]: idSchema, [Segments.BODY]: updateUserSchema }), asyncHandler(UsersController.update));

usersRoute.delete(`${base}/:id`, celebrate({ [Segments.PARAMS]: idSchema }), asyncHandler(UsersController.delete));
