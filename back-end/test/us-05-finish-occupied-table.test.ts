import request from "supertest";
import app from "../src/app";
import knex from "../src/db/connection";
import { TableData } from "../src/types/";

describe("US-05 - Finish an occupied table", () => {
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

  describe("DELETE /tables/:table_id/seat", () => {
    let barTableOne: TableData;
    let tableOne: TableData;

    beforeEach(async (): Promise<void> => {
      barTableOne = await knex("tables").where("table_name", "Bar #1").first();
      tableOne = await knex("tables").where("table_name", "#1").first();
    });

    test("returns 404 for non-existent table_id", async () => {
      const response = await request(app)
        .delete("/tables/99/seat")
        .set("Accept", "application/json")
        .send({ datum: {} });

      expect(response.body.error).toContain("99");
      expect(response.status).toBe(404);
    });

    test("returns 400 if table_id is not occupied", async () => {
      const response = await request(app)
        .delete("/tables/1/seat")
        .set("Accept", "application/json")
        .send({});

      expect(response.body.error).toContain("not occupied");
      expect(response.status).toBe(400);
    });

    test("returns 200 if table_id is occupied", async () => {
      expect(tableOne).not.toBeUndefined();

      const seatResponse = await request(app)
        .put(`/tables/${tableOne.table_id}/seat`)
        .set("Accept", "application/json")
        .send({ data: { reservation_id: 1 } });

      expect(seatResponse.body.error).toBeUndefined();
      expect(seatResponse.status).toBe(200);

      const finishResponse = await request(app)
        .delete(`/tables/${tableOne.table_id}/seat`)
        .set("Accept", "application/json");

      expect(finishResponse.body.error).toBeUndefined();
      expect(finishResponse.status).toBe(200);
    });
  });
});
