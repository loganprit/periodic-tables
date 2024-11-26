import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "@testing-library/jest-dom";

describe("App component", () => {
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
}); 