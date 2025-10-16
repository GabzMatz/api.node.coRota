import express from "express";
import { initializeApp } from 'firebase-admin/app';

initializeApp();
const app = express();

app.get("/", (req, res) => {
	res.send("Rota teste");
});

app.listen(3000, () => {});