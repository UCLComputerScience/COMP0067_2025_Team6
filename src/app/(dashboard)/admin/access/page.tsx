"use client";

import React from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import withAuth from "@/lib/withAuth"; // Import the withAuth HOC

import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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
  Fab,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import {
  Edit as EditIcon,
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

const ImageWrapper = styled.div`
  width: 50px;
  height: 50px;
  padding: ${(props) => props.theme.spacing(1)};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing(1)};
`;

const RatingIcon = styled(StarIcon)`
  color: ${() => orange[400]};
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
`;

function createData(
  id: string,
  firstname: string,
  lastname: string,
  usertype: string,
  status: string
) {
  return { id, firstname, lastname, usertype, status };
}

type RowType = {
  [key: string]: string | number;
  id: string;
  firstname: string;
  lastname: string;
  usertype: string;
  status: string;
};
const rows: Array<RowType> = [
  createData("1", "Jack", "Smith", "Owner", "Active"),
  createData("2", "Mike", "Bernie", "Standard", "Active"),
  createData("3", "Linda", "Thompson", "Standard", "Active"),
  createData("4", "Carlos", "Perez", "Owner", "Active"),
  createData("5", "Belinda", "Jacobs", "Standard", "Active"),
  createData("6", "Lucy", "Tillman", "Guest", "Active"),
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
  width?: string;
};
const headCells: Array<HeadCell> = [
  { id: "firstname", alignment: "left", label: "First Name", width: "20%" },
  { id: "lastname", alignment: "left", label: "Last Name", width: "20%" },
  { id: "usertype", alignment: "left", label: "User Type", width: "20%" },
  { id: "status", alignment: "left", label: "Status", width: "20%" },
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
        <TableCell padding="checkbox" style={{ width: "5%" }}>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all" }}
          />
        </TableCell>
        {headCells.map((headCell: HeadCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignment}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ width: headCell.width }}
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
        <TableCell style={{ width: "15%" }} /> {/* For action buttons */}
      </TableRow>
    </TableHead>
  );
};

type EnhancedTableToolbarProps = {
  numSelected: number;
  onManageAccess: () => void;
};
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, onManageAccess } = props;

  return (
    <Toolbar>
      <ToolbarTitle>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Users
          </Typography>
        )}
      </ToolbarTitle>
      <Spacer />
      <Button
        variant="contained"
        color="primary"
        size="small"
        disabled={numSelected === 0}
        onClick={onManageAccess}
      >
        Manage Access
      </Button>
    </Toolbar>
  );
};

function EnhancedTable() {
  const [order, setOrder] = React.useState<"desc" | "asc">("asc");
  const [orderBy, setOrderBy] = React.useState("customer");
  const [selected, setSelected] = React.useState<Array<string>>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingRow, setEditingRow] = React.useState<RowType | null>(null);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [instrumentAccess, setInstrumentAccess] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userTypeFilter, setUserTypeFilter] = React.useState("All");
  const [regionFilter, setRegionFilter] = React.useState("All");
  const [projectFilter, setProjectFilter] = React.useState("All");

  const handleEditClick = (row: RowType) => {
    setEditingRow(row);
    setOpenDialog(true);
  };

  const handleManageAccess = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRow(null);
    setCurrentTab(0);
  };

  const handleSaveChanges = () => {
    // Here you would typically make an API call to update the data
    handleCloseDialog();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleRequestSort = (event: any, property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds: Array<string> = rows.map((n: RowType) => n.id);
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
    setRowsPerPage(parseInt(event.target.value, 6));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div>
      <SearchContainer>
        <TextField
          placeholder="Search"
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
          <InputLabel>User Type</InputLabel>
          <Select
            value={userTypeFilter}
            label="User Type"
            onChange={(e) => setUserTypeFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Owner">Owner</MenuItem>
            <MenuItem value="Standard">Standard</MenuItem>
            <MenuItem value="Guest">Guest</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Region</InputLabel>
          <Select
            value={regionFilter}
            label="Region"
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {/* Add your region options here */}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Project</InputLabel>
          <Select
            value={projectFilter}
            label="Project"
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {/* Add your project options here */}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary">
          Go
        </Button>
      </SearchContainer>

      <Paper>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onManageAccess={handleManageAccess}
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
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: RowType, index: number) => {
                  const isItemSelected = isSelected(row.id);
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
                          onClick={(event) => handleClick(event, row.id)}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        <Customer>
                          <Box>
                            <Typography variant="body1">
                              {row.firstname}
                            </Typography>
                          </Box>
                        </Customer>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="body1">{row.lastname}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="body1">{row.usertype}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="body1">{row.status}</Typography>
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => handleEditClick(row)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[6, 12, 18]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Access</DialogTitle>
        <DialogContent>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Instrument Access" />
            <Tab label="Dashboard Access" />
            <Tab label="Control Access" />
          </Tabs>

          {currentTab === 0 && (
            <Box sx={{ mt: 2 }}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Instrument Access</InputLabel>
                <Select
                  value={instrumentAccess}
                  onChange={(e) => setInstrumentAccess(e.target.value)}
                  label="Instrument Access"
                >
                  <MenuItem value="full">Full Access</MenuItem>
                  <MenuItem value="limited">Limited Access</MenuItem>
                  <MenuItem value="none">No Access</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {currentTab === 1 && (
            <Box sx={{ mt: 2 }}>
              {/* Dashboard Access fields will go here */}
            </Box>
          )}

          {currentTab === 2 && (
            <Box sx={{ mt: 2 }}>{/* Control Access fields will go here */}</Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Products() {
  return (
    <React.Fragment>
      <Grid justifyContent="space-between" container spacing={10}>
        <Grid>
          <Typography variant="h3" gutterBottom display="inline">
            Manage Access
          </Typography>

          <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NextLink} href="/">
              Dashboard
            </Link>
            {/* <Link component={NextLink} href="/">
              Pages
            </Link> */}
            <Typography>Manage Access</Typography>
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

export default withAuth(Products, ["ADMIN"]);
