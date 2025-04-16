// import React from "react";
// import {
//   Box,
//   Button,
//   Card as MuiCard,
//   CardContent,
//   Dialog,
//   DialogTitle,
//   Typography,
//   Chip as MuiChip,
//   Grid,
// } from "@mui/material";
// import styled from "@emotion/styled";
// import { spacing } from "@mui/system";
// import { grey } from "@mui/material/colors";

// const HeaderCard = styled(MuiCard)`
//   ${spacing}
//   margin: 16px 16px 8px 16px;
//   overflow: visible;
//   border: 1px solid ${grey[300]};
// `;

// const LabsCard = styled(MuiCard)`
//   ${spacing}
//   margin: 8px 16px;
//   overflow: visible;
//   border: 1px solid ${grey[300]};
//   display: flex;
//   flex-direction: column;
// `;

// const ChannelsCard = styled(MuiCard)`
//   ${spacing}
//   margin: 8px 16px 16px 16px;
//   overflow: visible;
//   border: 1px solid ${grey[300]};
//   display: flex;
//   flex-direction: column;
// `;

// const StatusChip = styled(MuiChip)`
//   ${spacing}
//   background: ${(props) => (props.label === "ACTIVE" ? "#4caf50" : "#f44336")};
//   color: white;
// `;

// const RoleChip = styled(MuiChip)`
//   ${spacing}
//   background: ${(props) =>
//     props.label === "ADMIN"
//       ? "#2196f3"
//       : props.label === "SUPER_USER"
//       ? "#ff9800"
//       : props.label === "TEMPORARY_USER"
//       ? "#9c27b0"
//       : "#607d8b"};
//   color: white;
// `;

// interface UserInfo {
//   id: number;
//   firstName: string;
//   lastName: string;
//   organisation: string | null;
//   role: string;
//   status: string;
//   access: {
//     labId: number | null;
//     labLocation: string | null;
//     channelId: number | null;
//     channelName: string | null;
//   }[];
// }

// interface UserInfoPopupProps {
//   open: boolean;
//   user: UserInfo | null;
//   onClose: () => void;
// }

// const UserInfoPopup: React.FC<UserInfoPopupProps> = ({
//   open,
//   user,
//   onClose,
// }) => {
//   if (!user) return null;

//   // Filter access entries for labs and channels
//   const labs = user.access.filter(
//     (access) => access.labId && access.labLocation
//   );
//   const channels = user.access.filter(
//     (access) => access.channelId && access.channelName
//   );

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth={false}
//       sx={{
//         "& .MuiDialog-paper": {
//           width: "700px",
//           height: "600px",
//           display: "flex",
//           flexDirection: "column",
//         },
//       }}
//     >
//       <DialogTitle
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           fontSize: "1.1rem",
//         }}
//       >
//         User Information
//       </DialogTitle>
//       {/* Header Block */}
//       <HeaderCard sx={{ bgcolor: grey[200] }}>
//         <CardContent>
//           <Typography variant="h6" color="textSecondary">
//             User Details
//           </Typography>
//           <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
//             <Grid container spacing={2}>
//               <Grid item xs={6}>
//                 <Typography sx={{ fontSize: "1rem" }}>
//                   <strong>First Name:</strong> {user.firstName}
//                 </Typography>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography sx={{ fontSize: "1rem" }}>
//                   <strong>Last Name:</strong> {user.lastName}
//                 </Typography>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography sx={{ fontSize: "1rem" }}>
//                   <strong>Organisation:</strong>{" "}
//                   {user.organisation || "Not specified"}
//                 </Typography>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography sx={{ fontSize: "1rem" }}>
//                   <strong>Role:</strong>{" "}
//                   <RoleChip size="small" label={user.role} />
//                 </Typography>
//               </Grid>
//               <Grid item xs={6}>
//                 <Typography sx={{ fontSize: "1rem" }}>
//                   <strong>Status:</strong>{" "}
//                   <StatusChip size="small" label={user.status} />
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Box>
//         </CardContent>
//       </HeaderCard>

//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           overflow: "hidden",
//         }}
//       >
//         <LabsCard sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
//           <CardContent
//             sx={{ flex: 1, display: "flex", flexDirection: "column" }}
//           >
//             <Typography variant="h6" color="textSecondary">
//               Assigned Labs
//             </Typography>
//             <Box sx={{ mt: 2, flex: 1, overflow: "auto" }}>
//               {labs.length > 0 ? (
//                 <Grid container spacing={2}>
//                   {labs.map((access, index) => (
//                     <Grid item xs={12} key={`lab-${index}`}>
//                       <Typography sx={{ fontSize: "1rem" }}>
//                         <strong>
//                           {index + 1}. Lab {access.labId}:
//                         </strong>{" "}
//                         {access.labLocation}
//                       </Typography>
//                     </Grid>
//                   ))}
//                 </Grid>
//               ) : (
//                 <Typography sx={{ fontSize: "1rem" }}>
//                   No labs assigned
//                 </Typography>
//               )}
//             </Box>
//           </CardContent>
//         </LabsCard>

//         <ChannelsCard
//           sx={{ flex: 1, display: "flex", flexDirection: "column" }}
//         >
//           <CardContent
//             sx={{ flex: 1, display: "flex", flexDirection: "column" }}
//           >
//             <Typography variant="h6" color="textSecondary">
//               Assigned Channels
//             </Typography>
//             <Box sx={{ mt: 2, flex: 1, overflow: "auto" }}>
//               {channels.length > 0 ? (
//                 <Grid container spacing={2}>
//                   {channels.map((access, index) => (
//                     <Grid item xs={12} key={`channel-${index}`}>
//                       <Typography sx={{ fontSize: "1rem" }}>
//                         <strong>
//                           {index + 1}. Channel {access.channelId}:
//                         </strong>{" "}
//                         {access.channelName}
//                       </Typography>
//                     </Grid>
//                   ))}
//                 </Grid>
//               ) : (
//                 <Typography sx={{ fontSize: "1rem" }}>
//                   No channels assigned
//                 </Typography>
//               )}
//             </Box>
//           </CardContent>
//         </ChannelsCard>
//       </Box>

