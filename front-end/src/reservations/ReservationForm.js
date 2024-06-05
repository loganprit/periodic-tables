import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axiosInstance from "../utils/api";

// Define the ReservationForm component
function ReservationForm() {
  // Define history for navigation
  const history = useHistory();
  // Define state for form data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  });

  // Handle form input changes
  const handleChange = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submission started");

    try {
      const startTime = Date.now();
      // Log the request payload
      console.log("Request Payload:", { data: formData });

      // Send a POST request to create a reservation
      const response = await axiosInstance.post("/reservations", {
        data: formData,
      });
      const endTime = Date.now();
      console.log(`Form submission took ${endTime - startTime} ms`);
      console.log("Response:", response);

      setFormData({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
      });
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      console.error("There was an error creating the reservation:", error);
      // Log detailed error information
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
    }
  };

  // Handle form cancellation
  const handleCancel = (event) => {
    event.preventDefault();
    // Return to previous page
    history.goBack();
  };

  // Render the reservation form
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
      <button type="button" onClick={handleCancel}>
        Cancel
      </button>
    </form>
  );
}

export default ReservationForm;
