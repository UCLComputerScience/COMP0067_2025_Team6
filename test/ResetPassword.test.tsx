import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPassword from "../src/components/auth/ResetPassword";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useAuth", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("ResetPassword Component", () => {
  const push = jest.fn();
  const mockResetPassword = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    (useAuth as jest.Mock).mockReturnValue({ resetPassword: mockResetPassword });
    jest.clearAllMocks();
  });

  it("renders email input and reset button", () => {
    render(<ResetPassword />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("shows validation error on empty submit", async () => {
    render(<ResetPassword />);
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email", async () => {
    render(<ResetPassword />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/must be a valid email/i)).toBeInTheDocument();
    });
  });

  it("calls resetPassword and shows success snackbar", async () => {
    mockResetPassword.mockResolvedValueOnce({}); // Simulate success

    render(<ResetPassword />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith("test@example.com");
      expect(screen.getByText(/password reset email sent/i)).toBeInTheDocument();
    });
  });

  it("shows error snackbar when resetPassword fails", async () => {
    mockResetPassword.mockResolvedValueOnce({ error: "User not found" });

    render(<ResetPassword />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "fail@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
        expect(mockResetPassword).toHaveBeenCalledWith("fail@example.com");
        expect(screen.getAllByText(/user not found/i).length).toBeGreaterThan(0);
    });
      
  });
});
