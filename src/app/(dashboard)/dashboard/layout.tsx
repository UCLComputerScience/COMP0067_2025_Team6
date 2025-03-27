import { ReactNode } from "react";
import AuthGuard from "@/components/guards/AuthGuard"; // Import your AuthGuard

export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      {" "}
      {/* Allow access to all logged-in users */}
      {children}
    </AuthGuard>
  );
}
