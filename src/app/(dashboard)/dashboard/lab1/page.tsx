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
import { DeviceProps, ChannelProps, FeedProps, FeedPropsDb } from "@/types/devices";

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
  const [selectedOption, setSelectedOption] = React.useState<string>("");
  // const [data, setData] = React.useState<DeviceProps>({} as DeviceProps);  // Data fetched from the API
  // const [channel_db, setChannel_db] = React.useState<ChannelProps>({} as ChannelProps);  // Channel data from db
  // const [feeds_db, setFeeds_db] = React.useState<FeedPropsDb[]>([]);  // Feeds data from db
  const [apikeys, setApikeys] = React.useState<string[]>([]);  // Apikeys data from db
  const [apidata, setApidata] = React.useState<DeviceProps[]>([]);  // Data fetched from the API
  const [data, setData] = React.useState<string>("");

  // Function to fetch channel data from the db

  // React.useEffect(() => {
  //   async function fetchChannels() {
  //     try {
  //       const response = await fetch("/api/channel", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       setChannel_db(data);
  //     } catch (error) {
  //       console.error("Error fetching channels:", error);
  //     }
  //   }

  //   fetchChannels();
  // }, []);

  // Function to fetch feed data from the db

  // React.useEffect(() => {
  //   async function fetchFeeds() {
  //     try {
  //       const response = await fetch("/api/feed", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       const data = await response.json();

  //       setFeeds_db(data);
  //     } catch (error) {
  //       console.error("Error fetching feeds:", error);
  //     }
  //   }

  //   fetchFeeds();
  // }, []);

  // Function to fetch apikeys data from the db

  React.useEffect(() => {
    async function fetchApikeys() {
      try {
        const response = await fetch("/api/apikeys_get", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const apiArray: string[] = data.map((item: { api: string }) => item.api); // Extract only the "api" values

        setApikeys(apiArray);
      } catch (error) {
        console.error("Error fetching apikeys:", error);
      }
    }

    fetchApikeys();
  }, [data]);

  React.useEffect(() => {
    console.log(apidata); // This will log the updated value of apikeys whenever it changes
  }, [apidata]); // This effect runs every time apikeys changes

  // Function to fetch data based on the selected category
  // const fetchData = async (selectedOption: string) => {
  //     try {
  //         const response = await fetch(`https://api.thingspeak.com/channels/2606541/feeds.json${selectedOption}`);
  //         const result = await response.json();
  //         setData(result);
  //     } catch (error) {
  //         console.error("Error fetching data:", error);
  //     }
  //   };

  // Function to fetch data based on the selected category and apikey
  const fetchDataFromApi = async (selectedOption: string, apikey: string) => {
    try {
        const url = selectedOption ? `${apikey}` + `${selectedOption}` : apikey;
        // const url = `${apikey}`;
        const response = await fetch(url);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // Return null if the fetch fails
    }
  };

  useEffect(() => {    
    const fetchAllData = async () => {
      const results = await Promise.all(apikeys.map((key) => fetchDataFromApi(selectedOption, key)));
      setApidata(results.filter(Boolean)); // Remove null values from failed fetches
    };

    fetchAllData();
  }, [selectedOption, apikeys]);

  const { t } = useTranslation();

  // Safely accessing the data with optional chaining
  // const channel_db_name = channel_db[0]?.name || "N/A";
  // const field1_db = channel_db[0]?.field1 || "N/A";
  // const field2_db = channel_db[0]?.field2 || "N/A";
  // const field3_db = channel_db[0]?.field3 || "N/A";

  // // Mapping feeds for temperature, humidity, and pressure
  // const temperature_db: number[] = feeds_db.map((feed) => +feed.field1) || [];
  // const humidity_db: number[] = feeds_db.map((feed) => +feed.field2) || [];
  // const pressure_db: number[] = feeds_db.map((feed) => +feed.field3) || [];

  // // Safely accessing the data with optional chaining
  // const channel = data?.channel?.name || "N/A";
  // const field1 = data?.channel?.field1 || "N/A";
  // const field2 = data?.channel?.field2 || "N/A";
  // const field3 = data?.channel?.field3 || "N/A";

  // // Mapping feeds for temperature, humidity, and pressure
  // const rdata = data?.feeds || [];
  // const temperature: number[] = rdata.map((feed) => +feed.field1) || [];
  // const humidity: number[] = rdata.map((feed) => +feed.field2) || [];
  // const pressure: number[] = rdata.map((feed) => +feed.field3) || [];
  
  function extractTimestamps(data: FeedProps[]): string[] {
    return data.map(feed => feed.created_at);
  }
  // function extractTimestamps_db(data: FeedPropsDb[]): string[] {
  //   return data.map(feed => feed.createdAt);
  // }
  
  // Example usage
  // const DeviceLabels = extractTimestamps(rdata);
  // const DeviceLabels_db = extractTimestamps_db(feeds_db);

  // UseEffect to fetch data whenever the category state changes
  // React.useEffect(() => {
  //   fetchData(selectedOption);
  // }, [selectedOption]);  // Dependency array ensures the fetch runs only when category changes

  const devicesApi = apidata.map((item) => {
    const channel = item?.channel?.name || "N/A";
    const channel_id = item?.channel?.id || 0;
    const field1 = item?.channel?.field1 || "N/A";
    const field2 = item?.channel?.field2 || "N/A";
    const field3 = item?.channel?.field3 || "N/A";
  
    // Ensure feeds array exists
    const rdata = item?.feeds || [];
  
    // Extract numerical values safely
    const temperature = rdata.map((feed) => Number(feed?.field1) || 0);
    const humidity = rdata.map((feed) => Number(feed?.field2) || 0);
    const pressure = rdata.map((feed) => Number(feed?.field3) || 0);
  
    // Extract timestamps (assuming extractTimestamps is correctly implemented)
    const DeviceLabels = extractTimestamps(rdata);
  
    return [{
      channel_id: channel_id,
      channel: channel,
      field: field1,
      DeviceData: temperature,
      DeviceLabels: DeviceLabels
    },
    {
      channel_id: channel_id,
      channel: channel,
      field: field2,
      DeviceData: humidity,
      DeviceLabels: DeviceLabels
    },
    {
      channel_id: channel_id,
      channel: channel,
      field: field3,
      DeviceData: pressure,
      DeviceLabels: DeviceLabels
    }
  ];
  });

  
  const DevicesGridApi = () => {
    return (
      <Grid container spacing={6}>
        {devicesApi.flat().map((device) => (
          <Grid key={`${device.channel}-${device.field}`} // Change index key to id
            size={{
              xs: 12,
              lg: 12,
            }}
          >
            <LineChart channel_id={device.channel_id} channel={device.channel} field={device.field} DeviceData={device.DeviceData} DeviceLabels={device.DeviceLabels} setData={setData} />
          </Grid>
        ))}
      </Grid>
    );
  }


  // const devices = [
  //   {
  //     channel: channel,
  //     field: field1,
  //     DeviceData: temperature,
  //     DeviceLabels: DeviceLabels
  //   },
  //   {
  //     channel: channel,
  //     field: field2,
  //     DeviceData: humidity,
  //     DeviceLabels: DeviceLabels
  //   },
  //   {
  //     channel: channel,
  //     field: field3,
  //     DeviceData: pressure,
  //     DeviceLabels: DeviceLabels
  //   },
  //   {
  //     channel: channel_db_name,
  //     field: field1_db,
  //     DeviceData: temperature_db,
  //     DeviceLabels: DeviceLabels_db
  //   },
  //   {
  //     channel: channel_db_name,
  //     field: field2_db,
  //     DeviceData: humidity_db,
  //     DeviceLabels: DeviceLabels_db
  //   },
  //   {
  //     channel: channel_db_name,
  //     field: field3_db,
  //     DeviceData: pressure_db,
  //     DeviceLabels: DeviceLabels_db
  //   }
  // ]

  // const DevicesGrid = () => {
  //   return (
  //     <Grid container spacing={6}>
  //       {devices.map((device, index) => (
  //         <Grid key={index} // Change index key to id
  //           size={{
  //             xs: 12,
  //             lg: 12,
  //           }}
  //         >
  //           <LineChart channel={device.channel} field={device.field} DeviceData={device.DeviceData} DeviceLabels={device.DeviceLabels} />
  //         </Grid>
  //       ))}
  //     </Grid>
  //   );
  // }


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

        <Grid container spacing={3}>
          <Grid>
            <Actions selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
          </Grid>
          <Grid>
            <ActionsFilter selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
          </Grid>
          <Grid>
            <ActionsAdd data={data} setData={setData} />
          </Grid>
        </Grid>
      </Grid>
      <Divider my={6} />
      {/* <Grid container spacing={6}>
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
      </Grid> */}
      {/* <Grid container spacing={6}>
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
      </Grid> */}

      <DevicesGridApi />
    </React.Fragment>
  );
}

export default Lab1;
