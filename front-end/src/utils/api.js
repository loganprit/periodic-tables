import axios from "axios";
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-time";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

const axiosInstance = axios.create({ baseURL: API_BASE_URL });

async function fetchJson(url, options, onCancel) {
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
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export async function listReservations(params = {}, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) {
      url.searchParams.append(key, value.toString());
    }
  });
  return await fetchJson(
    url,
    { headers: { "Content-Type": "application/json" }, signal },
    []
  )
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function listTables(signal) {
  return await fetchJson(
    `${API_BASE_URL}/tables`,
    { headers: { "Content-Type": "application/json" }, signal },
    []
  );
}

async function deleteRequest(url, signal) {
  const options = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    signal,
  };
  return await fetchJson(url, options);
}

export async function finishTable(table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  return await deleteRequest(url, signal);
}

export async function updateReservationStatus(reservation_id, status, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`);
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { status } }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function getReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(
    url,
    { headers: { "Content-Type": "application/json" }, signal },
    {}
  )
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function updateReservation(reservation_id, data, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
    signal,
  };
  return await fetchJson(url, options);
}

export async function cancelReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await deleteRequest(url, signal);
}

export default axiosInstance;
