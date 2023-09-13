import express from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import connect from "@/utils/connect";
import route from "@/routes/root";
import deserializeUser from "./middlewares/deserializeUser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

const port = config.get<number>("port");

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: ["*"],
    credentials: true,
  }),
);
app.use(express.json()); //bodyparser
app.use(deserializeUser);

app.listen(port, async () => {
  console.log(`App is running at http://localhost:${port}`);
  await connect();
  route(app);
});
