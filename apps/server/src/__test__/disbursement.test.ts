import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";
import { createServer } from "../server";
import { createDisbursement } from "../services/disbursement.service";
import { createFarmer } from "../services/farmer.service";
import { generateFakeFarmers } from "../utils/generated";
import { signJwt } from "../utils/jwt.util";

const app = createServer();
const userId = new mongoose.Types.ObjectId().toString();

const userPayload = {
  sub: userId,
};

const disbursementPayload = {
  size: 100,
  assistances: ["Assistance 1", "Assistance 2"],
  receivedDate: "2023-11-08T00:00:00Z",
};

const jwt = signJwt(userPayload, "ACCESS_TOKEN_PRIVATE_KEY", {
  expiresIn: "1d",
});

describe("Disbursement", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("get disbursement route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post("/api/disbursements");

        expect(statusCode).toBe(403);
      });
    });

    describe("given the disbursement does not exist", () => {
      it("should return a 404", async () => {
        const disbursementId = new mongoose.Types.ObjectId().toString();

        await supertest(app)
          .get(`/api/disbursements/${disbursementId}`)
          .set("Authorization", `Bearer ${jwt}`)
          .expect(404);
      });
    });

    describe("given the disbursement does exist", () => {
      it("should return a 200 status and the disbursement", async () => {
        // @ts-ignore
        const farmer = await createFarmer(generateFakeFarmers()[0]);

        // @ts-ignore
        const disbursement = await createDisbursement({
          farmer: farmer.id,
          ...disbursementPayload,
        });

        const { body, statusCode } = await supertest(app)
          .get(`/api/disbursements/${disbursement.id}`)
          .set("Authorization", `Bearer ${jwt}`);

        expect(statusCode).toBe(200);

        expect(body._id).toBe(disbursement.id);
        expect(body.farmer._id).toBe(farmer.id);
      });
    });
  });

  describe("create disbursement route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post("/api/disbursements");

        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
      it("should return a 200 and create the disbursement", async () => {
        const { statusCode, body } = await supertest(app)
          .post("/api/disbursements")
          .set("Authorization", `Bearer ${jwt}`)
          .send({ farmer: userId, ...disbursementPayload });

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          farmer: null,
          size: 100,
          assistances: ["Assistance 1", "Assistance 2"],
          receivedDate: "2023-11-08T00:00:00.000Z",
          _id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          id: expect.any(String),
        });
      });
    });
  });
});
