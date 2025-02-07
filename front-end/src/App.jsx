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
          <Route exact path="/" component={Dashboard} />
          <Route path="/reservations/new" component={ReservationForm} />
          <Route
            path="/reservations"
            render={() => <ReservationList loadOnMount={true} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
