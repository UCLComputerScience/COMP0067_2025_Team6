"use client";

import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";

import {
  Paper,
  Typography,
  Box,
  Grid,
  AppBar,
  Toolbar,
  Button,
  InputBase,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import SignUpComponent from "@/components/auth/SignUp";

const TopBar = styled(AppBar)`
  background-color: #00114a;
  box-shadow: none; // Remove any extra shadows or borders
  padding-top: 8px; // Adjust top padding to ensure it fits properly
  padding-bottom: 8px; // Adjust bottom padding
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


function SignUp() {
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
                  letterSpacing: "0px",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Get Started!
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
                Connect your lab to its Digital Twin and perform analytics
                effortlessly with our platform.
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
                Sign up to create your account
              </Typography>
              <SignUpComponent />
            </ContentWrapper>
          </RightSection>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default SignUp;