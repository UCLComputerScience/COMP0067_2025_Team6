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
      {/* Change: Use unit prop instead of sensorRanges */}
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

  const handleThresholdsSave = () => {
    // Refresh thresholds
    fetchThresholds();
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
      setThresholds(data.thresholds || []);
    } catch (err) {
      console.error("Error fetching thresholds:", err);
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
    fetchThresholds(); // Initial fetch of thresholds
  }, [channelId, apiKey]);

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

  // Initialize slider values using thresholds or defaultThresholds
  const initialSliderValues = fields.map((field) => {
    const threshold = thresholds.find((t) => t.fieldName === field.label);
    const defaultThreshold = defaultThresholds.find(
      (t) => t.fieldName === field.label
    );
    if (threshold) {
      return [threshold.minValue, threshold.maxValue];
    } else if (defaultThreshold) {
      return [defaultThreshold.minValue, defaultThreshold.maxValue];
    } else {
      const latest = parseFloat(field.latestValue);
      return [latest - 10, latest + 10];
    }
  });

  if (sliderValues.length === 0 && fields.length > 0) {
    setSliderValues(initialSliderValues);
  }

  const handleSliderChange = (index: number, newValue: number | number[]) => {
    const updated = [...sliderValues];
    updated[index] = newValue as number[];
    setSliderValues(updated);
  };

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
              value={sliderValues[index]}
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

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
      </CardContent>
    </Card>
  );
}

function DateFilterMenu({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  selectedRange,
  setSelectedRange,
}: {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  selectedRange: string;
  setSelectedRange: (range: string) => void;
}) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(
    null
  );

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

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setMenuAnchorEl(null);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleApplyCustomRange = () => {
    setSelectedRange("custom");
    if (startDate) setStartDate(startOfDay(startDate));
    if (endDate) setEndDate(endOfDay(endDate));
    setPopoverAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleDateFilterClick}
        startIcon={<FilterListIcon />}
        sx={{ minWidth: 100 }}
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
        <MenuItem onClick={() => handleRangeSelect("7days")}>
          Last 7 Days
        </MenuItem>
        <MenuItem onClick={() => handleRangeSelect("30days")}>
          Last 30 Days
        </MenuItem>
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
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Select Date Range
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { size: "small" } }}
                format="dd/MM/yyyy"
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { size: "small" } }}
                format="dd/MM/yyyy"
              />
            </Box>
          </LocalizationProvider>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
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

function Controls() {
  const [searchTerm, setSearchTerm] = useState("");
  const [channelIdFilter, setChannelIdFilter] = useState<number | "">("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
    setStartDate(null);
    setEndDate(null);
    setSelectedRange("all");
    fetchData();
  };

  // Filter channels based on search term, channel ID, and date range
  const filteredChannels = channels.filter((channel) => {
    const matchesSearch =
      searchTerm === "" ||
      channel.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannelId =
      channelIdFilter === "" || channel.id === channelIdFilter;
    const channelUpdatedAt = new Date(channel.updatedAt);
    const matchesDate =
      (!startDate || channelUpdatedAt >= startOfDay(startDate)) &&
      (!endDate || channelUpdatedAt <= endOfDay(endDate));
    return matchesSearch && matchesChannelId && matchesDate;
  });

  // Get unique Channel IDs for the filter dropdown
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
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
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
