"use client"; // Mark this as a Client Component

import React from "react";
import AuthGuard from "@/components/guards/AuthGuard"; // Corrected path
import { usePathname } from "next/navigation"; // Import to get the current path

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const pathname = usePathname(); // Get the current route

  // Add "STANDARD_USER" role for the alerts page
  const requiredRoles =
    pathname === "/admin/alerts"
      ? ["ADMIN", "SUPER_USER", "STANDARD_USER"]
      : ["ADMIN", "SUPER_USER"];

  return (
    <AuthGuard requiredRoles={requiredRoles}>
      <div style={{ padding: "20px" }}>
        <h1>Admin Panel</h1>
        <nav> {/* Sidebar or Admin Navigation can go here */} </nav>
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
};

export default AdminLayout;
