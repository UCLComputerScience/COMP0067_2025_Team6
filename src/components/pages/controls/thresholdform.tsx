"use client";
import { getSession } from "next-auth/react";
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
  latestFeed?: any;
  labLocation: string;
}

const ThresholdForm: React.FC<ThresholdFormProps> = ({
  open,
  handleClose,
  channelId,
  channelName,
  defaultThresholds,
  channelFields,
  onSave,
  latestFeed,
  labLocation,
}) => {
  const [fields, setFields] = useState<ThresholdField[]>([]);
  const [originalThresholds, setOriginalThresholds] = useState<ThresholdField[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [potentialWarnings, setPotentialWarnings] = useState<string[]>([]);

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
        setOriginalThresholds(JSON.parse(JSON.stringify(initializedFields)));
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

  // Check for potential alerts when fields or latestFeed change
  useEffect(() => {
    if (!latestFeed) {
      setPotentialWarnings([]);
      return;
    }

    const warnings: string[] = [];
    fields.forEach((field, index) => {
      const minValue = field.minValue ? Number(field.minValue) : NaN;
      const maxValue = field.maxValue ? Number(field.maxValue) : NaN;
      const defaultThreshold = defaultThresholds.find(
        (t) => t.fieldName === field.fieldName
      );

      // Use default threshold if minValue or maxValue is empty
      const effectiveMin =
        !isNaN(minValue) && field.minValue !== ""
          ? minValue
          : defaultThreshold?.minValue ?? NaN;
      const effectiveMax =
        !isNaN(maxValue) && field.maxValue !== ""
          ? maxValue
          : defaultThreshold?.maxValue ?? NaN;

      // Skip if thresholds are invalid
      if (isNaN(effectiveMin) || isNaN(effectiveMax)) return;

      // Map fieldName to field1-field8
      const fieldIndex = channelFields.indexOf(field.fieldName) + 1;
      const latestValue = latestFeed?.[`field${fieldIndex}`]
        ? parseFloat(latestFeed[`field${fieldIndex}`])
        : NaN;

      if (!isNaN(latestValue)) {
        if (latestValue < effectiveMin || latestValue > effectiveMax) {
          const unit = defaultThreshold?.unit || "";
           warnings.push(
            `${field.fieldName} (${latestValue}${unit}) falls outside threshold (Min:${effectiveMin}${unit}, Max:${effectiveMax}${unit})`
           );
        }
      }
    });

    setPotentialWarnings(warnings);
  }, [fields, latestFeed, channelFields, defaultThresholds]);

  const handleFieldChange = (index: number, key: string, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    setFields(updatedFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    // Validate input fields
    const invalidFields = fields
      .filter((field) => field.minValue !== "" || field.maxValue !== "")
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
      const invalidNames = invalidFields.map((field) => field.fieldName).join(", ");
      setError(
        `Invalid thresholds for fields: ${invalidNames}. Both min and max must be numeric and min must be less than max, or both must be empty.`
      );
      setLoading(false);
      return;
    }
  
    const submissionFields = fields
      .filter((field) => field.minValue !== "" && field.maxValue !== "")
      .map((field) => ({
        fieldName: field.fieldName,
        minValue: Number(field.minValue),
        maxValue: Number(field.maxValue),
      }));
  
    try {
      // Submit updated thresholds
      const response = await fetch("/api/controls/thresholds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, thresholds: submissionFields }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to save thresholds: ${response.status}`);
      }
  
      // Fetch session info for logging
      const session = await getSession();
      const userId = session?.user?.id;
  
      if (userId) {
        const logChanges: string[] = [];
  
        fields.forEach((field) => {
          const newMin = Number(field.minValue);
          const newMax = Number(field.maxValue);
          const defaultThreshold = defaultThresholds.find(
            (t) => t.fieldName === field.fieldName
          );
          const oldMin = defaultThreshold?.minValue ?? NaN;
          const oldMax = defaultThreshold?.maxValue ?? NaN;
          const unit = defaultThreshold?.unit || "";
        
          if (!isNaN(oldMin) && oldMin !== newMin) {
            logChanges.push(
              `Lower threshold changed for ${field.fieldName.toLowerCase()} from ${oldMin}${unit} to ${newMin}${unit}`
            );
          }
        
          if (!isNaN(oldMax) && oldMax !== newMax) {
            logChanges.push(
              `Upper threshold changed for ${field.fieldName.toLowerCase()} changed from ${oldMax}${unit} to ${newMax}${unit}`
            );
          }
        });

        for (const action of logChanges) {
          await fetch("/api/logs/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              action,
              device: channelName,
              location: labLocation,
            }),
          });
        }
      }
  
      alert("Thresholds saved successfully!");
      onSave();
      handleClose();
    } catch (error) {
      console.error("Error saving thresholds:", error);
      if (error instanceof Error) {
        setError(error.message || "Failed to save thresholds. Please try again.");
      } else {
        setError("Failed to save thresholds. Please try again.");
      }
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
  
      // Fetch session to log activity
      const session = await getSession();
      if (session?.user?.id) {
        await fetch("/api/logs/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.user.id,
            action: "Thresholds reset to default",
            device: channelName,
            location: labLocation,
          }),
        });
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
      onSave(); // Trigger onSave to refresh LabCard
    } catch (error) {
      console.error("Error resetting thresholds:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to reset thresholds. Please try again."
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
        <Typography id="threshold-form-title" variant="h6" mb={2}>
          Customise Settings for {channelName}
        </Typography>
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}
        <Typography
          id="threshold-info"
          mb={2}
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
            fontWeight: 400,
          }}
        >
          Use this form to customise threshold settings for individual lab
          cards. Pressing "Reset to Default" will revert all settings to the
          admin-defined defaults.
        </Typography>
        {potentialWarnings.length > 0 && (
          <Typography color="warning.main" mb={2} sx={{ pb: 2 }}>
            Warning: {" "}
            {potentialWarnings.join("; ")}
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
                {loading ? "Saving..." : "Save"}
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
