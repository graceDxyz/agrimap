import { Express } from "express";
import requiredUser from "../middlewares/requireUser";
import { getAllStatisticsHandler } from "../controllers/statistics.controller";

function StatisticRoutes(app: Express) {
  app.get("/api/statistics", requiredUser, getAllStatisticsHandler);
}

export default StatisticRoutes;
