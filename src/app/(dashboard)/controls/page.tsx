"use client";

import React, { useState, useEffect, ReactNode } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Alert as MuiAlert,
  Avatar,
  AvatarGroup as MuiAvatarGroup,
  Breadcrumbs as MuiBreadcrumbs,
  Box,
  Button,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Grid2 as Grid,
  Link,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  TextField,
  FormControl,
  Popover,
  Typography as MuiTypography,
  IconButton,
  Snackbar,
  Select,
  Slider,
  Switch,
} from "@mui/material";
import { spacing } from "@mui/system";
import { orange, green, blue } from "@mui/material/colors";
import {
  Add as AddIcon,
  MoreVert,
  Search as SearchIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { startOfDay, endOfDay } from "date-fns";
import HideAuthGuard from "@/components/guards/HideAuthGuard";
import ThresholdForm from "@/components/pages/controls/thresholdform";
import SettingsForm from "@/components/pages/controls/settingsform";

// --- Styling ---
const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)<{ pb?: number }>`
  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)};
  }
`;

const AvatarGroup = styled(MuiAvatarGroup)`
  display: inline-flex;
`;

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Typography = styled(MuiTypography)(spacing);

const SearchBarContainer = styled(Box)`
  display: flex;
  justify-content: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
`;

interface ApiKey {
  id: number;
  channelId: number;
  api: string;
  labId: number;
  lab: {
    id: number;
    labLocation: string;
    managerId: number;
  };
}

interface Channel {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  field1?: string | null;
  field2?: string | null;
  field3?: string | null;
  field4?: string | null;
  field5?: string | null;
  field6?: string | null;
  field7?: string | null;
  field8?: string | null;
  lastEntryId: number;
  createdAt: string;
  updatedAt: string;
  ApiKey: ApiKey[];
}

interface LabCardProps {
  channelId: number;
  name: string;
  apiKey: string;
  defaultThresholds: {
    fieldName: string;
    minValue: number;
    maxValue: number;
    unit: string;
  }[];
  userId: string | null;
  labLocation: string;
}

interface SensorFieldProps {
  label: string;
  value: number[];
  min: number;
  max: number;
  step: number;
  unit: string;
  onSliderChange: (event: Event, newValue: number | number[]) => void;
  latestValue: string;
}

function SensorField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onSliderChange,
  latestValue,
}: SensorFieldProps) {
  const latest = parseFloat(latestValue);
  const isExceedingThreshold = latest < value[0] || latest > value[1];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "85px 120px 65px",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: "4px",
        padding: "6px",
        marginBottom: "8px",
        gap: "8px",
      }}
    >
      {/* Label */}
      <Box
        sx={{
          padding: "4px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          {label}
        </Typography>
      </Box>

      <Box sx={{ padding: "4px", position: "relative" }}>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={onSliderChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(val) => `${val}${unit}`}
        marks={[
          {
            value: Math.min(Math.max(parseFloat(latestValue), min), max),
            label: "", 
          },
        ]}
        sx={{
          "& .MuiSlider-mark": {
            width: 5,
            height: 20,
            borderRadius: "2px",
            backgroundColor: isExceedingThreshold ? "red" : "green",
            transform: "translate(-50%, -50%)",
          },
          "& .MuiSlider-markLabel[data-index='0']": {
            top: "-6px",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: `10px solid ${isExceedingThreshold ? "red" : "green"}`,
            position: "absolute",
            transform: "translateX(-50%)",
            backgroundColor: "transparent",
            zIndex: 2,
          },
          "& .MuiSlider-thumb": {
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: isExceedingThreshold ? "red" : "#1976d2",
            zIndex: 3,
            "&:hover": {
              boxShadow: "0 0 0 8px rgba(25, 118, 210, 0.16)",
            },
          },
          "& .MuiSlider-track": {
            height: 4,
            backgroundColor: isExceedingThreshold ? "red" : "#1976d2",
            zIndex: 1,
          },
          "& .MuiSlider-rail": {
            height: 4,
            backgroundColor: "#bfbfbf",
            zIndex: 0,
          },
        }}
      />


        <Typography
          sx={{
            position: "absolute",
            top: "24px",
            left: "2px",
            fontSize: "0.65rem",
            color: "text.primary",
          }}
        >
          Min
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            top: "24px",
            right: "2px",
            fontSize: "0.65rem",
            color: "text.primary",
          }}
        >
          Max
        </Typography>
      </Box>

      {/* Latest Value Box */}
      <Box
        sx={{
          padding: "4px",
          backgroundColor: isExceedingThreshold
            ? "rgba(255, 0, 0, 0.2)"
            : "rgba(0, 128, 0, 0.2)",
          borderRadius: "4px",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold",
            color: isExceedingThreshold ? "red" : "green",
          }}
        >
          {`${latestValue}${unit}`}
        </Typography>
      </Box>
    </Box>
  );
}


