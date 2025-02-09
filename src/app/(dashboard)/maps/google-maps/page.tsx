"use client";

import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";

import {
  Grid2 as Grid,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";

import Default from "@/components/pages/maps/google-maps/Default";
import Hybrid from "@/components/pages/maps/google-maps/Hybrid";
import LightStyle from "@/components/pages/maps/google-maps/LightStyle";
import DarkStyle from "@/components/pages/maps/google-maps/DarkStyle";
import Streetview from "@/components/pages/maps/google-maps/Streetview";
import Markers from "@/components/pages/maps/google-maps/Markers";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Typography = styled(MuiTypography)(spacing);

function GoogleMaps() {
  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom display="inline">
        Google Maps
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NextLink} href="/">
          Dashboard
        </Link>
        <Link component={NextLink} href="/">
          Maps
        </Link>
        <Typography>Google Maps</Typography>
      </Breadcrumbs>
      <Divider my={6} />
      <Grid container spacing={6}>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Default />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Hybrid />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <LightStyle />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <DarkStyle />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Streetview />
        </Grid>
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Markers />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default GoogleMaps;
