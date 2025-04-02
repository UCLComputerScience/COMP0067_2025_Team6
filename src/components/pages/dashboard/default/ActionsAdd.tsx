"use client";

import React, { useState } from "react";
import styled from "@emotion/styled";
import { usePathname } from "next/navigation";

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

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  let lab = Number(lastSegment.split("")[lastSegment.length - 1]);
  let labmanager = 1;
  let labLocation = "";
  if (lab === 1) {
    labLocation = "London";
  } else if (lab === 2) {
    labLocation = "Turkey";
  } else if (lab === 3) {
    labLocation = "India";
  }

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
    

      // Extract the relevant fields from the data
      const channelId = Number(data.channel.id); // Ensure the channel ID is a number
      const name = data.channel.name || "Unnamed Channel"; // Default value if name is missing
      const latitude = parseFloat(data.channel.latitude) || 0; // Default to 0 if latitude is missing
      const longitude = parseFloat(data.channel.longitude) || 0; // Default to 0 if longitude is missing
      const field1 = data.channel.field1 || null; // Default to null if field1 is missing
      const field2 = data.channel.field2 || null; // Default to null if field2 is missing
      const field3 = data.channel.field3 || null; // Default to null if field3 is missing
      const field4 = data.channel.field4 || null; // Default to null if field4 is missing
      const field5 = data.channel.field5 || null; // Default to null if field5 is missing
      const field6 = data.channel.field6 || null; // Default to null if field6 is missing
      const field7 = data.channel.field7 || null; // Default to null if field7 is missing
      const field8 = data.channel.field8 || null; // Default to null if field8 is missing
      const created_at = new Date(data.channel.created_at) || new Date(); // Use current date if created_at is missing
      const updated_at = new Date(data.channel.updated_at) || new Date(); // Use current date if updated_at is missing
      const last_entry_id = Number(data.channel.last_entry_id) || 0; // Default to 0 if last_entry_id is missing


      const channelres = await fetch("/api/channel_add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, name, latitude, longitude, field1, field2, field3, field4, field5, field6, field7, field8, created_at, updated_at, last_entry_id}),
      })

      const labres = await fetch("/api/lab_add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labmanager, labLocation}),
      })
    
      const res = await fetch("/api/apikeys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api, channelId }),
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
