import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]"; // Import your NextAuth options

// Helper function to check if the user is authenticated
const isAuthenticated = async (request: NextRequest) => {
  const session = await getServerSession(authOptions, request);
  return session;
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Define the public routes that don't require authentication
  const publicRoutes = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
  ];

  // If the user is trying to access a public route, allow access
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get the session to check if the user is authenticated
  const session = await isAuthenticated(request);

  // Admin page logic: check if user is authenticated and if they are an OWNER
  const isAdminPage = pathname.startsWith("/admin");
  if (isAdminPage) {
    if (!session) {
      // If not authenticated, redirect to the sign-in page
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
    if (session.user.role !== "OWNER") {
      // If authenticated but not an OWNER, redirect to an unauthorized page
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  } else {
    // For other protected pages, just check if the user is authenticated
    if (!session) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  // Allow the request to proceed if authentication/role checks pass
  return NextResponse.next();
}

// Configure the middleware to match all protected paths (admin, etc.)
export const config = {
  matcher: [
    "/dashboard/admin/*", // All admin pages
    "/dashboard/*", // Example of other protected paths
    "/profile/*", // Example of protected profile page
    // Add other paths as necessary (e.g., settings)
  ],
};
