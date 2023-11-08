import express, { Router } from "express";
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

const router: Router = express.Router();

router.get("/", requiredAdmin, getAllUserHandler);
router.get("/:id", requiredAdmin, getUserHandler);
router.post(
  "/",
  [requiredAdmin, validateResource(createUserSchema)],
  createUserHandler,
);
router.put(
  "/:id",
  [requiredAdmin, validateResource(updateUserSchema)],
  updateUserHandler,
);
router.delete(
  "/:id",
  [requiredAdmin, validateResource(getUserSchema)],
  deleteUserHandler,
);

export default router;
