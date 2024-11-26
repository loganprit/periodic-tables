import { formatAsTime } from "./date-time";
import { Reservation } from "../types/dashboard";

/**
 * Formats the reservation_time property of a reservation.
 * @param {Reservation} reservation - The reservation to format.
 * @returns {Reservation} The formatted reservation.
 */
function formatTime(reservation: Reservation): Reservation {
  reservation.reservation_time = formatAsTime(reservation.reservation_time);
  return reservation;
}

/**
 * Formats the reservation_time property of one or more reservations.
 * @param {Reservation|Reservation[]} reservations - A reservation or an array of reservations.
 * @returns {Reservation|Reservation[]} The formatted reservation(s).
 */
export default function formatReservationTime(
  reservations: Reservation | Reservation[]
): Reservation | Reservation[] {
  return Array.isArray(reservations)
    ? reservations.map(formatTime)
    : formatTime(reservations);
}
