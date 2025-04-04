"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  Typography as MuiTypography,
  TextField,
  Alert,
  Grid,
} from "@mui/material";
import NextLink from "next/link";

const Breadcrumbs = styled(MuiBreadcrumbs)`margin-bottom: 16px;`;
const Button = styled(MuiButton)`margin-right: 8px;`;
const Card = styled(MuiCard)`margin-bottom: 24px;`;
const Divider = styled(MuiDivider)`margin: 24px 0;`;
const Typography = styled(MuiTypography)``;

const ChangePasswordPage = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate passwords
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Fetch the session and get the JWT token
    const tokenResponse = await fetch("/api/auth/session");
    const session = await tokenResponse.json();

    if (!session?.user?.email) {
      setError("User not logged in.");
      return;
    }

    try {
      const res = await fetch("/api/auth/changePassword", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`, // Send the token here
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage("Password changed successfully! Redirecting...");
      setTimeout(() => router.push("/account/profile"), 2000); // Redirect after success
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Typography variant="h4">Change Password</Typography>
      <Breadcrumbs>
        <NextLink href="/">Home</NextLink>
        <NextLink href="/account/profile">Personal Profile</NextLink>
        <Typography color="textPrimary">Change Password</Typography>
      </Breadcrumbs>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" gap={3} mb={3}>
            <Box flex={1}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Update Your Password</Typography>
                  <Divider />

                  {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
                  {message && <Alert severity="success" sx={{ my: 2 }}>{message}</Alert>}

                  <Box mt={3}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          label="New Password"
                          type="password"
                          fullWidth
                          variant="outlined"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Confirm New Password"
                          type="password"
                          fullWidth
                          variant="outlined"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Box mt={3} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handlePasswordChange}>
                      Change Password
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default ChangePasswordPage;
