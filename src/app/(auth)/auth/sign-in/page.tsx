"use client";

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
  Paper,
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
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;
  background-size: cover;
  background-position: center;
`;

const RightSection = styled(Paper)`
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;
`;

function SignIn() {
  return (
    <React.Fragment>
      <TopBar position="static">
        <Toolbar>
          <Logo src="/logo.png" alt="Logo" />
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
            <Typography
              variant="display-medium"
              component="h1"
              align="center"
              sx={{
                fontWeight: 1,
                mb: 2,
              }}
            >
              Welcome!
            </Typography>
            <Typography
              variant="headline-small"
              component="p"
              align="center"
              sx={{
                maxWidth: "600px",
                margin: "0 auto",
                color: "rgba(0, 0, 0, 0.54)",
              }}
            >
              Experience real-time interaction with digital twin data through a
              seamless, centralized platform. Empowering researchers, industry
              partners, students, and staff to collaborate, analyze, and make
              data-driven decisions—anytime, anywhere.
            </Typography>
          </LeftSection>
        </Grid>
        <Grid item xs={12} md={6}>
          <RightSection elevation={0}>
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
          </RightSection>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default SignIn;
