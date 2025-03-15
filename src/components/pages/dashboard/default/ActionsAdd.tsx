import React, { useState } from "react";
import styled from "@emotion/styled";

import { spacing } from "@mui/system";
import { DataProps } from "@/types/devices";

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

const FormDialog: React.FC<DataProps> = ({ data, setData }) => {
  const [open, setOpen] = React.useState(false);
  const [api, setApi] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [id, setId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(api);
      const data = await response.json();
    
      if (!data.channel || !data.channel.id) {
        throw new Error("Channel number not found in the response");
      }
    
      const channelId = Number(data.channel.id); // Extract value directly
    
      const res = await fetch("/api/apikeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api, channel_id: channelId }),
      });
    
      if (res.ok) {
        setMessage("API added successfully!");
        setApi("");
        setData(`${api}`);
      } else {
        setMessage("Failed to add API.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong.");
    }
    // try {
    //   const response = await fetch(api);
    //   const data = await response.json();
  
    //   if (data.channel && data.channel.id) {
    //     setId(data.channel.id);
    //   } else {
    //     throw new Error("Channel number not found in the response");
    //   }
    // } catch (error) {
    //   console.error("Error fetching data:", error);
    //   return null;
    // }

    // try {
    //   const res = await fetch("/api/apikeys", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ channel_id: Number(id), api }),
    //   });

    //   if (res.ok) {
    //     setMessage("API added successfully!");
    //     setApi("");
    //     setData(`${api}`);
    //   } else {
    //     setMessage("Failed to add api.");
    //   }
    // } catch (error) {
    //   setMessage("Something went wrong.");
    // }

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
