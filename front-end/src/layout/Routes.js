import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationForm from "../reservations/ReservationForm";
import SeatReservation from "../reservations/SeatReservation";
import TableForm from "../tables/TableForm";
import SearchReservations from "../reservations/SearchReservations";

/**
 * Defines the main routes of the application.
 * @returns {JSX.Element} The routes for the application.
 */
function Routes() {
  return (
    <Switch>
      <Route exact path="/dashboard" component={Dashboard} />
      <Route path="/reservations/new" component={ReservationForm} />
      <Route
        path="/reservations/:reservation_id/seat"
        component={SeatReservation}
      />
      <Route
        path="/reservations/:reservation_id/edit"
        component={ReservationForm}
      />
      <Route path="/tables/new" component={TableForm} />
      <Route path="/search" component={SearchReservations} />
    </Switch>
  );
}

export default Routes;
