import fetch from "cross-fetch";
import { Reservation, Table, APIOptions } from "./types";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = { "Content-Type": "application/json" };

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 */
async function fetchJson<T>(
  url: string,
  options: RequestInit,
  onCancel?: T
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return onCancel as T;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error: any) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return onCancel as T;
  }
}

/**
 * Creates a new reservation
 */
async function createReservation(
  reservation: Reservation,
  options: APIOptions = {}
): Promise<Reservation> {
  const url = `${API_BASE_URL}/reservations`;
  const fetchOptions = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal: options.signal,
  };
  return await fetchJson<Reservation>(url, fetchOptions, reservation);
}

/**
 * Creates a new table
 */
async function createTable(
  table: Table,
  options: APIOptions = {}
): Promise<Table> {
  const url = `${API_BASE_URL}/tables`;
  const fetchOptions = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal: options.signal,
  };
  return await fetchJson<Table>(url, fetchOptions, table);
}

/**
 * Seats a reservation at a table
 */
async function seatReservation(
  reservation_id: number,
  table_id: number
): Promise<Record<string, never>> {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    body: JSON.stringify({ data: { reservation_id } }),
    headers,
  };
  return await fetchJson<Record<string, never>>(url, options, {});
}

export {
  createReservation,
  createTable,
  seatReservation,
};
