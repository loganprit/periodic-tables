import { Routes, Route } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard";
import Layout from "./layout/Layout";
import ReservationForm from "./reservations/ReservationForm";
import ReservationList from "./reservations/ReservationList";
import NotFound from "./layout/NotFound";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reservations/new" element={<ReservationForm />} />
        <Route 
          path="/reservations" 
          element={<ReservationList loadOnMount={true} />} 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
