import express, { Router } from "express";
import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
} from "../controllers/session.controller";
import requireUser from "../middlewares/requireUser";
import validateResource from "../middlewares/validateResource";
import { createSessionSchema } from "../schemas/session.schema";

const router: Router = express.Router();

router.post(
  "/",
  validateResource(createSessionSchema),
  createUserSessionHandler
);
router.get("/current", getUserSessionHandler);
router.post("/current", requireUser, deleteSessionHandler);

export default router;
