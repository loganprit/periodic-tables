import { useState } from "react";
import { listReservations } from "../utils/api";
import ReservationList from "./ReservationList";
import { Reservation } from "../types/dashboard";
import { FormEvent, InputEvent } from "../types/reservation";
import "./SearchReservations.css";

/**
 * SearchReservations component for searching reservations by mobile number.
 * @returns {JSX.Element} The rendered SearchReservations component.
 */
function SearchReservations() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortController = new AbortController();

  const handleChange = ({ target }: InputEvent) => {
    setMobileNumber(target.value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const data = await listReservations({ mobile_number: mobileNumber }, abortController.signal);
      setReservations(Array.isArray(data) ? data : [data]);
    } catch (error) {
      setError("Must enter a valid phone number.");
    }
  };

  return (
    <div className="search-container">
      <h2 className="search-header">Search Reservations</h2>
      <form className="search-form" onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="mobile_number">
          Enter a customer's phone number:
          <input
            className="form-input"
            type="text"
            name="mobile_number"
            id="mobile_number"
            value={mobileNumber}
            onChange={handleChange}
            placeholder="Phone #"
          />
        </label>
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
    </div>
  );
}

export default SearchReservations;
