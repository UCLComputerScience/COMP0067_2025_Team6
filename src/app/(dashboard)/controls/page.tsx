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
  Divider as MuiDivider,
  Grid2 as Grid,
  Link,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  TextField,
  FormControl,
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
} from "@mui/icons-material";
import HideAuthGuard from "@/components/guards/HideAuthGuard";

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

// --- Updated interfaces ---
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

// Change: Added defaultThresholds to LabCardProps
interface LabCardProps {
  channelId: number;
  name: string;
  apiKey: string;
  defaultThresholds: { fieldName: string; minValue: number; maxValue: number; unit: string }[];
}

// Change: Added unit to SensorFieldProps
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

// Mocking battery data separately
const batteryData = {
  battery: "85%",
};

// --- Removed sensorRanges since we'll use DefaultThreshold units ---
/* const sensorRanges = {
  Temperature: { min: -50, max: 150, unit: "°C" },
  Pressure: { min: 0, max: 2000, unit: "hPa" },
  Humidity: { min: 0, max: 100, unit: "%" },
}; */

// SensorField Component (Handles the Slider Display)
function SensorField({
  label,
  value,
  min,
  max,
  step,
  unit, // Change: Use unit prop directly
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
  }, [channelId, apiKey]);

  if (!channelData) {
    return <Typography variant="body1">Loading data...</Typography>;
  }

  if (error) {
    return <Typography variant="body1" color="error">{`Error: ${error}`}</Typography>;
  }

  const { channel, feeds } = channelData;
  const latestFeed = feeds[feeds.length - 1];

  const fields = Object.keys(channel)
    .filter((key) => key.startsWith("field"))
    .map((key) => ({
      label: channel[key],
      latestValue: parseFloat(latestFeed[key]).toFixed(2),
    }));

  // Change: Initialize slider values using defaultThresholds or ±10 from latestValue
  const initialSliderValues = fields.map((field) => {
    const threshold = defaultThresholds.find((t) => t.fieldName === field.label);
    if (threshold) {
      return [threshold.minValue, threshold.maxValue];
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
          <MenuItem onClick={() => { handleMenuClose(); console.log("Edit Settings clicked"); }}>
            Edit Settings
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); console.log("Delete Device clicked"); }}>
            Delete Device
          </MenuItem>
        </Menu>

        <Box sx={{ height: "16px" }}></Box>

        {fields.map((field, index) => {
          // Change: Use defaultThresholds or ±10 from latestValue for min/max
          const threshold = defaultThresholds.find((t) => t.fieldName === field.label);
          const latest = parseFloat(field.latestValue);
          return (
            <SensorField
              key={index}
              label={field.label}
              value={sliderValues[index]}
              min={threshold?.minValue ?? (latest - 10)}
              max={threshold?.maxValue ?? (latest + 10)}
              step={0.1} // Change: Use 0.1 for finer control
              unit={threshold?.unit || ""} // Change: Use unit from defaultThresholds
              onSliderChange={(event, newValue) => handleSliderChange(index, newValue)}
              latestValue={field.latestValue}
            />
          );
        })}

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Box sx={{ backgroundColor: "#f0f0f0", borderRadius: "4px", padding: "8px", flex: 1 }}>
            <Typography variant="body2">
              <strong>Start date:</strong> {new Date(channel.created_at).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ backgroundColor: "#f0f0f0", borderRadius: "4px", padding: "8px", flex: 1 }}>
            <Typography variant="body2">
              <strong>Last updated:</strong> {new Date(channel.updated_at).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function SettingsForm() {
  const [fields, setFields] = useState<
    { fieldName: string; minValue: string | number; maxValue: string | number; unit: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (index: number, key: string, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields([...fields, { fieldName: "", minValue: "", maxValue: "", unit: "" }]);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/controls/settings");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.fields && Array.isArray(data.fields)) {
          setFields(
            data.fields.map((field: any) => ({
              fieldName: field.fieldName,
              minValue: field.minValue.toString(),
              maxValue: field.maxValue.toString(),
              unit: field.unit || "",
            }))
          );
        } else {
          setFields([]);
        }
      } catch (error) {
        console.error("Error fetching default thresholds:", error);
        setError("Failed to load default thresholds. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (fields.length > 0) {
      const invalidFields = fields.filter((field) => {
        const min = field.minValue === "" ? NaN : Number(field.minValue);
        const max = field.maxValue === "" ? NaN : Number(field.maxValue);
        return !field.fieldName || isNaN(min) || isNaN(max) || min > max;
      });

      if (invalidFields.length > 0) {
        setError(
          "All fields must have a valid name and numeric min/max values, with min less than max."
        );
        setLoading(false);
        return;
      }
    }

    const submissionFields = fields.map((field) => ({
      fieldName: field.fieldName,
      minValue: Number(field.minValue),
      maxValue: Number(field.maxValue),
      unit: field.unit,
    }));

    try {
      const response = await fetch("/api/controls/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: submissionFields }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setFields(
        data.fields?.count
          ? submissionFields.map((field) => ({
              ...field,
              minValue: field.minValue.toString(),
              maxValue: field.maxValue.toString(),
            }))
          : data.fields.map((field: any) => ({
              fieldName: field.fieldName,
              minValue: field.minValue.toString(),
              maxValue: field.maxValue.toString(),
              unit: field.unit || "",
            }))
      );
      alert("Default thresholds saved successfully!");
    } catch (error) {
      console.error("Error saving default thresholds:", error);
      setError("Failed to save default thresholds. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        mb: 4,
        p: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Default Threshold Settings
      </Typography>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      {loading && <Typography mb={2}>Loading...</Typography>}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {fields.length === 0 && !loading ? (
            <Typography variant="body1" color="textSecondary">
              No fields defined yet. Click "Add Field" to start.
            </Typography>
          ) : (
            fields.map((field, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1,
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  label={`Field ${index + 1}`}
                  value={field.fieldName}
                  onChange={(e) =>
                    handleFieldChange(index, "fieldName", e.target.value)
                  }
                  sx={{ width: 200 }}
                  placeholder="Enter field name"
                  required
                  disabled={loading}
                />
                <TextField
                  label="Min Value"
                  type="number"
                  value={field.minValue}
                  onChange={(e) =>
                    handleFieldChange(index, "minValue", e.target.value)
                  }
                  sx={{ width: 120 }}
                  inputProps={{ step: "0.1" }}
                  placeholder="Enter min value"
                  required
                  disabled={loading}
                />
                <TextField
                  label="Max Value"
                  type="number"
                  value={field.maxValue}
                  onChange={(e) =>
                    handleFieldChange(index, "maxValue", e.target.value)
                  }
                  sx={{ width: 120 }}
                  inputProps={{ step: "0.1" }}
                  placeholder="Enter max value"
                  required
                  disabled={loading}
                />
                <TextField
                  label="Unit"
                  value={field.unit}
                  onChange={(e) =>
                    handleFieldChange(index, "unit", e.target.value)
                  }
                  sx={{ width: 80 }}
                  placeholder="e.g., °C"
                  disabled={loading}
                />
                <IconButton
                  onClick={() => handleRemoveField(index)}
                  sx={{
                    border: "1px solid grey",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    color: "grey",
                    "&:hover": {
                      borderColor: "darkgrey",
                      color: "darkgrey",
                    },
                  }}
                  disabled={loading}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            ))
          )}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddField}
            sx={{ alignSelf: "flex-start", mb: 2 }}
            disabled={loading}
          >
            Add Field
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ alignSelf: "flex-start", mt: 2 }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </Box>
      </form>
    </Box>
  );
}

function Controls() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabId, setSelectedLabId] = useState<number | "">("");
  const [channels, setChannels] = useState<Channel[]>([]);
  // Change: Added defaultThresholds state
  const [defaultThresholds, setDefaultThresholds] = useState<
    { fieldName: string; minValue: number; maxValue: number; unit: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSettings, setOpenSettings] = useState(false);

  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);

  // Change: Fetch defaultThresholds along with channels
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [channelsResponse, thresholdsResponse] = await Promise.all([
          fetch("/controls/api/all_channels"),
          fetch("/api/controls/settings"),
        ]);

        if (!channelsResponse.ok) throw new Error("Failed to fetch channels");
        if (!thresholdsResponse.ok) throw new Error("Failed to fetch default thresholds");

        const channelsData = await channelsResponse.json();
        const thresholdsData = await thresholdsResponse.json();

        setChannels(channelsData);
        setDefaultThresholds(thresholdsData.fields || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const filteredChannels = channels.filter(
    (channel) =>
      searchTerm === "" ||
      channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          placeholder="Search"
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
          <InputLabel>Lab ID</InputLabel>
          <Select
            value={selectedLabId}
            label="Lab ID"
            onChange={(e) => setSelectedLabId(e.target.value as number | "")}
            disabled
          >
            <MenuItem value="">
              <em>All Labs</em>
            </MenuItem>
          </Select>
        </FormControl>
        <HideAuthGuard requiredRoles={["ADMIN", "SUPER_USER"]}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenSettings}
            sx={{ ml: "auto" }}
          >
            Manage Settings
          </Button>
        </HideAuthGuard>
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
          <SettingsForm />
        </Box>
      </Modal>

      <Box sx={{ mb: 5, padding: 2 }}>
        <Grid container spacing={6}>
          {filteredChannels.map((channel) => (
            <Grid item xs={12} key={channel.id}>
              {/* Change: Pass defaultThresholds to LabCard */}
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

// const TaskTitle = styled(Typography)`
//   font-weight: 600;
//   font-size: 15px;
//   margin-right: ${(props) => props.theme.spacing(10)};
// `;

// const TaskWrapper = styled(Card)`
//   border: 1px solid ${(props) => props.theme.palette.grey[300]};
//   margin-bottom: ${(props) => props.theme.spacing(4)};
//   cursor: grab;

//   &:hover {
//     background: ${(props) => props.theme.palette.background.default};
//   }
// `;

// const TaskWrapperContent = styled(CardContent)`
//   position: relative;

//   &:last-child {
//     padding-bottom: ${(props) => props.theme.spacing(4)};
//   }
// `;

// const TaskAvatars = styled.div`
//   margin-top: ${(props) => props.theme.spacing(1)};
// `;

// const MessageCircleIcon = styled(MessageCircle)`
//   color: ${(props) => props.theme.palette.grey[500]};
//   vertical-align: middle;
// `;

// const TaskBadge = styled.div`
//   background: ${(props) => props.color};
//   width: 40px;
//   height: 6px;
//   border-radius: 6px;
//   display: inline-block;
//   margin-right: ${(props) => props.theme.spacing(2)};
// `;

// const TaskNotifications = styled.div`
//   display: flex;
//   position: absolute;
//   bottom: ${(props) => props.theme.spacing(4)};
//   right: ${(props) => props.theme.spacing(4)};
// `;

// const TaskNotificationsAmount = styled.div`
//   color: ${(props) => props.theme.palette.grey[500]};
//   font-weight: 600;
//   margin-right: ${(props) => props.theme.spacing(1)};
//   line-height: 1.75;
// `;

// const mockItems1 = [
//   {
//     id: faker.datatype.uuid(),
//     title: "Redesign the homepage",
//     badges: [green[600], orange[600]],
//     notifications: 2,
//     avatars: [1, 2, 3, 4],
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: "Upgrade dependencies to latest versions",
//     badges: [green[600]],
//     notifications: 1,
//     avatars: [2],
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: "Google Adwords best practices",
//     badges: [],
//     notifications: 0,
//     avatars: [2, 3],
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: "Improve site speed",
//     badges: [green[600]],
//     notifications: 3,
//     avatars: [],
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: "Stripe payment integration",
//     badges: [blue[600]],
//     notifications: 0,
//     avatars: [],
//   },
// ];

// const mockItems2 = [
//   {
//     id: faker.datatype.uuid(),
//     title: "Google Adwords best practices",
//     badges: [],
//     notifications: 0,
//     avatars: [2, 3],
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: "Stripe payment integration",
//     badges: [blue[600]],
//     notifications: 0,
//     avatars: [2],
//   },
// ];

// const mockItems3 = [
//   {
//     id: faker.datatype.uuid(),
//     title: "Improve site speed",
//     badges: [green[600]],
//     notifications: 3,
//     avatars: [1, 2],
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: "Google Adwords best practices",
//     badges: [],
//     notifications: 0,
//     avatars: [2],
//   },
//   {
//     id: faker.datatype.uuid(),
//     title: "Redesign the homepage",
//     badges: [green[600], orange[600]],
//     notifications: 2,
//     avatars: [],
//   },
// ];

// const mockColumns = {
//   [faker.datatype.uuid()]: {
//     title: "Backlog",
//     description: "Nam pretium turpis et arcu. Duis arcu.",
//     items: mockItems1,
//   },
//   [faker.datatype.uuid()]: {
//     title: "In Progress",
//     description: "Curabitur ligula sapien, tincidunt non.",
//     items: mockItems2,
//   },
//   [faker.datatype.uuid()]: {
//     title: "Completed",
//     description: "Aenean posuere, tortor sed cursus feugiat.",
//     items: mockItems3,
//   },
// };

// const onDragEnd = (result: DropResult, columns: any, setColumns: any) => {
//   if (!result.destination) return;
//   const { source, destination } = result;

//   if (source.droppableId !== destination.droppableId) {
//     const sourceColumn = columns[source.droppableId];
//     const destColumn = columns[destination.droppableId];
//     const sourceItems = [...sourceColumn.items];
//     const destItems = [...destColumn.items];
//     const [removed] = sourceItems.splice(source.index, 1);
//     destItems.splice(destination.index, 0, removed);
//     setColumns({
//       ...columns,
//       [source.droppableId]: {
//         ...sourceColumn,
//         items: sourceItems,
//       },
//       [destination.droppableId]: {
//         ...destColumn,
//         items: destItems,
//       },
//     });
//   } else {
//     const column = columns[source.droppableId];
//     const copiedItems = [...column.items];
//     const [removed] = copiedItems.splice(source.index, 1);
//     copiedItems.splice(destination.index, 0, removed);
//     setColumns({
//       ...columns,
//       [source.droppableId]: {
//         ...column,
//         items: copiedItems,
//       },
//     });
//   }
// };

// interface LaneProps {
//   column: {
//     title: string;
//     description: string;
//   };
//   children: ReactNode;
// }

// const Lane = ({ column, children }: LaneProps) => {
//   return (
//     <Grid
//       size={{
//         xs: 12,
//         lg: 4,
//         xl: 4,
//       }}
//     >
//       <Card mb={6}>
//         <CardContent pb={0}>
//           <Typography variant="h6" gutterBottom>
//             {column.title}
//           </Typography>
//           <Typography variant="body2" mb={4}>
//             {column.description}
//           </Typography>
//           {children}
//           <Button color="primary" variant="contained" fullWidth>
//             <AddIcon />
//             Add new task
//           </Button>
//         </CardContent>
//       </Card>
//     </Grid>
//   );
// };

// interface TaskProps {
//   item: {
//     badges: any;
//     title: string;
//     avatars: any;
//     notifications: any;
//   };
// }

// const Task = ({ item }: TaskProps) => {
//   return (
//     <TaskWrapper mb={4}>
//       <TaskWrapperContent>
//         {item.badges &&
//           item.badges.map((color: any, i: number) => (
//             <TaskBadge color={color} key={i} />
//           ))}

//         <TaskTitle variant="body1" gutterBottom>
//           {item.title}
//         </TaskTitle>

//         <TaskAvatars>
//           <AvatarGroup max={3}>
//             {!!item.avatars &&
//               item.avatars.map((avatar: any, i: number) => (
//                 <Avatar
//                   src={`/static/img/avatars/avatar-${avatar}.jpg`}
//                   key={i}
//                 />
//               ))}
//           </AvatarGroup>
//         </TaskAvatars>

//         {!!item.notifications && item.notifications > 0 && (
//           <TaskNotifications>
//             <TaskNotificationsAmount>
//               {item.notifications}
//             </TaskNotificationsAmount>
//             <MessageCircleIcon />
//           </TaskNotifications>
//         )}
//       </TaskWrapperContent>
//     </TaskWrapper>
//   );
// };

// function Tasks() {
//   const [columns, setColumns] = useState(mockColumns);
//   const [documentReady, setDocumentReady] = useState(false);

//   useEffect(() => {
//     setDocumentReady(true);
//   }, []);

//   return (
//     <React.Fragment>
//       <Typography variant="h3" gutterBottom display="inline">
//         Controls
//       </Typography>

//       <Breadcrumbs aria-label="Breadcrumb" mt={2}>
//         <Link component={NextLink} href="/">
//           Dashboard
//         </Link>
//         {/* <Link component={NextLink} href="/">
//           Pages
//         </Link> */}
//         <Typography>Controls</Typography>
//       </Breadcrumbs>

//       <Divider my={6} />

//       <Grid container spacing={6}>
//         {!!documentReady && (
//           <DragDropContext
//             onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
//           >
//             {Object.entries(columns).map(([columnId, column]) => (
//               <Lane key={columnId} column={column}>
//                 <Droppable droppableId={columnId} key={columnId}>
//                   {(provided) => {
//                     return (
//                       <div
//                         {...provided.droppableProps}
//                         ref={provided.innerRef}
//                         style={{
//                           minHeight: 50,
//                         }}
//                       >
//                         {column.items.map((item, index) => {
//                           return (
//                             <Draggable
//                               key={item.id}
//                               draggableId={item.id}
//                               index={index}
//                             >
//                               {(provided) => {
//                                 return (
//                                   <div
//                                     ref={provided.innerRef}
//                                     {...provided.draggableProps}
//                                     {...provided.dragHandleProps}
//                                   >
//                                     <Task item={item} />
//                                   </div>
//                                 );
//                               }}
//                             </Draggable>
//                           );
//                         })}
//                         {provided.placeholder}
//                       </div>
//                     );
//                   }}
//                 </Droppable>
//               </Lane>
//             ))}
//           </DragDropContext>
//         )}
//       </Grid>
//     </React.Fragment>
//   );
// }

// export default Tasks;
