import request from "supertest";
import app from "../src/app";
import knex from "../src/db/connection";
import { ReservationData } from "../src/types";

/**
 * Test suite for US-01 - Create and list reservations functionality
 */
describe("US-01 - Create and list reservations", () => {
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
      await knex.seed.run();
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
   * Test suite for general application endpoints
   */
  describe("App", () => {
    describe("not found handler", () => {
      test("returns 404 for non-existent route", async () => {
        const response = await request(app).get("/fastidious");
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Path not found: /fastidious");
      });
    });
  });

  /**
   * Test suite for GET /reservations/:reservation_id endpoint
   */
  describe("GET /reservations/:reservation_id", () => {
    test("returns 404 for non-existent id", async (): Promise<void> => {
      // Send request to get non-existent reservation
      const nonExistentId = "99";
      const response = await request(app)
        .get(`/reservations/${nonExistentId}`)
        .set("Accept", "application/json");

      // Verify error response contains ID and correct status code
      expect(response.body.error).toContain(nonExistentId);
      expect(response.status).toBe(404);
    });
  });

  /**
   * Test suite for POST /reservations endpoint
   */
  describe("POST /reservations", () => {
    test("returns 400 if data is missing", async (): Promise<void> => {
      // Make request with missing data property
      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ datum: {} }); // Intentionally using wrong property name

      // Verify error response
      expect(response.body.error).toBeDefined();
      expect(response.status).toBe(400);
    });

    test("returns 400 if first_name is missing", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 1,
      };

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("first_name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if first_name is empty", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 1,
      };

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("first_name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if last_name is missing", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 1,
      };

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("last_name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if last_name is empty", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 1,
      }

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("last_name");
      expect(response.status).toBe(400);
    });

    test("returns 400 if mobile_number is missing", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 1,
      };

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("mobile_number");
      expect(response.status).toBe(400);
    });

    test("returns 400 if mobile_number is empty", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
        people: 1,
      }

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

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
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("reservation_date");
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_date is empty", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_time: "13:30",
        people: 1,
      }
    
      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("reservation_date");
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_date is not a date", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_time: "13:30",
        people: 1,
      }

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("reservation_date");
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_time is missing", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        people: 1,
      }

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("reservation_time");
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_time is empty", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        people: 1,
      }

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("reservation_time");
      expect(response.status).toBe(400);
    });

    test("returns 400 if reservation_time is not a time", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        people: 1,
      }

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("reservation_time");
    });

    test("returns 400 if people is missing", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
      }

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("people");
      expect(response.status).toBe(400);
    });

    test("returns 400 if people is zero", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
      }

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("people");
      expect(response.status).toBe(400);
    });

    test("returns 400 if people is not a number", async (): Promise<void> => {
      const partialData: Partial<ReservationData> = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "13:30",
      }

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data: partialData });

      expect(response.body.error).toContain("people");
      expect(response.status).toBe(400);
    });

    test("returns 201 if data is valid", async (): Promise<void> => {
      const data: ReservationData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "17:30",
        people: 2,
      };

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.data).toEqual(
        expect.objectContaining({
          first_name: "first",
          last_name: "last",
          mobile_number: "800-555-1212",
          people: 2,
        })
      );
      expect(response.status).toBe(201);
    });
  });

  describe("GET /reservations", () => {
    test("returns only reservations matching date query parameter", async (): Promise<void> => {
      const response = await request(app)
        .get("/reservations?date=2020-12-31");

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].first_name).toBe("Rick");
      expect(response.status).toBe(200);
    });

    test("returns reservations sorted by time (earliest time first)", async (): Promise<void> => {
      const response = await request(app)
        .get("/reservations?date=2020-12-30");

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].first_name).toBe("Bird");
      expect(response.body.data[1].first_name).toBe("Frank");
      expect(response.status).toBe(200);
    });
  });
});