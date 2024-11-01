import request from "supertest";
import app from "../src/app";
import knex from "../src/db/connection";
import { ReservationData } from "../src/types/application";

describe("US-07 - Search reservation by phone number", () => {
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

  describe("GET /reservations?mobile_number=...", () => {
    test("returns reservations for a partial existing phone number", async () => {
      const response = await request(app)
        .get("/reservations?mobile_number=808")
        .set("Accept", "application/json");

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toHaveLength(2);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toMatchObject<Partial<ReservationData>>({
        mobile_number: expect.stringMatching(/808/),
      });
    });

    test("returns empty list for non-existent phone number", async () => {
      const response = await request(app)
        .get("/reservations?mobile_number=518-555-0169")
        .set("Accept", "application/json");

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toHaveLength(0);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});
