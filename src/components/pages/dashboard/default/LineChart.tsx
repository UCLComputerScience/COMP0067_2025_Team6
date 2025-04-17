import React from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { Line } from "react-chartjs-2";
import { MoreVertical } from "lucide-react";

import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  IconButton,
  Box, 
  Menu, 
  MenuItem
} from "@mui/material";
import { spacing } from "@mui/system";
import { alpha } from "@mui/material/styles";

// import { ThemeProps } from "@/types/theme";
import { DevicePropsTheme } from "@/types/devices";
import { Theme } from "@mui/material";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 378px;
`;

const getLabLocation = async (deviceName: string) => {
  try {
    const response = await fetch(`/api/device-lab?deviceName=${encodeURIComponent(deviceName)}`);
    const data = await response.json();
    return data.labLocation;
  } catch (error) {
    console.error("Failed to fetch lab location:", error);
    return "Unknown"; 
  }
};

const LineChart: React.FC<DevicePropsTheme> = ({ theme, channel_id, channel, field, DeviceData, DeviceLabels, setData }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    handleClose();
    try {
      const labLocation = await getLabLocation(channel); 
  
      const response = await fetch(`/api/apikeys/${channel_id}`, { method: "DELETE" });
  
      if (response.ok) {
        setData(channel);
  
        await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "Device Deleted",
            labLocation, 
            device: channel,
          }),
        });
        
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  
  const data = {
    labels: DeviceLabels,
    datasets: [
      {
        label: "",
        fill: true,
        backgroundColor: function (context: any) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return null;
          }

          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, alpha(theme.palette.secondary.main, 0.0875));
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

          return gradient;
        },
        borderColor: theme.palette.secondary.main,
        tension: 0.4,
        data: DeviceData,
        pointRadius: 0,     
        },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,  // Enable tooltips
        mode: 'nearest' as 'nearest' | 'x' | 'y' | 'index' | 'dataset' | 'point' | undefined, // Show the nearest point
        intersect: false, // Allow tooltips to appear when hovering near the line
        },
    },
    scales: {
      x: {
        ticks: {
          display: false, // Hide x-axis labels but keep the scale
        },        
        grid: {
          color: "rgba(0,0,0,0.0)",
        },
      },
      y: {
        grid: {
          color: "rgba(0,0,0,0.0375)",
          fontColor: "#fff",
        },
      },
    },
  };

  return (
    <Card mb={6}>
      <CardHeader
        action={
        <>
          <IconButton aria-label="settings" size="large" onClick={handleClick}>
            <MoreVertical />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </>
        }
        title={channel + " - " + field}
      />
      <CardContent>
        <ChartWrapper>
          <Line data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
}
export default withTheme(LineChart);
