import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import {
  listReservations,
  listTables,
  finishTable,
  updateReservationStatus,
} from "../utils/api";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Dashboard() {
  const history = useHistory();
  const query = useQuery();
  let date = query.get("date");

  if (!date) {
    const today = new Date();
    date = today.toISOString().split("T")[0];
  }

  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);

  const loadDashboard = useCallback(async () => {
    try {
      const reservationsResponse = await listReservations({ date });
      const tablesResponse = await listTables();
      setReservations(reservationsResponse);
      setTables(tablesResponse);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }, [date]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handlePrevious = () => {
    const prevDate = new Date(date);
    prevDate.setDate(prevDate.getDate() - 1);
    history.push(`/dashboard?date=${prevDate.toISOString().split("T")[0]}`);
  };

  const handleToday = () => {
    const today = new Date();
    history.push(`/dashboard?date=${today.toISOString().split("T")[0]}`);
  };

  const handleNext = () => {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    history.push(`/dashboard?date=${nextDate.toISOString().split("T")[0]}`);
  };

  const handleFinish = async (table_id) => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await finishTable(table_id);
        loadDashboard(); // Ensure the state is updated after finishing a table
      } catch (error) {
        console.error("Failed to finish table:", error);
      }
    }
  };

  const handleSeat = async (reservation_id) => {
    try {
      await updateReservationStatus(reservation_id, "seated");
      loadDashboard(); // Ensure the state is updated after seating a reservation
    } catch (error) {
      console.error("Failed to seat reservation:", error);
    }
  };

  const handleCancelReservation = async (reservation_id) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await updateReservationStatus(reservation_id, "cancelled");
        loadDashboard(); // Ensure the state is updated after canceling a reservation
      } catch (error) {
        console.error("Failed to cancel reservation:", error);
      }
    }
  };

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        <button className="btn btn-primary ml-2" onClick={handlePrevious}>
          Previous
        </button>
        <button className="btn btn-primary ml-auto" onClick={handleToday}>
          Today
        </button>
        <button className="btn btn-primary ml-2" onClick={handleNext}>
          Next
        </button>
      </div>
      <h2>Reservations</h2>
      <ul>
        {reservations
          .filter((reservation) => reservation.status !== "finished")
          .map((reservation) => (
            <li key={reservation.reservation_id}>
              {reservation.first_name} {reservation.last_name} -{" "}
              {reservation.people}
              <p data-reservation-id-status={reservation.reservation_id}>
                Status: {reservation.status}
              </p>
              {reservation.status === "booked" && (
                <>
                  <Link to={`/reservations/${reservation.reservation_id}/seat`}>
                    <button
                      onClick={() => handleSeat(reservation.reservation_id)}
                    >
                      Seat
                    </button>
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
      <h2>Tables</h2>
      <ul>
        {tables.map((table) => (
          <li key={table.table_id}>
            {table.table_name} - {table.capacity} -{" "}
            <span data-table-id-status={table.table_id}>
              {table.reservation_id ? "Occupied" : "Free"}
            </span>
            {table.reservation_id && (
              <button
                data-table-id-finish={table.table_id}
                onClick={() => handleFinish(table.table_id)}
              >
                Finish
              </button>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Dashboard;
