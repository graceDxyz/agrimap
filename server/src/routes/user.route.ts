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
import UserModel from "../models/user.model";
import {
  createUserSchema,
  getUserSchema,
  updateUserSchema,
} from "../schemas/user.schema";

const usersToSeed = [
  {
    firstname: "John",
    lastname: "Doe",
    email: "john.doe@example.com",
    password: "Password",
    role: "ADMIN",
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    email: "jane.smith@example.com",
    password: "Password",
    role: "USER",
  },
  {
    firstname: "Robert",
    lastname: "Johnson",
    email: "robert.johnson@example.com",
    password: "Password",
    role: "USER",
  },
  {
    firstname: "Emily",
    lastname: "Wilson",
    email: "emily.wilson@example.com",
    password: "Password",
    role: "USER",
  },
  {
    firstname: "Michael",
    lastname: "Brown",
    email: "michael.brown@example.com",
    password: "Password",
    role: "USER",
  },
];

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

  UserModel.countDocuments().then((res) => {
    if (res <= 0) {
      UserModel.insertMany(usersToSeed);
    }
  });
}

export default UserRoutes;
