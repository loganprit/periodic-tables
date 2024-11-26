import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance, { getReservation, updateReservation } from "../utils/api";
import { validateReservationDate } from "../utils/dateValidation";
import { validateReservationTime } from "../utils/timeValidation";
import { ReservationFormData, FormEvent, InputEvent, ErrorResponse } from "../types/reservation";
import "./ReservationForm.css";

/**
 * ReservationForm component for creating and updating reservations.
 * @returns {JSX.Element} The rendered ReservationForm component.
 */
function ReservationForm() {
  const navigate = useNavigate();
  const { reservation_id } = useParams<{ reservation_id?: string }>();
  const isEdit = Boolean(reservation_id);
  const [formData, setFormData] = useState<ReservationFormData>({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && reservation_id) {
      const loadReservation = async () => {
        try {
          const response = await getReservation(Number(reservation_id), new AbortController().signal);
          setFormData(response as ReservationFormData);
        } catch (error) {
          console.error("Error loading reservation:", error);
        }
      };
      loadReservation();
    }
  }, [isEdit, reservation_id]);

  const handleChange = ({ target }: InputEvent) => {
    const value = target.name === "people" ? Number(target.value) : target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const dateError = validateReservationDate(formData.reservation_date);
    if (dateError) {
      setError(dateError);
      return;
    }

    const timeError = validateReservationTime(
      formData.reservation_date,
      formData.reservation_time
    );
    if (timeError) {
      setError(timeError);
      return;
    }

    try {
      if (isEdit && reservation_id) {
        await updateReservation(Number(reservation_id), formData, new AbortController().signal);
      } else {
        await axiosInstance.post("/reservations", { data: formData });
      }
      navigate(`/dashboard?date=${formData.reservation_date}`);
    } catch (err) {
      const error = err as ErrorResponse;
      if (error.response) {
        setError(error.response.data.error);
      }
    }
  };

  const handleCancel = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate(-1);
  };

  return (
    <div className="reservation-form-container">
      <h2 className="reservation-form-header">
        {isEdit ? "Edit Reservation" : "New Reservation"}
      </h2>
      <form className="reservation-form" onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <label className="reservation-form-label">
          First Name:
          <input
            className="reservation-form-input"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </label>
        <label className="reservation-form-label">
          Last Name:
          <input
            className="reservation-form-input"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </label>
        <label className="reservation-form-label">
          Mobile Number:
          <input
            className="reservation-form-input"
            type="text"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            required
          />
        </label>
        <label className="reservation-form-label">
          Date:
          <input
            className="reservation-form-input"
            type="date"
            name="reservation_date"
            value={formData.reservation_date}
            onChange={handleChange}
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            required
          />
        </label>
        <label className="reservation-form-label">
          Time:
          <input
            className="reservation-form-input"
            type="time"
            name="reservation_time"
            value={formData.reservation_time}
            onChange={handleChange}
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            required
          />
        </label>
        <label className="reservation-form-label">
          People:
          <input
            className="reservation-form-input"
            type="number"
            name="people"
            value={formData.people}
            onChange={handleChange}
            required
          />
        </label>
        <div className="reservation-form-button-container">
          <button className="btn" type="submit">
            Submit
          </button>
          <button
            className="btn"
            type="button"
            onClick={handleCancel}
            data-reservation-id-cancel={formData.reservation_id}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
