"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const AuthGuard = ({ children, requiredRoles = [] }: AuthGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Wait for session to finish loading
  const userRole = session?.user?.userRole;

  console.log("AuthGuard - Session Data:", session);
  console.log("AuthGuard - User Role:", userRole);
  console.log("AuthGuard - Required Roles:", requiredRoles);

  useEffect(() => {
    console.log("AuthGuard Debug - Status:", status);
    console.log("AuthGuard Debug - Session:", session);
    console.log("AuthGuard Debug - User Role:", userRole);
    console.log("AuthGuard Debug - Required Roles:", requiredRoles);

    if (status === "loading") return; // Wait for session to load

    if (status === "unauthenticated") {
      console.log("Redirecting to sign-in...");
      router.replace("/auth/sign-in"); // Redirect guests to sign-in page
    } else if (status === "authenticated") {
      if (requiredRoles.length > 0 && !requiredRoles.includes(userRole)) {
        console.log("User role does not match required roles. Redirecting...");
        router.replace("/unauthorized"); // Redirect if role is incorrect
      } else {
        setLoading(false); // Allow access if role is valid
      }
    }
  }, [status, userRole, requiredRoles, router]);

  if (status === "loading" || loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "20px" }}
      >
        <CircularProgress />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
