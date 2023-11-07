import express, { Express } from "express";
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

const router = express.Router();

router.get("/", requiredAdmin, getAllUserHandler);
router.get("/:userId", requiredAdmin, getUserHandler);
router.post(
  "/",
  [requiredAdmin, validateResource(createUserSchema)],
  createUserHandler,
);
router.put(
  "/:userId",
  [requiredAdmin, validateResource(updateUserSchema)],
  updateUserHandler,
);
router.delete(
  "/:userId",
  [requiredAdmin, validateResource(getUserSchema)],
  deleteUserHandler,
);

export default router;
