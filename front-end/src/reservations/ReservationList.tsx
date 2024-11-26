import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { cancelReservation, listReservations } from "../utils/api";
import { Reservation } from "../types/dashboard";
import "./ReservationList.css";

interface ReservationListProps {
  reservations?: Reservation[];
  loadOnMount?: boolean;
}

/**
 * ReservationList component to display a list of reservations.
 * @param {Object} props - Component properties.
 * @param {Array} props.initialReservations - Initial list of reservations.
 * @param {boolean} props.loadOnMount - Flag to load reservations on mount.
 * @returns {JSX.Element} The rendered ReservationList component.
 */
function ReservationList({
  reservations: initialReservations = [],
  loadOnMount = true,
}: ReservationListProps) {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [abortController] = useState(() => new AbortController());

  const loadReservations = useCallback(async () => {
    try {
      const response = await listReservations({}, abortController.signal);
      setReservations(Array.isArray(response) ? response : [response]);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching reservations:", error.message);
      }
    }
  }, [abortController]);

  useEffect(() => {
    if (loadOnMount) {
      loadReservations();
    }
    return () => abortController.abort();
  }, [loadOnMount, loadReservations, abortController]);

  const handleCancelReservation = async (reservation_id: number) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await cancelReservation(reservation_id, abortController.signal);
        loadReservations();
      } catch (error) {
        console.error("Failed to cancel reservation:", error);
      }
    }
  };

  return (
    <div className="reservation-list-container">
      <h2 className="reservation-list-header">Reservations</h2>
      {reservations.length === 0 ? (
        <p className="no-reservations">No reservations found</p>
      ) : (
        <ul className="reservation-list">
          {reservations.map((reservation) => (
            <li
              className="reservation-list-item"
              key={reservation.reservation_id}
            >
              {reservation.first_name} {reservation.last_name} -{" "}
              {reservation.mobile_number} - {reservation.reservation_date}{" "}
              {reservation.reservation_time} - {reservation.people} people
              <p data-reservation-id-status={reservation.reservation_id}>
                Status: {reservation.status}
              </p>
              {reservation.status === "booked" && (
                <div className="reservation-list-button-container">
                  <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                    <button className="btn">Seat</button>
                  </Link>
                  <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                    <button className="btn">Edit</button>
                  </Link>
                  <button
                    className="btn"
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={() =>
                      handleCancelReservation(reservation.reservation_id)
                    }
                  >
                    Cancel
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReservationList;
