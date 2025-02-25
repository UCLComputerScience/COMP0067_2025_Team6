"use client";

import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Select, MenuItem, FormControl, InputLabel, TextField } from "@mui/material";
import { useState} from "react";

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Checkbox,
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

function createData(
  id: string,
  timestamp: string,
  userSystem: string,
  action: string,
  location: string,
  status: string,
  additionalDetails: string
) {
  return { id, timestamp, userSystem, action, location, status, additionalDetails };
}

type RowType = {
  [key: string]: string;
  id: string;
  timestamp: string;
  userSystem: string;
  action: string;
  location: string;
  status: string;
  additionalDetails: string;
};
const rows: Array<RowType> = [
  createData(
    "1",
    "05/02/2025 13:00",
    "John Smith",
    "Details Changed",
    "UK",
    "Successful",
    " "
  ),
  createData(
    "2",
    "05/02/2025 11:00",
    "Linda Harvey",
    "Dashboard Edited",
    "UK",
    "Failed",
    " "
  ),
  createData(
    "3",
    "04/02/2025 09:00",
    "Bob Johnson",
    "Report Export",
    "UK",
    "Error",
    " "
  ),
  createData(
    "4",
    "15/01/2025 09:00",
    "Lucas Smith",
    "Details Changed",
    "UK",
    "Error",
    " "
  ),
  createData(
    "5",
    "04/02/2025 09:00",
    "Bob",
    "Report Export",
    "UK",
    "Error",
    "Hehe"
  ),
  createData(
    "6",
    "04/02/2025 09:00",
    "Billy",
    "Report Export",
    "UK",
    "Error",
    "Pepe"
  ),
  createData(
    "7",
    "04/02/2025 09:00",
    "John",
    "Report Export",
    "UK",
    "Error",
    " "
  ),
  createData(
    "8",
    "04/02/2025 09:00",
    "Rob",
    "Report Export",
    "UK",
    "Error",
    " "
  ),
  createData(
    "9",
    "04/02/2025 09:00",
    "John",
    "Report Export",
    "UK",
    "Error",
    " "
  ),
  createData(
    "10",
    "04/02/2025 09:00",
    "Meow",
    "Report Export",
    "UK",
    "Error",
    " "
  ),
];

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
  { id: "timestamp", alignment: "left", label: "Timestamp" },
  { id: "userSystem", alignment: "left", label: "User/System" },
  { id: "action", alignment: "left", label: "Action" },
  { id: "location", alignment: "left", label: "Location" },
  { id: "status", alignment: "left", label: "Status" },
  { id: "additionalDetails", alignment: "left", label: "Additional Details" },
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
  filters: { user: string; activity: string; status: string; date: string };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
};

