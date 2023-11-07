import express from "express";
import { getReportHandler } from "../controllers/report.controller";
import requiredUser from "../middlewares/requireUser";

const router = express.Router();

router.get("/", requiredUser, getReportHandler);

export default router;
