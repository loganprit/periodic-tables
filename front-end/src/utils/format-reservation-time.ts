import { formatAsTime } from "./date-time";

/**
 * Formats the reservation_time property of a reservation.
 * @param {Object} reservation - The reservation to format.
 * @returns {Object} The formatted reservation.
 */
function formatTime(reservation) {
  reservation.reservation_time = formatAsTime(reservation.reservation_time);
  return reservation;
}

/**
 * Formats the reservation_time property of one or more reservations.
 * @param {Object|Object[]} reservations - A reservation or an array of reservations.
 * @returns {Object|Object[]} The formatted reservation(s).
 */
export default function formatReservationTime(reservations) {
  return Array.isArray(reservations)
    ? reservations.map(formatTime)
    : formatTime(reservations);
}
