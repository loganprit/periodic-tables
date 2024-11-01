import request from "supertest";
import app from "../src/app";
import knex from "../src/db/connection";
import { ReservationData } from "../src/types/";

/**
 * Test suite for US-08 - Change an existing reservation functionality
 */
describe("US-08 - Change an existing reservation", () => {
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
   * Test suite for PUT /reservations/:reservation_id endpoint
   */
  describe("PUT /reservations/:reservation_id", () => {
    test("returns 404 if reservation does not exist", async (): Promise<void> => {
      const testData: ReservationData = {
        first_name: "Mouse",
        last_name: "Whale",
        mobile_number: "1231231235",
        reservation_date: "2026-12-30",
        reservation_time: "18:00",
        people: 2,
      };

      const response = await request(app)
        .put("/reservations/999999")
        .set("Accept", "application/json")
        .send({ data: testData });

      expect(response.body.error).not.toBeUndefined();
      expect(response.status).toBe(404);
    });

    test("updates the reservation", async (): Promise<void> => {
      const testData: ReservationData = {
        first_name: "Mouse",
        last_name: "Whale",
        mobile_number: "1231231235",
        reservation_date: "2026-12-30",
        reservation_time: "18:00",
        people: 2,
      };

      const reservation = await knex("reservations")
        .where("reservation_id", 1)
        .first();

      expect(reservation).not.toBeUndefined();

      Object.entries(testData).forEach(
        ([key, value]) => (reservation[key] = value)
      );

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: reservation });

      expect(response.body.error).toBeUndefined();
      expect(response.body.data).toEqual(
        expect.objectContaining({
          first_name: "Mouse",
          last_name: "Whale",
          mobile_number: "1231231235",
          people: 2,
        })
      );
      expect(response.status).toBe(200);
    });

    test("returns 400 if first_name is missing", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 3,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("first_name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if first_name is empty", async (): Promise<void> => {
      const testData: ReservationData = {
        first_name: "",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 3,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: testData });

      expect(response.body.error).toContain("first_name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if last_name is missing", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 3,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("last_name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if last_name is empty", async (): Promise<void> => {
      const testData: ReservationData = {
        first_name: "first",
        last_name: "",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 3,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: testData });

      expect(response.body.error).toContain("last_name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if mobile_phone is missing", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 3,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("mobile_number");
      expect(response.status).toBe(400);
    });

    test("returns 400 if mobile_phone is empty", async (): Promise<void> => {
      const testData: ReservationData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 3,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: testData });

      expect(response.body.error).toContain("mobile_number");
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_date is missing", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_time: "13:30",
        people: 1,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("reservation_date");
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_date is empty", async (): Promise<void> => {
      const testData: ReservationData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "",
        reservation_time: "13:30",
        people: 1,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: testData });

      expect(response.body.error).toContain("reservation_date");
      expect(response.status).toBe(400);
    });
    test("returns 400 if reservation_date is not a date", async (): Promise<void> => {
      const testData: ReservationData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "not-a-date",
        reservation_time: "13:30",
        people: 2,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: testData });

      expect(response.body.error).toContain("reservation_date");
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_time is missing", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        people: 2,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("reservation_time");
      expect(response.status).toBe(400);
    });
    test("returns 400 if reservation_time is empty", async (): Promise<void> => {
      const testData: ReservationData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "",
        people: 2,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: testData });

      expect(response.body.error).toContain("reservation_time");
      expect(response.status).toBe(400);
    });
    test("returns 400 if reservation_time is not a time", async (): Promise<void> => {
      const testData: ReservationData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "not-a-time",
        people: 2,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: testData });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("reservation_time");
    });

    test("returns 400 if people is missing", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "17:30",
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("people");
      expect(response.status).toBe(400);
    });

    test("returns 400 if people is zero", async (): Promise<void> => {
      const testData: ReservationData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "17:30",
        people: 0,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: testData });

      expect(response.body.error).toContain("people");
      expect(response.status).toBe(400);
    });

    test("returns 400 if people is not a number", async (): Promise<void> => {
      const testData: ReservationData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "17:30",
        people: "2" as unknown as number,
      };

      const response = await request(app)
        .put("/reservations/1")
        .set("Accept", "application/json")
        .send({ data: testData });

      expect(response.body.error).toContain("people");
      expect(response.status).toBe(400);
    });
  });

  /**
   * Test suite for PUT /reservations/:reservation_id/status endpoint
   */
  describe("PUT /reservations/:reservation_id/status", () => {
    test("returns 200 for status cancelled", async (): Promise<void> => {
      const reservation = await knex("reservations")
        .orderBy(["reservation_date", "reservation_time"])
        .first();

      expect(reservation).not.toBeUndefined();

      const status = "cancelled";

      const response = await request(app)
        .put(`/reservations/${reservation.reservation_id}/status`)
        .set("Accept", "application/json")
        .send({ data: { status } });

      expect(response.body.data).toHaveProperty("status", status);
      expect(response.status).toBe(200);
    });
  });
});
