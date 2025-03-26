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
  status: string,
  role: string
) {
  return { id, firstname, lastname, usertype, status, role };
}

type RowType = {
  [key: string]: string | number;
  id: string;
  firstname: string;
  lastname: string;
  usertype: string;
  status: string;
  role: string;
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

type HeadCell = {
  id: string;
  alignment: "left" | "center" | "right" | "justify" | "inherit" | undefined;
  label: string;
  disablePadding?: boolean;
  width?: string;
};
const headCells: Array<HeadCell> = [
  { id: "firstname", alignment: "left", label: "First Name", width: "15%" },
  { id: "lastname", alignment: "left", label: "Last Name", width: "15%" },
  { id: "usertype", alignment: "left", label: "Organisation", width: "15%" },
  { id: "role", alignment: "left", label: "Role", width: "15%" },
  { id: "status", alignment: "left", label: "Status", width: "15%" },
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
        <TableCell style={{ width: "15%" }} />
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
  const [selectedUsers, setSelectedUsers] = React.useState<Array<string>>([]); //keeps selected users for multiple update
  const [currentTab, setCurrentTab] = React.useState(0);
  const [instrumentAccess, setInstrumentAccess] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userTypeFilter, setUserTypeFilter] = React.useState("All");
  const [regionFilter, setRegionFilter] = React.useState("All");
  const [projectFilter, setProjectFilter] = React.useState("All");
  const [selectedRole, setSelectedRole] = React.useState(""); //stores role for selected users
  const [users, setUsers] = React.useState<Array<RowType>>([]);
  const [loading, setLoading] = React.useState(true);

  const formatRole = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Admin";
      case "STANDARD_USER":
        return "Standard User";
      case "SUPER_USER":
        return "Super User";
      case "TEMPORARY_USER":
        return "Temporary User";
      default:
        return "Unknown Role";
    }
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/auth/users");
        if (response.ok) {
          const data = await response.json();
          interface UserApiResponse {
            id: string;
            firstName: string;
            lastName: string;
            organisation?: string;
            role: string;
          }

          interface MappedUser extends RowType {
            id: string;
            firstname: string;
            lastname: string;
            usertype: string;
            role: string;
            status: string;
          }

          const mappedUsers: MappedUser[] = data.map((user: UserApiResponse) => ({
            id: user.id,
            firstname: user.firstName,
            lastname: user.lastName,
            usertype: user.organisation || "Standard",
            role: formatRole(user.role),
            status: "Active",
          }));
          setUsers(mappedUsers);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  
  
  const handleEditClick = (row: RowType) => {
    setEditingRow(row);
    setSelectedUsers([row.id]);
    const rawRole = getRawRoleValue(row.role);
    setSelectedRole(rawRole);
    setOpenDialog(true);
  };

  const getRawRoleValue = (formattedRole: string) => {
    switch (formattedRole) {
      case "Admin": return "ADMIN";
      case "Standard User": return "STANDARD_USER";
      case "Super User": return "SUPER_USER";
      case "Temporary User": return "TEMPORARY_USER";
      default: return formattedRole;
    }
  };

  const handleManageAccess = () => {
    setSelectedUsers(selected);
    if (selected.length > 0) {
      const firstSelectedUser = users.find(user => user.id === selected[0]);
      if (firstSelectedUser) {
        const rawRole = getRawRoleValue(firstSelectedUser.role);
        setSelectedRole(rawRole);
      } else {
        setSelectedRole("STANDARD_USER"); //default value
      }
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRow(null);
    setSelectedUsers([]);
    setCurrentTab(0);
  };

  const handleSaveChanges = async () => {
    if (selectedUsers.length > 0) {
      try {
        console.log("Updating roles for selected users:", selectedUsers, selectedRole);

        const response = await fetch("/api/auth/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userIds: selectedUsers,
            role: selectedRole, 
          }),
        });

        const result = await response.json();
        console.log("API response:", result);

        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              selectedUsers.includes(user.id)
                ? { ...user, role: formatRole(selectedRole) }
                : user
            )
          );
          
          setSelected([]);
        } else {
          console.error("Failed to update roles:", result.error);
        }
      } catch (error) {
        console.error("Error updating roles:", error);
      }
    }
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
      const newSelecteds: Array<string> = users.map((n: RowType) => n.id);
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

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      searchTerm === "" || 
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase());
  
    const matchesUserType =
      userTypeFilter === "All" || 
      getRawRoleValue(user.role) === userTypeFilter; 
  
    return matchesSearch && matchesUserType;
  });
  

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

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
          <InputLabel>Role</InputLabel>
          <Select
            value={userTypeFilter}
            label="Role"
            onChange={(e) => setUserTypeFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
            <MenuItem value="SUPER_USER">Super User</MenuItem>
            <MenuItem value="STANDARD_USER">Standard User</MenuItem>
            <MenuItem value="TEMPORARY_USER">Temporary User</MenuItem>
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
            {/* Add region options */}
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
            {/* Add project options */}
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
              rowCount={users.length}
            />
            <TableBody>
              {stableSort(filteredUsers, getComparator(order, orderBy))
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
                      <TableCell align="left"><Typography variant="body1">{row.lastname}</Typography></TableCell>
                      <TableCell align="left"><Typography variant="body1">{row.usertype}</Typography></TableCell>
                      <TableCell align="left"><Typography variant="body1">{row.role}</Typography></TableCell>
                      <TableCell align="left"><Typography variant="body1">{row.status}</Typography></TableCell>
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
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedUsers.length > 1 
            ? `Edit Access (${selectedUsers.length} users selected)` 
            : "Edit Access"}
        </DialogTitle>
        <DialogContent>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="User Role" />
            <Tab label="Instrument Access" />
            <Tab label="Dashboard Access" />
            <Tab label="Control Access" />
          </Tabs>

          {currentTab === 0 && (
            <Box sx={{ mt: 2 }}>
              {/* User Role Selection */}
              <FormControl fullWidth margin="dense">
                <InputLabel>User Role</InputLabel>
                <Select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  label="User Role"
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="STANDARD_USER">Standard User</MenuItem>
                  <MenuItem value="SUPER_USER">Super User</MenuItem>
                  <MenuItem value="TEMPORARY_USER">Temporary User</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {currentTab === 1 && (
            <Box sx={{ mt: 2 }}>

              {/* Instrument Access */}
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


          {currentTab === 2 && (
            <Box sx={{ mt: 2 }}>
              {/* Add Dashboard Access fields here */}
            </Box>
          )}

          {currentTab === 3 && (
            <Box sx={{ mt: 2 }}>{/* Control Access fields here */}</Box>
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
