import { Route, Routes as RouterRoutes } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationForm from "../reservations/ReservationForm";
import SeatReservation from "../reservations/SeatReservation";
import TableForm from "../tables/TableForm";
import SearchReservations from "../reservations/SearchReservations";

/**
 * Defines the main routes of the application.
 * @returns {JSX.Element} The routes for the application.
 */
function AppRoutes(): JSX.Element {
  return (
    <RouterRoutes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/reservations/new" element={<ReservationForm />} />
      <Route path="/reservations/:reservation_id/seat" element={<SeatReservation />} />
      <Route path="/reservations/:reservation_id/edit" element={<ReservationForm />} />
      <Route path="/tables/new" element={<TableForm />} />
      <Route path="/search" element={<SearchReservations />} />
    </RouterRoutes>
  );
}

export default AppRoutes;
