import express from "express";
import ridesRoute from "./rides.routes.js";
import addressRoute from "./address.routes.js";
import { authRoute } from "./auth.route.js";

export const routes = (app: express.Express) => {
  app.use(express.json()); 
  app.use(
    authRoute,
    ridesRoute,
    addressRoute
  );
}