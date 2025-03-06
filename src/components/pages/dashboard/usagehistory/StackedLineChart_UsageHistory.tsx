import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, IconButton, Box } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
  ChartData
} from "chart.js";

// Import locationData from DoughnutChart
import { locationData } from "./DoughnutChart_UsageHistory";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

// Create a fixed-width container component with proper TypeScript types
interface FixedWidthContainerProps {
  children: ReactNode;
}

const FixedWidthContainer = ({ children }: FixedWidthContainerProps) => (
  <Box
    sx={{
      // width: '900px',
      maxWidth: '90vw',
      margin: '0 auto',
      overflowX: 'auto'
    }}
  >
    {children}
  </Box>
);

// location labels 
const locationLabels = ["London", "Glasgow", "Manchester"];

// year labels
const yearLabels = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"];

//rows are locations and columns are years
const dataMatrix = [
  // London data
  [50, 60, 70, 65, 60, 65, 70],
  // Glasgow data
  [40, 50, 40, 45, 55, 45, 60],
  // Manchester data
  [30, 40, 30, 40, 35, 40, 50]
];

// Map doughnut chart locations to the order in our line chart
const locationMap = {
  "London Office": 0,   // index in locationLabels array for "London"
  "Glasgow Office": 1,  // index in locationLabels array for "Glasgow"
  "Manchester Office": 2 // index in locationLabels array for "Manchester"
};

// Update the last column (2024) with total usage values from imported locationData
locationData.forEach(location => {
  //type assertion, key exists
  const rowIndex = locationMap[location.locationName as keyof typeof locationMap];
  if (rowIndex !== undefined) {
    // Last column index (2024) is yearLabels.length - 1
    dataMatrix[rowIndex][yearLabels.length - 1] = location.totalUsage;
  }
});

const userColors = [
  { border: "rgba(234, 196, 80, 0.5)", background: "rgba(234, 196, 80, 0.2)" },
  { border: "rgba(30, 145, 89, 0.5)", background: "rgba(30, 145, 89, 0.2)" },
  { border: "rgba(20, 12, 178, 0.5)", background: "rgba(20, 12, 178, 0.2)" }
];

const StackedLineChart = () => {
  
  const chartData: ChartData<"line"> = {
    labels: yearLabels,
    datasets: locationLabels.map((location, index) => ({
      label: location,
      data: dataMatrix[index],
      borderColor: userColors[index].border,
      backgroundColor: userColors[index].background,
      fill: false,
      tension: 0
    }))
  };

  const options: ChartOptions<"line"> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        mode: "index",
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0,0,0,0.0375)",
        },
        ticks: {
          font: {
            weight: "bold"
          },
          autoSkip: false // Prevent skipping labels
        },
        border: {
          display: true,
          color: 'rgba(0,0,0,0.1)'
        }
      },
      y: {
        position: "right",
        display: true,
        min: 0, // Start from 0
        grid: {
          color: "rgba(0,0,0,0.0375)",
          drawTicks: true,
          tickLength: 4,
          lineWidth: 1,
        },
        border: {
          display: true,
          color: 'rgba(0,0,0,0.1)'
        },
        ticks: {
          display: true,
          color: 'rgba(0,0,0,0.75)'
        }
      }
    },
  };

  return (
    <FixedWidthContainer>
      <Card sx={{ mb: 6, width: '100%' }}>
        <CardHeader
          action={
            <IconButton aria-label="settings" size="large">
              {/* <ChevronRight size={20} /> */}
            </IconButton>
          }
          title="Location Usage History"
        />

        <CardContent>
          <div style={{ position: "relative", width: "100%" }}>
            <div style={{ height: "375px" }}>
              <Line data={chartData} options={options} />
            </div>
          </div>
        </CardContent>
      </Card>
    </FixedWidthContainer>
  );
};

export default StackedLineChart;
