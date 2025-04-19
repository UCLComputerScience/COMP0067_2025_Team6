import { act } from "@testing-library/react";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("handleActivateUsers", () => {
  const setReloadUsers = jest.fn();
  const setSelected = jest.fn();
  const setSelectedUsers = jest.fn();
  const closeConfirmationDialog = jest.fn();
  const showFeedback = jest.fn();
  const setLoading = jest.fn();

  const selectedUsers = [1, 2];

  const createHandler = () => {
    return async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/activate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds: selectedUsers }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(
              `Failed to activate users: ${
                errorJson.error || errorJson.message || errorText
              }`
            );
          } catch {
            throw new Error(`Failed to activate users: ${errorText}`);
          }
        }

        const result = await response.json();
        console.log("Users activated successfully:", result);
        setReloadUsers((prev) => !prev);
        setSelected([]);
        setSelectedUsers([]);
        closeConfirmationDialog();
        showFeedback(
          `Successfully activated ${selectedUsers.length} user(s)`,
          "success"
        );
      } catch (error: any) {
        showFeedback(`Failed to activate users: ${error.message}`, "error");
      } finally {
        setLoading(false);
      }
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls fetch and updates state on success", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Users activated successfully" }),
    });

    const handler = createHandler();

    await act(async () => {
      await handler();
    });

    expect(fetch).toHaveBeenCalledWith(
      "/api/auth/activate",
      expect.any(Object)
    );
    expect(setReloadUsers).toHaveBeenCalled();
    expect(setSelected).toHaveBeenCalledWith([]);
    expect(setSelectedUsers).toHaveBeenCalledWith([]);
    expect(closeConfirmationDialog).toHaveBeenCalled();
    expect(showFeedback).toHaveBeenCalledWith(
      "Successfully activated 2 user(s)",
      "success"
    );
  });

  it("shows error message on failure", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => JSON.stringify({ error: "Something went wrong" }),
    });

    const handler = createHandler();

    await act(async () => {
      await handler();
    });

    expect(showFeedback).toHaveBeenCalledWith(
      expect.stringContaining("Something went wrong"),
      "error"
    );
  });
});
