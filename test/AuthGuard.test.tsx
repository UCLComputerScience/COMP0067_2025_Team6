import React from "react";

import { render, screen } from "@testing-library/react";
import AuthGuard from "@/components/guards/AuthGuard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockReplace = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });

describe("AuthGuard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading spinner when session is loading", () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "loading",
      data: null,
    });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("redirects unauthenticated users to /auth/sign-in", () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "unauthenticated",
      data: null,
    });

    render(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(mockReplace).toHaveBeenCalledWith("/auth/sign-in");
  });

  it("redirects users without required role to /unauthorized", () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: { user: { userRole: "STANDARD_USER" } },
    });

    render(
      <AuthGuard requiredRoles={["ADMIN"]}>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(mockReplace).toHaveBeenCalledWith("/unauthorized");
  });

  it("renders children when user has correct role", () => {
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: { user: { userRole: "ADMIN" } },
    });

    render(
      <AuthGuard requiredRoles={["ADMIN"]}>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
