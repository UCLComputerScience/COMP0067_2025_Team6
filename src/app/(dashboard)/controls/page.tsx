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
  TextField,
  FormControl,
  Typography as MuiTypography,
  IconButton,
  Select,
  Slider,
  Switch,
} from "@mui/material";
// import LabCard from "@/components/pages/dashboard/controls/LabCard";
import { spacing } from "@mui/system";
import { orange, green, blue } from "@mui/material/colors";
import {
  Add as AddIcon,
  MoreVert,
  Search as SearchIcon,
} from "@mui/icons-material";
import BatteryGauge from "react-battery-gauge"; //had installed react-battery-gauge (can remove if causing issues)

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

const SwitchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 6px;
  width: 100%;
`;

const SearchBarContainer = styled(Box)`
  display: flex;
  justify-content: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
`;

// Mocking battery data separately
const batteryData = {
  battery: "85%", // This could be updated later if connected to a real source
};

const channelData = [
  { channelId: 2606541, name: "Proteus Monitor 1", labId: 247 },
  { channelId: 2613687, name: "Proteus Monitor 2", labId: 247 },
  { channelId: 2207475, name: "Proteus P9", labId: 247 },
  { channelId: 2035654, name: "Proteus P8", labId: 249 },
  { channelId: 1746537, name: "Proteus P7", labId: 249 },
  { channelId: 1746536, name: "Proteus P6", labId: 249 },
  { channelId: 1746535, name: "Proteus P5", labId: 312 },
  { channelId: 1603568, name: "Proteus P4", labId: 312 },
  { channelId: 1603565, name: "Proteus P3", labId: 249 },
  { channelId: 1598577, name: "Proteus P2", labId: 247 },
  { channelId: 1593183, name: "Proteus P1", labId: 249 },
];

// const labData = {
//   channel: {
//     id: 2606541,
//     name: "Proteus Monitor 1",
//     latitude: "0.0",
//     longitude: "0.0",
//     field1: "Temperature",
//     field2: "Humidity",
//     field3: "Pressure",
//     created_at: "2024-07-23T12:14:02Z",
//     updated_at: "2024-08-15T06:42:31Z",
//     last_entry_id: 12967,
//   },
//   feeds: [
//     {
//       created_at: "2025-03-01T09:50:39Z",
//       entry_id: 12966,
//       field1: "25.05000",
//       field2: "36.68066",
//       field3: "1018.11660",
//     },
//     {
//       created_at: "2025-03-01T09:50:53Z",
//       entry_id: 12967,
//       field1: "25.05000",
//       field2: "36.69141",
//       field3: "1018.11390",
//     },
//   ],
// };

const sensorRanges = {
  Temperature: { min: -50, max: 150, unit: "°C" }, // Unit for Temperature
  Pressure: { min: 0, max: 2000, unit: "hPa" }, // Unit for Pressure
  Humidity: { min: 0, max: 100, unit: "%" }, // Unit for Humidity
};

// SensorField Component (Handles the Slider Display)
function SensorField({
  label,
  value,
  min,
  max,
  step,
  onSliderChange,
  latestValue,
}) {
  // Extract unit from sensorRanges using the label
  const unit = sensorRanges[label]?.unit || "";

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
        // Marks: an indicator for the actual sensor reading.
        marks={[
          {
            value: parseFloat(latestValue),
            // label: `${latestValue} units`,
          },
        ]}
        sx={{
          width: "120px", // Fixed width for the slider
          margin: "0 8px",
          "& .MuiSlider-mark": {
            width: 10, // Increase the width
            height: 10, // Increase the height
            borderRadius: "50%", // Make them circular
            backgroundColor: "orange", // Ensure the mark is white
          },
          "& .MuiSlider-thumb": {
            width: 12, // Set the desired width
            height: 12, // Set the desired height
            borderRadius: "50%", // Ensure the thumb remains circular
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

function LabCard({ channelId, name }) {
  const [channelData, setChannelData] = useState(null);
  const [sliderValues, setSliderValues] = useState([]); // State to handle slider values
  const [toggle, setToggle] = useState(false); // Toggle state
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Menu state

  // Function to handle menu open/close
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.thingspeak.com/channels/${channelId}/feeds.json?`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setChannelData(data); // Set the API response
      } catch (err) {
        setError(err.message); // Handle errors by setting the error message
      }
    };

    fetchData();
  }, [channelId]);

  // If data is still loading
  if (!channelData) {
    return <Typography variant="body1">Loading data...</Typography>;
  }

  // If there's an error, show the error message
  if (error) {
    return (
      <Typography variant="body1" color="error">{`Error: ${error}`}</Typography>
    );
  }

  // Destructure data from the API response
  const { channel, feeds } = channelData;

  // Get the latest feed 
  const latestFeed = feeds[feeds.length - 1];

  // Create an array of fields using keys that start with 'field'
  const fields = Object.keys(channel)
    .filter((key) => key.startsWith("field"))
    .map((key) => ({
      label: channel[key], // e.g., "Temperature", "Humidity", etc.
      latestValue: parseFloat(latestFeed[key]).toFixed(2), // e.g., "25.05000", etc.
    }));

  // Initialize slider values for each field as [0, 100] directly
  const initialSliderValues = fields.map(() => [0, 100]);

  // Set the slider values state if it's the first render
  if (sliderValues.length === 0 && fields.length > 0) {
    setSliderValues(initialSliderValues);
  }

  // Handle slider change for each sensor
  const handleSliderChange = (index, newValue) => {
    const updated = [...sliderValues];
    updated[index] = newValue; // newValue is an array: [minThreshold, maxThreshold]
    setSliderValues(updated);
  };

  const handleToggleChange = (event) => {
    setToggle(event.target.checked);
  };

  return (
    <Card sx={{ maxWidth: 320, marginBottom: 4 }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%", // Ensure it takes up the full height
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Device Name */}
          <Grid item>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {channel.name}
            </Typography>
          </Grid>

          {/* Battery and Menu Icons */}
          <Grid item>
            {/* <IconButton>
              <BatteryGauge
                value={parseInt(batteryData.battery, 10)}
                size={35}
              />
            </IconButton> */}
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          </Grid>
        </Grid>

        {/* Menu Component */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              console.log("Edit Settings clicked");
            }}
          >
            Edit Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              console.log("Delete Device clicked");
            }}
          >
            Delete Device
          </MenuItem>
        </Menu>

        {/* Create space */}
        <Box sx={{ height: "16px" }}></Box>

        {/* Display Sensor Fields with sliders */}
        {fields.map((field, index) => (
          <SensorField
            key={index}
            label={field.label}
            value={sliderValues[index]}
            min={0}
            max={100}
            step={1}
            onSliderChange={(event, newValue) =>
              handleSliderChange(index, newValue)
            }
            latestValue={field.latestValue}
          />
        ))}

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
        <SwitchContainer>
          <Switch
            checked={toggle}
            onChange={handleToggleChange}
            sx={{ transform: "scale(1.7)" }}
          />
        </SwitchContainer>
      </CardContent>
    </Card>
  );
}

