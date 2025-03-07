"use client";

import React, { useEffect, useState } from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation"; // Import useRouter for redirect
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react"; // Import useSession

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

  // Get session data using the useSession hook
  const { data: session, status } = useSession();
  const router = useRouter();

  // State for controlling loading or redirection state
  const [loading, setLoading] = useState(true);

  // Check if the user is authenticated and redirect if needed
  useEffect(() => {
    if (status === "unauthenticated") {
      setLoading(false); // Stop loading when we know the user is unauthenticated
      router.push("/auth/sign-in"); // Redirect to login page if not authenticated
    } else if (status === "authenticated") {
      setLoading(false); // Stop loading when user is authenticated
    }
  }, [status, router]);

  // Show a loading state or "Please log in" message while checking session
  if (loading) {
    return (
      <div>
        <Typography variant="h5" gutterBottom>
          {t("Please log in to view this page.")}
        </Typography>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Grid justifyContent="space-between" container spacing={6}>
        <Grid>
          <Typography variant="h3" gutterBottom>
            Lab 1
          </Typography>
          <Typography variant="subtitle1">
            {t("Welcome back")}, {session?.user?.firstName || "Stephen"}!{" "}
            {t("We've missed you")}.{" "}
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
