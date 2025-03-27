"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Typography, Alert } from "@mui/material";

function ResetPasswordPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  const { token } = params;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage("Password reset successfully! Redirecting...");
      setTimeout(() => router.push("/auth/sign-in"), 2000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleResetPassword}>
      <Typography variant="h5">Enter New Password</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {message && <Alert severity="success">{message}</Alert>}
      <TextField
        label="New Password"
        type="password"
        required
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Confirm Password"
        type="password"
        required
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Reset Password
      </Button>
    </form>
  );
}

export default ResetPasswordPage;
