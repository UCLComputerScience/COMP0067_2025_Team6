"use client";

import React, { useEffect, useState } from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Search as SearchIcon } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Add as AddIcon } from "@mui/icons-material";

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Checkbox,
  Chip as MuiChip,
  Divider as MuiDivider,
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { green, orange, red } from "@mui/material/colors";
import {
  Archive as ArchiveIcon,
  FilterList as FilterListIcon,
  RemoveRedEye as RemoveRedEyeIcon,
} from "@mui/icons-material";
import { spacing, SpacingProps } from "@mui/system";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Chip = styled(MuiChip)<SpacingProps>`
  ${spacing};
`;

const Spacer = styled.div`
  flex: 1 1 100%;
`;

const ToolbarTitle = styled.div`
  min-width: 150px;
`;

const columnWidths = {
  timestamp: "30%",
  user: "40%",
  action: "30%",
};

function descendingComparator(a: RowType, b: RowType, orderBy: keyof RowType) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: "desc" | "asc", orderBy: keyof RowType) {
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
  { id: "timestamp", alignment: "left", label: "Timestamp" },
  { id: "user", alignment: "left", label: "User" },
  { id: "action", alignment: "left", label: "Action" },
];

type RowType = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
};

// Function to format log data
function createLogData(
  timestamp: string,
  user: string,
  action: string
): RowType {
  return { id: timestamp, timestamp, user, action };
}

const EnhancedTableHead: React.FC<{
  order: "desc" | "asc";
  orderBy: string;
  onRequestSort: (e: any, property: keyof RowType) => void;
}> = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = (property: keyof RowType) => (event: any) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignment}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: columnWidths[headCell.id as keyof typeof columnWidths] }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id as keyof RowType)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

function EnhancedTable({ logs }: { logs: RowType[] }) {
  const [order, setOrder] = React.useState<"desc" | "asc">("asc");
  const [orderBy, setOrderBy] = React.useState<keyof RowType>("timestamp");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);

  const handleRequestSort = (event: any, property: keyof RowType) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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

  const sortedRows = stableSort(logs, getComparator(order, orderBy));
  const pagedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper>
      <TableContainer>
        <Table aria-label="usage history table">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {pagedRows.map((row, index) => (
              <TableRow key={`${row.id}-${index}`} hover>
                <TableCell sx={{ width: columnWidths.timestamp }}>
                  {new Date(row.timestamp).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </TableCell>
                <TableCell sx={{ width: columnWidths.user }}>
                  {row.user}
                </TableCell>
                <TableCell sx={{ width: columnWidths.action }}>
                  {row.action}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[6, 12, 18]}
        component="div"
        count={logs.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

function OrderList() {
  const [logs, setLogs] = useState<RowType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/auth/usageHistory");
        if (!response.ok) {
          console.error("Failed to fetch logs:", response.statusText);
          return;
        }

        const data = await response.json();
        const logData = data.map((log: any) =>
          createLogData(log.timestamp, log.userEmail, log.action)
        );
        setLogs(logData);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const handleExport = () => {
    const doc = new jsPDF();

    const filteredLogs = logs.filter((log) => {
      const matchesUser = log.user.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction =
        actionFilter === "All"
          ? true
          : actionFilter === "Signed up"
          ? log.action.toLowerCase().includes("signed up")
          : actionFilter === "Logged in"
          ? log.action.toLowerCase().includes("logged in")
          : actionFilter === "Role Change"
          ? log.action.toLowerCase().includes("access level") ||
            log.action.toLowerCase().includes("role")
          : false;
    
      const matchesDate =
        dateFilter === "" ||
        new Date(log.timestamp).toISOString().slice(0, 10) === dateFilter;
    
      return matchesUser && matchesAction && matchesDate;
    });

    const data = filteredLogs.map((log) => ({
      timestamp: new Date(log.timestamp).toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      user: log.user,
      action: log.action,
    }));

    doc.setFontSize(16);
    doc.text("Usage History Report", 14, 15);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString("en-GB")}`, 14, 25);

    let yPosition = 35;
    const activeFilters = [];
    if (searchTerm) activeFilters.push(`User Search: "${searchTerm}"`);
    if (actionFilter !== "All") activeFilters.push(`Action Type: ${actionFilter}`);
    if (dateFilter) activeFilters.push(`Date: ${dateFilter}`);

    if (activeFilters.length > 0) {
      doc.setFontSize(10);
      doc.text("Applied Filters:", 14, yPosition);
      activeFilters.forEach((filter, index) => {
        yPosition += 5;
        doc.text(`• ${filter}`, 16, yPosition);
      });
      yPosition += 10;
    }

    autoTable(doc, {
      columns: [
        { header: "Timestamp", dataKey: "timestamp" },
        { header: "User", dataKey: "user" },
        { header: "Action", dataKey: "action" },
      ],
      body: data,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 117, 163] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("usage-history.pdf");
  };

  const filteredLogs = logs.filter((log) => {
    const matchesUser = log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction =
      actionFilter === "All"
        ? true
        : actionFilter === "Signed up"
        ? log.action.toLowerCase().includes("signed up")
        : actionFilter === "Logged in"
        ? log.action.toLowerCase().includes("logged in")
        : actionFilter === "Role Change"
        ? log.action.toLowerCase().includes("access level") ||
          log.action.toLowerCase().includes("role")
        : false;
    
    const matchesDate =
      dateFilter === "" ||
      new Date(log.timestamp).toISOString().slice(0, 10) === dateFilter;
  
    return matchesUser && matchesAction && matchesDate;
  });

  return (
    <React.Fragment>
      <Grid container justifyContent="space-between" alignItems="center" spacing={3}>
        <Grid item>
          <Typography variant="h3" gutterBottom>
            Usage History
          </Typography>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mt: 1 }}>
            <Link
              component={NextLink}
              href="/"
              underline="hover"
              sx={{ color: "primary.main" }}
            >
              Dashboard
            </Link>
            <Typography color="textPrimary">Usage History</Typography>
          </Breadcrumbs>
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" onClick={handleExport}>
            <AddIcon sx={{ mr: 1 }} />
            Export
          </Button>
        </Grid>
      </Grid>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            placeholder="Search User"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" />,
            }}
            sx={{ minWidth: 300 }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Action Type</InputLabel>
            <Select
              value={actionFilter}
              label="Action Type"
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Signed up">User Signup</MenuItem>
              <MenuItem value="Logged in">User Login</MenuItem>
              <MenuItem value="Role Change">Role Change</MenuItem>
            </Select>
          </FormControl>

          <TextField
            type="date"
            variant="outlined"
            size="small"
            label="Date"
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 200 }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Box>

          <EnhancedTable logs={filteredLogs} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default OrderList;

