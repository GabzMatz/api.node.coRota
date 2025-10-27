import express from "express";
import ridesRoute from "./rides.routes.js";
import addressRoute from "./address.routes.js";
import { authRoute } from "./auth.route.js";
import { usersRoute } from "./user.route.js";
import companyRoute from "./company.routes.js";
import ridesHistoryRoute from "./rides-history.routes.js";

export const routes = (app: express.Express) => {
  app.use(express.json()); 
  app.use(
    authRoute,
    usersRoute,
    ridesRoute,
    companyRoute,
    addressRoute,
    ridesHistoryRoute
  );
}