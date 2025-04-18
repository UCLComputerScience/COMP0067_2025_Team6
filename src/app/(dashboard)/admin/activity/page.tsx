"use client";

import React, { useEffect, useState } from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
} from "@mui/material";

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
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
} from "@mui/material";
import { orange } from "@mui/material/colors";
import {
  Add as AddIcon,
  Archive as ArchiveIcon,
  FilterList as FilterListIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Star as StarIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { spacing } from "@mui/system";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Spacer = styled.div`
  flex: 1 1 100%;
`;

const ToolbarTitle = styled.div`
  min-width: 150px;
`;

const Customer = styled.div`
  display: flex;
  align-items: center;
`;

type RowType = {
  [key: string]: string;
  id: string;
  timestamp: string;
  firstName: string;
  lastName: string;
  device: string;
  action: string;
  location: string;
};

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

const columnWidths = {
  timestamp: "20%",
  firstName: "15%",
  lastName: "15%",
  device: "15%",
  action: "15%",
  location: "20%"
};

type HeadCell = {
  id: string;
  alignment: "left" | "center" | "right" | "justify" | "inherit" | undefined;
  label: string;
  disablePadding?: boolean;
  width: string;
};

const headCells: Array<HeadCell> = [
  { id: "timestamp", alignment: "left", label: "Timestamp", width: columnWidths.timestamp },
  { id: "firstName", alignment: "left", label: "First Name", width: columnWidths.firstName },
  { id: "lastName", alignment: "left", label: "Last Name", width: columnWidths.lastName },
  { id: "device", alignment: "left", label: "Device", width: columnWidths.device },
  { id: "action", alignment: "left", label: "Action", width: columnWidths.action },
  { id: "location", alignment: "left", label: "Location", width: columnWidths.location },
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
        {headCells.map((headCell: HeadCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignment}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width }}
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

const SearchControls = ({
  filters,
  setFilters,
}: {
  filters: { user: string; activity: string; date: string };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}) => {
  return (
    <Toolbar
      style={{
        display: "flex",
        justifyContent: "flex-start",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <TextField
        label="Search User/Device"
        variant="outlined"
        size="small"
        style={{ minWidth: 200 }}
        value={filters.user}
        onChange={(e) =>
          setFilters((prev: typeof filters) => ({
            ...prev,
            user: e.target.value,
          }))
        }
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
        <InputLabel id="activity-type-label">Action Type</InputLabel>
        <Select
          labelId="activity-type-label"
          id="activity-type-select"
          value={filters.activity}
          label="Action Type"
          onChange={(e) =>
            setFilters((prev: typeof filters) => ({
              ...prev,
              activity: e.target.value,
            }))
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Device Added">Device Added</MenuItem>
          <MenuItem value="Device Deleted">Device Deleted</MenuItem>
          <MenuItem value="Default threshold set">Default threshold set</MenuItem>
          <MenuItem value="Default threshold deleted">Default threshold deleted</MenuItem>
          <MenuItem value="Upper threshold changed">Upper threshold changed</MenuItem>
          <MenuItem value="Lower threshold changed">Lower threshold changed</MenuItem>
          <MenuItem value="Thresholds reset to default">Thresholds reset</MenuItem>
        </Select>
      </FormControl>

      <TextField
        type="date"
        variant="outlined"
        size="small"
        label="Date"
        InputLabelProps={{ shrink: true }}
        style={{ minWidth: 200 }}
        value={filters.date}
        onChange={(e) =>
          setFilters((prev: typeof filters) => ({
            ...prev,
            date: e.target.value,
          }))
        }
      />
    </Toolbar>
  );
};

function EnhancedTable({
  rows,
  filters,
  onDataFiltered,
}: {
  rows: Array<RowType>;
  filters: { user: string; activity: string; date: string };
  onDataFiltered?: (data: Array<RowType>, filters: any) => void;
}) {
  const [order, setOrder] = React.useState<"desc" | "asc">("asc");
  const [orderBy, setOrderBy] = React.useState("timestamp");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toISOString().slice(0, 10);
  };

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      const searchTerm = filters.user.toLowerCase();
      const firstName = row.firstName ?? "";
      const lastName = row.lastName ?? "";
      const deviceName = row.device ?? "";
      
      const matchesSearch =
        filters.user === "" ||
        firstName.toLowerCase().includes(searchTerm) ||
        lastName.toLowerCase().includes(searchTerm) ||
        deviceName.toLowerCase().includes(searchTerm);

      const matchesActivity =
        filters.activity === "" ||
        (filters.activity === "Upper threshold changed" && row.action.toLowerCase().includes("upper threshold changed")) ||
        (filters.activity === "Lower threshold changed" && row.action.toLowerCase().includes("lower threshold changed")) ||
        (filters.activity === "Default threshold set" && row.action.toLowerCase().includes("upper threshold set to")) ||
        (filters.activity === "Default threshold deleted" && row.action.toLowerCase().includes("was deleted")) ||
        row.action === filters.activity;
      
      let matchesDate = true;
      if (filters.date !== "") {
        const rowDate = formatDate(row.timestamp);
        matchesDate = rowDate === filters.date;
      }
      
      return matchesSearch && matchesActivity && matchesDate;
    });
  }, [filters, rows]);

  React.useEffect(() => {
    if (onDataFiltered) {
      const timeoutId = setTimeout(() => {
        onDataFiltered(filteredRows, filters);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [filters, filteredRows, onDataFiltered]);

  const handleRequestSort = (event: any, property: string) => {
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
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  React.useEffect(() => {
    setPage(0);
  }, [filters]);

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - filteredRows.length);

  return (
    <div>
      <Paper>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
            sx={{ minWidth: 1000, tableLayout: "fixed" }} 
          >
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align={headCell.alignment}
                    padding={headCell.disablePadding ? "none" : "normal"}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={{ width: headCell.width }} 
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(filteredRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: RowType, index: number) => (
                  <TableRow hover tabIndex={-1} key={`${row.id}-${index}`}>
                    <TableCell sx={{ width: columnWidths.timestamp, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {new Date(row.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell sx={{ width: columnWidths.firstName, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {row.firstName}
                    </TableCell> 
                    <TableCell sx={{ width: columnWidths.lastName, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {row.lastName}
                    </TableCell>
                    <TableCell sx={{ width: columnWidths.device, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {row.device}
                    </TableCell>
                    <TableCell sx={{ width: columnWidths.action, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {row.action}
                    </TableCell>
                    <TableCell sx={{ width: columnWidths.location, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {row.location}
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          rowsPerPageOptions={[6, 12, 18]}
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={
            filteredRows.length <= page * rowsPerPage && page > 0 ? 0 : page
          }
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          SelectProps={{
            native: false,
          }}
        />
      </Paper>
    </div>
  );
}

function ActivityLogs() {
  const [filteredData, setFilteredData] = useState<Array<RowType>>([]);
  const [currentFilters, setCurrentFilters] = useState({
    user: "",
    activity: "",
    date: "",
  });

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const response = await fetch("/api/logs");
        const data = await response.json();
        const transformed = data.map((log: any) => {
          const [firstName, ...lastNameParts] = log.user.split(" ");
          const lastName = lastNameParts.join(" ");
          return {
            id: log.id,
            timestamp: log.timestamp,
            firstName: firstName,
            lastName: lastName,
            device: log.device,
            action: log.action,
            location: log.labLocation,
          };
        });
  
        setFilteredData(transformed); 
      } catch (error) {
        console.error("Failed to fetch logs", error);
        setFilteredData([]); 
      }
    };
  
    fetchActivityLogs();
  }, []);

  const handleDataFiltered = (data: Array<RowType>, filters: any) => {
    setCurrentFilters(filters);
  };
  
  const handleExport = () => {
    const doc = new jsPDF();

    const columns = [
      { header: "Timestamp", dataKey: "timestamp" },
      { header: "First Name", dataKey: "firstName" },
      { header: "Last Name", dataKey: "lastName" },
      { header: "Device", dataKey: "device" },
      { header: "Action", dataKey: "action" },
      { header: "Location", dataKey: "location" },
    ];

    const data = filteredData.filter((log) => {
      return (
        (currentFilters.user === "" ||
          (`${log.firstName} ${log.lastName}`).toLowerCase().includes(currentFilters.user.toLowerCase())) &&
        (currentFilters.activity === "" || log.action === currentFilters.activity) &&
        (currentFilters.date === "" || new Date(log.timestamp).toISOString().slice(0, 10) === currentFilters.date)
      );
    }).map((row) => ({
      timestamp: new Date(row.timestamp).toLocaleString(),
      firstName: row.firstName,
      lastName: row.lastName,
      device: row.device,
      action: row.action,
      location: row.location,
    }));

    doc.setFontSize(16);
    doc.text("Activity Logs Report", 14, 15);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    let yPosition = 35;
    const activeFilters = [];

    if (currentFilters.user)
      activeFilters.push(`User Search: "${currentFilters.user}"`);
    if (currentFilters.activity)
      activeFilters.push(`Action Type: ${currentFilters.activity}`);
    if (currentFilters.date) activeFilters.push(`Date: ${currentFilters.date}`);

    if (activeFilters.length > 0) {
      doc.setFontSize(10);
      doc.text("Applied Filters:", 14, yPosition);
      activeFilters.forEach((filter, index) => {
        yPosition += 5;
        doc.text(`• ${filter}`, 16, yPosition);
      });
      yPosition += 10;
    } else {
      yPosition = 30;
    }

    autoTable(doc, {
      columns: columns,
      body: data,
      startY: yPosition,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [71, 117, 163] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 30 },
    });

    doc.save("activity-logs.pdf");
  };

  return (
    <React.Fragment>
      <Grid justifyContent="space-between" container spacing={10}>
        <Grid>
          <Typography variant="h3" gutterBottom display="inline">
            Activity Logs
          </Typography>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
          <Link
            component={NextLink}
            href="/"
            underline="hover"
            sx={{ color: 'primary.main' }} 
          >
            Dashboard
          </Link>
            <Typography>Activity Logs</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid>
          <Button variant="contained" color="primary" onClick={handleExport}>
            <AddIcon />
            Export
          </Button>
        </Grid>
      </Grid>
      <Divider my={6} />
      
      <Grid container spacing={6}>
        <Grid size={12}>
          <SearchControls 
            filters={currentFilters}
            setFilters={setCurrentFilters}
          />
        </Grid>
      </Grid>
      <Box mt={3}></Box>
      <Grid container spacing={6}>
        <Grid size={12}>
          <EnhancedTable
            rows={filteredData}
            filters={currentFilters}
            onDataFiltered={handleDataFiltered}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ActivityLogs;