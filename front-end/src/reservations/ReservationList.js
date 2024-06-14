import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cancelReservation, listReservations } from "../utils/api";

function ReservationList({
  reservations: initialReservations = [],
  loadOnMount = true,
}) {
  const [reservations, setReservations] = useState(initialReservations);

  const loadReservations = async () => {
    try {
      const response = await listReservations();
      setReservations(response.data.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  useEffect(() => {
    if (loadOnMount) {
      loadReservations();
    }
  }, [loadOnMount]);

  const handleCancelReservation = async (reservation_id) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await cancelReservation(reservation_id);
        loadReservations(); // Ensure the state is updated after canceling a reservation
      } catch (error) {
        console.error("Failed to cancel reservation:", error);
      }
    }
  };

  return (
    <div>
      <h2>Reservations</h2>
      {reservations.length === 0 ? (
        <p>No reservations found</p>
      ) : (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.reservation_id}>
              {reservation.first_name} {reservation.last_name} -{" "}
              {reservation.mobile_number} - {reservation.reservation_date}{" "}
              {reservation.reservation_time} - {reservation.people} people
              <p data-reservation-id-status={reservation.reservation_id}>
                Status: {reservation.status}
              </p>
              {reservation.status === "booked" && (
                <>
                  <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                    <button>Seat</button>
                  </Link>
                  <Link to={`/reservations/${reservation.reservation_id}/edit`}>
                    <button>Edit</button>
                  </Link>
                  <button
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={() =>
                      handleCancelReservation(reservation.reservation_id)
                    }
                  >
                    Cancel
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReservationList;
