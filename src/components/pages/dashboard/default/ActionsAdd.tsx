import React from "react";
import styled from "@emotion/styled";

import { spacing } from "@mui/system";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card as MuiCard,
  Paper as MuiPaper,
  TextField,
} from "@mui/material";

const Card = styled(MuiCard)(spacing);

const Paper = styled(MuiPaper)(spacing);

function FormDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
      >
        Add
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Add New Channel</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the API key of the channel you wish to add.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="API key"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;