function Controls() {
  // State for search and selected lab filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabId, setSelectedLabId] = useState<number | "">("");

  // Group by labId
  const groupedByLab = channelData.reduce((groups, channel) => {
    if (!groups[channel.labId]) {
      groups[channel.labId] = [];
    }
    groups[channel.labId].push(channel);
    return groups;
  }, {});

  // Filter channels based on search term and selected labId
  const filteredLabs = Object.entries(groupedByLab).filter(
    ([labId, channels]) => {
      return (
        (searchTerm === "" ||
          channels.some((channel) =>
            channel.name.toLowerCase().includes(searchTerm.toLowerCase())
          )) &&
        (selectedLabId === "" || Number(labId) === selectedLabId)
      );
    }
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
        {/* <Link component={NextLink} href="/">
          Pages
        </Link> */}
        <Typography>Controls</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      {/* Search and Filter Bar */}
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
            onChange={(e) => setSelectedLabId(e.target.value)}
          >
            <MenuItem value="">
              <em>All Labs</em>
            </MenuItem>
            {Object.keys(groupedByLab).map((labId) => (
              <MenuItem key={labId} value={Number(labId)}>
                {`Lab ${labId}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </SearchBarContainer>

      {/* Render filtered lab sections */}
      {filteredLabs.map(([labId, channels]) => (
        <Box
          key={labId}
          sx={{
            mb: 5,
            backgroundColor: "#f5f5f5", // Light grey background for the box
            padding: 2, // Padding inside the box
            borderRadius: 2, // Rounded corners
            border: "1px solid #ddd", // Light border to define the box
            boxShadow: 2, // Subtle shadow effect for a card-like appearance
            pl: 8, // Left padding for the entire box
          }}
        >
          <Typography variant="h3" gutterBottom>
            Lab {labId}
          </Typography>

          <Grid container spacing={6}>
            {/* Map through the predefined channel data and create LabCard for each channel */}
            {channels.map((channel) => (
              <Grid item xs={12} key={channel.channelId}>
                <LabCard channelId={channel.channelId} name={channel.name} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
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
