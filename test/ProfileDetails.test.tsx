import { render, screen } from "@testing-library/react";
import ProfileDetails from "../src/app/(dashboard)/account/profile/page";
import { useSession } from "next-auth/react";
import "@testing-library/jest-dom";
import React from "react";

jest.mock("next-auth/react");

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          user: {
            firstName: "Test",
            lastName: "User",
            userRole: "STANDARD_USER",
            avatar: "",
          },
        }),
    })
  ) as jest.Mock;
});

describe("ProfileDetails", () => {
  beforeEach(() => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { id: "123" } },
      status: "authenticated",
    });
    jest.clearAllMocks();
  });

  it("renders upload avatar button", () => {
    render(<ProfileDetails />);
    expect(screen.getByText(/upload avatar/i)).toBeInTheDocument();
  });

  it("renders user role and name placeholders", async () => {
    render(<ProfileDetails />);
    expect(screen.getByRole("img")).toBeInTheDocument(); // Avatar
    expect(screen.getByText(/standard user/i)).toBeInTheDocument();
  });

  it("has navigation buttons to personal sections", () => {
    render(<ProfileDetails />);
    expect(screen.getByRole("button", { name: /personal information/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /organisation information/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /change password/i })).toBeInTheDocument();
  });
});
