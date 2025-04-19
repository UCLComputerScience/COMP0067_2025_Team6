import handler from "../src/pages/api/auth/deactivate";
import { createMocks } from "node-mocks-http";
import prisma from "@/lib/prisma"; 

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    user: {
      updateMany: jest.fn(),
    },
  },
}));

describe("POST /api/auth/deactivate", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should return 405 if not POST", async () => {
    const { req, res } = createMocks({ method: "GET" });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._getJSONData()).toEqual({ error: "Method Not Allowed" });
  });

  it("should return 400 for invalid body", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: { userIds: [] },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      error: "Invalid or missing user IDs",
    });
  });

  it("should return 404 if no users updated", async () => {
    console.log("Test: should return 404 if no users updated");

    (prisma.user.updateMany as jest.Mock).mockResolvedValue({ count: 0 });

    const { req, res } = createMocks({
      method: "POST",
      body: { userIds: ["1", "2"] },
    });

    await handler(req, res);

    console.log(res._getStatusCode(), res._getJSONData());

    expect(res._getStatusCode()).toBe(404);
    expect(res._getJSONData()).toEqual({
      error: "No users found with provided IDs",
    });
  });

  it("should return 200 if users deactivated", async () => {
    console.log("Test: should return 200 if users deactivated");

    (prisma.user.updateMany as jest.Mock).mockResolvedValue({ count: 2 });

    const { req, res } = createMocks({
      method: "POST",
      body: { userIds: ["1", "2"] },
    });

    await handler(req, res);

    console.log(res._getStatusCode(), res._getJSONData());

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "Users deactivated successfully",
    });
  });
});
