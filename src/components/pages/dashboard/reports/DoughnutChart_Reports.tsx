import React, { useState } from "react";
import styled from "@emotion/styled";
import { withTheme } from "@emotion/react";
import { Doughnut } from "react-chartjs-2";
import { MoreVertical } from "lucide-react";

import { orange, green, red, blue, purple, teal } from "@mui/material/colors";
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  IconButton,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow as MuiTableRow,
  Typography,
  Box,
  Pagination,
} from "@mui/material";
import { spacing } from "@mui/system";

import { ThemeProps } from "@/types/theme";

const Card = styled(MuiCard)(spacing);

const ChartWrapper = styled.div`
  height: 250px;
  // minHeight: '500px'
  position: relative;
`;

const DoughnutInner = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: -22px;
  text-align: center;
  z-index: 0;
`;

const TableRow = styled(MuiTableRow)`
  height: 42px;
`;

const TableCell = styled(MuiTableCell)`
  padding-top: 0;
  padding-bottom: 0;
`;

const GreenText = styled.span`
  color: ${() => green[400]};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const RedText = styled.span`
  color: ${() => red[400]};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
`;

const PaginationControls = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  padding: 0 16px;
`;

// Sample data structure - each location has users with usage data
export const locationData = [
  {
    locationName: "London Office",
    // Users at this location with their usage numbers
    users: [
      { name: "John Smith", usage: 235},
      { name: "Emma Johnson", usage: 190},
      { name: "David Brown", usage: 145},
      { name: "Sarah Wilson", usage: 210},
    ],
    totalUsage: 780
  },
  {
    locationName: "Manchester Office",
    users: [
      { name: "Michael Clarke", usage: 280},
      { name: "Jessica Taylor", usage: 150},
      { name: "Robert Evans", usage: 195},
    ],
    totalUsage: 625
  },
  {
    locationName: "Glasgow Office",
    users: [
      { name: "William Scott", usage: 320},
      { name: "Olivia Lewis", usage: 175},
    ],
    totalUsage: 495
  },
];

// Color palette for users
const userColors = [
  blue[500],
  red[500],
  green[500],
  orange[500],
  purple[500],
  teal[500],
  blue[300],
  red[300],
];

const DoughnutChart = ({ theme }: ThemeProps) => {
  const [currentLocation, setCurrentLocation] = useState(0);
  
  const location = locationData[currentLocation];

  // Create chart data from users at this location
  const chartData = {
    labels: location.users.map(user => user.name),
    datasets: [
      {
        data: location.users.map(user => user.usage),
        backgroundColor: userColors.slice(0, location.users.length),
        borderWidth: 5,
        borderColor: theme.palette.background.paper,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "80%",
  };

  const handleLocationChange = (locationIndex: number) => {
    setCurrentLocation(locationIndex);
  };

  return (
    <Card mb={6}>
      <CardHeader
        action={
          <IconButton aria-label="settings" size="large">
            <MoreVertical />
          </IconButton>
        }
        title={`Usage History - ${location.locationName}`}
        subheader={`Total Users: ${location.users.length} | Total Usage: ${location.totalUsage}`}
      />

      <CardContent>
        <ChartWrapper>
          <DoughnutInner>
            <Typography variant="h4">{location.users.length}</Typography>
            <Typography variant="caption">users</Typography>
          </DoughnutInner>
          <Doughnut data={chartData} options={options} />
        </ChartWrapper>
        
        {/* Legend for users */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2, justifyContent: 'center' }}>
          {location.users.map((user, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mr: 2,
                mb: 1
              }}
            >
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  backgroundColor: userColors[index],
                  mr: 1
                }} 
              />
              <Typography variant="caption">
                {user.name}: {user.usage}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="right">Usage</TableCell>

              <TableCell align="right">Error Readings</TableCell>
              <TableCell align="right">Change</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {location.users.map((user, index) => (
              <TableRow key={index}>

                <TableCell component="th" scope="row">
                  {user.name}
                </TableCell>
                <TableCell align="right">{user.usage}</TableCell>

                <TableCell align="right">{user.errorReadings}</TableCell>

                <TableCell align="right">
                  {user.positive ? (
                    <RedText>+{user.change}%</RedText>
                  ) : (
                    <GreenText>{user.change}%</GreenText>
                  )}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>  */}

        {/* Location pagination */}
        <PaginationControls>
          <Pagination
            count={locationData.length}
            page={currentLocation + 1}
            onChange={(event, value) => handleLocationChange(value - 1)}
            color="primary"
            size="medium"
          />
        </PaginationControls>
      </CardContent>
    </Card>
  );
};

export default withTheme(DoughnutChart);
