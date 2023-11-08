import express, { Router } from "express";
import {
  getStatCountHandler,
  getStatHandler,
  getStatRecentHandler,
} from "../controllers/statistics.controller";
import requiredUser from "../middlewares/requireUser";

const router: Router = express.Router();

router.get("/recent", requiredUser, getStatRecentHandler);
router.get("/", requiredUser, getStatHandler);
router.get("/count", requiredUser, getStatCountHandler);

export default router;
