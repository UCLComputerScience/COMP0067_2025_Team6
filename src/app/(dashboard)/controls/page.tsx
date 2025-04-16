"use client";

import React, { useState, useEffect, ReactNode } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";

import { MessageCircle } from "lucide-react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { faker } from "@faker-js/faker";

import {
  Avatar,
  AvatarGroup as MuiAvatarGroup,
  Breadcrumbs as MuiBreadcrumbs,
  Box,
  Button,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid2 as Grid,
  Link,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  TextField,
  FormControl,
  Popover,
  Typography as MuiTypography,
  IconButton,
  Select,
  Slider,
  Switch,
} from "@mui/material";
import { spacing } from "@mui/system";
import { orange, green, blue } from "@mui/material/colors";
import {
  Add as AddIcon,
  MoreVert,
  Search as SearchIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { startOfDay, endOfDay } from "date-fns";
import HideAuthGuard from "@/components/guards/HideAuthGuard";
import ThresholdForm from "./components/thresholdform";
import SettingsForm from "./components/settingsform";

// --- No changes to styling ---
const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)<{ pb?: number }>`
  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)};
  }
`;

const AvatarGroup = styled(MuiAvatarGroup)`
  display: inline-flex;
`;

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Typography = styled(MuiTypography)(spacing);

const SearchBarContainer = styled(Box)`
  display: flex;
  justify-content: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
`;

interface ApiKey {
  id: number;
  channelId: number;
  api: string;
  labId: number;
  lab: {
    id: number;
    labLocation: string;
    managerId: number;
  };
}

interface Channel {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  field1?: string | null;
  field2?: string | null;
  field3?: string | null;
  field4?: string | null;
  field5?: string | null;
  field6?: string | null;
  field7?: string | null;
  field8?: string | null;
  lastEntryId: number;
  createdAt: string;
  updatedAt: string;
  ApiKey: ApiKey[];
}

interface LabCardProps {
  channelId: number;
  name: string;
  apiKey: string;
  defaultThresholds: {
    fieldName: string;
    minValue: number;
    maxValue: number;
    unit: string;
  }[];
}

interface SensorFieldProps {
  label: string;
  value: number[];
  min: number;
  max: number;
  step: number;
  unit: string; // New prop
  onSliderChange: (event: Event, newValue: number | number[]) => void;
  latestValue: string;
}

function SensorField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onSliderChange,
  latestValue,
}: SensorFieldProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: "4px",
        padding: "8px",
        marginBottom: "8px",
      }}
    >
      <Typography variant="body2" sx={{ width: "100px", fontWeight: "bold" }}>
        {label}
      </Typography>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onSliderChange}
        valueLabelDisplay="auto"
        marks={[
          {
            value: parseFloat(latestValue),
          },
        ]}
        sx={{
          width: "120px",
          margin: "0 8px",
          "& .MuiSlider-mark": {
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: "orange",
          },
          "& .MuiSlider-thumb": {
            width: 12,
            height: 12,
            borderRadius: "50%",
          },
        }}
      />

      <Typography
        variant="body2"
        sx={{ width: "80px", textAlign: "center", fontWeight: "bold" }}
      >
        {`${latestValue}${unit}`}
      </Typography>
    </Box>
  );
}

