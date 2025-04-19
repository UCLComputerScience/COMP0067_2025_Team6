"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "@emotion/styled";
import {
  AppBar,
  Box,
  Button,
  Grid,
  InputBase,
  Paper,
  TextField,
  Toolbar,
  Typography,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NextLink from "next/link";
const TopBar = styled(AppBar)`background-color: #00114a; box-shadow: none;`;
const Logo = styled.img`height: 40px; margin-right: 32px; object-fit: contain;`;
const NavButton = styled(Button)`color: white; margin: 0 8px;`;
const SearchWrapper = styled.div`
  position: relative;
  margin-left: auto;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  padding: 4px 8px;
  margin-right: 16px;
  display: flex;
  align-items: center;
`;
const SearchInput = styled(InputBase)`color: white; margin-left: 8px;`;

const LeftSection = styled(Box)`
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 48px;
  position: relative;
`;
const BackgroundOverlay = styled(Box)`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: -1;
`;
const LeftSectionImage = styled(Box)`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url("/sign_in_image.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.2;
`;
const ContentWrapper = styled(Box)`
  position: relative;
  margin-top: calc(50vh - 250px);
  z-index: 1;
  text-align: center;
`;
const RightSection = styled(Paper)`
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px;
`;

function ResetPasswordTokenPage({ params }: { params: { token: string } }) {
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
    <React.Fragment>
      <TopBar position="static">
        <Toolbar sx={{ padding: "0 16px" }}>
          <Logo src="/UCL_logo.jpg" alt="Logo" />
          <Box sx={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              component={NextLink}
              href="/auth/sign-in"
              sx={{ backgroundColor: "white", color: "black", mr: 1 }}
            >
              Sign In
            </Button>

            <Button
              variant="contained"
              component={NextLink}
              href="/auth/sign-up"
              color="primary"
              sx={{ color: "white" }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </TopBar>
      <Grid container>
        <Grid item xs={12} md={6}>
          <LeftSection>
            <LeftSectionImage />
            <BackgroundOverlay />
            <ContentWrapper>
              <Typography
                sx={{
                  fontFamily: "Roboto",
                  fontSize: "45px",
                  lineHeight: "52px",
                  fontWeight: 400,
                  mb: 2,
                }}
              >
                Create a new password
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  color: "rgba(0, 0, 0, 0.54)",
                }}
              >
                Set a secure password to complete your reset request.
              </Typography>
            </ContentWrapper>
          </LeftSection>
        </Grid>

        <Grid item xs={12} md={6}>
          <RightSection elevation={0}>
            <ContentWrapper>
              <Typography
                align="center"
                sx={{
                  fontFamily: "Inter",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "rgba(0, 0, 0, 0.87)",
                  mb: 2,
                }}
              >
                Enter new password
              </Typography>

              <form onSubmit={handleResetPassword}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

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

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Reset Password
                </Button>
              </form>
            </ContentWrapper>
          </RightSection>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ResetPasswordTokenPage;
