import React, { useEffect, useState } from "react";
import axios from "axios";

function ReservationList() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await axios.get("/reservations");
        setReservations(response.data.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    }

    fetchReservations();
  }, []);

  return (
    <div>
      <h2>Reservations</h2>
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.reservation_id}>
            {reservation.first_name} {reservation.last_name} -{" "}
            {reservation.mobile_number} - {reservation.reservation_date}{" "}
            {reservation.reservation_time} - {reservation.people} people
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReservationList;
