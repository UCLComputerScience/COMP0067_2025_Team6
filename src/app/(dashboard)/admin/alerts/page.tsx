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
  priority: string;
  alertDescription: string;
  status: string;
  date: string;
};

type RowType = {
  id: number;
  location: string; // Convert [lat, lon] to string
  equipment: string; // Placeholder, not in API yet
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
    equipment: alert.channelId ? `${alert.channelId}` : "Unknown",
    priority: alert.priority || "LOW",
    desc: alert.alertDescription || "No description",
    status: alert.status || "UNRESOLVED",
    date: alert.date ? new Date(alert.date).toLocaleDateString() : "Unknown",
  };
}

function descendingComparator(a: RowType, b: RowType, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: "desc" | "asc", orderBy: string) {
  return order === "desc"
    ? (a: RowType, b: RowType) => descendingComparator(a, b, orderBy)
    : (a: RowType, b: RowType) => -descendingComparator(a, b, orderBy);
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
  { id: "location", alignment: "left", label: "Location" },
  { id: "equipment", alignment: "left", label: "Equipment" },
  { id: "priority", alignment: "left", label: "Priority" },
  { id: "desc", alignment: "left", label: "Description" },
  { id: "status", alignment: "left", label: "Status" },
  { id: "date", alignment: "left", label: "Date" },
  { id: "actions", alignment: "right", label: "Actions" },
];

type EnhancedTableHeadProps = {
  numSelected: number;
  order: "desc" | "asc";
  orderBy: string;
  rowCount: number;
  onSelectAllClick: (e: any) => void;
  onRequestSort: (e: any, property: string) => void;
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
  const createSortHandler = (property: string) => (event: any) => {
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
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
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
  const [order, setOrder] = React.useState<"desc" | "asc">("asc");
  const [orderBy, setOrderBy] = React.useState("customer");
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
  const [bulkResolveDialogOpen, setBulkResolveDialogOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");              
  const [priorityFilter, setPriorityFilter] = React.useState("All");   
  const [statusFilter, setStatusFilter] = React.useState("All");       
  const [reloadAlerts, setReloadAlerts] = React.useState(false);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const response = await fetch(`/admin/alerts/api/channel?_t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "pragma": "no-cache",
          "cache-control": "no-cache",
        },
      });
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
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

  const handleRequestSort = (event: any, property: string) => {
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
      const newSelecteds: Array<string> = filteredRows.map((n: RowType) => n.id.toString());
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

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      searchTerm === "" ||
      row.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.equipment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "All" || row.priority === priorityFilter;
    const matchesStatus = statusFilter === "All" || row.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredRows.length - page * rowsPerPage);

  const handleDelete = async (id: number) => {
    setDeleteId(id); // Store the ID to delete
    setDeleteDialogOpen(true); // Open confirmation dialog
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
      setDeleteDialogOpen(false); // Close dialog
      setDeleteId(null); // Reset ID
    }
  };

  const handleMarkAsResolved = async (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (row && row.status === "RESOLVED") {
      alert(`Alert is already resolved.`);
      return;
    }
    setResolveId(id); // Store the ID to resolve
    setResolveDialogOpen(true); // Open confirmation dialog
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
      setResolveDialogOpen(false); // Close dialog
      setResolveId(null); // Reset ID
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
      setBulkDeleteDialogOpen(false); // Close dialog
      handleMenuClose(); // Close menu
    }
  };

  const handleBulkResolve = () => {
    if (selected.length === 0) return;
    setBulkResolveDialogOpen(true); // Open the confirmation dialog
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
        alert(`All selected alert(s) were already resolved.`);
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
          message += `${alreadyResolvedCount} alert(s) were already resolved. `;
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

  // CHANGE: Added loading and empty state checks before rendering table
  if (loading) return <Typography>Loading alerts...</Typography>;
  if (!loading && rows.length === 0)
    return <Typography>No alerts found.</Typography>;

  // CHANGE: Added debug log before rendering
  console.log("Rendering table with rows:", rows);

  return (
    <div>
            <SearchContainer>
        <TextField
          placeholder="Search by description or equipment"
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
        <Button variant="contained" color="primary">
          Go
        </Button>
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
                      <TableCell align="left">{row.location}</TableCell>
                      <TableCell align="left">{row.equipment}</TableCell>
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
                      <TableCell align="left">{row.date}</TableCell>
                      <TableCell padding="none" align="right">
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
