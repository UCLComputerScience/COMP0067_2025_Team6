import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CircularProgress from "@mui/material/CircularProgress"; // Import a loading spinner from MUI

const withAuth = (WrappedComponent, requiredRoles = []) => {
  const AuthHOC = (props) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
      if (status === "loading") return; // Wait until session is loaded

      if (!session) {
        router.push("/auth/sign-in"); // Redirect if no session
        return;
      }

      // Ensure the user has one of the required roles
      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes(session?.user?.user_role)
      ) {
        router.push("/unauthorized"); // Redirect if role is unauthorized
      }
    }, [session, status, router, requiredRoles]);

    if (status === "loading") {
      // You can replace this with a custom loading indicator
      return (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <CircularProgress />
        </div>
      );
    }

    // If no session or unauthorized, prevent rendering the wrapped component
    if (!session) {
      return null;
    }

    // If required roles are met or not provided, render the wrapped component
    if (
      requiredRoles.length === 0 ||
      requiredRoles.includes(session?.user?.user_role)
    ) {
      return <WrappedComponent {...props} />;
    }

    // Return null if user doesn't have the required role
    return null;
  };

  return AuthHOC;
};

export default withAuth;
