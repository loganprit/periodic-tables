import React from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationForm from "../reservations/ReservationForm";
import SeatReservation from "../reservations/SeatReservation";
import TableForm from "../tables/TableForm";
import SearchReservations from "../reservations/SearchReservations";

function Routes() {
  return (
    <Switch>
      <Route exact path="/dashboard">
        <Dashboard />
      </Route>
      <Route path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationForm />
      </Route>
      <Route path="/tables/new">
        <TableForm />
      </Route>
      <Route path="/search">
        <SearchReservations />
      </Route>
    </Switch>
  );
}

export default Routes;
