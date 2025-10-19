import express from "express";
import { initializeApp } from 'firebase-admin/app';
import { routes } from "./routes/index.js";
import { pageNotFoundHandler } from "./middlewares/page-not-found.middleware.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

initializeApp();

const app = express();
const port = process.env.PORT || 3000;

routes(app);
pageNotFoundHandler(app);
errorHandler(app);

app.listen(port);