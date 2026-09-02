import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import HomePage from "./HomePage";
import { CurrencyProvider } from "../context/CurrencyContext";
import { AuthProvider } from "../context/AuthContext";

test("newsletter form gives visible submission feedback", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <CurrencyProvider>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </CurrencyProvider>
    </MemoryRouter>
  );

  await user.type(screen.getByPlaceholderText("Enter your email"), "buyer@example.com");
  await user.click(screen.getByRole("button", { name: "Subscribe" }));

  expect(screen.getByRole("status")).toHaveTextContent("early-access deals list");
});
