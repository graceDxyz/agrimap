import { Express } from "express";
import { getReportHandler } from "../controllers/report.controller";
import requiredUser from "../middlewares/requireUser";

function ReportRoutes(app: Express) {
  app.get("/api/report", requiredUser, getReportHandler);
}

export default ReportRoutes;
