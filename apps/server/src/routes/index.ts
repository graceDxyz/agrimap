import express, { Request, Response } from "express";
import addressRoutes from "./address.route";
import disbursementRoutes from "./disbursement.route";
import farmRoutes from "./farm.route";
import farmerRoutes from "./farmers.route";
import mortgageRoutes from "./mortgage.route";
import reportRoutes from "./report.route";
import sessionRoutes from "./session.route";
import statisticRoutes from "./statistic.route";
import userRoutes from "./user.route";

const router = express.Router();

router.get("/ping", (req: Request, res: Response) => {
  const userAgent = req.get("user-agent") || "";
  res.status(200).send({
    message: "☁☁☁",
    description: `Hello ${userAgent} user`,
  });
});

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).send(".");
});

router.use("/users", userRoutes);
router.use("/sessions", sessionRoutes);
router.use("/farmers", farmerRoutes);
router.use("/farms", farmRoutes);
router.use("/mortgages", mortgageRoutes);
router.use("/statistics", statisticRoutes);
router.use("/address", addressRoutes);
router.use("/report", reportRoutes);
router.use("/disbursements", disbursementRoutes);

export default router;
