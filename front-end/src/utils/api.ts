import axios from "axios";
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-time";

const API_BASE_URL =
  (window as any).env?.REACT_APP_API_BASE_URL || "http://localhost:5001";
const axiosInstance = axios.create({ baseURL: API_BASE_URL });

/**
 * Fetches JSON data from the specified URL.
 * @param {string} url - The URL to fetch data from.
 * @param {Object} options - The fetch options.
 * @param {any} onCancel - The value to return if the fetch is aborted.
 * @returns {Promise<any>} The fetched data.
 */
async function fetchJson(url: string, options: any, onCancel: any) {
  try {
    const response = await fetch(url, options);
    if (response.status === 204) {
      return null;
    }
    const payload = await response.json();
    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error: any) {
    if (error.name !== "AbortError") {
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Lists reservations based on the provided parameters.
 * @param {Object} params - The query parameters for listing reservations.
 * @param {AbortSignal} signal - The abort signal.
 * @returns {Promise<any[]>} The list of reservations.
 */
export async function listReservations(params = {}, signal: any) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      url.searchParams.append(key, value.toString());
    }
  });
  const reservations = await fetchJson(
    url.toString(),
    { headers: { "Content-Type": "application/json" }, signal },
    []
  )
    .then(formatReservationDate)
    .then(formatReservationTime);
  return reservations || [];
}

/**
 * Lists all tables.
 * @param {AbortSignal} signal - The abort signal.
 * @returns {Promise<any[]>} The list of tables.
 */
export async function listTables(signal: any) {
  return await fetchJson(
    `${API_BASE_URL}/tables`,
    { headers: { "Content-Type": "application/json" }, signal },
    []
  );
}

/**
 * Sends a DELETE request to the specified URL.
 * @param {string} url - The URL to send the DELETE request to.
 * @param {AbortSignal} signal - The abort signal.
 * @returns {Promise<any>} The response data.
 */
async function deleteRequest(url: string, signal: any) {
  const options = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    signal,
  };
  return await fetchJson(url.toString(), options, []);
}

/**
 * Marks a table as finished.
 * @param {number} table_id - The ID of the table to mark as finished.
 * @param {AbortSignal} signal - The abort signal.
 * @returns {Promise<any>} The response data.
 */
export async function finishTable(table_id: number, signal: any) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  return await deleteRequest(url.toString(), signal);
}

/**
 * Updates the status of a reservation.
 * @param {number} reservation_id - The ID of the reservation to update.
 * @param {string} status - The new status of the reservation.
 * @param {AbortSignal} signal - The abort signal.
 * @returns {Promise<any>} The response data.
 */
export async function updateReservationStatus(reservation_id: number, status: string, signal: any) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { status } }),
    signal,
  };
  return await fetchJson(url.toString(), options, []);
}

/**
 * Retrieves a reservation by its ID.
 * @param {number} reservation_id - The ID of the reservation to retrieve.
 * @param {AbortSignal} signal - The abort signal.
 * @returns {Promise<any>} The reservation data.
 */
export async function getReservation(reservation_id: number, signal: any) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(
    url.toString(),
    { headers: { "Content-Type": "application/json" }, signal },
    {}
  )
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Updates a reservation.
 * @param {number} reservation_id - The ID of the reservation to update.
 * @param {Object} data - The updated reservation data.
 * @param {AbortSignal} signal - The abort signal.
 * @returns {Promise<any>} The response data.
 */
export async function updateReservation(reservation_id: number, data: any, signal: any) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
    signal,
  };
  return await fetchJson(url.toString(), options, []);
}

/**
 * Cancels a reservation.
 * @param {number} reservation_id - The ID of the reservation to cancel.
 * @param {AbortSignal} signal - The abort signal.
 * @returns {Promise<any>} The response data.
 */
export async function cancelReservation(reservation_id: number, signal: any) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await deleteRequest(url.toString(), signal);
}

export default axiosInstance;
