"use client";

import React, { useEffect, useState } from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
// import withAuth from "@/lib/withAuth"; // Import the withAuth HOC

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Checkbox,
  Chip as MuiChip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider as MuiDivider,
  Grid2 as Grid,
  IconButton,
  Link,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Popover,
} from "@mui/material";
import { green, orange, red, blue, grey } from "@mui/material/colors";
import {
  Add as AddIcon,
  Archive as ArchiveIcon,
  FilterList as FilterListIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { spacing, SpacingProps } from "@mui/system";
import { Rosario } from "next/font/google";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, startOfDay, endOfDay } from "date-fns";
import AlertDetailsPopup from "./components/AlertDetailsPopup";

const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Paper = styled(MuiPaper)(spacing);

interface PriorityChipProps extends SpacingProps {
  priority?: string;
}

const PriorityChip = styled(MuiChip)<PriorityChipProps>`
  ${spacing};

  background: ${(props) =>
    props.priority === "High"
      ? red[500]
      : props.priority === "Moderate"
      ? orange[500]
      : green[500]}; // Use green for Low priority

  color: ${(props) => props.theme.palette.common.white};
`;

interface StatusChipProps extends SpacingProps {
  status?: string;
}
const StatusChip = styled(MuiChip)<StatusChipProps>`
  ${spacing};

  background: ${(props) =>
    props.status === "Resolved" ? blue[500] : grey[500]};
  color: ${(props) => props.theme.palette.common.white};
`;

const Spacer = styled.div`
  flex: 1 1 100%;
`;

const ToolbarTitle = styled.div`
  min-width: 150px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
`;

type AlertType = {
  alertId: number;
  location: [number, number];
  channelId: number;
  channelName: string;
  priority: string;
  alertDescription: string;
  status: string;
  date: string;
};

export type RowType = {
  id: number;
  location: string; // Convert [lat, lon] to string
  channelId: number;
  channel: string;
  priority: string;
  desc: string;
  status: string;
  date: string;
};

function createRowFromAlert(alert: AlertType): RowType {
  console.log("Processing alert:", alert);
  return {
    id: alert.alertId,
    location:
      alert.location &&
      Array.isArray(alert.location) &&
      alert.location.length >= 2
        ? `${alert.location[0]}, ${alert.location[1]}`
        : "Unknown",
    channelId: alert.channelId,
    channel: alert.channelName || "Unknown",
    priority: alert.priority || "LOW",
    desc: alert.alertDescription || "No description",
    status: alert.status || "UNRESOLVED",
    date: alert.date || "Unknown",
  };
}

function descendingComparator(a: RowType, b: RowType, orderBy: keyof RowType) {
  if (orderBy === "channelId") {
    // Numerical sorting for Channel ID
    return b.channelId - a.channelId;
  } else if (orderBy === "channel") {
    // Alphabetical sorting for Channel Name
    return b.channel.localeCompare(a.channel);
  } else if (orderBy === "priority") {
    // Custom order: LOW (1), MODERATE (2), HIGH (3)
    const priorityOrder = { LOW: 1, MODERATE: 2, HIGH: 3 };
    return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
           (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
  } else if (orderBy === "desc") {
    // Alphabetical sorting for Description
    return b.desc.localeCompare(a.desc);
  } else if (orderBy === "status") {
    // Custom order: UNRESOLVED (0), RESOLVED (1)
    const statusOrder = { UNRESOLVED: 0, RESOLVED: 1 };
    return (statusOrder[b.status as keyof typeof statusOrder] || 0) - (statusOrder[a.status as keyof typeof statusOrder] || 0);
  } else if (orderBy === "date") {
    // Chronological sorting for Date & Time
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }
  return 0; // Default case (e.g., "actions" won't sort)
}

function getComparator(
  order: "desc" | "asc",
  orderBy: keyof RowType
): (a: RowType, b: RowType) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(
  array: Array<RowType>,
  comparator: (a: RowType, b: RowType) => number
) {
  const stabilizedThis = array.map((el: RowType, index: number) => ({
    el,
    index,
  }));
  stabilizedThis.sort((a, b) => {
    const order = comparator(a.el, b.el);
    if (order !== 0) return order;
    return a.index - b.index;
  });
  return stabilizedThis.map((element) => element.el);
}

type HeadCell = {
  id: string;
  alignment: "left" | "center" | "right" | "justify" | "inherit" | undefined;
  label: string;
  disablePadding?: boolean;
};
const headCells: Array<HeadCell> = [
  { id: "channelId", alignment: "left", label: "Channel ID" },
  { id: "channel", alignment: "left", label: "Channel Name" },
  { id: "priority", alignment: "left", label: "Priority" },
  { id: "desc", alignment: "left", label: "Description" },
  { id: "status", alignment: "left", label: "Status" },
  { id: "date", alignment: "left", label: "Date & Time" },
  { id: "actions", alignment: "left", label: "Actions" },
];

type EnhancedTableHeadProps = {
  numSelected: number;
  order: "desc" | "asc";
  orderBy: keyof RowType; // [CHANGED]
  rowCount: number;
  onSelectAllClick: (e: any) => void;
  onRequestSort: (e: any, property: keyof RowType) => void; // [CHANGED]
};

const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = (props) => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property: keyof RowType) => (event: any) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignment}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === "actions" ? (
              headCell.label
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id as keyof RowType)}
              >
                {headCell.label}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

