import { Express } from "express";
import requiredUser from "../middlewares/requireUser";
import {
  getStatHandler,
  getStatRecentHandler,
} from "../controllers/statistics.controller";

function StatisticRoutes(app: Express) {
  app.get("/api/statistics/recent", requiredUser, getStatRecentHandler);
  app.get("/api/statistics", requiredUser, getStatHandler);
}

export default StatisticRoutes;
