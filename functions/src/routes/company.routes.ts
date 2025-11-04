import express from "express";
import asyncHandler from "express-async-handler";
import { celebrate, Segments } from "celebrate";
import { idSchema } from "../models/base.model.js";
import { companySchema, searchCompanySchema } from "../models/company.model.js";
import { CompanyController } from "../controllers/company.controller.js";

const companyRoute = express.Router();
const base = "/companies";

companyRoute.post(`${base}`, celebrate({ [Segments.BODY]: companySchema}), asyncHandler(CompanyController.create));

companyRoute.get(`${base}`, asyncHandler(CompanyController.getAll));

companyRoute.post(`${base}/search`, celebrate({ [Segments.BODY]: searchCompanySchema}), asyncHandler(CompanyController.search));

companyRoute.get(`${base}/:id`, celebrate({ [Segments.PARAMS]: idSchema }), asyncHandler(CompanyController.getById));

companyRoute.put(`${base}/:id`, celebrate({ [Segments.BODY]: companySchema}), asyncHandler(CompanyController.update));

companyRoute.delete(`${base}/:id`, celebrate({ [Segments.PARAMS]: idSchema }), asyncHandler(CompanyController.delete));

export default companyRoute;