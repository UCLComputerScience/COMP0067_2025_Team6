"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Box, Button, TextField, Typography, IconButton } from "@mui/material";
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

    if (fields.length > 0) {
      const invalidFields = fields.filter((field) => {
        const min = field.minValue === "" ? NaN : Number(field.minValue);
        const max = field.maxValue === "" ? NaN : Number(field.maxValue);
        return !field.fieldName || isNaN(min) || isNaN(max) || min > max;
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
      unit: field.unit || null,
    }));

    try {
      const response = await fetch("/api/controls/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: submissionFields }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      alert(
        fields.length === 0
          ? "All default thresholds removed successfully!"
          : "Default thresholds saved successfully!"
      );
      onSave?.();
      handleClose();
    } catch (error) {
      console.error("Error saving default thresholds:", error);
      setError("Failed to save default thresholds. Please try again.");
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
    </BoxStyled>
  );
}

export default SettingsForm;