function LabCard({ channelId, name, apiKey, defaultThresholds, userId, labLocation }: LabCardProps) {
  const [channelData, setChannelData] = useState<any | null>(null);
  const [sliderValues, setSliderValues] = useState<number[][]>([]);
  const [initialSliderValues, setInitialSliderValues] = useState<number[][]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const location = labLocation;
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openThresholdForm, setOpenThresholdForm] = useState(false);
  const [thresholds, setThresholds] = useState<
    { fieldName: string; minValue: number; maxValue: number; unit: string }[]
  >([]);
  const [potentialWarnings, setPotentialWarnings] = useState<string[]>([]); // Add state for warnings
  useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };  
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenThresholdForm = () => {
    setOpenThresholdForm(true);
    handleMenuClose();
  };

  const handleCloseThresholdForm = () => {
    setOpenThresholdForm(false);
  };
  

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchThresholds = async () => {
    try {
      const response = await fetch(
        `/api/controls/thresholds?channelId=${channelId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch thresholds");
      }
      const data = await response.json();
      const newThresholds = data.thresholds || [];
      setThresholds(newThresholds);

      if (channelData) {
        const fields = Object.keys(channelData.channel)
          .filter((key) => key.startsWith("field"))
          .map((key) => ({
            label: channelData.channel[key],
            latestValue:
              channelData.feeds[channelData.feeds.length - 1][key] &&
              parseFloat(
                channelData.feeds[channelData.feeds.length - 1][key]
              ).toFixed(2),
          }))
          .filter((field) => field.label && field.latestValue);

        const updatedSliderValues = fields.map((field) => {
          const threshold = newThresholds.find(
            (t: any) => t.fieldName === field.label
          );
          const defaultThreshold = defaultThresholds.find(
            (t) => t.fieldName === field.label
          );
          const latest = field.latestValue
            ? parseFloat(field.latestValue)
            : null;
          if (threshold) {
            return [threshold.minValue, threshold.maxValue];
          } else if (defaultThreshold) {
            return [defaultThreshold.minValue, defaultThreshold.maxValue];
          } else if (latest !== null) {
            return [latest - 10, latest + 10];
          } else {
            return [0, 100];
          }
        });

        setSliderValues(updatedSliderValues);
        if (initialSliderValues.length === 0) {
          setInitialSliderValues(updatedSliderValues); 
        }
        setHasChanges(false);
      }
    } catch (err) {
      console.error("Error fetching thresholds:", err);
      setError("Failed to fetch thresholds.");
    }
  };

  const handleThresholdsSave = () => {
    fetchThresholds();
  };

  const handleSliderChange = (index: number, newValue: number | number[]) => {
    const updated = [...sliderValues];
    updated[index] = newValue as number[];
    setSliderValues(updated);

    const changed = updated.some(
      (val, i) =>
        val[0] !== initialSliderValues[i]?.[0] ||
        val[1] !== initialSliderValues[i]?.[1]
    );
    setHasChanges(changed);
  };

  const handleSaveThresholds = async () => {
    if (!channelData) return;

    setSaving(true);
    setError(null);

    const fields = Object.keys(channelData.channel)
      .filter((key) => key.startsWith("field"))
      .map((key) => channelData.channel[key])
      .filter((label) => label);

    const submissionFields = fields
      .map((fieldName, index) => {
        const [minValue, maxValue] = sliderValues[index] || [0, 100];
        if (isNaN(minValue) || isNaN(maxValue) || minValue >= maxValue) {
          return null;
        }
        const threshold = thresholds.find((t) => t.fieldName === fieldName);
        const defaultThreshold = defaultThresholds.find((t) => t.fieldName === fieldName);
        return {
          fieldName,
          minValue,
          maxValue,
          unit: threshold?.unit ?? defaultThreshold?.unit ?? "",
        };
      })
      .filter((field) => field !== null);

    try {
      const response = await fetch("/api/controls/thresholds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, thresholds: submissionFields }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      await fetchThresholds();

      type LogChange = {
        action: string;
        device: string;
        location: string;
      };
      
      const logChanges: LogChange[] = [];

      for (let index = 0; index < fields.length; index++) {
        const fieldLabel = fields[index];
        const [oldMin, oldMax] = initialSliderValues[index] || [];
        const [newMin, newMax] = sliderValues[index] || [];
      
        const deviceName = channelData?.channel?.name || name;
        const location = labLocation;
      
        const threshold = thresholds.find(t => t.fieldName === fieldLabel);
        const defaultThreshold = defaultThresholds.find(t => t.fieldName === fieldLabel);
        const unit = threshold?.unit || defaultThreshold?.unit || "";
      
        if (oldMin !== newMin) {
          logChanges.push({
            action: `Lower threshold changed for ${fieldLabel.toLowerCase()} from ${oldMin}${unit} to ${newMin}${unit}`,
            device: deviceName,
            location: labLocation,
          });
        }
      
        if (oldMax !== newMax) {
          logChanges.push({
            action: `Upper threshold changed for ${fieldLabel.toLowerCase()} from ${oldMax}${unit} to ${newMax}${unit}`,
            device: deviceName,
            location: labLocation,
          });
        }
      }
      
      for (const change of logChanges) {
        if (!userId) continue;
      
        await fetch("/api/logs/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            action: change.action,
            device: change.device,
            location: change.location,
          }),
        });
      }
      showSnackbar("Thresholds saved successfully!", "success");
    } catch (err) {
      console.error("Error saving thresholds:", err);
      setError("Failed to save thresholds. Please try again.");
      showSnackbar("Failed to save thresholds.", "error");
    } finally {
      setSaving(false);
    }
  };

  const checkThresholdViolations = async (fields: any[], newData: any) => {
    const latestFeed = newData.feeds[newData.feeds.length - 1] as Record<string, any>;
    const violations = [];
  
    for (const field of fields) {
      const threshold =
        thresholds.find((t) => t.fieldName === field.label) ||
        defaultThresholds.find((t) => t.fieldName === field.label);
      if (!threshold || !field.latestValue) continue;
  
      const latestValue = parseFloat(field.latestValue);
      if (isNaN(latestValue)) continue;
  
      const { minValue, maxValue, unit } = threshold;
  
      if (latestValue < minValue || latestValue > maxValue) {
        violations.push({
          fieldName: field.label,
          value: latestValue,
          minValue,
          maxValue,
          unit,
        });
      }
    }
  
    if (violations.length > 0) {
      const alertDescription = violations
        .map((v) => {
          const unit = v.unit ?? ""; // Use empty string if v.unit is null or undefined
          return `${v.fieldName} exceeded threshold: ${v.value}${unit} (Range: ${v.minValue}${unit} - ${v.maxValue}${unit})`;
        })
        .join("; ");
  
      try {
        const feedData: Record<string, number | null> = {};
        Object.keys(newData.channel)
          .filter((key) => key.startsWith("field"))
          .forEach((key) => {
            const fieldNum = key.replace("field", "");
            feedData[`field${fieldNum}`] = latestFeed[key]
              ? parseFloat(latestFeed[key])
              : null;
          });
  
        const response = await fetch("/api/controls/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channelId,
            fieldViolations: violations.map((v) => v.fieldName),
            alertDescription,
            priority: "HIGH",
            alertStatus: "UNRESOLVED",
            feedData,
          }),
        });
  
        const result = await response.json();
  
        if (response.status === 409) {
          showSnackbar(result.error, "warning");
          return;
        }
  
        if (response.status === 200) {
          console.log(
            `Unresolved alerts exist for fields: ${result.alerts
              .map((a: { alertDescription: string }) => a.alertDescription)
              .join(", ")}`
          );
          return;
        }
  
        if (!response.ok) {
          throw new Error(
            result.details || `Failed to create feed/alert: ${response.status}`
          );
        }
  
        showSnackbar(`New alert created: ${alertDescription}`, "warning");
      } catch (err: any) {
        console.error("Error creating feed/alert:", err);
        showSnackbar(`Failed to create alert: ${err.message || "Unknown error"}`, "error");
      }
    }
  };
  

  useEffect(() => {
    if (!channelData || !channelData.feeds || channelData.feeds.length === 0) {
      setPotentialWarnings([]);
      return;
    }

    const latestFeed = channelData.feeds[channelData.feeds.length - 1]; 
    const fields = Object.keys(channelData.channel)
      .filter((key) => key.startsWith("field"))
      .map((key) => ({
        label: channelData.channel[key],
        latestValue: latestFeed[key] && parseFloat(latestFeed[key]).toFixed(2),
      }))
      .filter((field) => field.label && field.latestValue);

    const warnings: string[] = [];
    const violationFields = fields
    .map((field, index) => {
      const [minValue, maxValue] = sliderValues[index] || [NaN, NaN];
      const defaultThreshold = defaultThresholds.find(
        (t) => t.fieldName === field.label
      );

      const effectiveMin = !isNaN(minValue)
        ? minValue
        : defaultThreshold?.minValue ?? NaN;
      const effectiveMax = !isNaN(maxValue)
        ? maxValue
        : defaultThreshold?.maxValue ?? NaN;

      if (isNaN(effectiveMin) || isNaN(effectiveMax)) return null;

      const latestValue = parseFloat(field.latestValue);
      if (!isNaN(latestValue)) {
        if (latestValue < effectiveMin || latestValue > effectiveMax) {
          const unit = defaultThreshold?.unit || "";
          warnings.push(
            `${field.label} (${latestValue}${unit}) falls outside threshold (Min:${effectiveMin}${unit}, Max:${effectiveMax}${unit})`
          );
          return { label: field.label, latestValue: field.latestValue };
        }
      }
      return null;
    })
    .filter((field) => field !== null);

  setPotentialWarnings(warnings);

  if (violationFields.length > 0) {
    checkThresholdViolations(violationFields, channelData);
  }
  }, [sliderValues, channelData, defaultThresholds]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching from URL:", apiKey);
      try {
        const response = await fetch(`${apiKey}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setChannelData(data);

        if (data && data.channel && data.feeds && data.feeds.length > 0) {
          const fields = Object.keys(data.channel)
            .filter((key) => key.startsWith("field"))
            .map((key) => ({
              label: data.channel[key],
              latestValue:
                data.feeds[data.feeds.length - 1][key] &&
                parseFloat(data.feeds[data.feeds.length - 1][key]).toFixed(2),
            }))
            .filter((field) => field.label && field.latestValue);
          await checkThresholdViolations(fields, data);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Fetch error:", err.message);
          setError(err.message);
        } else {
          console.error("Fetch error:", err);
          setError("An unknown error occurred.");
        }
      }
    };

    fetchData();
    fetchThresholds();

    const intervalId = setInterval(() => {
      fetchData();
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [channelId, apiKey]);

  useEffect(() => {
    if (channelData && sliderValues.length === 0) {
      const fields = Object.keys(channelData.channel)
        .filter((key) => key.startsWith("field"))
        .map((key) => ({
          label: channelData.channel[key],
          latestValue:
            channelData.feeds[channelData.feeds.length - 1][key] &&
            parseFloat(
              channelData.feeds[channelData.feeds.length - 1][key]
            ).toFixed(2),
        }))
        .filter((field) => field.label && field.latestValue);

      const initialSliderValues = fields.map((field) => {
        const threshold = thresholds.find((t) => t.fieldName === field.label);
        const defaultThreshold = defaultThresholds.find(
          (t) => t.fieldName === field.label
        );
        const latest = field.latestValue ? parseFloat(field.latestValue) : null;
        if (threshold) {
          return [threshold.minValue, threshold.maxValue];
        } else if (defaultThreshold) {
          return [defaultThreshold.minValue, defaultThreshold.maxValue];
        } else if (latest !== null) {
          return [latest - 10, latest + 10];
        } else {
          return [0, 100];
        }
      });

      setSliderValues(initialSliderValues);
      setInitialSliderValues(initialSliderValues);
    }
  }, [channelData, thresholds, defaultThresholds]);

  if (!channelData) {
    return <Typography variant="body1">Loading data...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">{`Error: ${error}`}</Typography>
    );
  }

  const { channel, feeds } = channelData;
  const latestFeed = feeds[feeds.length - 1];

  const fields = Object.keys(channel)
    .filter((key) => key.startsWith("field"))
    .map((key) => ({
      label: channel[key],
      latestValue: latestFeed[key] && parseFloat(latestFeed[key]).toFixed(2),
    }))
    .filter((field) => field.label && field.latestValue);

    return (
      <>
        <Card
          sx={{
            maxWidth: 320,
            minHeight: 350,
            marginBottom: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardContent
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: 0,
            }}
          >
        <Box sx={{ flexShrink: 0, p: 3, pb: 2 }}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                {channel.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "0.8rem", color: "grey.500" }}
              >
                {channelId}
              </Typography>
            </Grid>
            <Grid>
              <IconButton onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
            </Grid>
          </Grid>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleOpenThresholdForm}>Customise Thresholds</MenuItem>
          </Menu>

          <ThresholdForm
            open={openThresholdForm}
            handleClose={handleCloseThresholdForm}
            channelId={channelId}
            channelName={name}
            defaultThresholds={defaultThresholds}
            channelFields={fields.map((f) => f.label)}
            onSave={handleThresholdsSave}
            latestFeed={latestFeed}
            labLocation={labLocation} 
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 3,
            pt: 0,
            pb: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ flexShrink: 0 }}>
            {fields.map((field, index) => {
              const threshold = thresholds.find(
                (t) => t.fieldName === field.label
              );
              const defaultThreshold = defaultThresholds.find(
                (t) => t.fieldName === field.label
              );
              const latest = field.latestValue
                ? parseFloat(field.latestValue)
                : 0;
              return (
                <SensorField
                  key={index}
                  label={field.label}
                  value={sliderValues[index] || [latest - 10, latest + 10]}
                  min={
                    threshold?.minValue ??
                    defaultThreshold?.minValue ??
                    latest - 10
                  }
                  max={
                    threshold?.maxValue ??
                    defaultThreshold?.maxValue ??
                    latest + 10
                  }
                  step={0.1}
                  unit={threshold?.unit ?? defaultThreshold?.unit ?? ""}
                  onSliderChange={(event, newValue) =>
                    handleSliderChange(index, newValue)
                  }
                  latestValue={field.latestValue || "0.00"}
                />
              );
            })}
            {potentialWarnings.length > 0 && (
              <Typography variant="body2" color="warning.main" mt={2}>
                Warning: {potentialWarnings.join("; ")}
              </Typography>
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
        </Box>

        <Box sx={{ flexShrink: 0, p: 3, pt: 2 }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                padding: "8px",
                flex: 1,
              }}
            >
              <Typography variant="body2">
                <strong>Start date:</strong>{" "}
                {new Date(channel.created_at).toLocaleDateString()}
              </Typography>
            </Box>
            <Box
              sx={{
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                padding: "8px",
                flex: 1,
              }}
            >
              <Typography variant="body2">
                <strong>Last updated:</strong>{" "}
                {new Date(channel.updated_at).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          {hasChanges && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveThresholds}
                disabled={saving}
                fullWidth
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Card>
    </>
  );
}

