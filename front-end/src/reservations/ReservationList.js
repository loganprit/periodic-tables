import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api";

// Define the ReservationList component
function ReservationList() {
  // Define state variable for reservations
  const [reservations, setReservations] = useState([]);

  // Fetch reservations from the server when the component mounts
  useEffect(() => {
    async function fetchReservations() {
      try {
        const startTime = Date.now();
        const response = await axiosInstance.get("/reservations");
        const endTime = Date.now();
        console.log(`Fetching reservations took ${endTime - startTime} ms`);
        setReservations(response.data.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    }

    fetchReservations();
  }, []);

  // Render the list of reservations
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
