import React from "react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

import { Button as MuiButton, Menu, MenuItem } from "@mui/material";
import {
  Loop as LoopIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { spacing } from "@mui/system";
import { DataProps, DeviceProps, DeviceNameProps } from "@/types/devices";
import { el } from "date-fns/locale";
import { usePathname } from "next/navigation";

const Button = styled(MuiButton)(spacing);

const SmallButton = styled(Button)`
  padding: 4px;
  min-width: 0;

  svg {
    width: 0.9em;
    height: 0.9em;
  }
`;

const Actions: React.FC<DeviceNameProps> = ({ data, setData, device, setDevice }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [buttonText, setButtonText] = React.useState<string>("All");
  const [apikeys, setApikeys] = React.useState<string[]>([]); // Apikeys data from db
  const [apidata, setApidata] = React.useState<DeviceProps[]>([]); // Data fetched from the API

  
  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  let lab = Number(lastSegment.split("")[lastSegment.length - 1]);

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
  const fetchDataFromApi = async (apikey: string) => {
    try {
      const url = `${apikey}?results=0`;
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
        apikeys.map((key) => fetchDataFromApi( key))
      );
      setApidata(results.filter(Boolean)); // Remove null values from failed fetches
    };

    fetchAllData();
  }, [apikeys]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle selecting a menu item
  const handleSelect = (option: string) => {
    setDevice(option);               // Set the selected option as the device
    setButtonText(option);               // Set the selected option as the button text
    handleClose();               // Close the menu after selection
  };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="secondary"
        aria-owns={anchorEl ? "simple-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {buttonText}  {/* Display the selected option here */}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
          <MenuItem key="All" onClick={() => handleSelect("All")}>All</MenuItem>
        {apidata.map((option) => (
          <MenuItem key={option.channel.name} onClick={() => handleSelect(option.channel.name)}>
            {option.channel.name}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

export default Actions;
