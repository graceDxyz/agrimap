import express from "express";
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

const router = express.Router();

router.get("/", requiredUser, getAllMortgageHandler);
router.get("/:mortgageId", requiredUser, getMortgageHandler);
router.post(
  "/",
  [requiredUser, validateResource(createMortgageSchema)],
  createMortgageHandler,
);
router.put(
  "/:mortgageId",
  [requiredUser, validateResource(updateMortgageSchema)],
  updateMortgageHandler,
);
router.delete(
  "/:mortgageId",
  [requiredUser, validateResource(getMortgageSchema)],
  deleteMortgageHandler,
);

export default router;
