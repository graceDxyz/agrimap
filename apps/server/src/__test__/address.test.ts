import supertest from "supertest";
import { createServer } from "../server";

describe("Address", () => {
  it("address check returns 200", async () => {
    await supertest(createServer())
      .get("/api/address")
      .expect(200)
      .then((res) => {
        expect(res.ok).toBe(true);
      });
  });
});
