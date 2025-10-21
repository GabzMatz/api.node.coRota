import { Router } from "express";
import asyncHandler from "express-async-handler";
import { AuthController } from "../controllers/auth.controller.js";
import { celebrate, Segments } from "celebrate";
import { authRecoverySchema, loginSchema } from "../models/user.model.js";

export const authRoute = Router();

authRoute.post("/auth/login", celebrate({ [Segments.BODY]: loginSchema }), asyncHandler(AuthController.login));

authRoute.post("/auth/recovery", celebrate({ [Segments.BODY]: authRecoverySchema }), asyncHandler(AuthController.recovery));