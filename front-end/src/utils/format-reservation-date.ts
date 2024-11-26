import { formatAsDate } from "./date-time";
import { Reservation } from "../types/dashboard";

/**
 * Formats the reservation_date property of a reservation.
 * @param {Reservation} reservation - The reservation to format.
 * @returns {Reservation} The formatted reservation.
 */
function formatDate(reservation: Reservation): Reservation {
  reservation.reservation_date = formatAsDate(reservation.reservation_date);
  return reservation;
}

/**
 * Formats the reservation_date property of one or more reservations.
 * @param {Reservation|Reservation[]} reservations - A reservation or an array of reservations.
 * @returns {Reservation|Reservation[]} The formatted reservation(s).
 */
export default function formatReservationDate(
  reservations: Reservation | Reservation[]
): Reservation | Reservation[] {
  return Array.isArray(reservations)
    ? reservations.map(formatDate)
    : formatDate(reservations);
}
