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
import { green, red, blue, grey, orange } from "@mui/material/colors";

const HeaderCard = styled(MuiCard)`
  ${spacing}
  margin: 16px 16px 8px 16px;
  overflow: visible;
  border: 1px solid ${grey[300]};
`;

const DescriptionCard = styled(MuiCard)`
  ${spacing}
  margin: 8px 16px 8px 16px;
  overflow: visible;
  border: 1px solid ${grey[300]};
`;

const SensorCard = styled(MuiCard)`
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
  handleDelete: (id: number) => void;
  handleMarkAsResolved: (id: number) => void;
  refreshData: () => void;
}

const AlertDetailsPopup: React.FC<AlertDetailsPopupProps> = ({
  open,
  row,
  onClose,
  handleDelete,
  handleMarkAsResolved,
  refreshData,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuDelete = () => {
    handleDelete(row!.id);
    handleMenuClose();
    onClose();
  };

  const handleMenuResolve = () => {
    handleMarkAsResolved(row!.id);
    handleMenuClose();
    refreshData();
    onClose();
  };

  if (!row) return null;

  // Prepare sensor data for display
  const sensorData = [];
  const fields = ["field1", "field2", "field3", "field4", "field5", "field6", "field7", "field8"];
  if (row.feed && row.channelFields) {
    fields.forEach((field, index) => {
      const value = row.feed[field as keyof typeof row.feed];
      const label = row.channelFields[field as keyof typeof row.channelFields];
      if (value != null && label) {
        const formattedValue =
          typeof value === "number" ? value.toFixed(2) : value;
        sensorData.push({ label, value: formattedValue });
      }
    });
  }

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
          <MenuItem onClick={handleMenuDelete}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
          <MenuItem onClick={handleMenuResolve}>
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

      {/* Description Block */}
      <DescriptionCard>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            Description
          </Typography>
          <Typography variant="body1" sx={{ mt: 2, fontSize: "1rem" }}>
            {row.desc}
          </Typography>
        </CardContent>
      </DescriptionCard>

      {/* Sensor Snapshot Block */}
      <SensorCard sx={{ flex: 1 }}>
        <CardContent>
          <Typography variant="h6" color="textSecondary">
            Sensor Snapshot
          </Typography>
          {sensorData.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              {sensorData.map((data, index) => (
                <Typography key={index} sx={{ fontSize: "1rem", mb: 1 }}>
                  <strong>{data.label}:</strong> {data.value}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography sx={{ mt: 2, fontSize: "1rem", color: grey[600] }}>
              No sensor data available for this alert.
            </Typography>
          )}
        </CardContent>
      </SensorCard>

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
