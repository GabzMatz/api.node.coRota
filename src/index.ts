import express from "express";
import { initializeApp } from 'firebase-admin/app';
import { routes } from "./routes/index.js";
import { pageNotFoundHandler } from "./middlewares/page-not-found.middleware.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { initializeApp as initializeFirebaseApp } from "firebase/app";
import { auth } from "./middlewares/auth.middleware.js";

initializeApp();
initializeFirebaseApp({
  apiKey: process.env.API_KEY
});

const app = express();
const port = process.env.PORT || 3000;

auth(app);
routes(app);
pageNotFoundHandler(app);
errorHandler(app);

app.listen(port);