import React from "react";

import { render, screen, waitFor } from "@testing-library/react";
import GuestGuard from "@/components/guards/GuestGuard";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

// Mock next/navigation and useAuth hook
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("GuestGuard", () => {
  const mockPush = jest.fn();
  const mockUseAuth = useAuth as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects authenticated user to the dashboard", async () => {
    // Mock authenticated user
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isInitialized: true,
    });

    render(
      <GuestGuard>
        <div>Guest Content</div>
      </GuestGuard>
    );

    // Ensure the redirection is called
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard/lab1");
    });
  });

  it("renders children for unauthenticated user", () => {
    // Mock unauthenticated user
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: true,
    });

    render(
      <GuestGuard>
        <div>Guest Content</div>
      </GuestGuard>
    );

    // Ensure the children are rendered
    expect(screen.getByText("Guest Content")).toBeInTheDocument();
  });

  it("shows a loading spinner while checking authentication", () => {
    // Mock the state where the authentication status is not initialized
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isInitialized: false,
    });

    render(
      <GuestGuard>
        <div>Guest Content</div>
      </GuestGuard>
    );

    // Check if the loading spinner is displayed
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
