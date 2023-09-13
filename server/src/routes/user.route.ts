import { getAllUserHandler } from "@/controllers/user.controller";
import { Express } from "express";

function UserRoutes(app: Express) {
  app.get("/api/users", getAllUserHandler);
}

export default UserRoutes;
