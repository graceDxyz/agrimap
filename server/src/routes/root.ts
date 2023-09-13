import { Request, Response, Express } from "express";
import UserRoutes from "./user.route";
import SessionRoutes from "./session.route";

function root(app: Express) {
  app.get("/", (req: Request, res: Response) => {
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
