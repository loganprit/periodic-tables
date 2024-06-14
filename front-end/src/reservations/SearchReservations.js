import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationList from "./ReservationList";

function SearchReservations() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const data = await listReservations({ mobile_number: mobileNumber });
      setReservations(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter a customer's phone number:
          <input
            type="text"
            name="mobile_number"
            value={mobileNumber}
            onChange={handleChange}
            placeholder="Enter a customer's phone number"
          />
        </label>
        <button type="submit">Find</button>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      {reservations.length === 0 ? (
        <p>No reservations found</p>
      ) : (
        <ReservationList reservations={reservations} loadOnMount={false} />
      )}
    </div>
  );
}

export default SearchReservations;
