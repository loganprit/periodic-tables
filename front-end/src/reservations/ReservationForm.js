import React, { useState } from "react";
import axios from "axios";

function ReservationForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  });

  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/reservations", formData);
      setFormData({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
      });
      alert("Reservation created successfully");
    } catch (error) {
      console.error("There was an error creating the reservation:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Mobile Number:
        <input
          type="text"
          name="mobile_number"
          value={formData.mobile_number}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Date:
        <input
          type="date"
          name="reservation_date"
          value={formData.reservation_date}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Time:
        <input
          type="time"
          name="reservation_time"
          value={formData.reservation_time}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        People:
        <input
          type="number"
          name="people"
          value={formData.people}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Create Reservation</button>
    </form>
  );
}

export default ReservationForm;
