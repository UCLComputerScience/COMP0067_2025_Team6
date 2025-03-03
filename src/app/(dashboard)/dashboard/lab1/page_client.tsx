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
import { DeviceProps } from "@/types/devices";

import Actions from "@/components/pages/dashboard/default/Actions";
import ActionsAdd from "@/components/pages/dashboard/default/ActionsAdd";
import ActionsFilter from "@/components/pages/dashboard/default/ActionsFilter";
import BarChart from "@/components/pages/dashboard/default/BarChart";
import LineChart from "@/components/pages/dashboard/default/LineChart";
import DoughnutChart from "@/components/pages/dashboard/default/DoughnutChart";
import Stats from "@/components/pages/dashboard/default/Stats";
import Table from "@/components/pages/dashboard/default/Table";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const Lab1 = () => {
  const [selectedOption, setSelectedOption] = React.useState<string>("?days=365");
  const [data, setData] = React.useState<DeviceProps>({} as DeviceProps);  // Data fetched from the API

  // Function to fetch data based on the selected category
  const fetchData = async (selectedOption: string) => {
      try {
          const response = await fetch(`https://api.thingspeak.com/channels/2606541/feeds.json${selectedOption}`);
          const result = await response.json();
          setData(result);
      } catch (error) {
          console.error("Error fetching data:", error);
      }
    };

  const { t } = useTranslation();
  // const channel = data["channel"]["name"]
  // const field1 = data["channel"]["field1"]
  // const field2 = data["channel"]["field2"]
  // const field3 = data["channel"]["field3"]
  // const temperature: number[] = data["feeds"].map((feed: { created_at: string; entry_id: number; field1: string; field2: string; field3: string; }) => +feed["field1"]);
  // const humidity: number[] = data["feeds"].map((feed: { created_at: string; entry_id: number; field1: string; field2: string; field3: string; }) => +feed["field2"]);
  // const pressure: number[] = data["feeds"].map((feed: { created_at: string; entry_id: number; field1: string; field2: string; field3: string; }) => +feed["field3"]);
    // Safely accessing the data with optional chaining
  const channel = data?.channel?.name || "N/A";
  const field1 = data?.channel?.field1 || "N/A";
  const field2 = data?.channel?.field2 || "N/A";
  const field3 = data?.channel?.field3 || "N/A";

  // Mapping feeds for temperature, humidity, and pressure
  const rdata = data?.feeds || [];
  const temperature: number[] = rdata.map((feed) => +feed.field1) || [];
  const humidity: number[] = rdata.map((feed) => +feed.field2) || [];
  const pressure: number[] = rdata.map((feed) => +feed.field3) || [];

  type Feed = {
    created_at: string;
    entry_id: number;
    field1?: string;
    field2?: string;
    field3?: string;
  };
  
  type ApiResponse = {
    channel: {
      id: number;
      name: string;
      field1?: string;
      field2?: string;
      field3?: string;
    };
    feeds: Feed[];
  };
  
  function extractTimestamps(data: ApiResponse): string[] {
    return rdata.map(feed => feed.created_at);
  }
  
  // Example usage
  const DeviceLabels = extractTimestamps(data);

  // UseEffect to fetch data whenever the category state changes
  React.useEffect(() => {
    fetchData(selectedOption);
  }, [selectedOption]);  // Dependency array ensures the fetch runs only when category changes


  return (
    <React.Fragment>
      <Grid justifyContent="space-between" container spacing={6}>
        <Grid>
          <Typography variant="h3" gutterBottom>
            Lab 1
          </Typography>
          <Typography variant="subtitle1">
            {t("Welcome back")}, Stephen! {t("We've missed you")}.{" "}
            <span role="img" aria-label="Waving Hand Sign">
              👋
            </span>
          </Typography>
        </Grid>

        <Grid container spacing={3}>
          <Grid>
            <Actions selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
          </Grid>
          <Grid>
            <ActionsFilter selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
          </Grid>
          <Grid>
            <ActionsAdd selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
          </Grid>
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
          <Stats
            title="Pending Orders"
            amount="45"
            chip="Yearly"
            percentagetext="-9%"
            percentagecolor={red[500]}
            illustration="/static/img/illustrations/waiting.png"
          />
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid
          size={{
            xs: 12,
            lg: 6,
          }}
        >
          <DoughnutChart />
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
      <Grid container spacing={6}>
        <Grid
          size={{
            xs: 12,
            lg: 12,
          }}
        > 
          <LineChart channel={channel} field={field1} DeviceData={temperature} DeviceLabels={DeviceLabels} />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 12,
          }}
        >
          <LineChart channel={channel} field={field2} DeviceData={humidity} DeviceLabels={DeviceLabels} />
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid
          size={{
            xs: 12,
            lg: 12,
          }}
        > 
          <LineChart channel={channel} field={field3} DeviceData={pressure} DeviceLabels={DeviceLabels} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Lab1;
