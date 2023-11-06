import { Express } from "express";
import {
  createUserHandler,
  deleteUserHandler,
  getAllUserHandler,
  getUserHandler,
  updateUserHandler,
} from "../controllers/user.controller";
import requiredAdmin from "../middlewares/requireAdmin";
import validateResource from "../middlewares/validateResource";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../schemas/user.schema";

function UserRoutes(app: Express) {
  app.get("/api/users", requiredAdmin, getAllUserHandler);
  app.get("/api/users/:userId", requiredAdmin, getUserHandler);
  app.post(
    "/api/users",
    [requiredAdmin, validateResource(createUserSchema)],
    createUserHandler
  );
  app.put(
    "/api/users/:userId",
    [requiredAdmin, validateResource(updateUserSchema)],
    updateUserHandler
  );
  app.delete(
    "/api/users/:userId",
    [requiredAdmin, validateResource(getUserSchema)],
    deleteUserHandler
  );
}

export default UserRoutes;
