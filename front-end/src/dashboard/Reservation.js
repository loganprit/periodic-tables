import React from "react";

function Reservation({ reservation }) {
  return (
    <div>
      <h2>
        {reservation.first_name} {reservation.last_name}
      </h2>
      <p>Phone: {reservation.mobile_number}</p>
      <p>Date: {reservation.reservation_date}</p>
      <p>Time: {reservation.reservation_time}</p>
      <p>People: {reservation.people}</p>
    </div>
  );
}

export default Reservation;
