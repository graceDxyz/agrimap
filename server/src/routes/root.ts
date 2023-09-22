import { Express, Request, Response } from "express";
import { uploadthingHandler } from "../utils/uploadthing";
import FarmRoutes from "./farm.route";
import FarmerRoutes from "./farmers.route";
import SessionRoutes from "./session.route";
import UserRoutes from "./user.route";
import MortgageRoutes from "./mortgage.route";
import StatisticsRoutes from "./statistics.route";

function root(app: Express) {
  app.get("/api/ping", (req: Request, res: Response) => {
    const userAgent = req.get("user-agent") || "";
    res.status(200).send({
      message: "☁☁☁",
      description: `Hello ${userAgent} user`,
    });
  });

  app.use("/api/uploadthing", uploadthingHandler);

  UserRoutes(app);
  SessionRoutes(app);
  FarmerRoutes(app);
  FarmRoutes(app);
  MortgageRoutes(app);
  StatisticsRoutes(app);
}

export default root;
