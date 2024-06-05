import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../dashboard/Reservation";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Dashboard() {
  const query = useQuery();
  const date = query.get("date");

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then((data) => {
        console.log("Fetched reservations:", data); // Debug log
        setReservations(data);
      })
      .catch(setReservationsError);
    return () => abortController.abort();
  }, [date]);

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <div>
        {reservations.length > 0 ? (
          reservations.map((reservation) => (
            <Reservation
              key={reservation.reservation_id}
              reservation={reservation}
            />
          ))
        ) : (
          <p>No reservations found for this date.</p>
        )}
      </div>
    </main>
  );
}

export default Dashboard;