function LabCard({ channelId, name, apiKey, defaultThresholds }: LabCardProps) {
  const [channelData, setChannelData] = useState<any | null>(null);
  const [sliderValues, setSliderValues] = useState<number[][]>([]);
  const [initialSliderValues, setInitialSliderValues] = useState<number[][]>(
    []
  ); // Track initial values
  const [hasChanges, setHasChanges] = useState(false); // Track if sliders have changed
  const [saving, setSaving] = useState(false); // Track save operation
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openThresholdForm, setOpenThresholdForm] = useState(false);
  const [thresholds, setThresholds] = useState<
    { fieldName: string; minValue: number; maxValue: number; unit: string }[]
  >([]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenThresholdForm = () => {
    setOpenThresholdForm(true);
    handleMenuClose();
  };

  const handleCloseThresholdForm = () => {
    setOpenThresholdForm(false);
  };

  const fetchThresholds = async () => {
    try {
      const response = await fetch(
        `/api/controls/thresholds?channelId=${channelId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch thresholds");
      }
      const data = await response.json();
      const newThresholds = data.thresholds || [];
      setThresholds(newThresholds);

      if (channelData) {
        const fields = Object.keys(channelData.channel)
          .filter((key) => key.startsWith("field"))
          .map((key) => ({
            label: channelData.channel[key],
            latestValue: parseFloat(
              channelData.feeds[channelData.feeds.length - 1][key]
            ).toFixed(2),
          }));

        const updatedSliderValues = fields.map((field) => {
          const threshold = newThresholds.find(
            (t: any) => t.fieldName === field.label
          );
          const defaultThreshold = defaultThresholds.find(
            (t) => t.fieldName === field.label
          );
          const latest = parseFloat(field.latestValue);
          if (threshold) {
            return [threshold.minValue, threshold.maxValue];
          } else if (defaultThreshold) {
            return [defaultThreshold.minValue, defaultThreshold.maxValue];
          } else {
            return [latest - 10, latest + 10];
          }
        });

        setSliderValues(updatedSliderValues);
        setInitialSliderValues(updatedSliderValues); // Set initial values for change tracking
        setHasChanges(false); // Reset changes after fetching
      }
    } catch (err) {
      console.error("Error fetching thresholds:", err);
      setError("Failed to fetch thresholds.");
    }
  };

  const handleThresholdsSave = () => {
    fetchThresholds();
  };

  const handleSliderChange = (index: number, newValue: number | number[]) => {
    const updated = [...sliderValues];
    updated[index] = newValue as number[];
    setSliderValues(updated);

    // Check if sliders have changed compared to initial values
    const changed = updated.some(
      (val, i) =>
        val[0] !== initialSliderValues[i]?.[0] ||
        val[1] !== initialSliderValues[i]?.[1]
    );
    setHasChanges(changed);
  };

  const handleSaveThresholds = async () => {
    if (!channelData) return;

    setSaving(true);
    setError(null);

    const fields = Object.keys(channelData.channel)
      .filter((key) => key.startsWith("field"))
      .map((key) => channelData.channel[key]);

    // Prepare thresholds for submission
    const submissionFields = fields
      .map((fieldName, index) => {
        const [minValue, maxValue] = sliderValues[index];
        if (isNaN(minValue) || isNaN(maxValue) || minValue >= maxValue) {
          return null;
        }
        const threshold = thresholds.find((t) => t.fieldName === fieldName);
        const defaultThreshold = defaultThresholds.find(
          (t) => t.fieldName === fieldName
        );
        return {
          fieldName,
          minValue,
          maxValue,
          unit: threshold?.unit ?? defaultThreshold?.unit ?? "",
        };
      })
      .filter((field) => field !== null);

    try {
      const response = await fetch("/api/controls/thresholds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, thresholds: submissionFields }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Refresh thresholds and reset change tracking
      await fetchThresholds();
      alert("Thresholds saved successfully!");
    } catch (err) {
      console.error("Error saving thresholds:", err);
      setError("Failed to save thresholds. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching from URL:", apiKey);
      try {
        const response = await fetch(`${apiKey}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setChannelData(data);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setError(err.message);
      }
    };

    fetchData();
    fetchThresholds();
  }, [channelId, apiKey]);

  useEffect(() => {
    if (channelData && sliderValues.length === 0) {
      const fields = Object.keys(channelData.channel)
        .filter((key) => key.startsWith("field"))
        .map((key) => ({
          label: channelData.channel[key],
          latestValue: parseFloat(
            channelData.feeds[channelData.feeds.length - 1][key]
          ).toFixed(2),
        }));

      const initialSliderValues = fields.map((field) => {
        const threshold = thresholds.find((t) => t.fieldName === field.label);
        const defaultThreshold = defaultThresholds.find(
          (t) => t.fieldName === field.label
        );
        const latest = parseFloat(field.latestValue);
        if (threshold) {
          return [threshold.minValue, threshold.maxValue];
        } else if (defaultThreshold) {
          return [defaultThreshold.minValue, defaultThreshold.maxValue];
        } else {
          return [latest - 10, latest + 10];
        }
      });

      setSliderValues(initialSliderValues);
      setInitialSliderValues(initialSliderValues);
    }
  }, [channelData, thresholds, defaultThresholds]);

  if (!channelData) {
    return <Typography variant="body1">Loading data...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">{`Error: ${error}`}</Typography>
    );
  }

  const { channel, feeds } = channelData;
  const latestFeed = feeds[feeds.length - 1];

  const fields = Object.keys(channel)
    .filter((key) => key.startsWith("field"))
    .map((key) => ({
      label: channel[key],
      latestValue: parseFloat(latestFeed[key]).toFixed(2),
    }));

  return (
    <Card sx={{ maxWidth: 320, marginBottom: 4 }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {channel.name}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.8rem", color: "grey.500" }}
            >
              {channelId}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          </Grid>
        </Grid>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleOpenThresholdForm}>Edit Settings</MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              console.log("Delete Device clicked");
            }}
          >
            Delete Device
          </MenuItem>
        </Menu>

        <ThresholdForm
          open={openThresholdForm}
          handleClose={handleCloseThresholdForm}
          channelId={channelId}
          channelName={name}
          defaultThresholds={defaultThresholds}
          channelFields={fields.map((f) => f.label)}
          onSave={handleThresholdsSave}
        />

        <Box sx={{ height: "16px" }}></Box>

        {fields.map((field, index) => {
          const threshold = thresholds.find((t) => t.fieldName === field.label);
          const defaultThreshold = defaultThresholds.find(
            (t) => t.fieldName === field.label
          );
          const latest = parseFloat(field.latestValue);
          return (
            <SensorField
              key={index}
              label={field.label}
              value={sliderValues[index] || [latest - 10, latest + 10]}
              min={
                threshold?.minValue ?? defaultThreshold?.minValue ?? latest - 10
              }
              max={
                threshold?.maxValue ?? defaultThreshold?.maxValue ?? latest + 10
              }
              step={0.1}
              unit={threshold?.unit ?? defaultThreshold?.unit ?? ""}
              onSliderChange={(event, newValue) =>
                handleSliderChange(index, newValue)
              }
              latestValue={field.latestValue}
            />
          );
        })}

        <Box sx={{ display: "flex", gap: 2, mb: 2, mt: 2 }}>
          <Box
            sx={{
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              padding: "8px",
              flex: 1,
            }}
          >
            <Typography variant="body2">
              <strong>Start date:</strong>{" "}
              {new Date(channel.created_at).toLocaleDateString()}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#f0f0f0",
              borderRadius: "4px",
              padding: "8px",
              flex: 1,
            }}
          >
            <Typography variant="body2">
              <strong>Last updated:</strong>{" "}
              {new Date(channel.updated_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        {hasChanges && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveThresholds}
              disabled={saving}
              fullWidth
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}


// function DateFilterMenu({
//   startDate,
//   endDate,
//   setStartDate,
//   setEndDate,
//   selectedRange,
//   setSelectedRange,
//   dateField,
//   setDateField,
// }: {
//   startDate: Date | null;
//   endDate: Date | null;
//   setStartDate: (date: Date | null) => void;
//   setEndDate: (date: Date | null) => void;
//   selectedRange: string;
//   setSelectedRange: (range: string) => void;
//   dateField: "createdAt" | "updatedAt";
//   setDateField: (field: "createdAt" | "updatedAt") => void;
// }) {
//   const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
//   const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);

//   const handleDateFilterClick = (event: React.MouseEvent<HTMLElement>) => {
//     setMenuAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setMenuAnchorEl(null);
//   };

//   const handleRangeSelect = (
//     range: string,
//     event?: React.MouseEvent<HTMLElement>
//   ) => {
//     setSelectedRange(range);
//     let newStartDate = null;
//     let newEndDate = new Date();

//     switch (range) {
//       case "7days":
//         newStartDate = new Date();
//         newStartDate.setDate(newStartDate.getDate() - 7);
//         newStartDate = startOfDay(newStartDate);
//         newEndDate = endOfDay(newEndDate);
//         break;
//       case "30days":
//         newStartDate = new Date();
//         newStartDate.setDate(newStartDate.getDate() - 30);
//         newStartDate = startOfDay(newStartDate);
//         newEndDate = endOfDay(newEndDate);
//         break;
//       case "year":
//         newStartDate = new Date();
//         newStartDate.setFullYear(newStartDate.getFullYear() - 1);
//         newStartDate = startOfDay(newStartDate);
//         newEndDate = endOfDay(newEndDate);
//         break;
//       case "all":
//         newStartDate = null;
//         newEndDate = null;
//         break;
//       case "custom":
//         if (event) {
//           setPopoverAnchorEl(event.currentTarget);
//         }
//         return;
//     }

//     setStartDate(newStartDate);
//     setEndDate(newEndDate);
//     setMenuAnchorEl(null);
//   };

//   const handlePopoverClose = () => {
//     setPopoverAnchorEl(null);
//   };

//   const handleApplyCustomRange = () => {
//     setSelectedRange("custom");
//     if (startDate) setStartDate(startOfDay(startDate));
//     if (endDate) setEndDate(endOfDay(endDate));
//     setPopoverAnchorEl(null);
//   };

//   const handleResetDateFilter = () => {
//     setStartDate(null);
//     setEndDate(null);
//     setSelectedRange("all");
//     setDateField("updatedAt"); // Reset dateField to default
//     setPopoverAnchorEl(null);
//   };

//   const handleResetAllDateSettings = () => {
//     setStartDate(null);
//     setEndDate(null);
//     setSelectedRange("all");
//     setDateField("updatedAt"); // Reset dateField to default
//     setMenuAnchorEl(null);
//   };

//   return (
//     <>
//       <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//         <FormControl size="small" sx={{ minWidth: 150 }}>
//           <InputLabel>Filter By</InputLabel>
//           <Select
//             value={dateField}
//             label="Filter By"
//             onChange={(e) => setDateField(e.target.value as "createdAt" | "updatedAt")}
//           >
//             <MenuItem value="createdAt">Created At</MenuItem>
//             <MenuItem value="updatedAt">Updated At</MenuItem>
//           </Select>
//         </FormControl>
//         <Button
//           variant="outlined"
//           onClick={handleDateFilterClick}
//           startIcon={<FilterListIcon />}
//           sx={{ minWidth: 100 }}
//         >
//           {selectedRange === "7days"
//             ? "Last 7 Days"
//             : selectedRange === "30days"
//             ? "Last 30 Days"
//             : selectedRange === "year"
//             ? "Last Year"
//             : selectedRange === "custom"
//             ? "Custom Range"
//             : "All Time"}
//         </Button>
//       </Box>

//       <Menu
//         anchorEl={menuAnchorEl}
//         open={Boolean(menuAnchorEl)}
//         onClose={handleMenuClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//       >
//         <MenuItem onClick={() => handleRangeSelect("7days")}>Last 7 Days</MenuItem>
//         <MenuItem onClick={() => handleRangeSelect("30days")}>Last 30 Days</MenuItem>
//         <MenuItem onClick={() => handleRangeSelect("year")}>Last Year</MenuItem>
//         <MenuItem onClick={() => handleRangeSelect("all")}>All Time</MenuItem>
//         <MenuItem onClick={(event) => handleRangeSelect("custom", event)}>
//           Custom Range
//         </MenuItem>
//         <MenuItem onClick={handleResetAllDateSettings}>Reset</MenuItem>
//       </Menu>

//       <Popover
//         open={Boolean(popoverAnchorEl)}
//         anchorEl={popoverAnchorEl}
//         onClose={handlePopoverClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//         transformOrigin={{ vertical: "top", horizontal: "left" }}
//       >
//         <Box sx={{ p: 2, minWidth: 300 }}>
//           <Typography variant="h6" gutterBottom>
//             Select Date Range
//           </Typography>
//           <LocalizationProvider dateAdapter={AdapterDateFns}>
//             <Box sx={{ display: "flex", gap: 2 }}>
//               <DatePicker
//                 label="Start Date"
//                 value={startDate}
//                 onChange={(newValue) => setStartDate(newValue)}
//                 slotProps={{ textField: { size: "small" } }}
//                 format="dd/MM/yyyy"
//               />
//               <DatePicker
//                 label="End Date"
//                 value={endDate}
//                 onChange={(newValue) => setEndDate(newValue)}
//                 slotProps={{ textField: { size: "small" } }}
//                 format="dd/MM/yyyy"
//               />
//             </Box>
//           </LocalizationProvider>
//           <Box
//             sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
//           >
//             <Button onClick={handleResetDateFilter} color="secondary">
//               Reset
//             </Button>
//             <Button onClick={handlePopoverClose}>Cancel</Button>
//             <Button onClick={handleApplyCustomRange} variant="contained">
//               Apply
//             </Button>
//           </Box>
//         </Box>
//       </Popover>
//     </>
//   );
// }

function DateFilterMenu({
  createdStartDate,
  createdEndDate,
  updatedStartDate,
  updatedEndDate,
  setCreatedStartDate,
  setCreatedEndDate,
  setUpdatedStartDate,
  setUpdatedEndDate,
  selectedRange,
  setSelectedRange,
}: {
  createdStartDate: Date | null;
  createdEndDate: Date | null;
  updatedStartDate: Date | null;
  updatedEndDate: Date | null;
  setCreatedStartDate: (date: Date | null) => void;
  setCreatedEndDate: (date: Date | null) => void;
  setUpdatedStartDate: (date: Date | null) => void;
  setUpdatedEndDate: (date: Date | null) => void;
  selectedRange: string;
  setSelectedRange: (range: string) => void;
}) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);

  const handleDateFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleRangeSelect = (
    range: string,
    event?: React.MouseEvent<HTMLElement>
  ) => {
    setSelectedRange(range);
    let newStartDate = null;
    let newEndDate = new Date();

    switch (range) {
      case "7days":
        newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - 7);
        newStartDate = startOfDay(newStartDate);
        newEndDate = endOfDay(newEndDate);
        break;
      case "30days":
        newStartDate = new Date();
        newStartDate.setDate(newStartDate.getDate() - 30);
        newStartDate = startOfDay(newStartDate);
        newEndDate = endOfDay(newEndDate);
        break;
      case "year":
        newStartDate = new Date();
        newStartDate.setFullYear(newStartDate.getFullYear() - 1);
        newStartDate = startOfDay(newStartDate);
        newEndDate = endOfDay(newEndDate);
        break;
      case "all":
        newStartDate = null;
        newEndDate = null;
        break;
      case "custom":
        if (event) {
          setPopoverAnchorEl(event.currentTarget);
        }
        return;
    }

    // Apply the same range to both createdAt and updatedAt
    setCreatedStartDate(newStartDate);
    setCreatedEndDate(newEndDate);
    setUpdatedStartDate(newStartDate);
    setUpdatedEndDate(newEndDate);
    setMenuAnchorEl(null);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleApplyCustomRange = () => {
    setSelectedRange("custom");
    if (createdStartDate) setCreatedStartDate(startOfDay(createdStartDate));
    if (createdEndDate) setCreatedEndDate(endOfDay(createdEndDate));
    if (updatedStartDate) setUpdatedStartDate(startOfDay(updatedStartDate));
    if (updatedEndDate) setUpdatedEndDate(endOfDay(updatedEndDate));
    setPopoverAnchorEl(null);
  };

  const handleResetDateFilter = () => {
    setCreatedStartDate(null);
    setCreatedEndDate(null);
    setUpdatedStartDate(null);
    setUpdatedEndDate(null);
    setSelectedRange("all");
    setPopoverAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleDateFilterClick}
        startIcon={<FilterListIcon />}
        sx={{ minWidth: 150 }}
      >
        {selectedRange === "7days"
          ? "Last 7 Days"
          : selectedRange === "30days"
          ? "Last 30 Days"
          : selectedRange === "year"
          ? "Last Year"
          : selectedRange === "custom"
          ? "Custom Range"
          : "All Time"}
      </Button>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <MenuItem onClick={() => handleRangeSelect("7days")}>Last 7 Days</MenuItem>
        <MenuItem onClick={() => handleRangeSelect("30days")}>Last 30 Days</MenuItem>
        <MenuItem onClick={() => handleRangeSelect("year")}>Last Year</MenuItem>
        <MenuItem onClick={() => handleRangeSelect("all")}>All Time</MenuItem>
        <MenuItem onClick={(event) => handleRangeSelect("custom", event)}>
          Custom Range
        </MenuItem>
      </Menu>

      <Popover
        open={Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 350 }}>
          <Typography variant="h6" gutterBottom>
            Select Date Ranges
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Created Date Range
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={createdStartDate}
                  onChange={(newValue) => setCreatedStartDate(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                  format="dd/MM/yyyy"
                />
                <DatePicker
                  label="End Date"
                  value={createdEndDate}
                  onChange={(newValue) => setCreatedEndDate(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                  format="dd/MM/yyyy"
                />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Updated Date Range
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={updatedStartDate}
                  onChange={(newValue) => setUpdatedStartDate(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                  format="dd/MM/yyyy"
                />
                <DatePicker
                  label="End Date"
                  value={updatedEndDate}
                  onChange={(newValue) => setUpdatedEndDate(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                  format="dd/MM/yyyy"
                />
              </Box>
            </Box>
          </LocalizationProvider>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button onClick={handleResetDateFilter} color="secondary">
              Reset
            </Button>
            <Button onClick={handlePopoverClose}>Cancel</Button>
            <Button onClick={handleApplyCustomRange} variant="contained">
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

// function Controls() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [channelIdFilter, setChannelIdFilter] = useState<number | "">("");
//   const [startDate, setStartDate] = useState<Date | null>(null);
//   const [endDate, setEndDate] = useState<Date | null>(null);
//   const [selectedRange, setSelectedRange] = useState("all");
//   const [dateField, setDateField] = useState<"createdAt" | "updatedAt">("updatedAt"); // New state
//   const [channels, setChannels] = useState<Channel[]>([]);
//   const [defaultThresholds, setDefaultThresholds] = useState<
//     { fieldName: string; minValue: number; maxValue: number; unit: string }[]
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [openSettings, setOpenSettings] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const handleOpenSettings = () => setOpenSettings(true);
//   const handleCloseSettings = () => setOpenSettings(false);

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [channelsResponse, thresholdsResponse] = await Promise.all([
//         fetch("/api/controls/channels", { cache: "no-store" }),
//         fetch("/api/controls/settings", { cache: "no-store" }),
//       ]);

//       if (!channelsResponse.ok) throw new Error("Failed to fetch channels");
//       if (!thresholdsResponse.ok)
//         throw new Error("Failed to fetch default thresholds");

//       const channelsData = await channelsResponse.json();
//       const thresholdsData = await thresholdsResponse.json();

//       setChannels(channelsData);
//       setDefaultThresholds(thresholdsData.fields || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//       setIsRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSettingsSave = () => {
//     fetchData();
//   };

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     setSearchTerm("");
//     setChannelIdFilter("");
//     setStartDate(null);
//     setEndDate(null);
//     setSelectedRange("all");
//     setDateField("updatedAt"); // Reset date field
//     fetchData();
//   };

//   // Filter channels based on search term, channel ID, and date range
//   const filteredChannels = channels.filter((channel) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       channel.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesChannelId =
//       channelIdFilter === "" || channel.id === channelIdFilter;
//     const channelDate = new Date(channel[dateField]); // Use selected date field
//     const matchesDate =
//       (!startDate || channelDate >= startOfDay(startDate)) &&
//       (!endDate || channelDate <= endOfDay(endDate));
//     return matchesSearch && matchesChannelId && matchesDate;
//   });

//   // Get unique Channel IDs for the filter dropdown
//   const channelIds = [...new Set(channels.map((channel) => channel.id))].sort(
//     (a, b) => a - b
//   );

//   if (loading) return <Typography>Loading...</Typography>;
//   if (error) return <Typography color="error">{error}</Typography>;

//   return (
//     <>
//       <Typography variant="h3" gutterBottom display="inline">
//         Controls
//       </Typography>

//       <Breadcrumbs aria-label="Breadcrumb" mt={2}>
//         <Link component={NextLink} href="/">
//           Dashboard
//         </Link>
//         <Typography>Controls</Typography>
//       </Breadcrumbs>

//       <Divider my={6} />

//       <SearchBarContainer>
//         <TextField
//           placeholder="Search by name"
//           variant="outlined"
//           size="small"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           InputProps={{
//             startAdornment: <SearchIcon color="action" />,
//           }}
//           sx={{ minWidth: 300 }}
//         />
//         <FormControl size="small" sx={{ minWidth: 150 }}>
//           <InputLabel>Channel ID</InputLabel>
//           <Select
//             value={channelIdFilter}
//             label="Channel ID"
//             onChange={(e) => setChannelIdFilter(e.target.value as number | "")}
//           >
//             <MenuItem value="">
//               <em>All</em>
//             </MenuItem>
//             {channelIds.map((id) => (
//               <MenuItem key={id} value={id}>
//                 {id}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//         <DateFilterMenu
//           startDate={startDate}
//           endDate={endDate}
//           setStartDate={setStartDate}
//           setEndDate={setEndDate}
//           selectedRange={selectedRange}
//           setSelectedRange={setSelectedRange}
//           dateField={dateField}
//           setDateField={setDateField}
//         />
//         <Button
//           variant="outlined"
//           onClick={handleRefresh}
//           startIcon={
//             isRefreshing ? <CircularProgress size={20} /> : <RefreshIcon />
//           }
//           disabled={isRefreshing}
//           sx={{ minWidth: 100 }}
//         >
//           {isRefreshing ? "Refreshing..." : "Refresh"}
//         </Button>

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleOpenSettings}
//           sx={{ ml: "auto" }}
//         >
//           Manage Settings
//         </Button>
//       </SearchBarContainer>

//       <Modal
//         open={openSettings}
//         onClose={handleCloseSettings}
//         aria-labelledby="settings-modal-title"
//         sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
//       >
//         <Box
//           sx={{
//             bgcolor: "background.paper",
//             p: 4,
//             borderRadius: 2,
//             boxShadow: 24,
//             maxWidth: 800,
//             width: "100%",
//           }}
//         >
//           <SettingsForm
//             handleClose={handleCloseSettings}
//             onSave={handleSettingsSave}
//           />
//         </Box>
//       </Modal>

//       <Box sx={{ mb: 5, padding: 2 }}>
//         <Grid container spacing={6}>
//           {filteredChannels.map((channel) => (
//             <Grid item xs={12} key={channel.id}>
//               <LabCard
//                 channelId={channel.id}
//                 name={channel.name}
//                 apiKey={channel.ApiKey[0]?.api || ""}
//                 defaultThresholds={defaultThresholds}
//               />
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </>
//   );
// }


function Controls() {
  const [searchTerm, setSearchTerm] = useState("");
  const [channelIdFilter, setChannelIdFilter] = useState<number | "">("");
  const [createdStartDate, setCreatedStartDate] = useState<Date | null>(null);
  const [createdEndDate, setCreatedEndDate] = useState<Date | null>(null);
  const [updatedStartDate, setUpdatedStartDate] = useState<Date | null>(null);
  const [updatedEndDate, setUpdatedEndDate] = useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = useState("all");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [defaultThresholds, setDefaultThresholds] = useState<
    { fieldName: string; minValue: number; maxValue: number; unit: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [channelsResponse, thresholdsResponse] = await Promise.all([
        fetch("/api/controls/channels", { cache: "no-store" }),
        fetch("/api/controls/settings", { cache: "no-store" }),
      ]);

      if (!channelsResponse.ok) throw new Error("Failed to fetch channels");
      if (!thresholdsResponse.ok)
        throw new Error("Failed to fetch default thresholds");

      const channelsData = await channelsResponse.json();
      const thresholdsData = await thresholdsResponse.json();

      setChannels(channelsData);
      setDefaultThresholds(thresholdsData.fields || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSettingsSave = () => {
    fetchData();
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSearchTerm("");
    setChannelIdFilter("");
    setCreatedStartDate(null);
    setCreatedEndDate(null);
    setUpdatedStartDate(null);
    setUpdatedEndDate(null);
    setSelectedRange("all");
    fetchData();
  };

  const filteredChannels = channels.filter((channel) => {
    const matchesSearch =
      searchTerm === "" ||
      channel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannelId =
      channelIdFilter === "" || channel.id === channelIdFilter;
    const createdDate = new Date(channel.createdAt);
    const updatedDate = new Date(channel.updatedAt);
    const matchesCreatedDate =
      (!createdStartDate || createdDate >= startOfDay(createdStartDate)) &&
      (!createdEndDate || createdDate <= endOfDay(createdEndDate));
    const matchesUpdatedDate =
      (!updatedStartDate || updatedDate >= startOfDay(updatedStartDate)) &&
      (!updatedEndDate || updatedDate <= endOfDay(updatedEndDate));
    return matchesSearch && matchesChannelId && matchesCreatedDate && matchesUpdatedDate;
  });

  const channelIds = [...new Set(channels.map((channel) => channel.id))].sort(
    (a, b) => a - b
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Typography variant="h3" gutterBottom display="inline">
        Controls
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NextLink} href="/">
          Dashboard
        </Link>
        <Typography>Controls</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <SearchBarContainer>
        <TextField
          placeholder="Search by name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Channel ID</InputLabel>
          <Select
            value={channelIdFilter}
            label="Channel ID"
            onChange={(e) => setChannelIdFilter(e.target.value as number | "")}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {channelIds.map((id) => (
              <MenuItem key={id} value={id}>
                {id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DateFilterMenu
          createdStartDate={createdStartDate}
          createdEndDate={createdEndDate}
          updatedStartDate={updatedStartDate}
          updatedEndDate={updatedEndDate}
          setCreatedStartDate={setCreatedStartDate}
          setCreatedEndDate={setCreatedEndDate}
          setUpdatedStartDate={setUpdatedStartDate}
          setUpdatedEndDate={setUpdatedEndDate}
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
        />
        <Button
          variant="outlined"
          onClick={handleRefresh}
          startIcon={
            isRefreshing ? <CircularProgress size={20} /> : <RefreshIcon />
          }
          disabled={isRefreshing}
          sx={{ minWidth: 100 }}
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenSettings}
          sx={{ ml: "auto" }}
        >
          Manage Settings
        </Button>
      </SearchBarContainer>

      <Modal
        open={openSettings}
        onClose={handleCloseSettings}
        aria-labelledby="settings-modal-title"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 4,
            borderRadius: 2,
            boxShadow: 24,
            maxWidth: 800,
            width: "100%",
          }}
        >
          <SettingsForm
            handleClose={handleCloseSettings}
            onSave={handleSettingsSave}
          />
        </Box>
      </Modal>

      <Box sx={{ mb: 5, padding: 2 }}>
        <Grid container spacing={6}>
          {filteredChannels.map((channel) => (
            <Grid item xs={12} key={channel.id}>
              <LabCard
                channelId={channel.id}
                name={channel.name}
                apiKey={channel.ApiKey[0]?.api || ""}
                defaultThresholds={defaultThresholds}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default Controls;
export default Controls;
