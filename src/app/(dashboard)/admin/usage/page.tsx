"use client";

import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
// import withAuth from "@/lib/withAuth"; // Import the withAuth HOC

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Checkbox,
  Chip as MuiChip,
  Divider as MuiDivider,
  Grid2 as Grid,
  IconButton,
  Link,
  Paper as MuiPaper,
  Typography
} from "@mui/material";
import { green, orange, red } from "@mui/material/colors";
import {
  Add as AddIcon,
  Archive as ArchiveIcon,
  FilterList as FilterListIcon,
  RemoveRedEye as RemoveRedEyeIcon,
} from "@mui/icons-material";
import { spacing, SpacingProps } from "@mui/system";


import DoughnutChart from "@/components/pages/dashboard/usagehistory/DoughnutChart_UsageHistory";
// import StackedLineChart from "@/components/pages/dashboard/usagehistory/StackedLineChart_UsageHistory";
import StackedLineChart from "@/components/pages/dashboard/usagehistory/StackedLineChart_UsageHistory";


const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);


function Default() {
  const { t } = useTranslation();

  return (
    
    <React.Fragment>
      {/* welcome title */}
      <Grid justifyContent="space-between" container spacing={10}>
        <Grid>
          <Typography variant="h3" gutterBottom display="inline">
            Usage History
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NextLink} href="/">
              Dashboard
            </Link>
            <Link component={NextLink} href="/"> 
              Admin
            </Link>
            {/* not implemented the link */}
            <Typography>Usage History</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid>
          <div>
            <Button variant="contained" color="primary">
              <AddIcon />
              Edit Dashboard
            </Button>
          </div>
        </Grid>
      </Grid>
      <Divider my={6} />


      {/* page content: graphs of data */}
      <Grid container spacing={6}>

        {/* page content */}
        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <StackedLineChart />
        </Grid>

        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <DoughnutChart />
        </Grid>
      </Grid>

      {/* page content: graphs of data */}
      {/* <Grid container spacing={6}>

        <Grid
            size={{
              xs: 12,
              lg: 8,
            }}
          >
            <LineChart />
          </Grid>

      </Grid> */}

    </React.Fragment>
  );
}


function OrderList() {
  return (
    <React.Fragment>
      <Grid justifyContent="space-between" container spacing={10}>
        <Grid>
          <Typography variant="h3" gutterBottom display="inline">
            Usage History
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NextLink} href="/">
              Dashboard
            </Link>
            <Link component={NextLink} href="/"> 
              Admin
            </Link>
            {/* not implemented the link */}
            <Typography>Usage History</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid>
          <div>
            <Button variant="contained" color="primary">
              <AddIcon />
              Edit Dashboard
            </Button>
          </div>
        </Grid>
      </Grid>
      <Divider my={6} />
      <Grid container spacing={6}>


      </Grid>
    </React.Fragment>
  );
}
export default OrderList;
