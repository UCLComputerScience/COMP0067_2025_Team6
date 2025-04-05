"use client";
import NextLink from "next/link";

import React from "react";
import styled from "@emotion/styled";
import {
  AppBar,
  Box,
  Button,
  Grid,
  InputBase,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import ResetPasswordForm from "components/auth/ResetPassword"; 

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

export default function ResetPasswordPage() {
  return (
    <React.Fragment>
      <TopBar position="static">
        <Toolbar sx={{ padding: "0 16px" }}>
          <Logo src="/UCL_logo.jpg" alt="Logo" />
          <NavButton>Home</NavButton>
          <NavButton>About</NavButton>
          <NavButton>Resources</NavButton>
          <NavButton>Contact</NavButton>
          <SearchWrapper>
            <SearchIcon sx={{ color: "white" }} />
            <SearchInput placeholder="Search..." />
          </SearchWrapper>
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
            sx={{ color: "white", mr: 1 }}
          >
            Sign Up
          </Button>
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
                Forgot your password?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  color: "rgba(0, 0, 0, 0.54)",
                }}
              >
                Enter your email to receive a reset link and get back into your
                account.
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
                Reset your password
              </Typography>
              <ResetPasswordForm />
            </ContentWrapper>
          </RightSection>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
