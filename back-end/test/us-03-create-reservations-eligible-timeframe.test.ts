import request from "supertest";
import app from "../src/app";
import knex from "../src/db/connection";
import { ReservationData } from "../src/types/";

describe("US-03 - Create reservations eligible timeframe", () => {
  beforeAll(async (): Promise<void> => {
    await knex.migrate.forceFreeMigrationsLock();
    await knex.migrate.rollback(undefined, true);
    await knex.migrate.latest();
  });

  beforeEach(async (): Promise<void> => {
    await knex.transaction(async (trx) => {
      await trx.seed.run();
    });
  });

  afterAll(async (): Promise<void> => {
    try {
      await knex.migrate.rollback(undefined, true);
      await knex.destroy();
    } catch (error) {
      console.error("Database cleanup failed:", error);
      throw error;
    }
  });

  describe("POST /reservations", () => {
    test("returns 400 if reservation_time is not available", async () => {
      const testData: ReservationData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2050-01-05",
        reservation_time: "09:30",
        people: 3,
      };

      // Test early morning reservation (before opening)
      let response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: testData });
      expect(response.status).toBe(400);

      // Test late night reservation (after closing)
      testData.reservation_time = "23:30";
      response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: testData });
      expect(response.status).toBe(400);

      // Test reservation too close to closing time
      testData.reservation_time = "22:45";
      response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: testData });
      expect(response.status).toBe(400);

      // Test early morning reservation
      testData.reservation_time = "05:30";
      response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: testData });
      expect(response.status).toBe(400);
    });
  });
});
