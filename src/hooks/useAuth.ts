import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { useState, useEffect } from "react";

const useAuth = () => {
  const { data: session, status } = useSession();
  const isInitialized = status !== "loading";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("STANDARD_USER");

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
    if (session?.user) {
      setFirstName(session.user.firstName || "");
      setLastName(session.user.lastName || "");
      setUserName(session.user.name || "");
      setUserRole(session.user.userRole || "STANDARD_USER");
    }
  }, [session]);

  useEffect(() => {
    refreshUserData();

    const handleProfileUpdate = () => {
      refreshUserData();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await nextAuthSignIn("credentials", {
      redirect: false,
      email,
      password,
    });
  
    if (result?.error) {
      console.error("Sign-in error:", result.error);
      throw new Error(result.error);
    }
  
    localStorage.removeItem("personalInfo");
    localStorage.removeItem("userSkills");
    localStorage.removeItem("userDescription");
  
    return result;
  };
  

  const signOut = async () => {
    localStorage.removeItem("personalInfo");
    localStorage.removeItem("userSkills");
    localStorage.removeItem("userDescription");
  
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
    isAuthenticated: !!session,
    isInitialized,
    status,
    firstName,
    lastName,
    userName,
    userRole,
  };
};

export default useAuth;
