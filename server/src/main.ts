import express from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import connect from "@/utils/connect";
import route from "@/routes/root";

const port = config.get<number>("port");

const app = express();

app.use(express.json());

app.listen(port, async () => {
  console.log(`App is running at http://localhost:${port}`);
  await connect();
  route(app);
});
