"use client";

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, IconButton, Modal } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { styled } from "@mui/system";

interface ThresholdField {
  fieldName: string;
  minValue: string | number;
  maxValue: string | number;
  unit: string;
  isUnitReadOnly: boolean;
}

interface ThresholdFormProps {
  open: boolean;
  handleClose: () => void;
  channelId: number;
  channelName: string;
  defaultThresholds: { fieldName: string; minValue: number; maxValue: number; unit: string }[];
  channelFields: string[]; // Fields from Channel (e.g., ["Temperature", "Humidity"])
  onSave?: () => void; // To refresh parent
}

const FormContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  border: "1px solid #ddd",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "#f9f9f9",
  maxWidth: 800,
  margin: "0 auto",
}));

function ThresholdForm({
  open,
  handleClose,
  channelId,
  channelName,
  defaultThresholds,
  channelFields,
  onSave,
}: ThresholdFormProps) {
  const [fields, setFields] = useState<ThresholdField[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize form with channel fields and thresholds
  useEffect(() => {
    const fetchThresholds = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/controls/thresholds?channelId=${channelId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const thresholds: { fieldName: string; minValue: number; maxValue: number; unit: string }[] =
          data.thresholds || [];

        // Map channel fields to form fields
        const initialFields = channelFields.map((fieldName) => {
          const threshold = thresholds.find((t) => t.fieldName === fieldName);
          const defaultThreshold = defaultThresholds.find((t) => t.fieldName === fieldName);
          return {
            fieldName,
            minValue: threshold?.minValue?.toString() || defaultThreshold?.minValue?.toString() || "",
            maxValue: threshold?.maxValue?.toString() || defaultThreshold?.maxValue?.toString() || "",
            unit: threshold?.unit || defaultThreshold?.unit || "",
            isUnitReadOnly: !!defaultThreshold?.unit, // Read-only if default exists
          };
        });
        setFields(initialFields);
      } catch (error) {
        console.error("Error fetching thresholds:", error);
        setError("Failed to load thresholds. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchThresholds();
  }, [channelId, channelFields, defaultThresholds]);

  const handleFieldChange = (index: number, key: string, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setFields(updatedFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
        setLoading(false);
        return;
      }
    }

    const submissionFields = fields.map((field) => ({
      fieldName: field.fieldName,
      minValue: Number(field.minValue),
      maxValue: Number(field.maxValue),
      unit: field.unit,
    }));

    try {
      const response = await fetch("/api/controls/thresholds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, thresholds: submissionFields }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert("Thresholds saved successfully! An admin has been notified.");
      onSave?.();
      handleClose();
    } catch (error) {
      console.error("Error saving thresholds:", error);
      setError("Failed to save thresholds. Please try again.");
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
      <FormContainer>
        <Typography variant="h4" gutterBottom>
          Edit Thresholds for {channelName}
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
              fields.map((field, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <TextField
                    label={`Field ${index + 1}`}
                    value={field.fieldName}
                    disabled
                    sx={{ width: 200 }}
                  />
                  <TextField
                    label="Min Value"
                    type="number"
                    value={field.minValue}
                    onChange={(e) => handleFieldChange(index, "minValue", e.target.value)}
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
                    onChange={(e) => handleFieldChange(index, "maxValue", e.target.value)}
                    sx={{ width: 120 }}
                    inputProps={{ step: "0.1" }}
                    placeholder="Enter max value"
                    required
                    disabled={loading}
                  />
                  <TextField
                    label="Unit"
                    value={field.unit}
                    onChange={(e) => handleFieldChange(index, "unit", e.target.value)}
                    sx={{ width: 80 }}
                    placeholder="e.g., °C"
                    disabled={field.isUnitReadOnly || loading}
                  />
                </Box>
              ))
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
                color="secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </form>
      </FormContainer>
    </Modal>
  );
}

export default ThresholdForm;