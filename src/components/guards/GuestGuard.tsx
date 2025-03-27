"use client"; // Ensure this is a client-side component

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth"; // Your custom useAuth hook
import CircularProgress from "@mui/material/CircularProgress"; // Material UI Spinner

interface GuestGuardProps {
  children: React.ReactNode;
}

// For routes that can only be accessed by non-authenticated users
function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isInitialized } = useAuth(); // Using updated hook
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false); // Track if redirection is in progress

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      // Once initialized and authenticated, redirect to the dashboard
      setIsRedirecting(true); // Start redirection process
      router.push("/dashboard/lab1"); // Redirect user to the dashboard or other route
    }
  }, [isInitialized, isAuthenticated, router]);

  // While checking the auth status or redirecting, show a loading spinner
  if (!isInitialized || isRedirecting) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  // Only show children if the user is not authenticated
  return <>{children}</>;
}

export default GuestGuard;
