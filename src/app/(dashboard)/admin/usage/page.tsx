"use client";

import React, { useEffect, useState } from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Checkbox,
  Chip as MuiChip,
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
import { green, orange, red } from "@mui/material/colors";
import {
  Add as AddIcon,
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
  { id: "user", alignment: "left", label: "User" },
  { id: "action", alignment: "left", label: "Action" },
];

// function createLogData(
//   timestamp: string,
//   user: string,
//   action: string
// ): RowType {
//   return { id: timestamp, timestamp, user, action };
// }

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

// const rows: Array<RowType> = [
//   createLogData("2025-04-09 10:24", "john.doe@example.com", "Signed up"),
//   createLogData("2025-04-09 10:30", "john.doe@example.com", "Logged in"),
//   createLogData(
//     "2025-04-09 11:00",
//     "admin@example.com",
//     "Changed access level of john.doe@example.com to admin"
//   ),
// ];

const EnhancedTableHead: React.FC<{
  order: "desc" | "asc";
  orderBy: string;
  onRequestSort: (e: any, property: string) => void;
}> = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = (property: string) => (event: any) => {
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

function EnhancedTable({ logs }: { logs: RowType[] }) {
  const [order, setOrder] = React.useState<"desc" | "asc">("asc");
  const [orderBy, setOrderBy] = React.useState("timestamp");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
                <TableCell>{row.timestamp}</TableCell>
                <TableCell>{row.user}</TableCell>
                <TableCell>{row.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
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

  useEffect(() => {
    // Fetch the logs from your API
    const fetchLogs = async () => {
      try {
        console.log("Fetching logs from API...");
        const response = await fetch("/api/auth/usageHistory");

        if (!response.ok) {
          console.error("Failed to fetch logs:", response.statusText);
          return;
        }

        const data = await response.json();

        console.log("Fetched logs data:", data); // Log the raw API response

        // Assuming the API response is an array of logs
        const logData = data.map((log: any) =>
          createLogData(log.timestamp, log.userEmail, log.action)
        );

        console.log("Formatted logs data:", logData); // Log the formatted data
        setLogs(logData);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  console.log("Logs passed to table:", logs); // Log the data before passing to table

  return (
    <React.Fragment>
      <Grid justifyContent="space-between" container spacing={10}>
        <Grid>
          <Typography variant="h3" gutterBottom display="inline">
            Usage History
          </Typography>
          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NextLink} href="/">
              Dashboard
            </Link>
            <Typography>Usage History</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <Divider my={6} />
      <Grid container spacing={6}>
        <Grid size={12}>
          <EnhancedTable logs={logs} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default OrderList;
