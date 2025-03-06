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

import { ThemeProps } from "@/types/theme";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 378px;
`;

function LineChart({ theme }: ThemeProps) {
  const data = {
    labels: [
      "0",
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
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
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
        data: [
          41, 43, 38, 45, 42, 45, 40, 47, 44, 38, 31, 36, 33, 31, 35, 41, 46, 43, 52, 54, 47, 50, 48, 52,
        ],
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
        title="Digibox 1 Temperature"
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
