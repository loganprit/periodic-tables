import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/api";
import { Reservation, Table } from "../types/dashboard";
import { ErrorResponse } from "../types/reservation";
import "./SeatReservation.css";

/**
 * SeatReservation component for seating a reservation at a table.
 * @returns {JSX.Element} The rendered SeatReservation component.
 */
function SeatReservation() {
  const navigate = useNavigate();
  const { reservation_id } = useParams<{ reservation_id: string }>();
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [reservation, setReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [tablesResponse, reservationResponse] = await Promise.all([
          axiosInstance.get<{ data: Table[] }>("/tables"),
          axiosInstance.get<{ data: Reservation }>(`/reservations/${reservation_id}`),
        ]);

        if (isMounted) {
          setTables(tablesResponse.data.data);
          setReservation(reservationResponse.data.data);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        if (isMounted) {
          setError("An error occurred while loading data. Please try again.");
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [reservation_id]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTable(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reservation) return;

    if (reservation.status === "seated") {
      setError("This reservation is already seated.");
      return;
    }

    const selectedTableData = tables.find(
      (table) => table.table_id === Number(selectedTable)
    );
    if (selectedTableData && selectedTableData.capacity < reservation.people) {
      setError(
        "The selected table does not have enough capacity for this reservation."
      );
      return;
    }

    try {
      await axiosInstance.put(`/tables/${selectedTable}/seat`, {
        data: { reservation_id },
      });
      navigate(`/dashboard?date=${reservation.reservation_date}`);
    } catch (err) {
      const error = err as ErrorResponse;
      console.error("Error seating reservation:", error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate(-1);
  };

  if (!reservation) {
    return <div>Loading...</div>;
  }

  return (
    <main className="seat-container">
      <div className="seat-header">
        Seat Reservation for {reservation.first_name} {reservation.last_name}
      </div>
      <form className="seat-form" onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <p className="seat-status">Status: {reservation.status}</p>
        <label className="seat-label" htmlFor="table_id">
          Table:
          <select
            className="seat-input"
            name="table_id"
            value={selectedTable}
            onChange={handleChange}
            required
          >
            <option value="">Select a table</option>
            {tables.map((table) => (
              <option key={table.table_id} value={table.table_id}>
                {`${table.table_name} - ${table.capacity}`}
              </option>
            ))}
          </select>
        </label>
        <div className="seat-button-container">
          <button
            className="btn"
            type="submit"
            disabled={reservation.status === "seated"}
          >
            Submit
          </button>
          <button className="btn" type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}

export default SeatReservation;
