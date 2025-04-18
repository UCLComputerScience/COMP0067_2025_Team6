import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

interface TimeRangeSelectorProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
  customStartDate: Date | null;
  setCustomStartDate: (date: Date | null) => void;
  customEndDate: Date | null;
  setCustomEndDate: (date: Date | null) => void;
}

export default function TimeRangeSelector({
  timeRange,
  setTimeRange,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
}: TimeRangeSelectorProps) {
  return (
    <Stack spacing={2}>
      <FormControl fullWidth>
        <InputLabel>Time Range</InputLabel>
        <Select
          value={timeRange}
          label="Time Range"
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <MenuItem value="day">Past Day</MenuItem>
          <MenuItem value="week">Past Week</MenuItem>
          <MenuItem value="month">Past Month</MenuItem>
          <MenuItem value="custom">Custom Range</MenuItem>
        </Select>
      </FormControl>

      {timeRange === 'custom' && (
        <Stack direction="row" spacing={2}>
          <DatePicker
            label="Start Date"
            value={customStartDate}
            onChange={(newValue) => setCustomStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={customEndDate}
            onChange={(newValue) => setCustomEndDate(newValue)}
          />
        </Stack>
      )}
    </Stack>
  );
} 