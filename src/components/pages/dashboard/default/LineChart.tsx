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

const LineChart: React.FC<DevicePropsTheme> = ({ theme, channel, field, DeviceData }) => {
  const data = {
    labels: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
    ],
    datasets: [
      {
        label: "Sales ($)",
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
      },
      // {
      //   label: "Orders",
      //   fill: true,
      //   backgroundColor: "transparent",
      //   borderColor: theme.palette.grey[500],
      //   borderDash: [4, 4],
      //   tension: 0.4,
      //   data: [
      //     958, 724, 629, 883, 915, 1214, 1476, 1212, 1554, 2128, 1466, 1827,
      //   ],
      // },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
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
          <IconButton aria-label="settings" size="large">
            <MoreVertical />
          </IconButton>
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
