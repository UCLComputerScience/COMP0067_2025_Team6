"use client";

import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

import TimeRangeSelector from "@/components/pages/dashboard/reports/TimeRangeSelector";
import DeviceReportCard from "@/components/pages/dashboard/reports/DeviceReportCard";

const StyledDivider = styled(Divider)(spacing);

interface Channel {
  id: number;
  name: string;
  field1: string;
  field2: string;
  field3: string;
  latitude: number;
  longitude: number;
  lab: number;
}

export default function ReportsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedLab, setSelectedLab] = useState<number>(0);
  const [timeRange, setTimeRange] = useState('day');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);

  const { data: session } = useSession();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        // Fetch all channels from your database
        const response = await fetch('/api/channels_get');
        const data = await response.json();
        setChannels(data);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };

    fetchChannels();
  }, []);

  const filteredChannels = selectedLab === 0 
    ? channels 
    : channels.filter(channel => channel.lab === selectedLab);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant="h3" gutterBottom>
          {t("Reports")}
        </Typography>
        <Typography variant="subtitle1">
          {t("View and export reports for all labs and devices")}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Lab</InputLabel>
                  <Select
                    value={selectedLab}
                    label="Select Lab"
                    onChange={(e) => setSelectedLab(Number(e.target.value))}
                  >
                    <MenuItem value={0}>All Labs</MenuItem>
                    <MenuItem value={1}>Lab 1</MenuItem>
                    <MenuItem value={2}>Lab 2</MenuItem>
                    <MenuItem value={3}>Lab 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TimeRangeSelector
                  timeRange={timeRange}
                  setTimeRange={setTimeRange}
                  customStartDate={customStartDate}
                  setCustomStartDate={setCustomStartDate}
                  customEndDate={customEndDate}
                  setCustomEndDate={setCustomEndDate}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {filteredChannels.map((channel) => (
        <Grid item xs={12} key={channel.id}>
          <DeviceReportCard
            channel={channel}
            timeRange={timeRange}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
          />
        </Grid>
      ))}
    </Grid>
  );
}
