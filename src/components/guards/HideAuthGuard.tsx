"use client";

import React from "react";
import { useSession } from "next-auth/react";

interface HideAuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const HideAuthGuard = ({ children, requiredRoles = [] }: HideAuthGuardProps) => {
  const { data: session, status } = useSession();
  const userRole = session?.user?.userRole;

  console.log("HideAuthGuard - Session Data:", session);
  console.log("HideAuthGuard - User Role:", userRole);
  console.log("HideAuthGuard - Required Roles:", requiredRoles);

  // If session is still loading, return null to avoid flashing content
  if (status === "loading") {
    return null;
  }

  // If unauthenticated or role doesn't match, hide the children (return null)
  if (status === "unauthenticated" || (requiredRoles.length > 0 && !requiredRoles.includes(userRole))) {
    console.log("Hiding component - User not authenticated or role insufficient");
    return null;
  }

  // If authenticated and role matches, show the children
  return <>{children}</>;
};

export default HideAuthGuard;