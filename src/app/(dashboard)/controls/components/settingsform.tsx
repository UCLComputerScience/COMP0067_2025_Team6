"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";

const BoxStyled = styled(Box)(spacing);

interface SettingsFormProps {
  handleClose: () => void;
  onSave?: () => void;
}

function SettingsForm({ handleClose, onSave }: SettingsFormProps) {
  const [fields, setFields] = useState<
    {
      fieldName: string;
      minValue: string | number;
      maxValue: string | number;
      unit: string;
    }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "warning" | "info" | "success";
  }>({ open: false, message: "", severity: "info" });

  const handleFieldChange = (index: number, key: string, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setFields(updatedFields);
  };

  const handleAddField = () => {
    setFields([
      ...fields,
      { fieldName: "", minValue: "", maxValue: "", unit: "" },
    ]);
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index);
    setFields(updatedFields);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/controls/settings");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.fields && Array.isArray(data.fields)) {
          setFields(
            data.fields.map((field: any) => ({
              fieldName: field.fieldName,
              minValue: field.minValue.toString(),
              maxValue: field.maxValue.toString(),
              unit: field.unit || "",
            }))
          );
        } else {
          setFields([]);
        }
      } catch (error) {
        console.error("Error fetching default thresholds:", error);
        setError("Failed to load default thresholds. Please try again.");
        setSnackbar({
          open: true,
          message: "Failed to load default thresholds.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate input fields
    if (fields.length > 0) {
      const invalidFields = fields.filter((field) => {
        const min = field.minValue === "" ? NaN : Number(field.minValue);
        const max = field.maxValue === "" ? NaN : Number(field.maxValue);
        return !field.fieldName || isNaN(min) || isNaN(max) || min >= max;
      });

      if (invalidFields.length > 0) {
        setError(
          "All fields must have a valid name and numeric min/max values, with min less than max."
        );
        setSnackbar({
          open: true,
          message:
            "All fields must have a valid name and numeric min/max values, with min less than max.",
          severity: "error",
        });
        setLoading(false);
        return;
      }
    }

    // Validate against latest channel values
    try {
      // Fetch all channels
      const channelsResponse = await fetch("/api/controls/channels");
      if (!channelsResponse.ok) {
        throw new Error(`HTTP error! Status: ${channelsResponse.status}`);
      }
      const channelsData = await channelsResponse.json();
      console.log("Fetched channels:", channelsData); // DEBUG: Log channels

      // Check custom thresholds
      const customThresholds: { [channelId: number]: any[] } = {};
      for (const channel of channelsData) {
        const thresholdResponse = await fetch(
          `/api/controls/thresholds?channelId=${channel.id}`
        );
        if (thresholdResponse.ok) {
          const data = await thresholdResponse.json();
          customThresholds[channel.id] = data.thresholds || [];
        } else {
          console.warn(
            `Failed to fetch thresholds for channel ${channel.id}: Status ${thresholdResponse.status}`
          );
          customThresholds[channel.id] = [];
        }
      }
      console.log("Custom thresholds:", customThresholds); // DEBUG: Log thresholds

      // Validate thresholds
      let affectedControls = 0;
      const violations: string[] = [];

      for (const channel of channelsData) {
        console.log(`Processing channel ${channel.id} (${channel.name})`); // DEBUG: Log channel
        const response = await fetch(channel.ApiKey[0]?.api);
        if (!response.ok || !channel.ApiKey[0]?.api) {
          console.warn(
            `Failed to fetch feed for channel ${channel.id}: Status ${
              response.status || "No API key"
            }`
          );
          continue;
        }
        const { feeds } = await response.json();
        if (!feeds || feeds.length === 0) {
          console.warn(`No feeds found for channel ${channel.id}`);
          continue;
        }
        const latestFeed = feeds[feeds.length - 1];
        console.log(`Latest feed for channel ${channel.id}:`, latestFeed); // DEBUG: Log feed

        const channelViolations: string[] = [];
        fields.forEach((field) => {
          // Skip if channel has custom threshold
          const hasCustomThreshold = customThresholds[channel.id]?.some(
            (t: any) => t.fieldName.toLowerCase() === field.fieldName.toLowerCase()
          );
          if (hasCustomThreshold) {
            console.log(
              `Skipping validation for ${field.fieldName} in channel ${channel.id} due to custom threshold`
            ); // DEBUG: Log skip
            return;
          }

          // Match fieldName to channel fields (case-insensitive)
          const fieldKey = Object.keys(channel)
            .filter((key) => key.startsWith("field") && channel[key])
            .find(
              (key) =>
                channel[key].toLowerCase() === field.fieldName.toLowerCase()
            );
          console.log(
            `Checking field ${field.fieldName} in channel ${channel.id}: key=${fieldKey}`
          ); // DEBUG: Log field match

          if (fieldKey && latestFeed[fieldKey] !== undefined) {
            const latestValue = parseFloat(latestFeed[fieldKey]);
            const minValue = Number(field.minValue);
            const maxValue = Number(field.maxValue);
            console.log(
              `Validating ${field.fieldName}: latestValue=${latestValue}, min=${minValue}, max=${maxValue}`
            ); // DEBUG: Log values

            if (
              !isNaN(latestValue) &&
              (latestValue < minValue || latestValue > maxValue)
            ) {
              channelViolations.push(
                `${field.fieldName}: ${latestValue} is outside ${minValue}-${maxValue}`
              );
              console.log(
                `Violation detected for ${field.fieldName} in channel ${channel.id}`
              ); // DEBUG: Log violation
            }
          } else {
            console.warn(
              `Field ${field.fieldName} not found or no value in channel ${channel.id} (key=${fieldKey})`
            ); // DEBUG: Log missing field/value
          }
        });

        if (channelViolations.length > 0) {
          affectedControls++;
          violations.push(
            `Channel ${channel.name} (ID: ${channel.id}): ${channelViolations.join(
              ", "
            )}`
          );
        }
      }

      console.log("Total violations:", violations); // DEBUG: Log violations
      console.log("Affected controls:", affectedControls); // DEBUG: Log count

      // Show pop-ups
      if (violations.length > 0) {
        setSnackbar({
          open: true,
          message: `Warning: The following channels have values exceeding the new default thresholds:\n${violations.join(
            "\n"
          )}`,
          severity: "warning",
        });

        setTimeout(() => {
          setSnackbar({
            open: true,
            message: `${affectedControls} controls will be affected by these threshold changes.`,
            severity: "info",
          });
        }, 500);
      } else {
        console.log("No violations detected"); // DEBUG: Log no violations
      }
    } catch (error) {
      console.error("Error during validation:", error);
      setError("Failed to validate thresholds. Please try again.");
      setSnackbar({
        open: true,
        message: "Failed to validate thresholds.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    // Submit thresholds
    try {
      const submissionFields = fields.map((field) => ({
        fieldName: field.fieldName,
        minValue: Number(field.minValue),
        maxValue: Number(field.maxValue),
        unit: field.unit || null,
      }));

      const response = await fetch("/api/controls/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: submissionFields }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setSnackbar({
        open: true,
        message:
          fields.length === 0
            ? "All default thresholds removed successfully!"
            : "Default thresholds saved successfully!",
        severity: "success",
      });
      onSave?.();
      handleClose();
    } catch (error) {
      console.error("Error saving default thresholds:", error);
      setError("Failed to save default thresholds. Please try again.");
      setSnackbar({
        open: true,
        message: "Failed to save default thresholds.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BoxStyled
      sx={{
        mb: 4,
        p: 5,
        border: "1px solid #ddd",
        borderRadius: 2,
        backgroundColor: "#f9f9f9",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" mb={5}>
        Default Threshold Settings
      </Typography>
      <div></div>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      {loading && <Typography mb={2}>Loading...</Typography>}
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {fields.length === 0 && !loading ? (
            <Typography variant="body1" color="textSecondary">
              No fields defined yet. Click "Add Field" to start.
            </Typography>
          ) : (
            fields.map((field, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  mb: 1,
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  label={`Field ${index + 1}`}
                  value={field.fieldName}
                  onChange={(e) =>
                    handleFieldChange(index, "fieldName", e.target.value)
                  }
                  sx={{ width: 200 }}
                  placeholder="Enter field name"
                  required
                  disabled={loading}
                />
                <TextField
                  label="Min Value"
                  type="number"
                  value={field.minValue}
                  onChange={(e) =>
                    handleFieldChange(index, "minValue", e.target.value)
                  }
                  sx={{ width: 120 }}
                  inputProps={{ step: "0.1" }}
                  placeholder="Enter min value"
                  required
                  disabled={loading}
                />
                <TextField
                  label="Max Value"
                  type="number"
                  value={field.maxValue}
                  onChange={(e) =>
                    handleFieldChange(index, "maxValue", e.target.value)
                  }
                  sx={{ width: 120 }}
                  inputProps={{ step: "0.1" }}
                  placeholder="Enter max value"
                  required
                  disabled={loading}
                />
                <TextField
                  label="Unit"
                  value={field.unit}
                  onChange={(e) =>
                    handleFieldChange(index, "unit", e.target.value)
                  }
                  sx={{ width: 80 }}
                  placeholder="e.g., Pa"
                  disabled={loading}
                />
                <IconButton
                  onClick={() => handleRemoveField(index)}
                  sx={{
                    border: "1px solid grey",
                    borderRadius: "50%",
                    width: 32,
                    height: 32,
                    color: "grey",
                    "&:hover": {
                      borderColor: "darkgrey",
                      color: "darkgrey",
                    },
                  }}
                  disabled={loading}
                >
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            ))
          )}

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddField}
            sx={{ alignSelf: "flex-start", mb: 2 }}
            disabled={loading}
          >
            Add Field
          </Button>

          <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </BoxStyled>
  );
}

export default SettingsForm;