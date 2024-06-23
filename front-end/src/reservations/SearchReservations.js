import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationList from "./ReservationList";
import "./SearchReservations.css";

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
    <main className="search-container">
      <div className="search-header">Search Reservations</div>
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="mobile_number">
            Enter a customer's phone number:
          </label>
          <input
            className="form-input"
            type="text"
            name="mobile_number"
            id="mobile_number"
            value={mobileNumber}
            onChange={handleChange}
            placeholder="Phone #"
          />
        </div>
        <div className="button-container">
          <button className="btn" type="submit">
            Find
          </button>
        </div>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      {reservations.length === 0 ? (
        <p>No reservations found</p>
      ) : (
        <ReservationList reservations={reservations} loadOnMount={false} />
      )}
    </main>
  );
}

export default SearchReservations;
