"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/forgot-password");
  }, []);

  return <p>Redirecting...</p>;
}
