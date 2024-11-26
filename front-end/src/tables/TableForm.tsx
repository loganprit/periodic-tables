import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/api";
import { ErrorResponse } from "../types/reservation";
import { TableFormData } from "../types/dashboard";
import "./TableForm.css";

/**
 * TableForm component for creating a new table.
 * @returns {JSX.Element} The rendered TableForm component.
 */
function TableForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TableFormData>({
    table_name: "",
    capacity: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const value = target.name === "capacity" ? Number(target.value) : target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!formData.table_name || formData.table_name.length < 2) {
      setError("Table name must be at least 2 characters long.");
      return;
    }

    const capacity = Number(formData.capacity);
    if (!capacity || isNaN(capacity) || capacity < 1) {
      setError("Capacity must be a positive number.");
      return;
    }

    try {
      await axiosInstance.post("/tables", {
        data: { ...formData, capacity },
      });
      navigate("/dashboard");
    } catch (err) {
      const error = err as ErrorResponse;
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate(-1);
  };

  return (
    <div className="table-form-container">
      <h2 className="table-form-header">Create Table</h2>
      <form className="table-form" onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <label className="form-label" htmlFor="table_name">
          Table Name:
          <input
            className="form-input"
            type="text"
            name="table_name"
            id="table_name"
            value={formData.table_name}
            onChange={handleChange}
            required
            minLength={2}
          />
        </label>
        <label className="form-label" htmlFor="capacity">
          Capacity:
          <input
            className="form-input"
            type="number"
            name="capacity"
            id="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            min={1}
          />
        </label>
        <div className="button-container">
          <button className="btn" type="submit">
            Submit
          </button>
          <button className="btn" type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TableForm;
