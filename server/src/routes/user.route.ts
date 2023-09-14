import { getAllUserHandler } from "@/controllers/user.controller";
import requiredAdmin from "@/middlewares/requireAdmin";
import { createUser, getAllUser } from "@/services/user.service";
import { Express } from "express";

function UserRoutes(app: Express) {
  app.get("/api/users", requiredAdmin, getAllUserHandler);

  getAllUser().then((res) => {
    if (res.length <= 0) {
      createUser({
        firstname: "john",
        lastname: "doe",
        email: "john.doe@example.com",
        password: "Password",
        userRole: "ADMIN",
      });
    }
  });
}

export default UserRoutes;
