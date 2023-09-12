import express from "express";
import dotenv from "dotenv";
import config from "config";
import connect from "@/util/connect";

dotenv.config();
const port = config.get<number>("port");

const app = express();

app.use(express.json());

app.get("/healthcheck", (req, res) => {
  res.send({ message: "☁☁☁" });
});

app.listen(port, async () => {
  console.log(`App is running at http://localhost:${port}`);
  await connect();
});
