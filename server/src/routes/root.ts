import { Express, Request, Response } from "express";
import { uploadthingHandler } from "../utils/uploadthing";
import AddressRoutes from "./address.route";
import FarmRoutes from "./farm.route";
import FarmerRoutes from "./farmers.route";
import MortgageRoutes from "./mortgage.route";
import SessionRoutes from "./session.route";
import StatisticsRoutes from "./statistics.route";
import UserRoutes from "./user.route";

function root(app: Express) {
  app.get("/api/ping", (req: Request, res: Response) => {
    const userAgent = req.get("user-agent") || "";
    res.status(200).send({
      message: "☁☁☁",
      description: `Hello ${userAgent} user`,
    });
  });

  app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).send(".");
  });

  app.use("/api/uploadthing", uploadthingHandler);

  UserRoutes(app);
  SessionRoutes(app);
  FarmerRoutes(app);
  FarmRoutes(app);
  MortgageRoutes(app);
  StatisticsRoutes(app);
  AddressRoutes(app);
}

export default root;
