import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma"; // Prisma client

// Define UserRole as an enum type based on your Prisma schema
enum Role {
  STANDARD_USER = "STANDARD_USER",
  ADMIN = "ADMIN",
  SUPER_USER = "SUPER_USER",
  TEMPORARY_USER = "TEMPORARY_USER",
}

interface User {
  id: number; // Prisma returns an ID as a number, not a string
  email: string;
  firstName: string | null;
  lastName: string | null;
  organisation: string | null;
  avatar: string | null;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  userRole: Role; // Define the role type as an enum
  status: "ACTIVE" | "INACTIVE"; // Status from your `UserStatus` enum
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Check if email and password are provided
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Fetch user from the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check if user exists and password matches (hash passwords in production)
        if (user && credentials.password === user.password) {
          // Check if the user's status is "ACTIVE"
          if (user.status !== "ACTIVE") {
            return null; // User is inactive, return null and prevent login
          }
          // Return user object with necessary fields
          return {
            id: user.id.toString(),
            email: user.email,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            organisation: user.organisation || "",
            avatar: user.avatar || "",
            userRole: user.userRole,
            status: user.status,
          };
        }

        return null; // Return null if credentials are incorrect
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in", // Custom login page
  },
  session: {
    strategy: "jwt", // Using JWT for session management
  },

  callbacks: {
    async jwt({ token, user }) {
      // If user data exists, add it to the JWT token
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = "lastName" in user ? user.lastName : null;
        token.organisation = "organisation" in user ? user.organisation : null;
        token.avatar = "avatar" in user ? user.avatar : null;
        if ("userRole" in user) {
          token.userRole = user.userRole;
        }
        if ("status" in user) {
          token.status = user.status;
        }
      }
      return token; // Return the token with added information
    },

    async session({ session, token }) {
      // Add user details from JWT token to the session
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.organisation = token.organisation;
      session.user.avatar = token.avatar;
      session.user.userRole = token.userRole;
      session.user.status = token.status;
      return session;
    },
  },
});
