import { ReactNode } from "react";
import AuthGuard from "@/components/guards/AuthGuard"; // Import your AuthGuard

export const metadata = {
  title: "Manage Access",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requiredRoles={["ADMIN"]}>
      {" "}
      {/* Restrict to only Admin */}
      {children}
    </AuthGuard>
  );
}