const EnhancedTableToolbar = ({ numSelected, filters, setFilters }: EnhancedTableToolbarProps) => {
  return (
    <Toolbar style={{ display: "flex", justifyContent: "flex-start", gap: "20px", flexWrap: "wrap" }}>
      <TextField
        label="Search User/System"
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
      />

      <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
        <InputLabel shrink sx={{ backgroundColor: "white", px: 0.5 }}>Activity Type</InputLabel>
        <Select
          value={filters.activity}
          displayEmpty
          onChange={(e) =>
            setFilters((prev: typeof filters) => ({
              ...prev,
              activity: e.target.value,
            }))
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Details Changed">Details Changed</MenuItem>
          <MenuItem value="Dashboard Edited">Dashboard Edited</MenuItem>
          <MenuItem value="Report Export">Report Export</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="outlined" size="small" style={{ minWidth: 200 }}>
        <InputLabel shrink sx={{ backgroundColor: "white", px: 0.5 }}>Status</InputLabel>
        <Select
          value={filters.status}
          displayEmpty
          onChange={(e) =>
            setFilters((prev: typeof filters) => ({
              ...prev,
              status: e.target.value, 
            }))
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Successful">Successful</MenuItem>
          <MenuItem value="Failed">Failed</MenuItem>
          <MenuItem value="Error">Error</MenuItem>
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

function EnhancedTable({ onDataFiltered }: { onDataFiltered: (data: Array<RowType>, filters: any) => void }) {
  const [order, setOrder] = React.useState<"desc" | "asc">("asc");
  const [orderBy, setOrderBy] = React.useState("timestamp");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  
  const [filters, setFilters] = useState({
    user: "",
    activity: "",
    status: "",
    date: "",
  });

  const formatDate = (timestamp: string) => {
    const [datePart] = timestamp.split(" ");
    const [day, month, year] = datePart.split("/");
    return `${year}-${month}-${day}`;
  };

  const filteredRows = React.useMemo(() => {
    return rows.filter((row) => {
      const rowDate = formatDate(row.timestamp);
      return (
        (filters.user === "" || row.userSystem.toLowerCase().includes(filters.user.toLowerCase())) &&
        (filters.activity === "" || row.action === filters.activity) &&
        (filters.status === "" || row.status === filters.status) &&
        (filters.date === "" || rowDate === filters.date)
      );
    });
  }, [filters]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      onDataFiltered(filteredRows, filters);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [filters, filteredRows, onDataFiltered]);

  const handleRequestSort = (event: any, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        <EnhancedTableToolbar
          numSelected={0} 
          filters={filters} 
          setFilters={setFilters} 
        />
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <TableHead>
              <TableRow>
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
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={`${row.id}-${index}`}
                  >
                    <TableCell>{row.timestamp}</TableCell>
                    <TableCell>{row.userSystem}</TableCell>
                    <TableCell>{row.action}</TableCell>
                    <TableCell>{row.location}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.additionalDetails}</TableCell>
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
          page={filteredRows.length <= page * rowsPerPage && page > 0 ? 0 : page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          SelectProps={{
            native: false
          }}
        />
      </Paper>
    </div>
  );
}

function ActivityLogs() {
  const [filteredData, setFilteredData] = useState(rows);
  const [currentFilters, setCurrentFilters] = useState({
    user: "",
    activity: "",
    status: "",
    date: "",
  });

  const handleDataFiltered = (newData: Array<RowType>, filters: any) => {
    setFilteredData(newData);
    setCurrentFilters(filters);
  };

  const handleExport = () => {
    const doc = new jsPDF();
    
    const columns = [
      { header: 'Timestamp', dataKey: 'timestamp' },
      { header: 'User/System', dataKey: 'userSystem' },
      { header: 'Action', dataKey: 'action' },
      { header: 'Location', dataKey: 'location' },
      { header: 'Status', dataKey: 'status' },
      { header: 'Additional Details', dataKey: 'additionalDetails' }
    ];

    const data = filteredData.map(row => ({
      timestamp: row.timestamp,
      userSystem: row.userSystem,
      action: row.action,
      location: row.location,
      status: row.status,
      additionalDetails: row.additionalDetails
    }));

    doc.setFontSize(16);
    doc.text('Activity Logs Report', 14, 15);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    let yPosition = 35;
    const activeFilters = [];
    
    if (currentFilters.user) activeFilters.push(`User Search: "${currentFilters.user}"`);
    if (currentFilters.activity) activeFilters.push(`Activity Type: ${currentFilters.activity}`);
    if (currentFilters.status) activeFilters.push(`Status: ${currentFilters.status}`);
    if (currentFilters.date) activeFilters.push(`Date: ${currentFilters.date}`);

    if (activeFilters.length > 0) {
      doc.setFontSize(10);
      doc.text('Applied Filters:', 14, yPosition);
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
      margin: { top: 30 }
    });
    
    doc.save('activity-logs.pdf');
  };

  return (
    <React.Fragment>
      <Grid justifyContent="space-between" container spacing={10}>
        <Grid>
          <Typography variant="h3" gutterBottom display="inline">
            Activity Logs
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NextLink} href="/">
              Dashboard
            </Link>
            <Typography>Activity Logs</Typography>
          </Breadcrumbs>
        </Grid>
        <Grid>
          <div>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleExport}
            >
              <AddIcon />
              Export
            </Button>
          </div>
        </Grid>
      </Grid>
      <Divider my={6} />
      <Grid container spacing={6}>
        <Grid size={12}>
          <EnhancedTable onDataFiltered={handleDataFiltered} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ActivityLogs;