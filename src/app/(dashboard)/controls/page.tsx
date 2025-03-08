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
  Typography as MuiTypography,
  IconButton,
  Slider,
  Switch,
} from "@mui/material";
// import LabCard from "@/components/pages/dashboard/controls/LabCard";
import { spacing } from "@mui/system";
import { orange, green, blue } from "@mui/material/colors";
import {
  Add as AddIcon,
  BatteryChargingFull,
  MoreVert,
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
  margin-top: 16px;
  width: 100%;
`;

// Mocking battery data separately
const batteryData = {
  battery: "85%", // This could be updated later if connected to a real source
};

const labData = {
  channel: {
    id: 2606541,
    name: "Proteus Monitor 1",
    latitude: "0.0",
    longitude: "0.0",
    field1: "Temperature",
    field2: "Humidity",
    field3: "Pressure",
    created_at: "2024-07-23T12:14:02Z",
    updated_at: "2024-08-15T06:42:31Z",
    last_entry_id: 12967,
  },
  feeds: [
    {
      created_at: "2025-03-01T09:50:39Z",
      entry_id: 12966,
      field1: "25.05000",
      field2: "36.68066",
      field3: "1018.11660",
    },
    {
      created_at: "2025-03-01T09:50:53Z",
      entry_id: 12967,
      field1: "25.05000",
      field2: "36.69141",
      field3: "1018.11390",
    },
  ],
};

const sensorRanges = {
  Temperature: { min: -50, max: 150 },
  Pressure: { min: 0, max: 2000 },
  Humidity: { min: 0, max: 100 },
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
            label: `${latestValue} units`,
          },
        ]}
        sx={{
          width: "100%",
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
      <Typography variant="body2" sx={{ width: "80px", textAlign: "center" }}>
        {`${latestValue} units`}
      </Typography>
    </Box>
  );
}

function LabCard({ channelId }) {
  // Look up the channel data using the channelId
  const { channel, feeds } = labData; // For now, labData is our static source
  if (channel.id !== channelId) {
    return (
      <Typography variant="body1">No data for channelId {channelId}</Typography>
    );
  }

  // Get the latest feed (we assume the last element is the latest)
  const latestFeed = feeds[feeds.length - 1];

  // Create an array of fields using keys that start with 'field'
  const fields = Object.keys(channel)
    .filter((key) => key.startsWith("field"))
    .map((key) => ({
      label: channel[key], // e.g., "Temperature", "Humidity", etc.
      latestValue: latestFeed[key], // e.g., "25.05000", etc.
    }));

  // Initialize slider values for each sensor as a range: [defaultMin, defaultMax]
  // For example, here we default each slider to [30, 70]
  const [sliderValues, setSliderValues] = useState(fields.map(() => [30, 70]));

  const handleSliderChange = (index, newValue) => {
    const updated = [...sliderValues];
    updated[index] = newValue; // newValue is an array: [minThreshold, maxThreshold]
    setSliderValues(updated);
  };

  // Toggle state for the switch at the bottom of the card
  const [toggle, setToggle] = useState(false);
  const handleToggleChange = (event) => {
    setToggle(event.target.checked);
  };

  return (
    <Card sx={{ maxWidth: 345, marginBottom: 4 }}>
      <CardContent>
        <Grid container alignItems="center" justifyContent="space-between">
          {/* Device Name */}
          <Grid item>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              {channel.name}
            </Typography>
          </Grid>

          {/* Battery and Menu Icons */}
          <Grid item>
            <IconButton>
              <BatteryGauge
                value={parseInt(batteryData.battery, 10)}
                size={35}
              />
            </IconButton>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Grid>
        </Grid>

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
              {new Date(channel.created_at).toLocaleString()}
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
              {new Date(channel.updated_at).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <SwitchContainer>
          <Switch checked={toggle} onChange={handleToggleChange} />
        </SwitchContainer>
      </CardContent>
    </Card>
  );
}

function Controls() {
  const latestFeed = labData.feeds[labData.feeds.length - 1];
  const fields = Object.keys(latestFeed)
    .filter((key) => key.startsWith("field"))
    .map((key) => ({ label: labData.channel[key], value: latestFeed[key] }));

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

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <LabCard channelId={labData.channel.id} />
        </Grid>
      </Grid>
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
