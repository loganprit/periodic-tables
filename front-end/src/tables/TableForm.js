import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../utils/api";
import "./TableForm.css";

/**
 * TableForm component for creating a new table.
 * @returns {JSX.Element} The rendered TableForm component.
 */
function TableForm() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: "",
  });
  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    const value =
      target.name === "capacity" ? Number(target.value) : target.value;
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!formData.table_name || formData.table_name.length < 2) {
      setError("Table name must be at least 2 characters long.");
      return;
    }

    if (
      !formData.capacity ||
      isNaN(formData.capacity) ||
      formData.capacity < 1
    ) {
      setError("Capacity must be a positive number.");
      return;
    }

    try {
      await axiosInstance.post("/tables", {
        data: formData,
      });
      history.push("/dashboard");
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else {
        setError(error.message);
      }
    }
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
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
