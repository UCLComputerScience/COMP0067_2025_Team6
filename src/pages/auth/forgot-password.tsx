"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Typography, Alert } from "@mui/material";

function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setSuccess("A password reset link has been sent to your email.");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleResetRequest}>
      <Typography variant="h5">Reset Password</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TextField
        label="Email"
        type="email"
        required
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Send Reset Link
      </Button>
    </form>
  );
}

export default ForgotPasswordPage;
