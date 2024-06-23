import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import {
  listReservations,
  listTables,
  finishTable,
  updateReservationStatus,
} from "../utils/api";
import "./Dashboard.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Dashboard() {
  const history = useHistory();
  const query = useQuery();
  let date = query.get("date");

  const getTodayDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset); // Adjust for timezone
    return today.toISOString().split("T")[0];
  };

  if (!date) {
    date = getTodayDate();
  } else {
    date = new Date(date).toISOString().split("T")[0]; // Ensure date is in correct format
  }
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);

  const loadDashboard = useCallback(async () => {
    console.log("Loading dashboard for date:", date);
    try {
      const reservationsResponse = await listReservations({ date });
      console.log("Reservations received:", reservationsResponse);
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
    const today = getTodayDate();
    history.push(`/dashboard?date=${today}`);
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

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    // Use the date string directly without creating a new Date object
    return new Date(dateString + "T00:00:00").toLocaleDateString(
      undefined,
      options
    );
  };

  const today = getTodayDate();

  return (
    <main className="dashboard-container">
      <div className="dashboard-header">
        Reservations for {formatDate(date)}
      </div>
      <div className="button-container">
        <button className="btn" onClick={handlePrevious}>
          Previous
        </button>
        <button className="btn" onClick={handleToday} disabled={date === today}>
          Today
        </button>
        <button className="btn" onClick={handleNext}>
          Next
        </button>
      </div>
      <div className="dashboard-reservations">
        <h3>Reservations</h3>
        {reservations.length === 0 ? (
          <p>No reservations found</p>
        ) : (
          <ul className="dashboard-reservations-list">
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
                      <div className="reservation-table-button-container">
                        <Link
                          to={`/reservations/${reservation.reservation_id}/seat`}
                        >
                          <button className="res-tbl-btn">Seat</button>
                        </Link>
                        <Link
                          to={`/reservations/${reservation.reservation_id}/edit`}
                        >
                          <button className="res-tbl-btn">Edit</button>
                        </Link>
                        <button
                          className="res-tbl-btn"
                          data-reservation-id-cancel={
                            reservation.reservation_id
                          }
                          onClick={() =>
                            handleCancelReservation(reservation.reservation_id)
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="dashboard-tables">
        <h3>Tables</h3>
        <ul className="dashboard-tables-list">
          {tables.map((table) => (
            <li key={table.table_id}>
              {table.table_name} - {table.capacity} -{" "}
              <span data-table-id-status={table.table_id}>
                {table.reservation_id ? "Occupied" : "Free"}
              </span>
              {table.reservation_id && (
                <div className="reservation-table-button-container">
                  <button
                    className="res-tbl-btn"
                    data-table-id-finish={table.table_id}
                    onClick={() => handleFinish(table.table_id)}
                  >
                    Finish
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default Dashboard;
