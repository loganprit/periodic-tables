import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axiosInstance, { getReservation, updateReservation } from "../utils/api";
import { validateReservationDate } from "../utils/dateValidation";
import { validateReservationTime } from "../utils/timeValidation";

// Define the ReservationForm component
function ReservationForm() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const isEdit = Boolean(reservation_id);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      const loadReservation = async () => {
        try {
          const response = await getReservation(reservation_id);
          setFormData(response);
        } catch (error) {
          console.error("Error loading reservation:", error);
        }
      };
      loadReservation();
    }
  }, [isEdit, reservation_id]);

  const handleChange = ({ target }) => {
    const value =
      target.name === "people" ? Number(target.value) : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submission started");

    // Validate the reservation date
    const dateError = validateReservationDate(formData.reservation_date);
    if (dateError) {
      setError(dateError);
      console.error(dateError);
      return;
    }

    // Validate the reservation time
    const timeError = validateReservationTime(
      formData.reservation_date,
      formData.reservation_time
    );
    if (timeError) {
      setError(timeError);
      console.error(timeError);
      return;
    }

    try {
      const startTime = Date.now();
      console.log("Request Payload:", { data: formData });

      if (isEdit) {
        await updateReservation(reservation_id, formData);
      } else {
        await axiosInstance.post("/reservations", { data: formData });
      }

      const endTime = Date.now();
      console.log(`Form submission took ${endTime - startTime} ms`);
      setFormData({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
      });
      setError(null); // Clear any previous errors
      history.push(`/dashboard?date=${formData.reservation_date}`);
    } catch (error) {
      console.error(
        "There was an error creating/updating the reservation:",
        error
      );
      if (error.response) {
        console.error("Error response data:", error.response.data);
        setError(error.response.data.error); // Set error message from backend
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
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
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
          placeholder="HH:MM"
          pattern="[0-9]{2}:[0-9]{2}"
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
      <button type="submit">Submit</button>
      <button
        type="button"
        onClick={handleCancel}
        data-reservation-id-cancel={formData.reservation_id}
      >
        Cancel
      </button>
    </form>
  );
}

export default ReservationForm;
