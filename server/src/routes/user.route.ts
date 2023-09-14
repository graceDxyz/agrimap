import { getAllUserHandler } from "@/controllers/user.controller";
import requiredAdmin from "@/middlewares/requireAdmin";
import { Express } from "express";

function UserRoutes(app: Express) {
  app.get("/api/users", requiredAdmin, getAllUserHandler);
}

export default UserRoutes;
