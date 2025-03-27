import { ReactNode } from "react";
import AuthGuard from "@/components/guards/AuthGuard"; // Import your AuthGuard

export const metadata = {
  title: "Reports",
};

export default function ReportsLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      {" "}
      {/* Allow access to all logged-in users */}
      {children}
    </AuthGuard>
  );
}
