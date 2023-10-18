import dotenv from "dotenv";

dotenv.config();

import config from "config";
import deserializeUser from "./middlewares/deserializeUser";
import route from "./routes/root";
import connect from "./utils/connect";
import logger from "./utils/logger";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";

const port = config.get<number>("port");
const node_env = config.get<string>("env");

const root_dir = node_env === "production" ? "../../.." : "../..";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://192.168.254.132:5173",
      "http://localhost:5173",
      "http://192.168.254.126:5000",
      "http://localhost:5000",
    ],
    credentials: true,
    allowedHeaders: ["Content-Disposition"],
  })
);
app.use(express.json()); //bodyparser
app.use(deserializeUser);
if (node_env === "production") {
  app.use(
    morgan("common", {
      skip: (req, res) => res.statusCode < 400,
    })
  );
} else {
  app.use(morgan("dev"));
}

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, root_dir, "client", "dist")));

// Handle any additional routes and return the React app
app.get("*", (req, res, next) => {
  if (req.originalUrl.includes("/api")) {
    // Skip the React app handling for routes containing "/api"
    return next();
  }
  res.sendFile(path.join(__dirname, root_dir, "client", "dist", "index.html"));
});

app.listen(port, async () => {
  await connect();
  route(app);

  logger.info(`App is running at http://localhost:${port}`);
});
