import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Actions from "@/components/pages/dashboard/default/Actions";

describe("Actions Component", () => {
  const mockSetSelectedOption = jest.fn();

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  
  afterAll(() => {
    (console.error as jest.Mock).mockRestore();
  });

  beforeEach(() => {
    mockSetSelectedOption.mockReset();
  });

  it("renders the button with initial text 'All Data'", () => {
    render(<Actions selectedOption="" setSelectedOption={mockSetSelectedOption} />);
    expect(screen.getByRole("button", { name: /all data/i })).toBeInTheDocument();
  });

  it("opens the menu when button is clicked", () => {
    render(<Actions selectedOption="" setSelectedOption={mockSetSelectedOption} />);
    fireEvent.click(screen.getByRole("button", { name: /all data/i }));

    // All options should now be visible
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Last 7 Days")).toBeInTheDocument();
    expect(screen.getByText("Last 30 Days")).toBeInTheDocument();
    expect(screen.getByText("Last Year")).toBeInTheDocument();
  });

  it("selects 'Today' and updates state", () => {
    render(<Actions selectedOption="" setSelectedOption={mockSetSelectedOption} />);
    fireEvent.click(screen.getByRole("button", { name: /all data/i }));
    fireEvent.click(screen.getByText("Today"));

    expect(mockSetSelectedOption).toHaveBeenCalledWith("?days=1");
    expect(screen.getByRole("button", { name: /today/i })).toBeInTheDocument();
  });

  it("selects 'Last 7 Days'", () => {
    render(<Actions selectedOption="" setSelectedOption={mockSetSelectedOption} />);
    fireEvent.click(screen.getByRole("button", { name: /all data/i }));
    fireEvent.click(screen.getByText("Last 7 Days"));

    expect(mockSetSelectedOption).toHaveBeenCalledWith("?days=7");
    expect(screen.getByRole("button", { name: /last 7 days/i })).toBeInTheDocument();
  });

  it("selects 'All Data' and clears the filter", () => {
    render(<Actions selectedOption="?days=30" setSelectedOption={mockSetSelectedOption} />);
    fireEvent.click(screen.getByRole("button", { name: /all data/i }));
    const items = screen.getAllByText("All Data");
    fireEvent.click(items[1]); // 0 is the button, 1 is the menu item

    expect(mockSetSelectedOption).toHaveBeenCalledWith("");
    expect(screen.getByRole("button", { name: /all data/i })).toBeInTheDocument();
  });
});