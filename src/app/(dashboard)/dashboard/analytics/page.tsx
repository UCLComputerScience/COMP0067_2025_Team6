"use client";

import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
// import withAuth from "@/lib/withAuth"; // Import the withAuth HOC
import { useTranslation } from "react-i18next";

import {
  Grid2 as Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@mui/material";
import { green, red } from "@mui/material/colors";
import { spacing } from "@mui/system";

import Actions from "@/components/pages/dashboard/analytics/Actions";
import BarChart from "@/components/pages/dashboard/analytics/BarChart";
import DoughnutChart from "@/components/pages/dashboard/analytics/DoughnutChart";
import LanguagesTable from "@/components/pages/dashboard/analytics/LanguagesTable";
import Stats from "@/components/pages/dashboard/analytics/Stats";
import Table from "@/components/pages/dashboard/analytics/Table";
import WorldMap from "@/components/pages/dashboard/analytics/WorldMap";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Analytics() {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid justifyContent="space-between" container spacing={6}>
        <Grid>
          <Typography variant="h3" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="subtitle1">
            {t("Welcome back")}, Lucy! {t("We've missed you")}.{" "}
            <span role="img" aria-label="Waving Hand Sign">
              👋
            </span>
          </Typography>
        </Grid>

        <Grid>
          <Actions />
        </Grid>
      </Grid>
      <Divider my={6} />
      <Grid container spacing={6}>
        <Grid
          size={{
            xs: 12,
            lg: 5,
          }}
        >
          <React.Fragment>
            <Grid container spacing={6}>
              <Grid
                size={{
                  xs: 12,
                  sm: 12,
                  md: 6,
                }}
              >
                <Stats
                  title="Visitors"
                  amount="24.532"
                  chip="Today"
                  percentagetext="+14%"
                  percentagecolor={green[500]}
                  illustration="/static/img/illustrations/working.png"
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 12,
                  md: 6,
                }}
              >
                <Stats
                  title="Activity"
                  amount="63.200"
                  chip="Annual"
                  percentagetext="-12%"
                  percentagecolor={red[500]}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 12,
                  md: 6,
                }}
              >
                <Stats
                  title="Real-Time"
                  amount="1.320"
                  chip="Monthly"
                  percentagetext="-18%"
                  percentagecolor={red[500]}
                />
              </Grid>
              <Grid
                size={{
                  xs: 12,
                  sm: 12,
                  md: 6,
                }}
              >
                <Stats
                  title="Bounce"
                  amount="12.364"
                  chip="Yearly"
                  percentagetext="+27%"
                  percentagecolor={green[500]}
                />
              </Grid>
            </Grid>
          </React.Fragment>
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 7,
          }}
        >
          <BarChart />
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <WorldMap />
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
      <Grid container spacing={6}>
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <LanguagesTable />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <Table />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Analytics;
