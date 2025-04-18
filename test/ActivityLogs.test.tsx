import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ActivityLogs from "../src/app/(dashboard)/admin/activity/page";
import "@testing-library/jest-dom";

jest.mock("jspdf", () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    setFontSize: jest.fn(),
    save: jest.fn(),
  })),
}));
jest.mock("jspdf-autotable", () => jest.fn());


beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        id: "1",
        timestamp: new Date().toISOString(),
        user: "Alice Smith",
        device: "Sensor A",
        action: "Device Added",
        labLocation: "Lab 1",
      },
      {
        id: "2",
        timestamp: new Date().toISOString(),
        user: "Bob Johnson",
        device: "Sensor B",
        action: "Upper threshold changed",
        labLocation: "Lab 2",
      },
    ],
  });
});

describe("ActivityLogs Integration Test", () => {
  it("renders activity logs with data from API", async () => {
    render(<ActivityLogs />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Device Added")).toBeInTheDocument();
      expect(screen.getByText("Upper threshold changed")).toBeInTheDocument();
    });
  });

  it("filters results by search input", async () => {
    render(<ActivityLogs />);
    await waitFor(() => screen.getByText("Alice")); // ensure loaded

    const searchBox = screen.getByLabelText(/search user\/device/i);

    fireEvent.change(searchBox, { target: { value: "Bob" } });

    await waitFor(() => {
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });
});
