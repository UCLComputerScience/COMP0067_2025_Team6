import React, { useState } from "react";
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
  const [api, setApi] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/apikeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api }),
      });

      if (res.ok) {
        setMessage("API added successfully!");
        setApi("");
      } else {
        setMessage("Failed to add api.");
      }
    } catch (error) {
      setMessage("Something went wrong.");
    }

    setLoading(false);
    setOpen(false)
  }

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
        <form onSubmit={handleSubmit} >
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
            value={api}
            onChange={(e) => setApi(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} color="primary">
            Add
          </Button>
        </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default FormDialog;
