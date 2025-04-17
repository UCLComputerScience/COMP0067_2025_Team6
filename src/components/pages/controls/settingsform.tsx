// "use client";

// import React, { useState, useEffect } from "react";
// import styled from "@emotion/styled";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   IconButton,
//   Snackbar,
//   Alert,
// } from "@mui/material";
// import { spacing } from "@mui/system";
// import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";

// const BoxStyled = styled(Box)(spacing);

// interface Threshold {
//   fieldName: string;
//   minValue: string;
//   maxValue: string;
//   unit: string;
// }

// interface SettingsFormProps {
//   handleClose: () => void;
//   onSave?: () => void;
// }

// function SettingsForm({ handleClose, onSave }: SettingsFormProps) {
//   const [fields, setFields] = useState<Threshold[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [snackbar, setSnackbar] = useState<{
//     open: boolean;
//     message: string;
//     severity: "error" | "warning" | "info" | "success";
//   }>({ open: false, message: "", severity: "info" });

//   const handleFieldChange = (
//     index: number,
//     key: keyof Threshold,
//     value: string
//   ) => {
//     const updatedFields = [...fields];
//     updatedFields[index] = { ...updatedFields[index], [key]: value };
//     setFields(updatedFields);
//   };

//   const handleAddField = () => {
//     setFields([
//       ...fields,
//       { fieldName: "", minValue: "", maxValue: "", unit: "" },
//     ]);
//   };

//   const handleRemoveField = (index: number) => {
//     const updatedFields = fields.filter((_, i) => i !== index);
//     setFields(updatedFields);
//   };

//   const handleSnackbarClose = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   useEffect(() => {
//     const fetchSettings = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch("/api/controls/settings");
//         if (!response.ok) {
//           throw new Error(`Failed to fetch thresholds: ${response.status}`);
//         }
//         const data = await response.json();
//         if (data.fields && Array.isArray(data.fields)) {
//           setFields(
//             data.fields.map((field: any) => ({
//               fieldName: field.fieldName || "",
//               minValue: field.minValue != null ? field.minValue.toString() : "",
//               maxValue: field.maxValue != null ? field.maxValue.toString() : "",
//               unit: field.unit || "",
//             }))
//           );
//         } else {
//           setFields([]);
//         }
//       } catch (error) {
//         console.error("Error fetching default thresholds:", error);
//         setError("Failed to load default thresholds. Please try again.");
//         setSnackbar({
//           open: true,
//           message: "Failed to load default thresholds.",
//           severity: "error",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   const validateFields = () => {
//     if (fields.length === 0) {
//       return null; // Allow empty fields to delete all thresholds
//     }

//     for (let i = 0; i < fields.length; i++) {
//       const field = fields[i];
//       if (!field.fieldName.trim()) {
//         return `Field ${i + 1}: Name is required and cannot be empty`;
//       }
//       const min = Number(field.minValue);
//       const max = Number(field.maxValue);
//       if (field.minValue === "" || isNaN(min)) {
//         return `Field ${i + 1}: Min value must be a valid number`;
//       }
//       if (field.maxValue === "" || isNaN(max)) {
//         return `Field ${i + 1}: Max value must be a valid number`;
//       }
//       if (min >= max) {
//         return `Field ${i + 1}: Min value must be less than max value`;
//       }
//     }
//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     // Client-side validation
//     const validationError = validateFields();
//     if (validationError) {
//       setError(validationError);
//       setSnackbar({
//         open: true,
//         message: validationError,
//         severity: "error",
//       });
//       setLoading(false);
//       return;
//     }

//     // Submit thresholds
//     try {
//       const submissionFields = fields.map((field) => ({
//         fieldName: field.fieldName.trim(),
//         minValue: Number(field.minValue),
//         maxValue: Number(field.maxValue),
//         unit: field.unit.trim() || null,
//       }));

//       const response = await fetch("/api/controls/settings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fields: submissionFields }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         let errorMessage = "Failed to save thresholds. Please try again.";
//         if (errorData.error) {
//           errorMessage = errorData.error;
//           if (errorData.details) {
//             errorMessage +=
//               "\nDetails: " + JSON.stringify(errorData.details, null, 2);
//           }
//         }
//         throw new Error(errorMessage);
//       }

