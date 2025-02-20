"use client";

import React from "react";

import { Typography } from "@mui/material";

import SignUpComponent from "@/components/auth/SignUp";

function SignUp() {
  return (
    <React.Fragment>
      <Typography component="h1" variant="h3" align="center" gutterBottom>
        Get started
      </Typography>
      <Typography component="h2" variant="subtitle1" align="center">
        Connect your lab to its Digital Twin and perform analytics
      </Typography>

      <SignUpComponent />
    </React.Fragment>
  );
}

export default SignUp;
