"use client";

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import PowerOffIcon from '@mui/icons-material/PowerOff';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

interface Channel {
  id: number;
  name: string;
  field1: string;
  field2: string;
  field3: string;
  latitude: number;
  longitude: number;
}

interface Feed {
  created_at: string;
  entry_id: number;
  field1: string;
  field2: string;
  field3: string;
}

interface DeviceReportCardProps {
  channel: Channel;
  timeRange: string;
  customStartDate?: Date | null;
  customEndDate?: Date | null;
}

export default function DeviceReportCard({
  channel,
  timeRange,
  customStartDate,
  customEndDate,
}: DeviceReportCardProps) {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [stats, setStats] = useState({
    alertCount: 0,
    downtime: 0,
    averages: {
      field1: 0,
      field2: 0,
      field3: 0,
    },
  });

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        // Calculate date range based on timeRange
        let startDate = new Date();
        let endDate = new Date();
        
        switch (timeRange) {
          case 'day':
            startDate.setDate(startDate.getDate() - 1);
            break;
          case 'week':
            startDate.setDate(startDate.getDate() - 7);
            break;
          case 'month':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case 'custom':
            if (customStartDate && customEndDate) {
              startDate = customStartDate;
              endDate = customEndDate;
            }
            break;
        }

        // Fetch data from ThingSpeak API
        const response = await fetch(`https://api.thingspeak.com/channels/${channel.id}/feeds.json?start=${startDate.toISOString()}&end=${endDate.toISOString()}`);
        const data = await response.json();
        
        setFeeds(data.feeds);
        
        // Calculate statistics
        const values = {
          field1: data.feeds.map((f: Feed) => Number(f.field1)),
          field2: data.feeds.map((f: Feed) => Number(f.field2)),
          field3: data.feeds.map((f: Feed) => Number(f.field3)),
        };

        const averages = {
          field1: values.field1.reduce((a: number, b: number) => a + b, 0) / values.field1.length,
          field2: values.field2.reduce((a: number, b: number) => a + b, 0) / values.field2.length,
          field3: values.field3.reduce((a: number, b: number) => a + b, 0) / values.field3.length,
        };

        // Calculate alerts (example: if temperature > 30)
        const alerts = values.field1.filter(v => v > 30).length;
        
        setStats({
          alertCount: alerts,
          downtime: calculateDowntime(data.feeds),
          averages,
        });
      } catch (error) {
        console.error('Error fetching device data:', error);
      }
    };

    fetchDeviceData();
  }, [channel.id, timeRange, customStartDate, customEndDate]);

  const calculateDowntime = (feeds: Feed[]): number => {
    let downtimeMinutes = 0;
    let lastTimestamp: Date | null = null;

    for (const feed of feeds) {
      const currentTimestamp = new Date(feed.created_at);
      
      if (lastTimestamp) {
        const diffMinutes = (currentTimestamp.getTime() - lastTimestamp.getTime()) / (1000 * 60);
        if (diffMinutes > 5) { // Assuming readings should be every 5 minutes
          downtimeMinutes += diffMinutes;
        }
      }
      
      lastTimestamp = currentTimestamp;
    }

    return downtimeMinutes;
  };

  const chartData = {
    labels: feeds.map(feed => new Date(feed.created_at).toLocaleTimeString()),
    datasets: [
      {
        label: channel.field1 || 'Temperature',
        data: feeds.map(feed => Number(feed.field1)),
        borderColor: 'rgba(255, 99, 132, 0.5)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.4,
      },
      {
        label: channel.field2 || 'Humidity',
        data: feeds.map(feed => Number(feed.field2)),
        borderColor: 'rgba(54, 162, 235, 0.5)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        tension: 0.4,
      },
      {
        label: channel.field3 || 'Pressure',
        data: feeds.map(feed => Number(feed.field3)),
        borderColor: 'rgba(75, 192, 192, 0.5)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleExport = async () => {
    // Create CSV content
    const csvContent = [
      ['Timestamp', channel.field1, channel.field2, channel.field3].join(','),
      ...feeds.map(feed => [
        feed.created_at,
        feed.field1,
        feed.field2,
        feed.field3,
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${channel.name}_report_${timeRange}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader
        title={channel.name}
        subheader={`Location: ${channel.latitude}, ${channel.longitude}`}
        action={
          <IconButton onClick={handleExport}>
            <DownloadIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" gap={1}>
              <Tooltip title="Number of times temperature exceeded threshold">
                <Chip
                  icon={<ErrorIcon />}
                  label={`${stats.alertCount} Alerts`}
                  color={stats.alertCount > 0 ? "error" : "default"}
                />
              </Tooltip>
              
              <Tooltip title="Total time device was offline">
                <Chip
                  icon={<PowerOffIcon />}
                  label={`${Math.round(stats.downtime)} min downtime`}
                  color={stats.downtime > 60 ? "warning" : "default"}
                />
              </Tooltip>
              
              <Typography variant="body2" color="text.secondary">
                Avg {channel.field1}: {stats.averages.field1.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg {channel.field2}: {stats.averages.field2.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg {channel.field3}: {stats.averages.field3.toFixed(2)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box height={300}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
} 