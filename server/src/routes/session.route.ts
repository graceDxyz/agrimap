import {
  createUserSessionHandler,
  deleteSessionHandler,
  getUserSessionHandler,
} from "../controllers/session.controller";
import requireUser from "../middlewares/requireUser";
import validateResource from "../middlewares/validateResource";
import { createSessionSchema } from "../schemas/session.schema";
import { Express } from "express";

function SessionRoutes(app: Express) {
  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createUserSessionHandler,
  );

  app.get("/api/sessions/current", getUserSessionHandler);
  app.post("/api/sessions/current", requireUser, deleteSessionHandler);
}

export default SessionRoutes;
