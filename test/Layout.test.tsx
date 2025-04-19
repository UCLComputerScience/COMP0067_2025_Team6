import React from "react";

import { render, screen, waitFor } from "@testing-library/react";
import Layout from "../src/app/(dashboard)/admin/access/layout"; // Adjust the path as needed
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock the next-auth session and next/navigation hooks
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockReplace = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });

describe("Layout with AuthGuard", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("allows access to the page for an ADMIN user", async () => {
    // Mock the session for an ADMIN user
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: { user: { userRole: "ADMIN" } },
    });

    render(
      <Layout>
        <div>Admin Content</div>
      </Layout>
    );

    // Check that the content is rendered for the ADMIN user
    await waitFor(() => {
      expect(screen.getByText("Admin Content")).toBeInTheDocument();
    });
  });

  it("redirects non-ADMIN user to unauthorized page", async () => {
    // Mock the session for a non-ADMIN user (STANDARD_USER)
    (useSession as jest.Mock).mockReturnValue({
      status: "authenticated",
      data: { user: { userRole: "STANDARD_USER" } },
    });

    render(
      <Layout>
        <div>Admin Content</div>
      </Layout>
    );

    // Wait for the redirection to occur
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/unauthorized");
    });
  });

  it("redirects unauthenticated user to the sign-in page", async () => {
    // Mock the session for an unauthenticated user
    (useSession as jest.Mock).mockReturnValue({
      status: "unauthenticated",
      data: null,
    });

    render(
      <Layout>
        <div>Admin Content</div>
      </Layout>
    );

    // Wait for the redirection to occur
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/auth/sign-in");
    });
  });
});
