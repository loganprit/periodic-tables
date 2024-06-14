import React, { useState, useEffect } from "react";
import { listReservations, listTables, seatReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservationForm() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadReservations();
    loadTables();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await listReservations();
      setReservations(data);
    } catch (err) {
      setError(err);
    }
  };

  const loadTables = async () => {
    try {
      const data = await listTables();
      setTables(data);
    } catch (err) {
      setError(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await seatReservation(selectedReservation, selectedTable);
      // Reload reservations and tables after seating
      loadReservations();
      loadTables();
    } catch (err) {
      setError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert error={error} />
      <div>
        <label htmlFor="reservation_id">Reservation:</label>
        <select
          id="reservation_id"
          name="reservation_id"
          value={selectedReservation}
          onChange={(e) => setSelectedReservation(e.target.value)}
        >
          <option value="">Select a reservation</option>
          {reservations.map((reservation) => (
            <option
              key={reservation.reservation_id}
              value={reservation.reservation_id}
            >
              {reservation.first_name} {reservation.last_name} -{" "}
              {reservation.reservation_time}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="table_id">Table:</label>
        <select
          id="table_id"
          name="table_id"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="">Select a table</option>
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Seat Reservation</button>
    </form>
  );
}

export default SeatReservationForm;
