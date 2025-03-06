import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Label } from 'recharts';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from '@emotion/styled';
import { Card as MuiCard, CardContent, CardHeader, IconButton, Box } from '@mui/material';
import { spacing } from '@mui/system';
import { withTheme } from "@emotion/react";

const Card = styled(MuiCard)(spacing);

const FixedWidthContainer = styled(Box)`
  // width: 800px;
  // height: 500px;
  max-width: 90vw; // Prevent overflow on small screens
  margin: 0 auto;
  overflow-x: auto; // Add horizontal scroll if needed
`;

// Keep ChartWrapper for height only
const ChartWrapper = styled.div`
  height: 378px;
`;




const data = [
  { year: 2016, Brazil: 50, Canada: 300, India: 100 },
  { year: 2017, Brazil: 120, Canada: 320, India: 180 },
  { year: 2018, Brazil: 200, Canada: 310, India: 150 },
  { year: 2019, Brazil: 250, Canada: 350, India: 220 },
];

const options = {
  margin: { top: 10, right: 50, left: 0, bottom: 20 },
  xAxis: { tick: { fontWeight: 'bold' } },
  yAxis: {
    position: "right",
    tick: { fontWeight: 'bold' },
    grid: { strokeDasharray: '3 3', strokeOpacity: 0.5 },
  },
  tooltip: {},
  legend: { position: "bottom", height: 36 },
};

function StackedLineChart() {
  return (
    <FixedWidthContainer>
      <Card sx={{ mb: 6, width: '100%' }}>
        <CardHeader
          action={
            <IconButton aria-label="settings" size="large">
              <ChevronRight size={20} />
            </IconButton>
          }
          title="User Location"
        />
        <CardContent>
          <ChartWrapper>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 30 }}>
                <XAxis dataKey="year" tick={{ fontWeight: 'bold' }} />
                <YAxis 
                  yAxisId="left"
                  orientation="left" 
                  display="none" 
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right" 
                  tick={{ fontWeight: 'bold' }}
                  tickLine={{ stroke: '#333' }}
                  axisLine={{ stroke: '#333' }}
                >
                  <Label 
                    value="Total" 
                    position="top" 
                    offset={20}
                    dy={-10}
                    style={{ textAnchor: 'middle', fontWeight: 'bold' }}
                  />
                </YAxis>
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                />
                <Area 
                  yAxisId="right"
                  type="linear" 
                  dataKey="Brazil" 
                  stackId="1" 
                  stroke="#E69F66" 
                  fill="#E69F66" 
                />
                <Area 
                  yAxisId="right"
                  type="linear" 
                  dataKey="Canada" 
                  stackId="1" 
                  stroke="#4BAA9A" 
                  fill="#4BAA9A" 
                />
                <Area 
                  yAxisId="right"
                  type="linear" 
                  dataKey="India" 
                  stackId="1" 
                  stroke="#8854D0" 
                  fill="#8854D0" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </CardContent>
      </Card>
    </FixedWidthContainer>
  );
}
export default withTheme(StackedLineChart);