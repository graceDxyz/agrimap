import express, { Router } from "express";
import {
  createMortgageHandler,
  deleteMortgageHandler,
  getAllMortgageHandler,
  getMortgageHandler,
  updateMortgageHandler,
} from "../controllers/mortgage.controller";
import requiredUser from "../middlewares/requireUser";
import validateResource from "../middlewares/validateResource";
import {
  createMortgageSchema,
  getMortgageSchema,
  updateMortgageSchema,
} from "../schemas/mortgage.schema";

const router: Router = express.Router();

router.get("/", requiredUser, getAllMortgageHandler);
router.get("/:id", requiredUser, getMortgageHandler);
router.post(
  "/",
  [requiredUser, validateResource(createMortgageSchema)],
  createMortgageHandler,
);
router.put(
  "/:id",
  [requiredUser, validateResource(updateMortgageSchema)],
  updateMortgageHandler,
);
router.delete(
  "/:id",
  [requiredUser, validateResource(getMortgageSchema)],
  deleteMortgageHandler,
);

export default router;
