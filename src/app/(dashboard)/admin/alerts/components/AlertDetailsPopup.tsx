import React, { useState } from "react";
import {
  Box,
  Button,
  Card as MuiCard,
  CardContent,
  Dialog,
  DialogTitle,
  Divider as MuiDivider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip as MuiChip,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { format } from "date-fns";
import { RowType } from "../page";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { green, orange, red, blue, grey } from "@mui/material/colors";

const Card = styled(MuiCard)`
  ${spacing}
  margin: 16px;
  overflow: visible;
  border: 1px solid ${grey[300]};
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

const Divider = styled(MuiDivider)`
  ${spacing}
`;

interface AlertDetailsPopupProps {
  open: boolean;
  row: RowType | null;
  onClose: () => void;
}

const AlertDetailsPopup: React.FC<AlertDetailsPopupProps> = ({
  open,
  row,
  onClose,
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

  // Placeholder for dynamic buttons (UI only)
  const showApprovalButtons =
    row.priority === "HIGH" && row.status === "UNRESOLVED";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Alert Details
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
          <MenuItem onClick={handleMenuClose}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
            Mark as Resolved
          </MenuItem>
        </Menu>
      </DialogTitle>
      <Card>
        <CardContent>
          <Box mb={2}>
            <Typography variant="subtitle2" color="textSecondary">
              Description
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {row.desc}
            </Typography>
          </Box>
          <Divider my={2} />
          <Box>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Additional Details
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography>
                <strong>Channel ID:</strong> {row.channelId}
              </Typography>
              <Typography>
                <strong>Channel Name:</strong> {row.channel}
              </Typography>
              <Typography>
                <strong>Location:</strong> {row.location}
              </Typography>
              <Typography>
                <strong>Priority:</strong>{" "}
                <PriorityChip size="small" label={row.priority} />
              </Typography>
              <Typography>
                <strong>Status:</strong>{" "}
                <StatusChip size="small" label={row.status} />
              </Typography>
              <Typography>
                <strong>Date & Time:</strong>{" "}
                {row.date !== "Unknown"
                  ? format(new Date(row.date), "dd/MM/yy HH:mm")
                  : "Unknown"}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, p: 2 }}>
        {showApprovalButtons && (
          <>
            <Button variant="contained" color="primary">
              Approve
            </Button>
            <Button variant="outlined" color="secondary">
              Reject
            </Button>
          </>
        )}
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Dialog>
  );
};

export default AlertDetailsPopup;
