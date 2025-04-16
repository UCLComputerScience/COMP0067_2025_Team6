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
import { format } from "date-fns";
import { RowType } from "../page";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { green, red, blue, grey } from "@mui/material/colors";

const HeaderCard = styled(MuiCard)`
  ${spacing}
  margin: 16px 16px 8px 16px;
  overflow: visible;
  border: 1px solid ${grey[300]};
`;

const DescriptionCard = styled(MuiCard)`
  ${spacing}
  margin: 8px 16px 16px 16px;
  overflow: visible;
  border: 1px solid ${grey[300]};
  flex: 1;
`;

const PriorityChip = styled(MuiChip)`
  ${spacing}
  background: ${(props) =>
    props.label === "HIGH"
      ? red[500]
      : props.label === "MODERATE"
      ? orange[500]
      : green[500]};
  color: white;
`;

const StatusChip = styled(MuiChip)`
  ${spacing}
  background: ${(props) =>
    props.label === "RESOLVED" ? blue[500] : grey[500]};
  color: white;
`;

interface AlertDetailsPopupProps {
  open: boolean;
  row: RowType | null;
  onClose: () => void;
  handleDelete: (id: number) => void; // Add handleDelete prop
  handleMarkAsResolved: (id: number) => void; // Add handleMarkAsResolved prop
}

const AlertDetailsPopup: React.FC<AlertDetailsPopupProps> = ({
  open,
  row,
  onClose,
  handleDelete,
  handleMarkAsResolved,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (!row) return null;

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
        Alert
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
          <MenuItem
            onClick={() => {
              handleDelete(row.id);
              handleMenuClose();
              // onClose(); // Optionally close popup after action
            }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMarkAsResolved(row.id);
              handleMenuClose();
              // onClose(); // Optionally close popup after action
            }}
          >
            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
            Mark as Resolved
          </MenuItem>
        </Menu>
      </DialogTitle>
      {/* Header Block */}
      <HeaderCard sx={{ bgcolor: grey[200] }}>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            Details
          </Typography>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "1rem" }}>
                  <strong>Channel ID:</strong> {row.channelId}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "1rem" }}>
                  <strong>Channel Name:</strong> {row.channel}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "1rem" }}>
                  <strong>Priority:</strong>{" "}
                  <PriorityChip size="small" label={row.priority} />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ fontSize: "1rem" }}>
                  <strong>Status:</strong>{" "}
                  <StatusChip size="small" label={row.status} />
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontSize: "1rem" }}>
                  <strong>Date:</strong>{" "}
                  {row.date !== "Unknown"
                    ? format(new Date(row.date), "dd/MM/yy HH:mm")
                    : "Unknown"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </HeaderCard>

      <DescriptionCard>
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h6" color="textSecondary">
            Description
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, fontSize: "1rem" }}>
            {row.desc}
          </Typography>
        </CardContent>
      </DescriptionCard>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1,
          p: 4,
        }}
      >
        <Button variant="outlined" onClick={onClose} sx={{ minWidth: "100px" }}>
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
};

export default AlertDetailsPopup;