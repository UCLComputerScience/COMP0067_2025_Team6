import React from "react";
import { render, screen } from "@testing-library/react";
import Lab1 from "../src/app/(dashboard)/dashboard/lab1/page";
import { SessionProvider } from "next-auth/react";
import '@testing-library/jest-dom';

// Mock subcomponents
jest.mock("@/components/pages/dashboard/default/Actions", () => () => <div>Mocked Actions</div>);
jest.mock("@/components/pages/dashboard/default/ActionsFilter", () => () => <div>Mocked ActionsFilter</div>);
jest.mock("@/components/pages/dashboard/default/ActionsAdd", () => () => <div>Mocked ActionsAdd</div>);

// Mock next/navigation usePathname
jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/lab1",
}));

// Mock translation hook
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("Lab1 Component", () => {
  it("renders welcome text and child components", () => {
    render(
      <SessionProvider
        session={{
          user: { name: "Test User", email: "test@example.com" },
          expires: "2099-01-01T00:00:00.000Z",
        }}
      >
        <Lab1 />
      </SessionProvider>
    );

    expect(screen.getByText("Lab 1")).toBeInTheDocument();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/we've missed you/i)).toBeInTheDocument();

    expect(screen.getByText("Mocked Actions")).toBeInTheDocument();
    expect(screen.getByText("Mocked ActionsFilter")).toBeInTheDocument();
    expect(screen.getByText("Mocked ActionsAdd")).toBeInTheDocument();
  });
});