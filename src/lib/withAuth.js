import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// HOC to protect pages based on authentication and roles
const withAuth = (WrappedComponent, requiredRoles = []) => {
  const AuthHOC = (props) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
      if (status === "loading") return;

      if (!session) {
        router.push("/auth/sign-in");
        return;
      }

      // Ensure requiredRoles is an array and check the user's role
      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes(session?.user?.user_role) // Updated field name
      ) {
        router.push("/unauthorized");
      }
    }, [session, status, router, requiredRoles]);

    if (status === "loading" || !session) {
      return null;
    }

    // If no role is required, allow access
    if (
      requiredRoles.length === 0 ||
      requiredRoles.includes(session?.user?.user_role) // Updated field name
    ) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  return AuthHOC;
};

export default withAuth;
