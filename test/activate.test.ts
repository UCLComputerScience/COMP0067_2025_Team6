import { createMocks } from 'node-mocks-http';
import handler from "../src/pages/api/auth/activate";
import prisma from '@/lib/prisma'; // Import the prisma mock

// Mock prisma module
jest.mock('@/lib/prisma', () => ({
  user: {
    updateMany: jest.fn(),
  },
}));

describe("POST /api/auth/activate", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("activates users successfully and returns success message", async () => {
    const mockUpdateMany = jest.fn().mockResolvedValue({ count: 2 });
    prisma.user.updateMany = mockUpdateMany;

    const { req, res } = createMocks({
      method: "POST",
      body: { userIds: [1, 2] },
    });

    await handler(req, res);

    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: { in: [1, 2] } },
      data: { status: "ACTIVE" },
    });
    expect(res.statusCode).toBe(200);
    expect(res._getData()).toEqual(
      JSON.stringify({ message: "Users activated successfully" })
    );
  });

  test("returns error if no userIds are provided", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {},
    });

    await handler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res._getData()).toEqual(
      JSON.stringify({ error: "Invalid or missing user IDs" })
    );
  });

  test("returns error if no users match provided IDs", async () => {
    const mockUpdateMany = jest.fn().mockResolvedValue({ count: 0 });
    prisma.user.updateMany = mockUpdateMany;

    const { req, res } = createMocks({
      method: "POST",
      body: { userIds: [999] }, // Assuming 999 doesn't exist
    });

    await handler(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getData()).toEqual(
      JSON.stringify({ error: "No users found with provided IDs" })
    );
  });

  test("handles unexpected errors gracefully", async () => {
    const mockUpdateMany = jest.fn().mockRejectedValue(new Error("Some error"));
    prisma.user.updateMany = mockUpdateMany;

    const { req, res } = createMocks({
      method: "POST",
      body: { userIds: [1, 2] },
    });

    await handler(req, res);

    expect(res.statusCode).toBe(500);
    expect(res._getData()).toEqual(
      JSON.stringify({ error: "Internal Server Error" })
    );
  });
});
