import express from "express";
import { initializeApp } from 'firebase-admin/app';
import { routes } from "./routes/index.js";
import { pageNotFoundHandler } from "./middlewares/page-not-found.middleware.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { initializeApp as initializeFirebaseApp } from "firebase/app";
import { auth } from "./middlewares/auth.middleware.js";
import cors from 'cors';
import { onRequest } from "firebase-functions/v1/https";
import * as dotenv from "dotenv";

dotenv.config();

initializeApp();
initializeFirebaseApp({
  apiKey: process.env.API_KEY
});

const app = express();

app.use(cors());

auth(app);
routes(app);
pageNotFoundHandler(app);
errorHandler(app);

import('./cron/ride-completion-cron.js');

export const api = onRequest(app);