type EnhancedTableToolbarProps = {
  numSelected: number;
  onManageAlertsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  anchorEl: HTMLElement | null;
  handleMenuClose: () => void;
  handleBulkDelete: () => void;
  handleBulkResolve: () => void;
};
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  // Here was 'let'
  const {
    numSelected,
    onManageAlertsClick,
    anchorEl,
    handleMenuClose,
    handleBulkDelete,
    handleBulkResolve,
  } = props;
  const open = Boolean(anchorEl);

  return (
    <Toolbar>
      <ToolbarTitle>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Alerts
          </Typography>
        )}
      </ToolbarTitle>
      <Spacer />
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={numSelected === 0}
          onClick={onManageAlertsClick}
          aria-controls={open ? "manage-alerts-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{ minWidth: "110px", minHeight: "35px" }} // Makes the button longer
        >
          Manage Alerts
        </Button>
        <Menu
          id="manage-alerts-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleBulkDelete}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
          <MenuItem onClick={handleBulkResolve}>
            <CheckCircleIcon fontSize="small" sx={{ mr: 1 }} />
            Mark as Resolved
          </MenuItem>
        </Menu>
        <Tooltip title="Filter list">
          <IconButton aria-label="Filter list" size="large">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};

function EnhancedTable() {
  const [order, setOrder] = React.useState<"desc" | "asc">("desc");
  const [orderBy, setOrderBy] = React.useState<keyof RowType>("date");
  const [selected, setSelected] = React.useState<Array<string>>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<RowType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const [resolveDialogOpen, setResolveDialogOpen] = React.useState(false);
  const [resolveId, setResolveId] = React.useState<number | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [bulkResolveDialogOpen, setBulkResolveDialogOpen] =
    React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState("All");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [reloadAlerts, setReloadAlerts] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [selectedRange, setSelectedRange] = React.useState("all");
  const [descriptionDialogOpen, setDescriptionDialogOpen] =
    React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<RowType | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const response = await fetch(
        `/admin/alerts/api/channel?_t=${timestamp}`,
        {
          cache: "no-store",
          headers: {
            pragma: "no-cache",
            "cache-control": "no-cache",
          },
        }
      );
      console.log("Response status:", response.status);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data: AlertType[] = await response.json();
      console.log("Raw API data:", data);
      const formattedRows = data.map(createRowFromAlert);
      console.log("Formatted rows:", formattedRows);
      setRows(formattedRows);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [reloadAlerts]);

  const handleRequestSort = (event: any, property: keyof RowType) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleRefreshData = () => {
    console.log("Refreshing alert data...");
    setReloadAlerts((prev) => !prev);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds: Array<string> = filteredRows.map((n: RowType) =>
        n.id.toString()
      );
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: Array<string> = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (row: RowType) => {
    setSelectedRow(row);
    setDescriptionDialogOpen(true);
  };

  const handleDescriptionDialogClose = () => {
    setDescriptionDialogOpen(false);
    setSelectedRow(null);
  };

  const DateFilterMenu = () => {
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(
      null
    );
    const [popoverAnchorEl, setPopoverAnchorEl] =
      React.useState<HTMLElement | null>(null);

    const handleDateFilterClick = (event: React.MouseEvent<HTMLElement>) => {
      console.log("Anchor element:", event.currentTarget);
      setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setMenuAnchorEl(null);
    };

    const handleRangeSelect = (
      range: string,
      event?: React.MouseEvent<HTMLElement>
    ) => {
      setSelectedRange(range);
      let newStartDate: Date | null = null;
      let newEndDate: Date | null = new Date();

      switch (range) {
        case "7days":
          newStartDate = new Date();
          newStartDate.setDate(newStartDate.getDate() - 7);
          newStartDate = startOfDay(newStartDate); // Start of day
          newEndDate = endOfDay(newEndDate); // End of current day
          break;
        case "30days":
          newStartDate = new Date();
          newStartDate.setDate(newStartDate.getDate() - 30);
          newStartDate = startOfDay(newStartDate);
          newEndDate = endOfDay(newEndDate);
          break;
        case "year":
          newStartDate = new Date();
          newStartDate.setFullYear(newStartDate.getFullYear() - 1);
          newStartDate = startOfDay(newStartDate);
          newEndDate = endOfDay(newEndDate);
          break;
        case "all":
          newStartDate = null;
          newEndDate = null;
          break;
        case "custom":
          if (event) {
            setPopoverAnchorEl(event.currentTarget);
          }
          return;
      }

      setStartDate(newStartDate);
      setEndDate(newEndDate);
      setMenuAnchorEl(null);
    };

    const handlePopoverClose = () => {
      setPopoverAnchorEl(null);
    };

    const handleApplyCustomRange = () => {
      setSelectedRange("custom");
      if (startDate) setStartDate(startOfDay(startDate));
      if (endDate) setEndDate(endOfDay(endDate));
      setPopoverAnchorEl(null);
    };

    return (
      <>
        <Button
          variant="outlined"
          onClick={handleDateFilterClick}
          startIcon={<FilterListIcon />}
        >
          {selectedRange === "7days"
            ? "Last 7 Days"
            : selectedRange === "30days"
            ? "Last 30 Days"
            : selectedRange === "year"
            ? "Last Year"
            : selectedRange === "custom"
            ? "Custom Range"
            : "All Time"}
        </Button>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem onClick={() => handleRangeSelect("7days")}>
            Last 7 Days
          </MenuItem>
          <MenuItem onClick={() => handleRangeSelect("30days")}>
            Last 30 Days
          </MenuItem>
          <MenuItem onClick={() => handleRangeSelect("year")}>
            Last Year
          </MenuItem>
          <MenuItem onClick={() => handleRangeSelect("all")}>All Time</MenuItem>
          <MenuItem onClick={(event) => handleRangeSelect("custom", event)}>
            Custom Range
          </MenuItem>
        </Menu>

        <Popover
          open={Boolean(popoverAnchorEl)}
          anchorEl={popoverAnchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Box sx={{ p: 2, minWidth: 300 }}>
            <Typography variant="h6" gutterBottom>
              Select Date Range
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                  format="dd/MM/yy"
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                  format="dd/MM/yy"
                />
              </Box>
            </LocalizationProvider>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Button onClick={handlePopoverClose}>Cancel</Button>
              <Button onClick={handleApplyCustomRange} variant="contained">
                Apply
              </Button>
            </Box>
          </Box>
        </Popover>
      </>
    );
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      searchTerm === "" ||
      row.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.channelId.toString().includes(searchTerm);
    const matchesPriority =
      priorityFilter === "All" || row.priority === priorityFilter;
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    const rowDate = new Date(row.date);
    const rowDateStart = startOfDay(rowDate);
    const rowDateEnd = endOfDay(rowDate);
    const matchesDate =
      (!startDate || rowDateEnd >= startOfDay(startDate)) &&
      (!endDate || rowDateStart <= endOfDay(endDate));
    return matchesSearch && matchesPriority && matchesStatus && matchesDate;
  });

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, filteredRows.length - page * rowsPerPage);

  const handleDelete = async (id: number) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      const response = await fetch(`/admin/alerts/api/${deleteId}/delete`, {
        method: "DELETE",
      });
      if (response.ok) {
        setRows(rows.filter((row) => row.id !== deleteId));
        setSelected(
          selected.filter((selectedId) => selectedId !== deleteId.toString())
        );
        console.log(`Alert deleted successfully.`);
        alert(`Alert deleted successfully.`);
      } else {
        const errorData = await response.json();
        console.error("Failed to delete alert:", errorData.error);
        alert("Unable to delete alert.");
      }
    } catch (error) {
      console.error("Error deleting alert:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const handleMarkAsResolved = async (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (row && row.status === "RESOLVED") {
      alert(`Alert is already resolved.`);
      return;
    }
    setResolveId(id);
    setResolveDialogOpen(true);
  };

  const confirmResolve = async () => {
    if (resolveId === null) return;
    try {
      const response = await fetch(`/admin/alerts/api/${resolveId}/update`, {
        method: "PATCH",
      });
      if (response.ok) {
        const updatedAlert = await response.json();
        setRows(
          rows.map((row) =>
            row.id === resolveId
              ? { ...row, status: updatedAlert.alertStatus }
              : row
          )
        );
        console.log(`Alert ${resolveId} marked as resolved.`);
        alert(`Alert successfully marked as resolved.`);
      } else {
        const errorData = await response.json();
        console.error("Failed to mark alert as resolved:", errorData.error);
        alert("Unable to mark alert as resolved.");
      }
    } catch (error) {
      console.error("Error marking alert as resolved:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setResolveDialogOpen(false);
      setResolveId(null);
    }
  };
  // Added menu handlers
  const handleManageAlertsClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    console.log(
      "Manage Alerts clicked, setting anchorEl:",
      event.currentTarget
    );
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    console.log("Closing menu, setting anchorEl to null");
    setAnchorEl(null);
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const deletePromises = selected.map((id) =>
        fetch(`/admin/alerts/api/${id}/delete`, { method: "DELETE" }).then(
          (response) => {
            if (!response.ok)
              throw new Error(`Failed to delete alert. Please try again.`);
            return id;
          }
        )
      );
      await Promise.all(deletePromises);
      setRows(rows.filter((row) => !selected.includes(row.id.toString())));
      setSelected([]);
      alert(`Successfully deleted ${selected.length} alert(s).`);
    } catch (error) {
      console.error("Error during bulk delete:", error);
      alert("An error occurred while deleting alerts. Please try again.");
    } finally {
      setBulkDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const handleBulkResolve = () => {
    if (selected.length === 0) return;
    setBulkResolveDialogOpen(true);
  };

  const confirmBulkResolve = async () => {
    try {
      // Count already resolved alerts
      const alreadyResolvedIds = selected.filter((id) => {
        const row = rows.find((r) => r.id.toString() === id);
        return row && row.status === "RESOLVED";
      });
      const alreadyResolvedCount = alreadyResolvedIds.length;

      // Filter out unresolved alerts to process
      const unresolvedIds = selected.filter((id) => {
        const row = rows.find((r) => r.id.toString() === id);
        return row && row.status !== "RESOLVED";
      });

      if (unresolvedIds.length === 0) {
        alert(`All selected alert(s) already resolved.`);
        setBulkResolveDialogOpen(false);
        handleMenuClose();
        return;
      }

      // Send PATCH requests for all unresolved alerts
      const resolvePromises = unresolvedIds.map((id) =>
        fetch(`/admin/alerts/api/${id}/update`, { method: "PATCH" }).then(
          async (response) => {
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                `Failed to resolve alert ${id}: ${
                  errorData.error || response.statusText
                }`
              );
            }
            const updatedAlert = await response.json();
            return { id, status: updatedAlert.alertStatus };
          }
        )
      );

      // Wait for all requests to complete
      const results = await Promise.allSettled(resolvePromises);

      // Process results
      const updatedRows = [...rows];
      let successCount = 0;
      let failureCount = 0;

      results.forEach((result, index) => {
        const selectedId = unresolvedIds[index];
        if (result.status === "fulfilled") {
          const rowIndex = updatedRows.findIndex(
            (r) => r.id.toString() === selectedId
          );
          if (rowIndex !== -1) {
            updatedRows[rowIndex] = {
              ...updatedRows[rowIndex],
              status: result.value.status,
            };
            successCount++;
          }
        } else {
          console.error(`Error resolving alert ${selectedId}:`, result.reason);
          failureCount++;
        }
      });

      // Update state
      setRows(updatedRows);
      setSelected([]);

      // Provide detailed user feedback
      const totalSelected = selected.length;
      if (successCount > 0 || alreadyResolvedCount > 0 || failureCount > 0) {
        let message = "";
        if (successCount > 0) {
          message += `Successfully resolved ${successCount} alert(s). `;
        }
        if (alreadyResolvedCount > 0) {
          message += `${alreadyResolvedCount} alert(s) already resolved. `;
        }
        if (failureCount > 0) {
          message += `${failureCount} alert(s) failed to resolve. Please try again.`;
        }
        alert(message.trim());
      } else {
        alert("No alerts were processed due to an unexpected issue.");
      }
    } catch (error) {
      console.error("Unexpected error during bulk resolve:", error);
      alert(
        "An unexpected error occurred while resolving alerts. Please try again."
      );
    } finally {
      setBulkResolveDialogOpen(false);
      handleMenuClose();
    }
  };

  if (loading) return <Typography>Loading alerts...</Typography>;
  if (!loading && rows.length === 0)
    return <Typography>No alerts found.</Typography>;

  console.log("Rendering table with rows:", rows);

  return (
    <div>
      <SearchContainer>
        <TextField
          placeholder="Search by description or channel"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon color="action" /> }}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={priorityFilter}
            label="Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="MODERATE">Moderate</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="RESOLVED">Resolved</MenuItem>
            <MenuItem value="UNRESOLVED">Unresolved</MenuItem>
          </Select>
        </FormControl>
        <DateFilterMenu />
        <Button
          variant="outlined"
          onClick={handleRefreshData}
          startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </SearchContainer>
      <Paper>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onManageAlertsClick={handleManageAlertsClick}
          anchorEl={anchorEl}
          handleMenuClose={handleMenuClose}
          handleBulkDelete={handleBulkDelete}
          handleBulkResolve={handleBulkResolve}
        />
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = row.id
                    ? isSelected(row.id.toString())
                    : false;
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={`${row.id || "unknown"}-${index}`} //originally: key={`${row.id}-${index}`}
                      selected={isItemSelected}
                      onClick={() => handleRowClick(row)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                          onClick={(event) =>
                            handleClick(event, row.id.toString())
                          }
                        />
                      </TableCell>
                      <TableCell align="left">{row.channelId}</TableCell>
                      <TableCell align="left">{row.channel}</TableCell>
                      <TableCell align="left">
                        {row.priority === "HIGH" && (
                          <PriorityChip
                            size="small"
                            mr={1}
                            mb={1}
                            label="High"
                            priority="High"
                          />
                        )}
                        {row.priority === "MODERATE" && (
                          <PriorityChip
                            size="small"
                            mr={1}
                            mb={1}
                            label="Moderate"
                            priority="Moderate"
                          />
                        )}
                        {row.priority === "LOW" && (
                          <PriorityChip
                            size="small"
                            mr={1}
                            mb={1}
                            label="Low"
                            priority="Low"
                          />
                        )}
                      </TableCell>
                      <TableCell align="left">{row.desc}</TableCell>
                      <TableCell>
                        {row.status === "RESOLVED" && (
                          <StatusChip
                            size="small"
                            mr={1}
                            mb={1}
                            label="Resolved"
                            status="Resolved" // Pass status prop to style it
                          />
                        )}
                        {row.status === "UNRESOLVED" && (
                          <StatusChip
                            size="small"
                            mr={1}
                            mb={1}
                            label="Unresolved"
                            status="Unresolved" // Pass status prop to style it
                          />
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {row.date !== "Unknown"
                          ? format(new Date(row.date), "dd/MM/yy HH:mm")
                          : "Unknown"}
                      </TableCell>
                      <TableCell padding="none" align="left">
                        <Box mr={2}>
                          <IconButton
                            aria-label="delete"
                            size="large"
                            onClick={() => handleDelete(row.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            aria-label="details"
                            size="large"
                            onClick={() => handleMarkAsResolved(row.id)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <AlertDetailsPopup
        open={descriptionDialogOpen}
        row={selectedRow}
        onClose={handleDescriptionDialogClose}
        // No onApprove or onCancel props yet
      />
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this alert?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={resolveDialogOpen}
        onClose={() => setResolveDialogOpen(false)}
      >
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark this alert as resolved?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResolveDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmResolve} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the selected alerts?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmBulkDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={bulkResolveDialogOpen}
        onClose={() => setBulkResolveDialogOpen(false)}
      >
        <DialogTitle>Confirm Bulk Resolve</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark {selected.length} alert(s) as
            resolved?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkResolveDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmBulkResolve} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function OrderList() {
  return (
    <React.Fragment>
      <Grid justifyContent="space-between" container spacing={10}>
        <Grid>
          <Typography variant="h3" gutterBottom display="inline">
            Alerts
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NextLink} href="/">
              Dashboard
            </Link>
            {/* <Link component={NextLink} href="/">
              Pages
            </Link> */}
            <Typography>Alerts</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Divider my={6} />
      <Grid container spacing={6}>
        <Grid size={12}>
          <EnhancedTable />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default OrderList;
