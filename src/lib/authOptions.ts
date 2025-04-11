import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma"; 

enum Role {
  STANDARD_USER = "STANDARD_USER",
  ADMIN = "ADMIN",
  SUPER_USER = "SUPER_USER",
  TEMPORARY_USER = "TEMPORARY_USER",
}

interface User {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  organisation: string | null;
  avatar: string | null;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  userRole: Role;
  status: "ACTIVE" | "INACTIVE";
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && credentials.password === user.password) {
          if (user.status !== "ACTIVE") {
            return null;
          }

          // Log the login event into UsageHistory table
          await prisma.usageHistory.create({
            data: {
              timestamp: new Date().toISOString(),
              userEmail: user.email, // Use the user's email to reference the user
              action: "Logged in", // Action description
              metadata: {}, // Optional: You can store additional info here if needed
            },
          });
          
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
        return null;
      },
    }),
  ],

  pages: {
    signIn: "/auth/sign-in",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
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
      return token;
    },

    async session({ session, token }) {
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
};
