"use client";

import React from "react";
import styled from "@emotion/styled";

import { CssBaseline, Paper } from "@mui/material";

import Logo from "@/vendor/logo.svg";

import Settings from "@/components/Settings";
import GlobalStyle from "@/components/GlobalStyle";

interface AuthType {
  children?: React.ReactNode;
}

const Root = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-grow: 1;
`;

// const Brand = styled(Logo)`
//   fill: ${(props) => props.theme.palette.primary.main};
//   width: 64px;
//   height: 64px;
//   margin-bottom: 32px;
// `;

const Wrapper = styled(Paper)`
  width: 100vw; /* Full viewport width */
  height: 100vh; /* Full viewport height */
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers children horizontally */
  justify-content: center; /* Centers children vertically */
  padding: 0 !important; /* Remove any padding */
  margin: 0; /* Remove any margin */
  box-shadow: none; /* Removes any unwanted box shadow */
  border-radius: 0; /* Ensures no rounded edges */

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: 0 !important;
  }
`;
const Auth: React.FC<AuthType> = ({ children }) => {
  return (
    <Root>
      <CssBaseline />
      <GlobalStyle />
      {/* <Brand /> */}
      <Wrapper>{children}</Wrapper>
      {/* <Settings /> */}
    </Root>
  );
};

export default Auth;
