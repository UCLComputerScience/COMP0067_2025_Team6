import { JWT } from "next-auth/jwt"; // Import JWT type for token

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      firstName: string | null;
      lastName: string | null;
      organisation: string | null;
      avatar: string | null;
      resetToken: string | null;
      resetTokenExpiry: Date | null;
      userRole: "ADMIN" | "SUPER_USER" | "STANDARD_USER" | "TEMPORARY_USER"; // Corrected camelCase here
      status: "ACTIVE" | "INACTIVE";
    };
  }

  // Extend JWT to include custom fields
  interface JWT {
    id: number;
    email: string;
    firstName: string | null;
    lastName: string | null;
    organisation: string | null;
    avatar: string | null;
    resetToken: string | null;
    resetTokenExpiry: Date | null;
    userRole: "ADMIN" | "SUPER_USER" | "STANDARD_USER" | "TEMPORARY_USER"; // Corrected camelCase here
    status: "ACTIVE" | "INACTIVE";
  }
}
