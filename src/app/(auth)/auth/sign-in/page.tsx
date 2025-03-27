"use client";

import { Paper } from "@mui/material";
import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";

import {
  Avatar,
  Typography,
  AppBar,
  Toolbar,
  Button,
  InputBase,
  Box,
  Container,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import SignInComponent from "@/components/auth/SignIn";

const BigAvatar = styled(Avatar)`
  width: 92px;
  height: 92px;
  text-align: center;
  margin: 0 auto ${(props) => props.theme.spacing(5)};
`;

const TopBar = styled(AppBar)`
  background-color: #00114a;
`;

const Logo = styled.img`
  height: 40px;
  margin-right: 32px;
  object-fit: contain;
`;

const NavButton = styled(Button)`
  color: white;
  margin: 0 8px;
`;

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

const SearchInput = styled(InputBase)`
  color: white;
  margin-left: 8px;
`;

const SignUpButton = styled(Button)`
  background-color: #1e88e5;
  color: white;
  &:hover {
    background-color: #1976d2;
  }
`;

const LeftSection = styled(Box)`
  min-height: calc(100vh - 64px); // Adjust to full height minus the top bar
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 48px;
  position: relative;
`;

const BackgroundOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(
    0,
    0,
    0,
    0.8
  ); // Dark overlay to make the text stand out more
  z-index: -1; // Place it behind the text
`;

const LeftSectionImage = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("/sign_in_image.jpg"); // Path to your image
  background-size: cover; // Cover the entire section
  background-position: center; // Center the image
  background-repeat: no-repeat; // Do not repeat the image
  opacity: 0.2; // 20% opacity
`;

const ContentWrapper = styled(Box)`
  position: relative; // Ensure text stays above the background
  margin-top: calc(50vh - 250px);
  z-index: 1; // Ensure the text stays above the background image
  text-align: center;
`;

const RightSection = styled(Paper)`
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px;
`;

function SignIn() {
  return (
    <React.Fragment>
      <TopBar position="static">
        <Toolbar>
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
            sx={{ backgroundColor: "white", color: "black", mr: 1 }}
          >
            Sign In
          </Button>
          <SignUpButton variant="contained">Sign Up</SignUpButton>
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
                  letterSpacing: "0px",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Welcome!
              </Typography>
              <Typography
                variant="h6"
                component="p"
                align="center"
                sx={{
                  maxWidth: "600px",
                  margin: "0 auto",
                  color: "rgba(0, 0, 0, 0.54)",
                }}
              >
                Experience real-time interaction with digital twin data through
                a seamless, centralized platform. Empowering researchers,
                industry partners, students, and staff to collaborate, analyze,
                and make data-driven decisions—anytime, anywhere.
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
                Sign in to your account
              </Typography>
              <SignInComponent />
            </ContentWrapper>
          </RightSection>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default SignIn;
