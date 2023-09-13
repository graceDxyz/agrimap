import { createUserSessionHandler } from "@/controllers/session.controller";
import validateResource from "@/middlewares/validateResource";
import { createSessionSchema } from "@/schemas/session.schema";
import { Express } from "express";

function SessionRoutes(app: Express) {
  app.post(
    "/api/sessions",
    validateResource(createSessionSchema),
    createUserSessionHandler,
  );
}

export default SessionRoutes;
