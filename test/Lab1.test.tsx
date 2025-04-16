import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import Lab1 from "../src/app/(dashboard)/dashboard/lab1/page";
import { useSession } from "next-auth/react";
import useAuth from "@/hooks/useAuth";

global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>;

jest.mock("next/navigation", () => ({
  usePathname: () => "/dashboard/lab1",
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("@/hooks/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

describe("Lab1 Component", () => {
  const mockSession = {
    user: { name: "John Doe" },
    expires: "2025-12-31T23:59:59.999Z",
  };

  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ firstName: "John", session: mockSession, status: "authenticated" });
    (useSession as jest.Mock).mockReturnValue({ data: mockSession, status: "authenticated" });
  });

  it("fetches apikeys and displays data correctly", async () => {
    const mockApikeysResponse = [
      { api: "http://api.example.com/key1" },
      { api: "http://api.example.com/key2" },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApikeysResponse,
    });

    render(<Lab1 />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/apikeys_get?labId=1", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      expect(screen.getByText(/Lab 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("handles errors gracefully when fetch fails", async () => {
    const mockError = new Error("API fetch failed");
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);
  
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  
    render(<Lab1 />);
  
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching apikeys:", mockError);
    });
  
    consoleSpy.mockRestore();
  });

  it("shows loading state correctly", () => {
    (useAuth as jest.Mock).mockReturnValueOnce({ firstName: "", session: null, status: "loading" });
    render(<Lab1 />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows unauthenticated state correctly", () => {
    (useAuth as jest.Mock).mockReturnValueOnce({ firstName: "", session: null, status: "unauthenticated" });
    render(<Lab1 />);
    expect(screen.getByText("You need to sign in to access this page.")).toBeInTheDocument();
  });
});