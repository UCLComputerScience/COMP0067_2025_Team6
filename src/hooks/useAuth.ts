import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";

const useAuth = () => {
  const { data: session, status } = useSession();
  const isInitialized = status !== "loading"; // Check if the session is initialized

  // Log session data to ensure it's populated
  console.log("Session Data:", session);

  const signIn = async (email: string, password: string) => {
    const result = await nextAuthSignIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      console.error("Sign-in error:", result.error); // Log the error for debugging
      throw new Error(result.error);
    }

    return result;
  };

  const signOut = async () => {
    await nextAuthSignOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Password reset request failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  // User details and role
  const firstName = session?.user?.firstName || "";
  const lastName = session?.user?.lastName || "";
  const userName = session?.user?.name || "";
  const userRole = session?.user?.userRole || "STANDARD_USER"; // Default to "STANDARD_USER"

  return {
    signIn,
    signOut,
    resetPassword,
    session,
    isAuthenticated: !!session, // true if authenticated
    isInitialized, // Provide the `isInitialized` state
    status,
    firstName,
    lastName,
    userName,
    userRole, // Provide the user role
  };
};

export default useAuth;
