import request from "supertest";
import app from "../src/app";
import knex from "../src/db/connection";
import { ReservationData, TableData } from "../src/types/";

/**
 * Test suite for US-06 - Reservation status functionality
 */
describe("US-06 - Reservation status", () => {
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

  beforeEach(async (): Promise<void> => {
    try {
      await knex.seed.run();
    } catch (error) {
      console.error("Database seed failed:", error);
      throw error;
    }
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

  /**
   * Test suite for POST /reservations endpoint
   */
  describe("POST /reservations", () => {
    test("returns 201 if status is 'booked'", async (): Promise<void> => {
      const data: ReservationData = {
        first_name: "first",
        last_name: "last",
        mobile_number: "800-555-1212",
        reservation_date: "2025-01-01",
        reservation_time: "17:30",
        people: 2,
        status: "booked",
      };

      const response = await request(app)
        .post("/reservations")
        .set("Accept", "application/json")
        .send({ data });

      expect(response.body.error).toBeUndefined();
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

    test.each(["seated", "finished"] as const)(
      "returns 400 if status is '%s'",
      async (status: ReservationData["status"]): Promise<void> => {
        const data: ReservationData = {
          first_name: "first",
          last_name: "last",
          mobile_number: "800-555-1212",
          reservation_date: "2025-01-01",
          reservation_time: "17:30",
          people: 2,
          status,
        };

        const response = await request(app)
          .post("/reservations")
          .set("Accept", "application/json")
          .send({ data });

        expect(response.body.error).toContain(status);
        expect(response.status).toBe(400);
      }
    );
  });

  /**
   * Test suite for PUT /reservations/:reservation_id/status endpoint
   */
  describe("PUT /reservations/:reservation_id/status", () => {
    let reservationOne: ReservationData;
    let reservationTwo: ReservationData;

    beforeEach(async (): Promise<void> => {
      [reservationOne, reservationTwo] = await knex("reservations").orderBy([
        "reservation_date",
        "reservation_time",
      ]);
    });

    test("returns 404 for non-existent reservation_id", async (): Promise<void> => {
      const response = await request(app)
        .put("/reservations/99/status")
        .set("Accept", "application/json")
        .send({ data: { status: "seated" as const } });

      expect(response.body.error).toContain("99");
      expect(response.status).toBe(404);
    });

    test("returns 400 for unknown status", async (): Promise<void> => {
      expect(reservationOne).not.toBeUndefined();

      const response = await request(app)
        .put(`/reservations/${reservationOne.reservation_id}/status`)
        .set("Accept", "application/json")
        .send({ data: { status: "unknown" as const } });

      expect(response.body.error).toContain("unknown");
      expect(response.status).toBe(400);
    });

    test("returns 400 if status is currently finished (a finished reservation cannot be updated)", async (): Promise<void> => {
      expect(reservationOne).not.toBeUndefined();

      reservationOne.status = "finished";
      await knex("reservations")
        .where({ reservation_id: reservationOne.reservation_id })
        .update(reservationOne, "*");

      const response = await request(app)
        .put(`/reservations/${reservationOne.reservation_id}/status`)
        .set("Accept", "application/json")
        .send({ data: { status: "seated" as const } });

      expect(response.body.error).toContain("finished");
      expect(response.status).toBe(400);
    });

    test.each(["booked", "seated", "finished"] as const)(
      "returns 200 for status '%s'",
      async (status: ReservationData["status"]): Promise<void> => {
        expect(reservationOne).not.toBeUndefined();

        const response = await request(app)
          .put(`/reservations/${reservationOne.reservation_id}/status`)
          .set("Accept", "application/json")
          .send({ data: { status } });

        expect(response.body.data).toHaveProperty("status", status);
        expect(response.status).toBe(200);
      }
    );
  });

  /**
   * Test suite for PUT /tables/:table_id/seat endpoint
   */
  describe("PUT /tables/:table_id/seat", () => {
    let reservationOne: ReservationData;
    let tableOne: TableData;
    let tableTwo: TableData;

    beforeEach(async (): Promise<void> => {
      reservationOne = await knex("reservations")
        .orderBy(["reservation_date", "reservation_time"])
        .first();
      [tableOne, tableTwo] = await knex("tables").orderBy("table_name");
    });

    test("returns 200 and changes reservation status to 'seated'", async (): Promise<void> => {
      expect(tableOne).not.toBeUndefined();
      expect(reservationOne).not.toBeUndefined();

      const seatResponse = await request(app)
        .put(`/tables/${tableOne.table_id}/seat`)
        .set("Accept", "application/json")
        .send({ data: { reservation_id: reservationOne.reservation_id } });

      expect(seatResponse.body.error).toBeUndefined();
      expect(seatResponse.status).toBe(200);

      const reservationResponse = await request(app)
        .get(`/reservations/${reservationOne.reservation_id}`)
        .set("Accept", "application/json");

      expect(reservationResponse.body.error).toBeUndefined();
      expect(reservationResponse.body.data).toHaveProperty("status", "seated");
      expect(reservationResponse.status).toBe(200);
    });

    test("returns 400 if reservation is already 'seated'", async (): Promise<void> => {
      expect(tableOne).not.toBeUndefined();
      expect(reservationOne).not.toBeUndefined();

      const firstSeatResponse = await request(app)
        .put(`/tables/${tableOne.table_id}/seat`)
        .set("Accept", "application/json")
        .send({ data: { reservation_id: reservationOne.reservation_id } });

      expect(firstSeatResponse.body.error).toBeUndefined();
      expect(firstSeatResponse.status).toBe(200);

      const secondSeatResponse = await request(app)
        .put(`/tables/${tableTwo.table_id}/seat`)
        .set("Accept", "application/json")
        .send({ data: { reservation_id: reservationOne.reservation_id } });

      expect(secondSeatResponse.body.error).toContain("seated");
      expect(secondSeatResponse.status).toBe(400);
    });
  });

  /**
   * Test suite for DELETE /tables/:table_id/seat endpoint
   */
  describe("DELETE /tables/:table_id/seat", () => {
    let reservationOne: ReservationData;
    let tableOne: TableData;

    beforeEach(async (): Promise<void> => {
      reservationOne = await knex("reservations")
        .orderBy(["reservation_date", "reservation_time"])
        .first();
      tableOne = await knex("tables").orderBy("table_name").first();
    });

    test("returns 200 and changes reservation status to 'finished'", async (): Promise<void> => {
      expect(tableOne).not.toBeUndefined();
      expect(reservationOne).not.toBeUndefined();

      const seatResponse = await request(app)
        .put(`/tables/${tableOne.table_id}/seat`)
        .set("Accept", "application/json")
        .send({ data: { reservation_id: reservationOne.reservation_id } });

      expect(seatResponse.body.error).toBeUndefined();
      expect(seatResponse.status).toBe(200);

      const finishResponse = await request(app)
        .delete(`/tables/${tableOne.table_id}/seat`)
        .set("Accept", "application/json")
        .send({ data: { reservation_id: reservationOne.reservation_id } });

      expect(finishResponse.body.error).toBeUndefined();
      expect(finishResponse.status).toBe(200);

      const reservationResponse = await request(app)
        .get(`/reservations/${reservationOne.reservation_id}`)
        .set("Accept", "application/json");

      expect(reservationResponse.body.error).toBeUndefined();
      expect(reservationResponse.body.data).toHaveProperty(
        "status",
        "finished"
      );
      expect(reservationResponse.status).toBe(200);
    });
  });

  /**
   * Test suite for GET /reservations/date=XXXX-XX-XX endpoint
   */
  describe("GET /reservations/date=XXXX-XX-XX", () => {
    let reservationOne: ReservationData;
    let tableOne: TableData;

    beforeEach(async (): Promise<void> => {
      reservationOne = await knex("reservations")
        .orderBy(["reservation_date", "reservation_time"])
        .first();
      tableOne = await knex("tables").orderBy("table_name").first();
    });

    test("does not include 'finished' reservations", async (): Promise<void> => {
      expect(tableOne).not.toBeUndefined();
      expect(reservationOne).not.toBeUndefined();

      const seatResponse = await request(app)
        .put(`/tables/${tableOne.table_id}/seat`)
        .set("Accept", "application/json")
        .send({ data: { reservation_id: reservationOne.reservation_id } });

      expect(seatResponse.body.error).toBeUndefined();
      expect(seatResponse.status).toBe(200);

      const finishResponse = await request(app)
        .delete(`/tables/${tableOne.table_id}/seat`)
        .set("Accept", "application/json")
        .send({ data: { reservation_id: reservationOne.reservation_id } });

      expect(finishResponse.body.error).toBeUndefined();
      expect(finishResponse.status).toBe(200);

      const reservationsResponse = await request(app)
        .get(
          `/reservations?date=${reservationOne.reservation_date}`
        )
        .set("Accept", "application/json");

      expect(reservationsResponse.body.error).toBeUndefined();

      const finishedReservations = reservationsResponse.body.data.filter(
        (reservation: ReservationData) => reservation.status === "finished"
      );

      expect(finishedReservations).toHaveLength(0);
    });
  });

  /**
   * Helper function to format date as YYYY-MM-DD string
   */
  function asDateString(date: Date): string {
    return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
      .toString(10)
      .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
  }
});