function DateFilterMenu({
  createdStartDate,
  createdEndDate,
  updatedStartDate,
  updatedEndDate,
  setCreatedStartDate,
  setCreatedEndDate,
  setUpdatedStartDate,
  setUpdatedEndDate,
}: {
  createdStartDate: Date | null;
  createdEndDate: Date | null;
  updatedStartDate: Date | null;
  updatedEndDate: Date | null;
  setCreatedStartDate: (date: Date | null) => void;
  setCreatedEndDate: (date: Date | null) => void;
  setUpdatedStartDate: (date: Date | null) => void;
  setUpdatedEndDate: (date: Date | null) => void;
}) {
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(
    null
  );

  const handleDateFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const handleApplyCustomRange = () => {
    if (createdStartDate) setCreatedStartDate(startOfDay(createdStartDate));
    if (createdEndDate) setCreatedEndDate(endOfDay(createdEndDate));
    if (updatedStartDate) setUpdatedStartDate(startOfDay(updatedStartDate));
    if (updatedEndDate) setUpdatedEndDate(endOfDay(updatedEndDate));
    setPopoverAnchorEl(null);
  };

  const handleResetDateFilter = () => {
    setCreatedStartDate(null);
    setCreatedEndDate(null);
    setUpdatedStartDate(null);
    setUpdatedEndDate(null);
    setPopoverAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleDateFilterClick}
        startIcon={<FilterListIcon />}
        sx={{
          minWidth: 120,
          padding: "4px 8px",
          fontSize: "0.85rem",
        }}
      >
        Date Filter
      </Button>

      <Popover
        open={Boolean(popoverAnchorEl)}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 350 }}>
          <Typography variant="h6" gutterBottom>
            Select Date Ranges
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Created Date Range
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={createdStartDate}
                  onChange={(newValue) => setCreatedStartDate(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                  format="dd/MM/yyyy"
                />
                <DatePicker
                  label="End Date"
                  value={createdEndDate}
                  onChange={(newValue) => setCreatedEndDate(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                  format="dd/MM/yyyy"
                />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Updated Date Range
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={updatedStartDate}
                  onChange={(newValue) => setUpdatedStartDate(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                  format="dd/MM/yyyy"
                />
                <DatePicker
                  label="End Date"
                  value={updatedEndDate}
                  onChange={(newValue) => setUpdatedEndDate(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                  format="dd/MM/yyyy"
                />
              </Box>
            </Box>
          </LocalizationProvider>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button onClick={handleResetDateFilter} color="secondary">
              Reset
            </Button>
            <Button onClick={handlePopoverClose}>Cancel</Button>
            <Button onClick={handleApplyCustomRange} variant="contained">
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

function SortMenu({
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
}: {
  sortField: string;
  sortDirection: "asc" | "desc";
  setSortField: (field: string) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortSelect = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
    handleSortClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleSortClick}
        startIcon={<SortIcon />}
        sx={{
          minWidth: 100,
          padding: "4px 8px",
          fontSize: "0.85rem",
        }}
      >
        Sort
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={() => handleSortSelect("name", "asc")}>
          Name (A-Z)
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect("name", "desc")}>
          Name (Z-A)
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect("id", "asc")}>
          Channel ID (Low to High)
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect("id", "desc")}>
          Channel ID (High to Low)
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect("createdAt", "asc")}>
          Creation Date (Oldest First)
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect("createdAt", "desc")}>
          Creation Date (Newest First)
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect("updatedAt", "asc")}>
          Last Updated (Oldest First)
        </MenuItem>
        <MenuItem onClick={() => handleSortSelect("updatedAt", "desc")}>
          Last Updated (Newest First)
        </MenuItem>
      </Menu>
    </>
  );
}

function Controls() {
  const [searchTerm, setSearchTerm] = useState("");
  const [channelIdFilter, setChannelIdFilter] = useState<number | "">("");
  const [createdStartDate, setCreatedStartDate] = useState<Date | null>(null);
  const [createdEndDate, setCreatedEndDate] = useState<Date | null>(null);
  const [updatedStartDate, setUpdatedStartDate] = useState<Date | null>(null);
  const [updatedEndDate, setUpdatedEndDate] = useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = useState("all");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [defaultThresholds, setDefaultThresholds] = useState<
    { fieldName: string; minValue: number; maxValue: number; unit: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        console.log("Client-side session:", session);
        if (session && session.user && session.user.id) {
          setUserId(session.user.id);
        } else {
          setError("No active session found. Please log in.");
          router.push("/auth/signin");
        }
      } catch (err) {
        console.error("Error fetching session:", err);
        setError("Failed to fetch session data.");
        router.push("/auth/signin");
      }
    };
    fetchSession();
  }, [router]);

  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);

  const fetchData = async () => {
    if (!userId) {
      setError("User ID not available. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [channelsResponse, thresholdsResponse] = await Promise.all([
        fetch(`/api/controls/channels?userId=${encodeURIComponent(userId)}`, {
          cache: "no-store",
          credentials: "include",
        }),
        fetch("/api/controls/settings", { cache: "no-store" }),
      ]);

      if (!channelsResponse.ok) {
        const errorData = await channelsResponse.json();
        console.error(
          `Failed to fetch channels: Status ${channelsResponse.status}, Message: ${errorData.message}`
        );
        throw new Error(errorData.message || "Failed to fetch channels");
      }
      if (!thresholdsResponse.ok) {
        const errorData = await thresholdsResponse.json();
        console.error(
          `Failed to fetch thresholds: Status ${thresholdsResponse.status}, Message: ${errorData.message}`
        );
        throw new Error(
          errorData.message || "Failed to fetch default thresholds"
        );
      }

      const channelsData = await channelsResponse.json();
      const thresholdsData = await thresholdsResponse.json();

      console.log("Channels Data:", channelsData);
      console.log("Thresholds Data:", thresholdsData);

      setChannels(channelsData);
      setDefaultThresholds(thresholdsData.fields || []);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Fetch error:", err);
      } else {
        setError("An unknown error occurred.");
        console.error("Fetch error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }

    const intervalId = setInterval(() => {
      if (userId) {
        fetchData();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [userId]);

  const handleSettingsSave = () => {
    fetchData();
  };

  const filteredChannels = channels
    .filter((channel) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === "" ||
        channel.name.toLowerCase().includes(searchLower) ||
        channel.id.toString().includes(searchLower);
      const matchesChannelId =
        channelIdFilter === "" || channel.id === channelIdFilter;
      const createdDate = new Date(channel.createdAt);
      const updatedDate = new Date(channel.updatedAt);
      const matchesCreatedDate =
        (!createdStartDate || createdDate >= startOfDay(createdStartDate)) &&
        (!createdEndDate || createdDate <= endOfDay(createdEndDate));
      const matchesUpdatedDate =
        (!updatedStartDate || updatedDate >= startOfDay(updatedStartDate)) &&
        (!updatedEndDate || updatedDate <= endOfDay(updatedEndDate));
      return (
        matchesSearch &&
        matchesChannelId &&
        matchesCreatedDate &&
        matchesUpdatedDate
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === "id") {
        comparison = a.id - b.id;
      } else if (sortField === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === "updatedAt") {
        comparison =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const channelIds = Array.from(
    new Set(channels.map((channel) => channel.id))
  ).sort((a, b) => a - b);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Typography variant="h3" gutterBottom display="inline">
        Controls
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NextLink} href="/">
          Dashboard
        </Link>
        <Typography>Controls</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <SearchBarContainer>
        <TextField
          placeholder="Search Channel"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Channel ID</InputLabel>
          <Select
            value={channelIdFilter}
            label="Channel ID"
            onChange={(e) => setChannelIdFilter(e.target.value as number | "")}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {channelIds.map((id) => (
              <MenuItem key={id} value={id}>
                {id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <DateFilterMenu
          createdStartDate={createdStartDate}
          createdEndDate={createdEndDate}
          updatedStartDate={updatedStartDate}
          updatedEndDate={updatedEndDate}
          setCreatedStartDate={setCreatedStartDate}
          setCreatedEndDate={setCreatedEndDate}
          setUpdatedStartDate={setUpdatedStartDate}
          setUpdatedEndDate={setUpdatedEndDate}
        />
        <SortMenu
          sortField={sortField}
          sortDirection={sortDirection}
          setSortField={setSortField}
          setSortDirection={setSortDirection}
        />
        <HideAuthGuard requiredRoles={["ADMIN", "SUPERUSER"]}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenSettings}
          sx={{ ml: "auto" }}
        >
          Manage Default Settings
        </Button>
        </HideAuthGuard>
      </SearchBarContainer>

      <Modal
        open={openSettings}
        onClose={handleCloseSettings}
        aria-labelledby="settings-modal-title"
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
          <SettingsForm
            handleClose={handleCloseSettings}
            onSave={handleSettingsSave}
          />
        </Box>
      </Modal>

      <Box sx={{ mb: 5, padding: 2 }}>
        <Grid container spacing={6}>
          {filteredChannels.map((channel) => {
            console.log(`Channel ${channel.id} ApiKey:`, channel.ApiKey);
            return (
              <Grid key={channel.id}>
                <LabCard
                  channelId={channel.id}
                  name={channel.name}
                  apiKey={channel.ApiKey[0]?.api || ""}
                  defaultThresholds={defaultThresholds}
                  userId={userId} 
                  labLocation={channel.ApiKey[0]?.lab?.labLocation || "Unknown"}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
}

export default Controls;
