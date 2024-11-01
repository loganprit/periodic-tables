import React from "react";
import "./Reservation.css";

/**
 * Component to display reservation details.
 * @param {Object} props - Component properties.
 * @param {Object} props.reservation - Reservation object containing details to display.
 * @returns {JSX.Element} The rendered Reservation component.
 */
function Reservation({ reservation }) {
  return (
    <div className="reservation-container">
      <h2 className="reservation-header">
        {reservation.first_name} {reservation.last_name}
      </h2>
      <div className="reservation-details">
        <p className="reservation-label">Phone:</p>
        <p className="reservation-value">{reservation.mobile_number}</p>

        <p className="reservation-label">Date:</p>
        <p className="reservation-value">{reservation.reservation_date}</p>

        <p className="reservation-label">Time:</p>
        <p className="reservation-value">{reservation.reservation_time}</p>

        <p className="reservation-label">People:</p>
        <p className="reservation-value">{reservation.people}</p>

        <p
          className="reservation-label"
          data-reservation-id-status={reservation.reservation_id}
        >
          Status:
        </p>
        <p className="reservation-value">{reservation.status}</p>
      </div>
    </div>
  );
}

export default Reservation;
