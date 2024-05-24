import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import Login from "./Login";

describe("Login Component", () => {
  it("renders the login form", () => {
    const checkAuth = jest.fn();
    const history = createMemoryHistory();

    render(
      <Router history={history}>
        <Login checkAuth={checkAuth} />
      </Router>
    );

    // Check if the title "Login" is rendered
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();

    // Check if the username input is rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();

    // Check if the password input is rendered
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Check if the login button is rendered
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});
