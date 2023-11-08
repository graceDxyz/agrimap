import supertest from "supertest";
import { createServer } from "../server";

const app = createServer();

describe("Server", () => {
  it("health check returns 200", async () => {
    await supertest(app)
      .get("/api/health")
      .expect(200)
      .then((res) => {
        expect(res.ok).toBe(true);
      });
  });
});
