import cron from "node-cron";
import { RidesService } from "../services/rides.service.js";

const ridesService = new RidesService();

const task = cron.schedule(
  "* * * * *", // every minute
  async () => {
    try {
      await ridesService.checkAndCompleteExpiredRides();
    } catch (err) {
      console.error("Erro ao verificar corridas expiradas:", err);
    }
  },
  {
    timezone: "America/Sao_Paulo",
  }
);

// start immediately
task.start();

const shutdown = async () => {
  try {
    console.log("Parando cron job...");
    task.stop();
    process.exit(0);
  } catch (err) {
    console.error("Erro no shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
