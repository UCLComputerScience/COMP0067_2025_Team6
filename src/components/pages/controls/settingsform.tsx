"use client";
import { getSession } from "next-auth/react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";

const BoxStyled = styled(Box)(spacing);

interface Threshold {
  fieldName: string;
  minValue: string;
  maxValue: string;
  unit: string;
}

interface SettingsFormProps {
  handleClose: () => void;
  onSave?: () => void;
}

function SettingsForm({ handleClose, onSave }: SettingsFormProps) {
  const [fields, setFields] = useState<Threshold[]>([]);
  const [originalFields, setOriginalFields] = useState<Threshold[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "warning" | "info" | "success";
  }>({ open: false, message: "", severity: "info" });
  const [confirmationDialog, setConfirmationDialog] = useState<{
    open: boolean;
    submissionFields: any[];
  }>({ open: false, submissionFields: [] });

  const handleFieldChange = (
    index: number,
    key: keyof Threshold,
    value: string
  ) => {
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

  const handleConfirmationClose = (proceed: boolean) => {
    if (proceed) {
      saveThresholds(confirmationDialog.submissionFields);
    }
    setConfirmationDialog({ open: false, submissionFields: [] });
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/controls/settings");
        if (!response.ok) throw new Error("Failed to fetch thresholds");
        const data = await response.json();
        const fetchedFields = data.fields || [];
        setFields(fetchedFields);
        setOriginalFields(JSON.parse(JSON.stringify(fetchedFields)));
      } catch (error) {
        console.error("Error fetching thresholds:", error);
        setError("Failed to load thresholds.");
        setSnackbar({ open: true, message: "Failed to load thresholds.", severity: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const validateFields = () => {
    if (fields.length === 0) return null;
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      const min = Number(f.minValue);
      const max = Number(f.maxValue);
      if (!f.fieldName.trim()) return `Field ${i + 1}: Name required`;
      if (f.minValue === "" || isNaN(min)) return `Field ${i + 1}: Invalid min`;
      if (f.maxValue === "" || isNaN(max)) return `Field ${i + 1}: Invalid max`;
      if (min >= max) return `Field ${i + 1}: Min >= Max`;
    }
    return null;
  };

  const saveThresholds = async (submissionFields: Threshold[]) => {
    try {
      const response = await fetch("/api/controls/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: submissionFields }),
      });
      if (!response.ok) throw new Error("Failed to save thresholds");

      const session = await getSession();
      if (session?.user?.id) {
        const userId = session.user.id;

        // Create a map to compare previous and new
        const originalMap = Object.fromEntries(originalFields.map(f => [f.fieldName.toLowerCase(), f]));
        const newMap = Object.fromEntries(submissionFields.map(f => [f.fieldName.toLowerCase(), f]));

        const changes: string[] = [];

        // Log changes and additions
        for (const [key, newVal] of Object.entries(newMap)) {
          const oldVal = originalMap[key];
          const fieldName = key.toLowerCase(); // ensure lowercase in log

          if (!oldVal) {
            // New threshold added
            changes.push(
              `Upper threshold set to ${newVal.maxValue}${newVal.unit} and lower threshold set to ${newVal.minValue}${newVal.unit} for ${fieldName}`
            );
          } else {
            // Existing threshold updated
            if (
              oldVal.minValue !== newVal.minValue ||
              oldVal.maxValue !== newVal.maxValue ||
              oldVal.unit !== newVal.unit
            ) {
              changes.push(
                `Upper threshold set to ${newVal.maxValue}${newVal.unit} and lower threshold set to ${newVal.minValue}${newVal.unit} for ${fieldName}`
              );
            }
          }
        }

        // Log deletions
        for (const [key, oldVal] of Object.entries(originalMap)) {
          if (!newMap[key]) {
            changes.push(
              `Upper threshold of ${oldVal.maxValue}${oldVal.unit} and lower threshold of ${oldVal.minValue}${oldVal.unit} for ${key} was deleted`
            );
          }
        }

        for (const action of changes) {
          await fetch("/api/logs/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              action,
              device: "Default Threshold",
              location: "N/A",
            }),
          });
        }
      }

      setSnackbar({ open: true, message: "Saved successfully", severity: "success" });
      onSave?.();
      handleClose();
    } catch (error) {
      console.error("Error saving default thresholds:", error);
      if (error instanceof Error) {
        setError(
          error.message || "Failed to save thresholds. Please try again."
        );
      } else {
        setError("Failed to save thresholds. Please try again.");
      }
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : "Failed to save thresholds.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Client-side validation
    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      setSnackbar({
        open: true,
        message: validationError,
        severity: "error",
      });
      setLoading(false);
      return;
    }

    const submissionFields = fields.map((field) => ({
      fieldName: field.fieldName.trim(),
      minValue: Number(field.minValue),
      maxValue: Number(field.maxValue),
      unit: (field.unit ?? "").trim() || null,
    }));

    setConfirmationDialog({ open: true, submissionFields });
    setLoading(false);
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
      <Typography variant="h4" mb={2}>
        Default Threshold Settings
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
          padding: 1,
        }}
      >
        Configure default threshold settings (range and units) for all channels
        using this form. These settings will apply to channels without custom
        thresholds. If no defaults are specified, channels will use a threshold
        of ±10 from the current feed value.
      </Typography>
      <div></div>
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
      <Dialog
        open={confirmationDialog.open}
        onClose={() => handleConfirmationClose(false)}
      >
        <DialogTitle>Confirm Default Threshold Change</DialogTitle>
        <DialogContent>
          <Typography>
            Changing default thresholds may cause lab cards without custom
            thresholds to exceed new limits. Do you want to proceed with the
            changes?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleConfirmationClose(false)}
            color="secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleConfirmationClose(true)}
            variant="contained"
            color="primary"
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </BoxStyled>
  );
}

export default SettingsForm;
