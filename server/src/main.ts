import dotenv from "dotenv";

dotenv.config();
import config from "config";

import deserializeUser from "@/middlewares/deserializeUser";
import route from "@/routes/root";
import connect from "@/utils/connect";
import logger from "@/utils/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import morgan from "morgan";

const port = config.get<number>("port");

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://192.168.254.126:5173", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json()); //bodyparser
app.use(deserializeUser);
app.use(morgan("common"));

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, "../..", "client", "dist")));

// Handle any additional routes and return the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../..", "client", "dist", "index.html"));
});

app.listen(port, async () => {
  await connect();
  route(app);

  logger.info(`App is running at http://localhost:${port}`);
});
