"use client";

import React from "react";
import { useSession } from "next-auth/react";

interface SessionUser {
  userRole?: string;
}

interface HideAuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const HideAuthGuard = ({
  children,
  requiredRoles = [],
}: HideAuthGuardProps) => {
  const { data: session, status } = useSession();
  const userRole = session?.user?.userRole;

  if (status === "loading") {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (
    requiredRoles.length > 0 &&
    (!userRole || !requiredRoles.includes(userRole))
  ) {
    return null;
  }

  return <>{children}</>;
};

export default HideAuthGuard;