//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "flex-end",
//           gap: 1,
//           p: 4,
//         }}
//       >
//         <Button variant="outlined" onClick={onClose} sx={{ minWidth: "100px" }}>
//           Close
//         </Button>
//       </Box>
//     </Dialog>
//   );
// };

// export default UserInfoPopup;

import React, { useState } from "react";
import {
  Box,
  Button,
  Card as MuiCard,
  CardContent,
  Dialog,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip as MuiChip,
  Grid,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import { grey } from "@mui/material/colors";

const HeaderCard = styled(MuiCard)`
  ${spacing}
  margin: 16px 16px 8px 16px;
  overflow: visible;
  border: 1px solid ${grey[300]};
`;

const LabsCard = styled(MuiCard)`
  ${spacing}
  margin: 8px 16px;
  overflow: visible;
  border: 1px solid ${grey[300]};
  display: flex;
  flex-direction: column;
`;

const ChannelsCard = styled(MuiCard)`
  ${spacing}
  margin: 8px 16px 16px 16px;
  overflow: visible;
  border: 1px solid ${grey[300]};
  display: flex;
  flex-direction: column;
`;

const StatusChip = styled(MuiChip)`
  ${spacing}
  background: ${(props) => (props.label === "ACTIVE" ? "#4caf50" : "#f44336")};
  color: white;
`;

const RoleChip = styled(MuiChip)`
  ${spacing}
  background: ${(props) =>
    props.label === "ADMIN"
      ? "#2196f3"
      : props.label === "SUPER_USER"
      ? "#ff9800"
      : props.label === "TEMPORARY_USER"
      ? "#9c27b0"
      : "#607d8b"};
  color: white;
`;

interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  organisation: string | null;
  role: string;
  status: string;
  access: {
    labId: number | null;
    labLocation: string | null;
    channelId: number | null;
    channelName: string | null;
  }[];
}

interface UserInfoPopupProps {
  open: boolean;
  user: UserInfo | null;
  onClose: () => void;
  onManageAccess?: (userId: number) => void; // New prop to trigger manage access
}

const UserInfoPopup: React.FC<UserInfoPopupProps> = ({
  open,
  user,
  onClose,
  onManageAccess,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleManageAccess = () => {
    if (user && onManageAccess) {
      onManageAccess(user.id);
    }
    handleMenuClose();
    onClose(); // Close popup to show table dialog
  };

  if (!user) return null;

  // Filter access entries for labs and channels
  const labs = user.access.filter(
    (access) => access.labId && access.labLocation
  );
  const channels = user.access.filter(
    (access) => access.channelId && access.channelName
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          width: "700px",
          height: "600px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "1.1rem",
        }}
      >
        User Information
        <IconButton
          aria-label="more"
          onClick={handleMenuClick}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleManageAccess}>Manage Access</MenuItem>
        </Menu>
      </DialogTitle>
      {/* Header Block */}
      <HeaderCard sx={{ bgcolor: grey[200] }}>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            User Details
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "1rem" }}>
                  <strong>First Name:</strong> {user.firstName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "1rem" }}>
                  <strong>Last Name:</strong> {user.lastName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "1rem" }}>
                  <strong>Organisation:</strong>{" "}
                  {user.organisation || "Not specified"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "1rem" }}>
                  <strong>Role:</strong>{" "}
                  <RoleChip size="small" label={user.role} />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "1rem" }}>
                  <strong>Status:</strong>{" "}
                  <StatusChip size="small" label={user.status} />
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </HeaderCard>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <LabsCard sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <CardContent
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h6" color="textSecondary">
              Assigned Labs
            </Typography>
            <Box sx={{ mt: 2, flex: 1, overflow: "auto" }}>
              {labs.length > 0 ? (
                <Grid container spacing={2}>
                  {labs.map((access, index) => (
                    <Grid item xs={12} key={`lab-${index}`}>
                      <Typography sx={{ fontSize: "1rem" }}>
                        <strong>
                          {index + 1}. Lab {access.labId}:
                        </strong>{" "}
                        {access.labLocation}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography sx={{ fontSize: "1rem" }}>
                  No labs assigned
                </Typography>
              )}
            </Box>
          </CardContent>
        </LabsCard>

        <ChannelsCard
          sx={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <CardContent
            sx={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Typography variant="h6" color="textSecondary">
              Assigned Channels
            </Typography>
            <Box sx={{ mt: 2, flex: 1, overflow: "auto" }}>
              {channels.length > 0 ? (
                <Grid container spacing={2}>
                  {channels.map((access, index) => (
                    <Grid item xs={12} key={`channel-${index}`}>
                      <Typography sx={{ fontSize: "1rem" }}>
                        <strong>
                          {index + 1}. Channel {access.channelId}:
                        </strong>{" "}
                        {access.channelName}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography sx={{ fontSize: "1rem" }}>
                  No channels assigned
                </Typography>
              )}
            </Box>
          </CardContent>
        </ChannelsCard>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          p: 4,
        }}
      >
        <Button variant="outlined" onClick={onClose} sx={{ minWidth: "100px" }}>
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default UserInfoPopup;
