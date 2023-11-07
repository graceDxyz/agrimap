import express from "express";
import requiredUser from "../middlewares/requireUser";
import {
  getStatCountHandler,
  getStatHandler,
  getStatRecentHandler,
} from "../controllers/statistics.controller";

const router = express.Router();

router.get("/recent", requiredUser, getStatRecentHandler);
router.get("/", requiredUser, getStatHandler);
router.get("/count", requiredUser, getStatCountHandler);

export default router;
