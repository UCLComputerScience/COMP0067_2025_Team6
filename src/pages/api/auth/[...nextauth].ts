import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma"; // Prisma client

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

        // Check if user exists and password matches (hash your passwords in production)
        if (user && credentials.password === user.password) {
          // Return user object with necessary fields
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            organisation: user.organisation,
            avatar: user.avatar,
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
        token.lastName = user.lastName;
        token.organisation = user.organisation;
        token.avatar = user.avatar;
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

      return session;
    },
  },
});
