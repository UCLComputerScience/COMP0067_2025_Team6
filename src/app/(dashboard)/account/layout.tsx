import { ReactNode } from "react";
import AuthGuard from "@/components/guards/AuthGuard"; // Import your AuthGuard

export const metadata = {
  title: "Account",
};

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      {" "}
      {/* No role restriction, just need to be logged in */}
      {children}
    </AuthGuard>
  );
}
