"use client"; // Ensure this is a client-side component

import { ReactNode } from "react";
import GuestGuard from "@/components/guards/GuestGuard"; // Import GuestGuard to protect sign-in/signup
import Auth from "@/layouts/Auth"; // Import Auth layout for sign-in/sign-up pages
import Head from "next/head"; // Import next/head to handle metadata dynamically

// Define metadata directly in the layout
const metadata = {
  title: {
    template: "%s | Digital Twin Labs",
    default: "Digital Twin Labs",
  },
  description:
    "A professional package that comes with plenty of UI components, forms, tables, charts, dashboards, pages and svg icons. Each one is fully customizable, responsive and easy to use.",
  keywords: [
    "mira",
    "mui",
    "material app",
    "react",
    "material",
    "kit",
    "dashboard",
    "application",
    "admin",
    "template",
    "theme",
  ],
  authors: [{ name: "Bootlab", url: "https://bootlab.io/" }],
  metadataBase: new URL("https://mira.bootlab.io"),
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Dynamically manage the metadata */}
      <Head>
        <title>{metadata.title.template}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        {/* Add more meta tags as needed */}
      </Head>

      {/* Protect sign-in and sign-up pages with GuestGuard */}
      <GuestGuard>
        <Auth>{children}</Auth>
      </GuestGuard>
    </>
  );
}
