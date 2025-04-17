import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Actions from "@/components/pages/dashboard/default/ActionsFilter";
import { usePathname } from "next/navigation";

// Mock `next/navigation` to control the pathname
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

const mockSetDevice = jest.fn();
const mockSetData = jest.fn();

describe("Actions Component", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue("/lab/room3");

    (fetch as jest.Mock).mockImplementation((url) => {
      if (url.toString().includes("/api/apikeys_get")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { api: "https://dummyapi1.com" },
            { api: "https://dummyapi2.com" },
          ]),
        });
      }

      if (url.toString().includes("https://dummyapi")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              channel: { name: url.includes("1") ? "Device 1" : "Device 2" },
            }),
        });
      }

      return Promise.reject("Unknown fetch URL");
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default text 'All'", async () => {
    render(<Actions data={""} setData={mockSetData} device={"All"} setDevice={mockSetDevice} />);
    expect(screen.getByRole("button")).toHaveTextContent("All");
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3)); // apikeys_get + 2 APIs
  });

  it("opens menu on button click", async () => {
    render(<Actions data={""} setData={mockSetData} device={"All"} setDevice={mockSetDevice} />);
    await waitFor(() => screen.getByRole("button"));
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText("Device 1")).toBeInTheDocument();
    expect(screen.getByText("Device 2")).toBeInTheDocument();
  });

  it("selecting a device updates button and calls setDevice", async () => {
    render(<Actions data={""} setData={mockSetData} device={"All"} setDevice={mockSetDevice} />);
    fireEvent.click(screen.getByRole("button"));

    const deviceItem = await screen.findByText("Device 1");
    fireEvent.click(deviceItem);

    expect(mockSetDevice).toHaveBeenCalledWith("Device 1");
    const buttons = screen.getAllByText("Device 1");
    expect(buttons[0]).toBeVisible(); 
  });

  it("selecting 'All' calls setDevice with 'All'", async () => {
    render(<Actions data={""} setData={mockSetData} device={"Device 1"} setDevice={mockSetDevice} />);
    fireEvent.click(screen.getByRole("button"));

    const allItem = await screen.getAllByText("All")[1];
    fireEvent.click(allItem);

    expect(mockSetDevice).toHaveBeenCalledWith("All");
  });
});
