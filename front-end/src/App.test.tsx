import { render, screen } from "@testing-library/react";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";

test("renders title", () => {
  render(
    <Router>
      <App />
    </Router>
  );
  const periodicElement = screen.getByText(/periodic/i);
  const tablesElement = screen.getByText(/tables/i);

  expect(periodicElement).toBeInTheDocument();
  expect(tablesElement).toBeInTheDocument();
});
