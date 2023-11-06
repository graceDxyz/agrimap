import { Express } from "express";
import requiredUser from "../middlewares/requireUser";
import {
  getStatCountHandler,
  getStatHandler,
  getStatRecentHandler,
} from "../controllers/statistics.controller";

function StatisticRoutes(app: Express) {
  app.get("/api/statistics/recent", requiredUser, getStatRecentHandler);
  app.get("/api/statistics", requiredUser, getStatHandler);
  app.get("/api/statistics/count", requiredUser, getStatCountHandler);
}

export default StatisticRoutes;
