"use client";

import React from "react";
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
import { green, orange, red, blue, grey } from "@mui/material/colors";
import {
  Add as AddIcon,
  Archive as ArchiveIcon,
  FilterList as FilterListIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { spacing, SpacingProps } from "@mui/system";

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

function createData(
  id: number,
  location: string,
  equipment: string,
  priority: string,
  desc: string,
  status: string,
  date: string
) {
  return { id, location, equipment, priority, desc, status, date };
}

type RowType = {
  [key: string]: string | number;
  id: number;
  location: string;
  equipment: string;
  priority: string;
  desc: string;
  status: string;
  date: string;
};
const rows: Array<RowType> = [
  createData(
    1,
    "247",
    "Box 7",
    "High",
    "Temperature levels has exceeded the threshold",
    "Resolved",
    "12/12/2022"
  ),
  createData(
    2,
    "247",
    "Box 19",
    "High",
    "Temperature levels has exceeded the threshold",
    "Unresolved",
    "12/12/2022"
  ),
  createData(
    3,
    "247",
    "Box 17",
    "Moderate",
    "Pressure levels has exceeded the threshold",
    "Resolved",
    "12/12/2022"
  ),
  createData(
    4,
    "249",
    "Box 27",
    "Low",
    "Humity levels has exceeded the threshold",
    "Unresolved",
    "12/12/2022"
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
  { id: "location", alignment: "right", label: "Location" },
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

type EnhancedTableToolbarProps = { numSelected: number };
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  // Here was 'let'
  const { numSelected } = props;

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
      <div>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" size="large">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list" size="large">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
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

  const handleRequestSort = (event: any, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds: Array<string> = rows.map((n: RowType) =>
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

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div>
      <Paper>
        <EnhancedTableToolbar numSelected={selected.length} />
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
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id.toString());
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={`${row.id}-${index}`}
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

                      <TableCell align="center">{row.location}</TableCell>
                      <TableCell align="left">{row.equipment}</TableCell>
                      <TableCell align="left">
                        {row.priority === "High" && (
                          <PriorityChip
                            size="small"
                            mr={1}
                            mb={1}
                            label="High"
                            priority="High"
                          />
                        )}
                        {row.priority === "Moderate" && (
                          <PriorityChip
                            size="small"
                            mr={1}
                            mb={1}
                            label="Moderate"
                            priority="Moderate"
                          />
                        )}
                        {row.priority === "Low" && (
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
                        {row.status === "Resolved" && (
                          <StatusChip
                            size="small"
                            mr={1}
                            mb={1}
                            label="Resolved"
                            status="Resolved" // Pass status prop to style it
                          />
                        )}
                        {row.status === "Unresolved" && (
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
                          <IconButton aria-label="delete" size="large">
                            <DeleteIcon />
                          </IconButton>
                          <IconButton aria-label="details" size="large">
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
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
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
        <Grid>
          <div>
            <Button variant="contained" color="primary">
              Manage Alerts
            </Button>
          </div>
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
