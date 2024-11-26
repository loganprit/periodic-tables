import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  listReservations,
  listTables,
  finishTable,
  updateReservationStatus,
} from "../utils/api";
import "./Dashboard.css";
import {
  Reservation,
  Table,
  DateNavigationHandler,
  TableActionHandler,
  ReservationActionHandler
} from "../types/dashboard";
import { useEffect, useState, useCallback } from "react";

// Custom hook to parse URL query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

/**
 * Dashboard component displaying reservations and tables for a specific date.
 * @returns {JSX.Element} The rendered Dashboard component.
 */
function Dashboard() {
  const navigate = useNavigate();
  const query = useQuery();

  const getTodayDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    today.setMinutes(today.getMinutes() - offset);
    return today.toISOString().split("T")[0];
  };

  const queryDate = query.get("date");
  const date = (queryDate 
    ? new Date(queryDate as string).toISOString().split("T")[0] 
    : getTodayDate()) as string;

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  // Load dashboard data with proper signal handling
  const loadDashboard = useCallback(async () => {
    const abortController = new AbortController();
    try {
      const reservationsResponse = await listReservations({ date }, abortController.signal);
      const tablesResponse = await listTables(abortController.signal);
      setReservations(Array.isArray(reservationsResponse) ? reservationsResponse : [reservationsResponse]);
      setTables(tablesResponse);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
    return () => abortController.abort();
  }, [date]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Handlers for navigating through dates
  const handlePrevious: DateNavigationHandler = () => {
    const prevDate = new Date(date + "T00:00:00");
    prevDate.setDate(prevDate.getDate() - 1);
    navigate(`/dashboard?date=${prevDate.toISOString().split("T")[0]}`);
  };

  const handleToday: DateNavigationHandler = () => {
    const today = getTodayDate();
    navigate(`/dashboard?date=${today}`);
  };

  const handleNext: DateNavigationHandler = () => {
    const nextDate = new Date(date + "T00:00:00");
    nextDate.setDate(nextDate.getDate() + 1);
    navigate(`/dashboard?date=${nextDate.toISOString().split("T")[0]}`);
  };

  // Handler for finishing a table
  const handleFinish: TableActionHandler = async (table_id) => {
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await finishTable(table_id, date);
        loadDashboard(); // Ensure the state is updated after finishing a table
      } catch (error) {
        console.error("Failed to finish table:", error);
      }
    }
  };

  // Handler for canceling a reservation
  const handleCancelReservation: ReservationActionHandler = async (reservation_id) => {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await updateReservationStatus(reservation_id, "cancelled", date);
        loadDashboard(); // Ensure the state is updated after canceling a reservation
      } catch (error) {
        console.error("Failed to cancel reservation:", error);
      }
    }
  };

  // Function to format date string into a readable format (e.g. "Sunday, June 23, 2024")
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(`${dateString}T00:00:00`).toLocaleDateString(undefined, options);
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
              .filter((reservation: Reservation) => reservation.status !== "finished")
              .map((reservation: Reservation) => (
                <li key={reservation.reservation_id}>
                  {reservation.first_name} {reservation.last_name} -{" "}
                  {reservation.people}
                  <p data-reservation-id-status={reservation.reservation_id}>
                    Status: {reservation.status}
                  </p>
                  {reservation.status === "booked" && (
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
                        data-reservation-id-cancel={reservation.reservation_id}
                        onClick={() =>
                          handleCancelReservation(reservation.reservation_id)
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="dashboard-tables">
        <h3>Tables</h3>
        <ul className="dashboard-tables-list">
          {tables.map((table: Table) => (
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
