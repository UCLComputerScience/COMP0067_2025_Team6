import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;  // ✅ Add custom field
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    firstName: string;  // ✅ Add custom field
  }
}