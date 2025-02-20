"use client";

import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";

import { useTranslation } from "react-i18next";

import {
  Grid2 as Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { green, red } from "@mui/material/colors";

import Actions from "@/components/pages/dashboard/default/Actions";
import BarChart from "@/components/pages/dashboard/default/BarChart";
import LineChart from "@/components/pages/dashboard/default/LineChart";
import DoughnutChart from "@/components/pages/dashboard/default/DoughnutChart";
import Stats from "@/components/pages/dashboard/default/Stats";
import Table from "@/components/pages/dashboard/default/Table";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Default() {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid justifyContent="space-between" container spacing={6}>
        <Grid>
          <Typography variant="h3" gutterBottom>
            Lab 3
          </Typography>
          <Typography variant="subtitle1">
            {t("Welcome back")}, Stephen! {t("We've missed you")}.{" "}
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
            sm: 12,
            md: 6,
            lg: 3,
            xl: "grow",
          }}
        >
          <Stats
            title="Average Temperature"
            amount="41 C"
            chip="Today"
            percentagetext="+26%"
            percentagecolor={green[500]}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 12,
            md: 6,
            lg: 3,
            xl: "grow",
          }}
        >
          <Stats
            title="Average Pressure"
            amount="1.1 bar"
            chip="Today"
            percentagetext="-14%"
            percentagecolor={red[500]}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 12,
            md: 6,
            lg: 3,
            xl: "grow",
          }}
        >
          <Stats
            title="Average Humidity"
            amount="70%"
            chip="Today"
            percentagetext="+18%"
            percentagecolor={green[500]}
          />
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 12,
            md: 6,
            lg: 3,
            xl: "grow",
          }}
        >
          {/* <Stats
            title="Pending Orders"
            amount="45"
            chip="Yearly"
            percentagetext="-9%"
            percentagecolor={red[500]}
            illustration="/static/img/illustrations/waiting.png"
          /> */}
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid
          size={{
            xs: 12,
            lg: 6,
          }}
        >
          <LineChart />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6,
          }}
        >
          <DoughnutChart />
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid
          size={{
            xs: 12,
            lg: 6,
          }}
        >
          <LineChart />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6,
          }}
        >
          <Table />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Default;
