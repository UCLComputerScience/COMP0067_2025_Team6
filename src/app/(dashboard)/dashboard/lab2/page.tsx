"use client";

import React, { useEffect, useState } from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation"; // Import useRouter for redirect
import { useTranslation } from "react-i18next";
import withAuth from "@/lib/withAuth"; // Import the withAuth HOC
import { useSession } from "next-auth/react"; // Import useSession
import { usePathname } from "next/navigation";

import {
  Grid2 as Grid,
  Divider as MuiDivider,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { green, red } from "@mui/material/colors";
import {
  DeviceProps,
  ChannelProps,
  FeedProps,
  FeedPropsDb,
} from "@/types/devices";

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

const Lab2 = () => {
  const [selectedOption, setSelectedOption] = React.useState<string>("");
  // const [data, setData] = React.useState<DeviceProps>({} as DeviceProps);  // Data fetched from the API
  // const [channel_db, setChannel_db] = React.useState<ChannelProps>({} as ChannelProps);  // Channel data from db
  // const [feeds_db, setFeeds_db] = React.useState<FeedPropsDb[]>([]);  // Feeds data from db
  const [apikeys, setApikeys] = React.useState<string[]>([]); // Apikeys data from db
  const [apidata, setApidata] = React.useState<DeviceProps[]>([]); // Data fetched from the API
  const [data, setData] = React.useState<string>("");
  const [device, setDevice] = React.useState<string>("All");

  const { data: session, status } = useSession();

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  let lab = Number(lastSegment.split("")[lastSegment.length - 1]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>You need to sign in to access this page.</div>;
  }

  if (!session || !session.user) {
    return <div>No session found. Redirecting...</div>;
  }

  React.useEffect(() => {
    async function fetchApikeys() {
      try {
        const response = await fetch(`/api/apikeys_get?labId=${lab}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const apiArray: string[] = data.map(
          (item: { api: string }) => item.api
        ); // Extract only the "api" values

        setApikeys(apiArray);
      } catch (error) {
        console.error("Error fetching apikeys:", error);
      }
    }

    fetchApikeys();
  }, [data]);

  // Function to fetch data based on the selected category and apikey
  const fetchDataFromApi = async (selectedOption: string, apikey: string) => {
    try {
      const url = selectedOption ? `${apikey}` + `${selectedOption}` : apikey;
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
      const results = await Promise.all(
        apikeys.map((key) => fetchDataFromApi(selectedOption, key))
      );
      setApidata(results.filter(Boolean)); // Remove null values from failed fetches
    };

    fetchAllData();
    const interval = setInterval(fetchAllData, 60000); // Poll every 5 sec

    return () => clearInterval(interval); // Cleanup
  }, [selectedOption, apikeys]);

  const { t } = useTranslation();

  function extractTimestamps(data: FeedProps[]): string[] {
    return data.map((feed) => feed.created_at);
  }

  const devicesApi = apidata.map((item) => {
  const channel = item?.channel?.name || "N/A";
  if (device !== "All" && channel !== device) {
    return [];
  }

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

  return [
    {
      channel_id: channel_id,
      channel: channel,
      field: field1,
      DeviceData: temperature,
      DeviceLabels: DeviceLabels,
    },
    {
      channel_id: channel_id,
      channel: channel,
      field: field2,
      DeviceData: humidity,
      DeviceLabels: DeviceLabels,
    },
    {
      channel_id: channel_id,
      channel: channel,
      field: field3,
      DeviceData: pressure,
      DeviceLabels: DeviceLabels,
    },
  ];
});

  // const devicesApi = apidata.map((item) => {
  //   const channel = item?.channel?.name || "N/A";
  //   if (device !== "All" && channel === device) {}

  //   const channel_id = item?.channel?.id || 0;
  //   const field1 = item?.channel?.field1 || "N/A";
  //   const field2 = item?.channel?.field2 || "N/A";
  //   const field3 = item?.channel?.field3 || "N/A";

  //   // Ensure feeds array exists
  //   const rdata = item?.feeds || [];

  //   // Extract numerical values safely
  //   const temperature = rdata.map((feed) => Number(feed?.field1) || 0);
  //   const humidity = rdata.map((feed) => Number(feed?.field2) || 0);
  //   const pressure = rdata.map((feed) => Number(feed?.field3) || 0);

  //   // Extract timestamps (assuming extractTimestamps is correctly implemented)
  //   const DeviceLabels = extractTimestamps(rdata);

  //   return [
  //     {
  //       channel_id: channel_id,
  //       channel: channel,
  //       field: field1,
  //       DeviceData: temperature,
  //       DeviceLabels: DeviceLabels,
  //     },
  //     {
  //       channel_id: channel_id,
  //       channel: channel,
  //       field: field2,
  //       DeviceData: humidity,
  //       DeviceLabels: DeviceLabels,
  //     },
  //     {
  //       channel_id: channel_id,
  //       channel: channel,
  //       field: field3,
  //       DeviceData: pressure,
  //       DeviceLabels: DeviceLabels,
  //     },
  //   ];
  // });

  const DevicesGridApi = () => {
    return (
      <Grid container spacing={6}>
        {devicesApi.flat().map((device) => (
          <Grid
            key={`${device.channel}-${device.field}`} // Change index key to id
            size={{
              xs: 12,
              lg: 12,
            }}
          >
            <LineChart
              channel_id={device.channel_id}
              channel={device.channel}
              field={device.field}
              DeviceData={device.DeviceData}
              DeviceLabels={device.DeviceLabels}
              setData={setData}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  // // Get session data using the useSession hook
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // // State for controlling loading or redirection state
  // const [loading, setLoading] = useState(true);

  // // Check if the user is authenticated and redirect if needed
  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     setLoading(false); // Stop loading when we know the user is unauthenticated
  //     router.push("/auth/sign-in"); // Redirect to login page if not authenticated
  //   } else if (status === "authenticated") {
  //     setLoading(false); // Stop loading when user is authenticated
  //   }
  // }, [status, router]);

  // // Show a loading state or "Please log in" message while checking session
  // if (loading) {
  //   return (
  //     <div>
  //       <Typography variant="h5" gutterBottom>
  //         {t("Please log in to view this page.")}
  //       </Typography>
  //     </div>
  //   );
  // }
  // const { data: session } = useSession();
  console.log(session?.user);

  return (
    // <AuthGuard>
    //   {" "}
    <React.Fragment>
      <Grid justifyContent="space-between" container spacing={6}>
        <Grid>
          <Typography variant="h3" gutterBottom>
            Lab 2
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
            <Actions
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          </Grid>
          <Grid>
            <ActionsFilter data={data} setData={setData} device={device} setDevice={setDevice} />
          </Grid>
          <Grid>
            <ActionsAdd data={data} setData={setData} />
          </Grid>
        </Grid>
      </Grid>
      <Divider my={6} />

      <DevicesGridApi />
    </React.Fragment>
    // </AuthGuard>
  );
};

export default Lab2;
