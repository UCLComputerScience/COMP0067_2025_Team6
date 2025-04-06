import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { useState, useEffect } from "react";

const useAuth = () => {
  const { data: session, status } = useSession();
  const isInitialized = status !== "loading"; // Check if the session is initialized

  // Log session data to ensure it's populated
  console.log("Session Data:", session);

  const [firstName, setFirstName] = useState(session?.user?.firstName || "");
  const [lastName, setLastName] = useState(session?.user?.lastName || "");
  const [userName, setUserName] = useState(session?.user?.name || "");
  const [userRole, setUserRole] = useState(session?.user?.userRole || "STANDARD_USER");

  const refreshUserData = () => {
    const storedData = localStorage.getItem("personalInfo");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      if (parsed.firstName) setFirstName(parsed.firstName);
      if (parsed.lastName) setLastName(parsed.lastName);
      if (parsed.firstName && parsed.lastName) setUserName(`${parsed.firstName} ${parsed.lastName}`);
    }
  };

  useEffect(() => {
    refreshUserData(); // Load once when mounting

    const handleProfileUpdate = () => {
      console.log("Profile updated event received in useAuth");
      refreshUserData(); // Load again when "profileUpdated" event fires
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [session]); // Refresh if session changes


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
