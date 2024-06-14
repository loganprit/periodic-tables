import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Layout from "./layout/Layout";
import ReservationForm from "./reservations/ReservationForm";
import ReservationList from "./reservations/ReservationList";
import NotFound from "./layout/NotFound";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>
          <Route path="/reservations/new">
            <ReservationForm />
          </Route>
          <Route path="/reservations">
            <ReservationList loadOnMount={true} />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
