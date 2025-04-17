"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Modal } from "@mui/material";

interface ThresholdField {
  fieldName: string;
  minValue: string;
  maxValue: string;
}

interface ThresholdFormProps {
  open: boolean;
  handleClose: () => void;
  channelId: number;
  channelName: string;
  defaultThresholds: {
    fieldName: string;
    minValue: number;
    maxValue: number;
    unit: string;
  }[];
  channelFields: string[];
  onSave: () => void;
}

const ThresholdForm: React.FC<ThresholdFormProps> = ({
  open,
  handleClose,
  channelId,
  channelName,
  defaultThresholds,
  channelFields,
  onSave,
}) => {
  const [fields, setFields] = useState<ThresholdField[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize fields with channelFields
  useEffect(() => {
    const fetchThresholds = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/controls/thresholds?channelId=${channelId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch thresholds: ${response.status}`);
        }
        const data = await response.json();
        const thresholds = data.thresholds || [];

        // Initialize fields for all channelFields
        const initializedFields = channelFields.map((fieldName) => {
          const threshold = thresholds.find(
            (t: any) => t.fieldName === fieldName
          );
          const defaultThreshold = defaultThresholds.find(
            (t) => t.fieldName === fieldName
          );
          return {
            fieldName,
            minValue:
              threshold?.minValue?.toString() ||
              defaultThreshold?.minValue?.toString() ||
              "",
            maxValue:
              threshold?.maxValue?.toString() ||
              defaultThreshold?.maxValue?.toString() ||
              "",
          };
        });

        setFields(initializedFields);
      } catch (err) {
        console.error("Error fetching thresholds:", err);
        setError("Failed to load thresholds. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchThresholds();
    }
  }, [open, channelId, channelFields, defaultThresholds]);

  const handleFieldChange = (index: number, key: string, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setFields(updatedFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate only filled fields
    const invalidFields = fields
      .filter((field) => field.minValue !== "" || field.maxValue !== "") // Only check fields with at least one value
      .filter((field) => {
        const min = field.minValue === "" ? NaN : Number(field.minValue);
        const max = field.maxValue === "" ? NaN : Number(field.maxValue);
        return (
          (field.minValue !== "" && (isNaN(min) || field.maxValue === "")) ||
          (field.maxValue !== "" && (isNaN(max) || field.minValue === "")) ||
          (!isNaN(min) && !isNaN(max) && min >= max)
        );
      });

    if (invalidFields.length > 0) {
      const invalidNames = invalidFields
        .map((field) => field.fieldName)
        .join(", ");
      setError(
        `Invalid thresholds for fields: ${invalidNames}. Both min and max must be numeric and min must be less than max, or both must be empty.`
      );
      setLoading(false);
      return;
    }

    // Prepare submission fields
    const submissionFields = fields
      .filter((field) => field.minValue !== "" && field.maxValue !== "")
      .map((field) => ({
        fieldName: field.fieldName,
        minValue: Number(field.minValue),
        maxValue: Number(field.maxValue),
      }));

    try {
      const response = await fetch("/api/controls/thresholds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, thresholds: submissionFields }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to save thresholds: ${response.status}`
        );
      }
      alert("Thresholds saved successfully!");
      onSave();
      handleClose();
    } catch (error) {
      console.error("Error saving thresholds:", error);
      setError(error.message || "Failed to save thresholds. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefault = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset to default? This will delete all custom thresholds for this channel."
      )
    ) {
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/controls/thresholds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, thresholds: [] }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to reset thresholds: ${response.status}`
        );
      }

      const resetFields = channelFields.map((fieldName) => {
        const defaultThreshold = defaultThresholds.find(
          (t) => t.fieldName === fieldName
        );
        return {
          fieldName,
          minValue: defaultThreshold?.minValue?.toString() || "",
          maxValue: defaultThreshold?.maxValue?.toString() || "",
        };
      });

      setFields(resetFields);
      alert("Thresholds reset to default successfully!");
    } catch (error) {
      console.error("Error resetting thresholds:", error);
      setError(
        error.message || "Failed to reset thresholds. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="threshold-form-title"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          maxWidth: 800,
          width: "100%",
        }}
      >
        <Typography id="threshold-form-title" variant="h6" gutterBottom>
          Threshold Settings for {channelName}
        </Typography>
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}
        {loading && <Typography mb={2}>Loading...</Typography>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {fields.length === 0 && !loading ? (
              <Typography variant="body1" color="textSecondary">
                No fields available for this channel.
              </Typography>
            ) : (
              fields.map((field, index) => {
                const defaultThreshold = defaultThresholds.find(
                  (t) => t.fieldName === field.fieldName
                );
                return (
                  <Box
                    key={field.fieldName}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <TextField
                      label="Field Name"
                      value={field.fieldName}
                      disabled
                      sx={{ width: 200 }}
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
                      disabled={loading}
                    />
                    <TextField
                      label="Unit"
                      value={defaultThreshold?.unit || ""}
                      disabled
                      sx={{ width: 80 }}
                      placeholder="e.g., °C"
                    />
                  </Box>
                );
              })
            )}

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Thresholds"}
              </Button>
              <Button
                variant="outlined"
                color="warning"
                onClick={handleResetToDefault}
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset to Default"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ThresholdForm;
