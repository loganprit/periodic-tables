import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axiosInstance from "../utils/api";

function SeatReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTables() {
      try {
        const response = await axiosInstance.get("/tables");
        setTables(response.data.data);
      } catch (error) {
        setError(error.message);
      }
    }

    loadTables();
  }, []);

  const handleChange = ({ target }) => {
    setSelectedTable(target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(`Seating reservation at table: ${selectedTable}`);
      await axiosInstance.put(`/tables/${selectedTable}/seat`, {
        data: { reservation_id },
      });
      history.push("/dashboard");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
      console.error("Error seating reservation:", error);
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <label>
        Table:
        <select
          name="table_id"
          value={selectedTable}
          onChange={handleChange}
          required
        >
          <option value="">Select a table</option>
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Submit</button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}

export default SeatReservation;
