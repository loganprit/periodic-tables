import { formatAsDate } from "./date-time";

/**
 * Formats the reservation_date property of a reservation.
 * @param {Object} reservation - The reservation to format.
 * @returns {Object} The formatted reservation.
 */
function formatDate(reservation) {
  reservation.reservation_date = formatAsDate(reservation.reservation_date);
  return reservation;
}

/**
 * Formats the reservation_date property of one or more reservations.
 * @param {Object|Object[]} reservations - A reservation or an array of reservations.
 * @returns {Object|Object[]} The formatted reservation(s).
 */
export default function formatReservationDate(reservations) {
  return Array.isArray(reservations)
    ? reservations.map(formatDate)
    : formatDate(reservations);
}
