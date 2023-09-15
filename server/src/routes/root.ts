import { Express, Request, Response } from "express";
import SessionRoutes from "./session.route";
import UserRoutes from "./user.route";

function root(app: Express) {
  app.get("/api/ping", (req: Request, res: Response) => {
    const userAgent = req.get("user-agent") || "";
    res.status(200).send({
      message: "☁☁☁",
      description: `Hello ${userAgent} user`,
    });
  });

  UserRoutes(app);
  SessionRoutes(app);
}

export default root;
