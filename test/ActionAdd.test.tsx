import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import FormDialog from "@/components/pages/dashboard/default/ActionsAdd";
import "@testing-library/jest-dom";

global.fetch = jest.fn();
const mockSetData = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/lab1",
}));

describe("FormDialog Component", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  
  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("opens the dialog when Add button is clicked", () => {
    render(<FormDialog data="" setData={mockSetData} />);
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Add New Channel")).toBeInTheDocument();
  });

  it("submits form and handles success", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: async () => ({
          channel: {
            id: 123,
            name: "Test Channel",
            latitude: "0.0",
            longitude: "0.0",
            field1: "f1", field2: "f2",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_entry_id: 1,
          },
        }),
      })
      .mockResolvedValueOnce({ ok: true }) // /api/channel_add
      .mockResolvedValueOnce({ ok: true }) // /api/apikeys
      .mockResolvedValueOnce({
        json: async () => ({ labLocation: "London" }),
      }) // /api/device-lab
      .mockResolvedValueOnce({ ok: true }); // /api/logs
  
    render(<FormDialog data="" setData={mockSetData} />);
  
    fireEvent.click(screen.getByText("Add"));
  
    const input = screen.getByRole("textbox", { name: /api key/i });
    fireEvent.change(input, { target: { value: "http://example.com/api" } });
  
    fireEvent.click(screen.getByText("Add", { selector: "button[type='submit']" }));
  
    await waitFor(() => {
      expect(mockSetData).toHaveBeenCalledWith("http://example.com/api");
    });
  });

  it("shows error message if fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Fetch failed"));
  
    render(<FormDialog data="" setData={mockSetData} />);
    fireEvent.click(screen.getByText("Add"));
  
    // Better selector
    fireEvent.change(screen.getByLabelText(/api key/i), {
      target: { value: "http://bad-url.com" },
    });
  
    fireEvent.click(screen.getByText("Add", { selector: "button[type='submit']" }));
  
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
  
  it("closes the dialog when Cancel is clicked", async () => {
    render(<FormDialog data="" setData={mockSetData} />);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Cancel"));
  
    await waitFor(() => {
      expect(screen.queryByText("Add New Channel")).not.toBeInTheDocument();
    });
  });
});