import request from "supertest";
import app from "../src/app";
import knex from "../src/db/connection";
import { ReservationData } from "../src/types/application";
import { DateValidationError } from "../src/types/validation";

// Test data factory
function createTestReservation(overrides?: Partial<ReservationData>): ReservationData {
  return {
    first_name: "Test",
    last_name: "User",
    mobile_number: "800-555-1212",
    reservation_date: "2025-01-01",
    reservation_time: "17:30",
    people: 3,
    ...overrides,
  };
}

/**
 * Test suite for US-02 - Create reservations future date
 */
describe("US-02 - Create reservations future date", () => {
  /**
   * Setup database before all tests
   */
  beforeAll(async (): Promise<void> => {
    try {
      await knex.migrate.forceFreeMigrationsLock();
      await knex.migrate.rollback(undefined, true);
      await knex.migrate.latest();
    } catch (error) {
      console.error("Database setup failed:", error);
      throw error;
    }
  });

  /**
   * Reset database state before each test
   */
  beforeEach(async (): Promise<void> => {
    try {
      await knex.transaction(async (trx) => {
        await trx.seed.run();
      });
    } catch (error) {
      console.error("Database seed failed:", error);
      throw error;
    }
  });

  /**
   * Cleanup database after all tests
   */
  afterAll(async (): Promise<void> => {
    try {
      await knex.migrate.rollback(undefined, true);
      await knex.destroy();
    } catch (error) {
      console.error("Database cleanup failed:", error);
      throw error;
    }
  });

  /**
   * Test suite for POST /reservations endpoint
   */
  describe("POST /reservations", () => {
    test("returns 400 if reservation occurs in the past", async (): Promise<void> => {
      const pastReservation = createTestReservation({
        reservation_date: "1999-01-01",
      });

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: pastReservation });

      expect(response.body.error).toBe(DateValidationError.PAST_DATE);
      expect(response.status).toBe(400);
    });
    test("returns 400 if reservation_date falls on a tuesday", async (): Promise<void> => {
      const futureTuesdayReservation = createTestReservation({
        reservation_date: "2030-01-01",
      });

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: futureTuesdayReservation });

      expect(response.body.error).toBe(DateValidationError.CLOSED_DAY);
      expect(response.status).toBe(400);
    });
  });
});
