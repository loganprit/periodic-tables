import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../utils/api";

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
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      <label>
        Table Name:
        <input
          type="text"
          name="table_name"
          value={formData.table_name}
          onChange={handleChange}
          required
          minLength={2}
        />
      </label>
      <label>
        Capacity:
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          required
          min={1}
        />
      </label>
      <button type="submit">Submit</button>
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}

export default TableForm;