//       setSnackbar({
//         open: true,
//         message:
//           fields.length === 0
//             ? "All default thresholds removed successfully!"
//             : "Default thresholds saved successfully!",
//         severity: "success",
//       });
//       onSave?.();
//       handleClose();
//     } catch (error) {
//       console.error("Error saving default thresholds:", error);
//       setError(error.message || "Failed to save thresholds. Please try again.");
//       setSnackbar({
//         open: true,
//         message: error.message || "Failed to save thresholds.",
//         severity: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <BoxStyled
//       sx={{
//         mb: 4,
//         p: 5,
//         border: "1px solid #ddd",
//         borderRadius: 2,
//         backgroundColor: "#f9f9f9",
//         maxWidth: 800,
//         margin: "0 auto",
//       }}
//     >
//       <Typography variant="h4" mb={5}>
//         Default Threshold Settings
//       </Typography>
//       {error && (
//         <Typography color="error" mb={2}>
//           {error}
//         </Typography>
//       )}
//       {loading && <Typography mb={2}>Loading...</Typography>}
//       <form onSubmit={handleSubmit}>
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
//           {fields.length === 0 && !loading ? (
//             <Typography variant="body1" color="textSecondary">
//               No fields defined yet. Click "Add Field" to start.
//             </Typography>
//           ) : (
//             fields.map((field, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   gap: 5,
//                   mb: 1,
//                   flexWrap: "wrap",
//                 }}
//               >
//                 <TextField
//                   label={`Field ${index + 1}`}
//                   value={field.fieldName}
//                   onChange={(e) =>
//                     handleFieldChange(index, "fieldName", e.target.value)
//                   }
//                   sx={{ width: 200 }}
//                   placeholder="Enter field name"
//                   required
//                   disabled={loading}
//                 />
//                 <TextField
//                   label="Min Value"
//                   type="number"
//                   value={field.minValue}
//                   onChange={(e) =>
//                     handleFieldChange(index, "minValue", e.target.value)
//                   }
//                   sx={{ width: 120 }}
//                   inputProps={{ step: "0.1" }}
//                   placeholder="Enter min value"
//                   required
//                   disabled={loading}
//                 />
//                 <TextField
//                   label="Max Value"
//                   type="number"
//                   value={field.maxValue}
//                   onChange={(e) =>
//                     handleFieldChange(index, "maxValue", e.target.value)
//                   }
//                   sx={{ width: 120 }}
//                   inputProps={{ step: "0.1" }}
//                   placeholder="Enter max value"
//                   required
//                   disabled={loading}
//                 />
//                 <TextField
//                   label="Unit"
//                   value={field.unit}
//                   onChange={(e) =>
//                     handleFieldChange(index, "unit", e.target.value)
//                   }
//                   sx={{ width: 80 }}
//                   placeholder="e.g., Pa"
//                   disabled={loading}
//                 />
//                 <IconButton
//                   onClick={() => handleRemoveField(index)}
//                   sx={{
//                     border: "1px solid grey",
//                     borderRadius: "50%",
//                     width: 32,
//                     height: 32,
//                     color: "grey",
//                     "&:hover": {
//                       borderColor: "darkgrey",
//                       color: "darkgrey",
//                     },
//                   }}
//                   disabled={loading}
//                 >
//                   <CloseIcon sx={{ fontSize: 18 }} />
//                 </IconButton>
//               </Box>
//             ))
//           )}

//           <Button
//             variant="outlined"
//             startIcon={<AddIcon />}
//             onClick={handleAddField}
//             sx={{ alignSelf: "flex-start", mb: 2 }}
//             disabled={loading}
//           >
//             Add Field
//           </Button>

//           <Box sx={{ display: "flex", gap: 3, mt: 2 }}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               disabled={loading}
//               sx={{ minWidth: 100 }}
//             >
//               {loading ? "Saving..." : "Save"}
//             </Button>
//             <Button
//               variant="outlined"
//               color="secondary"
//               onClick={handleClose}
//               disabled={loading}
//               sx={{ minWidth: 100 }}
//             >
//               Cancel
//             </Button>
//           </Box>
//         </Box>
//       </form>
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleSnackbarClose}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleSnackbarClose}
//           severity={snackbar.severity}
//           sx={{ whiteSpace: "pre-wrap" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </BoxStyled>
//   );
// }

// export default SettingsForm;

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
        if (!response.ok) {
          throw new Error(`Failed to fetch thresholds: ${response.status}`);
        }
        const data = await response.json();
        if (data.fields && Array.isArray(data.fields)) {
          setFields(
            data.fields.map((field: any) => ({
              fieldName: field.fieldName || "",
              minValue: field.minValue != null ? field.minValue.toString() : "",
              maxValue: field.maxValue != null ? field.maxValue.toString() : "",
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

  const validateFields = () => {
    if (fields.length === 0) {
      return null; // Allow empty fields to delete all thresholds
    }

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (!field.fieldName.trim()) {
        return `Field ${i + 1}: Name is required and cannot be empty`;
      }
      const min = Number(field.minValue);
      const max = Number(field.maxValue);
      if (field.minValue === "" || isNaN(min)) {
        return `Field ${i + 1}: Min value must be a valid number`;
      }
      if (field.maxValue === "" || isNaN(max)) {
        return `Field ${i + 1}: Max value must be a valid number`;
      }
      if (min >= max) {
        return `Field ${i + 1}: Min value must be less than max value`;
      }
    }
    return null;
  };

  const saveThresholds = async (submissionFields: any[]) => {
    try {
      const response = await fetch("/api/controls/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: submissionFields }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Failed to save thresholds. Please try again.";
        if (errorData.error) {
          errorMessage = errorData.error;
          if (errorData.details) {
            errorMessage +=
              "\nDetails: " + JSON.stringify(errorData.details, null, 2);
          }
        }
        throw new Error(errorMessage);
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
      setError(error.message || "Failed to save thresholds. Please try again.");
      setSnackbar({
        open: true,
        message: error.message || "Failed to save thresholds.",
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

    // Prepare submission fields
    const submissionFields = fields.map((field) => ({
      fieldName: field.fieldName.trim(),
      minValue: Number(field.minValue),
      maxValue: Number(field.maxValue),
      unit: field.unit.trim() || null,
    }));

    // Show confirmation dialog
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
      <Typography variant="h4" mb={5}>
        Default Threshold Settings
      </Typography>
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
      <Dialog
        open={confirmationDialog.open}
        onClose={() => handleConfirmationClose(false)}
      >
        <DialogTitle>Confirm Default Threshold Change</DialogTitle>
        <DialogContent>
          <Typography>
          Changing default thresholds may cause lab cards without custom thresholds to exceed new limits. Do you want to proceed
          with the changes?
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
