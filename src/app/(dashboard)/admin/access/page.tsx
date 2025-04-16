"use client";

import React, { useState, useEffect } from "react";
import type { ReactElement } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { getSession } from "next-auth/react";

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
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import {
  Edit as EditIcon,
  Star as StarIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
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
  justify-content: space-between;
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
};
const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
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
            Users
          </Typography>
        )}
      </ToolbarTitle>
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
  const [selectedUsers, setSelectedUsers] = React.useState<Array<string>>([]);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [instrumentAccess, setInstrumentAccess] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userTypeFilter, setUserTypeFilter] = React.useState("All");
  const [selectedRole, setSelectedRole] = React.useState("");
  const [users, setUsers] = React.useState<Array<RowType>>([]);
  const [loading, setLoading] = React.useState(true);
  const [reloadUsers, setReloadUsers] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
  const [confirmDialogAction, setConfirmDialogAction] = React.useState<
    "activate" | "deactivate"
  >("deactivate");
  const [accessForm, setAccessForm] = React.useState({
    labId: "",
    channelId: "",
    grantedBy: "",
  });
  const [labs, setLabs] = React.useState<
    Array<{ id: number; labLocation: string }>
  >([]);
  const [channels, setChannels] = React.useState<
    Array<{ id: number; name: string }>
  >([]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showFeedback = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "INACTIVE":
        return "Inactive";
      default:
        return "Unknown";
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/auth/users?_t=${timestamp}`, {
        cache: "no-store",
        headers: {
          pragma: "no-cache",
          "cache-control": "no-cache",
        },
      });

      if (response.ok) {
        const data = await response.json();
        interface UserApiResponse {
          id: string;
          firstName: string;
          lastName: string;
          organisation?: string;
          userRole: string;
          status: string;
        }

        interface MappedUser extends RowType {
          id: string;
          firstname: string;
          lastname: string;
          usertype: string;
          role: string;
          status: string;
        }

        const mappedUsers: MappedUser[] = (data as UserApiResponse[]).map(
          (user: UserApiResponse) => ({
            id: user.id,
            firstname: user.firstName,
            lastname: user.lastName,
            usertype: user.organisation || "Standard",
            role: formatRole(user.userRole),
            status: formatStatus(user.status),
          })
        );

        setUsers(mappedUsers);
        console.log("Users fetched successfully:", mappedUsers);
      } else {
        console.error("Failed to fetch users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLabs = async () => {
    try {
      const response = await fetch("/api/access/labs");
      if (response.ok) {
        const data = await response.json();
        setLabs(data);
      } else {
        console.error("Failed to fetch labs:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching labs:", error);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await fetch("/api/access/channels");
      if (response.ok) {
        const data = await response.json();
        setChannels(data);
      } else {
        console.error("Failed to fetch channels:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  useEffect(() => {
    console.log("Fetching data...");
    fetchUsers();
    fetchLabs();
    fetchChannels();
  }, [reloadUsers]);

  const handleDeactivateUsers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const response = await fetch("/api/auth/deactivate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(
            `Failed to deactivate users: ${
              errorJson.error || errorJson.message || errorText
            }`
          );
        } catch (parseError) {
          throw new Error(`Failed to deactivate users: ${errorText}`);
        }
      }

      const result = await response.json();
      console.log("Users deactivated successfully:", result);

      setReloadUsers((prev) => !prev);
      setSelected([]);
      setSelectedUsers([]);
      closeConfirmationDialog();

      showFeedback(
        `Successfully deactivated ${selectedUsers.length} user(s)`,
        "success"
      );
    } catch (error) {
      console.error("Error deactivating users:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      showFeedback(`Failed to deactivate users: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUsers = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setLoading(true);
      const response = await fetch("/api/auth/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userIds: selectedUsers }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(
            `Failed to activate users: ${
              errorJson.error || errorJson.message || errorText
            }`
          );
        } catch (parseError) {
          throw new Error(`Failed to activate users: ${errorText}`);
        }
      }

      const result = await response.json();
      console.log("Users activated successfully:", result);

      setReloadUsers((prev) => !prev);
      setSelected([]);
      setSelectedUsers([]);
      closeConfirmationDialog();

      showFeedback(
        `Successfully activated ${selectedUsers.length} user(s)`,
        "success"
      );
    } catch (error) {
      console.error("Error activating users:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      showFeedback(`Failed to activate users: ${errorMessage}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmationDialog = (action: "activate" | "deactivate") => {
    setConfirmDialogAction(action);
    setConfirmDialogOpen(true);
  };

  const closeConfirmationDialog = () => {
    setConfirmDialogOpen(false);
  };

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

  const handleEditClick = (row: RowType) => {
    setEditingRow(row);
    setSelectedUsers([row.id]);
    const rawRole = getRawRoleValue(row.role);
    setSelectedRole(rawRole);
    setAccessForm({ labId: "", channelId: "", grantedBy: "" });
    setOpenDialog(true);
  };

  const getRawRoleValue = (formattedRole: string) => {
    switch (formattedRole) {
      case "Admin":
        return "ADMIN";
      case "Standard User":
        return "STANDARD_USER";
      case "Super User":
        return "SUPER_USER";
      case "Temporary User":
        return "TEMPORARY_USER";
      default:
        return formattedRole;
    }
  };

  const handleManageAccess = () => {
    setSelectedUsers(selected);
    if (selected.length > 0) {
      const firstSelectedUser = users.find((user) => user.id === selected[0]);
      if (firstSelectedUser) {
        const rawRole = getRawRoleValue(firstSelectedUser.role);
        setSelectedRole(rawRole);
      } else {
        setSelectedRole("STANDARD_USER");
      }
    }
    setAccessForm({ labId: "", channelId: "", grantedBy: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRow(null);
    setSelectedUsers([]);
    setCurrentTab(0);
    setAccessForm({ labId: "", channelId: "", grantedBy: "" });
  };

  const handleSaveChanges = async () => {
    if (selectedUsers.length === 0) return;
  
    try {
      setLoading(true);
      const session = await getSession();
  
      if (currentTab === 0) {
        console.log("Updating roles for users:", selectedUsers, selectedRole);
        const response = await fetch("/api/auth/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userIds: selectedUsers,
            role: selectedRole,
            currentUserEmail: session?.user?.email,
          }),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(
              `Failed to update roles: ${
                errorJson.error || errorJson.message || errorText
              }`
            );
          } catch (parseError) {
            throw new Error(`Failed to update roles: ${errorText}`);
          }
        }
  
        showFeedback(
          `Successfully updated role for ${selectedUsers.length} user(s)`,
          "success"
        );
      }
  
      if (currentTab === 2) {
        console.log("Updating access for users:", selectedUsers, accessForm);
        const accessData = {
          userIds: selectedUsers,
          labId: accessForm.labId ? parseInt(accessForm.labId) : null,
          channelId: accessForm.channelId ? parseInt(accessForm.channelId) : null,
          grantedBy: session?.user?.id ? parseInt(session.user.id) : null,
        };
  
        const response = await fetch("/api/access/user_access", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accessData),
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          if (response.status === 409) {
            showFeedback(result.message, "warning");
          } else {
            throw new Error(result.message || `Failed to update access: ${response.statusText}`);
          }
        } else {
          showFeedback(result.message, "success");
        }
      }
  
      setReloadUsers((prev) => !prev);
      setSelected([]);
    } catch (error) {
      console.error("Error updating:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      showFeedback(errorMessage, "error");
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleAccessFormChange = (field: string, value: string) => {
    setAccessForm((prev) => ({ ...prev, [field]: value }));
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

  const areAllSelectedUsersActive = () => {
    if (selectedUsers.length === 0) return false;

    return selectedUsers.every((userId) => {
      const user = users.find((u) => u.id === userId);
      return user && user.status === "Active";
    });
  };

  const areAllSelectedUsersInactive = () => {
    if (selectedUsers.length === 0) return false;

    return selectedUsers.every((userId) => {
      const user = users.find((u) => u.id === userId);
      return user && user.status === "Inactive";
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUserType =
      userTypeFilter === "All" || getRawRoleValue(user.role) === userTypeFilter;

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
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={selected.length === 0}
          onClick={handleManageAccess}
        >
          Manage Access
        </Button>
      </SearchContainer>

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
                      <TableCell align="left">
                        <Typography variant="body1">{row.lastname}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="body1">{row.usertype}</Typography>
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="body1">{row.role}</Typography>
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
            <Tab label="User Status" />
            <Tab label="Resource Access" />
          </Tabs>

          {currentTab === 0 && (
            <Box sx={{ mt: 2 }}>
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
              <Typography variant="body1" gutterBottom>
                Manage user status:
              </Typography>

              {areAllSelectedUsersActive() && (
                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => openConfirmationDialog("deactivate")}
                    disabled={selectedUsers.length === 0}
                  >
                    Deactivate Users
                  </Button>
                </Box>
              )}

              {areAllSelectedUsersInactive() && (
                <Box mt={3} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openConfirmationDialog("activate")}
                    disabled={selectedUsers.length === 0}
                  >
                    Activate Users
                  </Button>
                </Box>
              )}

              {!areAllSelectedUsersActive() &&
                !areAllSelectedUsersInactive() &&
                selectedUsers.length > 0 && (
                  <Typography color="error">
                    Selected users have mixed statuses. Please select users with
                    the same status.
                  </Typography>
                )}
            </Box>
          )}

          {currentTab === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                Grant access to resources:
              </Typography>
              <FormControl fullWidth margin="dense">
                <InputLabel>Lab</InputLabel>
                <Select
                  value={accessForm.labId}
                  onChange={(e) =>
                    handleAccessFormChange("labId", e.target.value)
                  }
                  label="Lab"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {labs.map((lab) => (
                    <MenuItem key={lab.id} value={lab.id}>
                      {lab.labLocation}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="dense">
                <InputLabel>Channel</InputLabel>
                <Select
                  value={accessForm.channelId}
                  onChange={(e) =>
                    handleAccessFormChange("channelId", e.target.value)
                  }
                  label="Channel"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {channels.map((channel) => (
                    <MenuItem key={channel.id} value={channel.id}>
                      {channel.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDialogOpen} onClose={closeConfirmationDialog}>
        <DialogTitle>
          {confirmDialogAction === "deactivate"
            ? "Confirm User Deactivation"
            : "Confirm User Activation"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialogAction === "deactivate"
              ? `Are you sure you want to deactivate ${
                  selectedUsers.length
                } selected user${
                  selectedUsers.length !== 1 ? "s" : ""
                }? Deactivated users will no longer be able to access the system.`
              : `Are you sure you want to activate ${
                  selectedUsers.length
                } selected user${
                  selectedUsers.length !== 1 ? "s" : ""
                }? Activated users will be able to access the system.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog}>Cancel</Button>
          <Button
            onClick={
              confirmDialogAction === "deactivate"
                ? handleDeactivateUsers
                : handleActivateUsers
            }
            variant="contained"
            color={
              confirmDialogAction === "deactivate" ? "secondary" : "primary"
            }
          >
            {confirmDialogAction === "deactivate" ? "Deactivate" : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
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

export default Products;

// "use client";

// import React, { useState, useEffect } from "react";
// import type { ReactElement } from "react";
// import styled from "@emotion/styled";
// import NextLink from "next/link";
// import { getSession } from "next-auth/react";

// import {
//   Box,
//   Breadcrumbs as MuiBreadcrumbs,
//   Button,
//   Checkbox,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Divider as MuiDivider,
//   Grid2 as Grid,
//   IconButton,
//   Link,
//   Paper as MuiPaper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TablePagination,
//   TableRow,
//   TableSortLabel,
//   Toolbar,
//   Tooltip,
//   Typography,
//   Fab,
//   Tabs,
//   Tab,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   CircularProgress, // Added for loading indicator
//   Snackbar, // Added for user feedback
//   Alert,
// } from "@mui/material";
// import { orange } from "@mui/material/colors";
// import {
//   Edit as EditIcon,
//   Star as StarIcon,
//   Search as SearchIcon,
//   Refresh as RefreshIcon,
// } from "@mui/icons-material";
// import { spacing } from "@mui/system";

// const Divider = styled(MuiDivider)(spacing);

// const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

// const Paper = styled(MuiPaper)(spacing);

// const Spacer = styled.div`
//   flex: 1 1 100%;
// `;

// const ToolbarTitle = styled.div`
//   min-width: 150px;
// `;

// const Customer = styled.div`
//   display: flex;
//   align-items: center;
// `;

// const ImageWrapper = styled.div`
//   width: 50px;
//   height: 50px;
//   padding: ${(props) => props.theme.spacing(1)};
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const Image = styled.img`
//   max-width: 100%;
//   max-height: 100%;
// `;

// const Rating = styled.div`
//   display: flex;
//   align-items: center;
//   gap: ${(props) => props.theme.spacing(1)};
// `;

// const RatingIcon = styled(StarIcon)`
//   color: ${() => orange[400]};
// `;

// const SearchContainer = styled.div`
//   display: flex;
//   gap: 16px;
//   margin-bottom: 16px;
//   align-items: center;
// `;

// function createData(
//   id: string,
//   firstname: string,
//   lastname: string,
//   usertype: string,
//   status: string,
//   role: string
// ) {
//   return { id, firstname, lastname, usertype, status, role };
// }

// type RowType = {
//   [key: string]: string | number;
//   id: string;
//   firstname: string;
//   lastname: string;
//   usertype: string;
//   status: string;
//   role: string;
// };

// function descendingComparator(a: RowType, b: RowType, orderBy: string) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order: "desc" | "asc", orderBy: string) {
//   return order === "desc"
//     ? (a: RowType, b: RowType) => descendingComparator(a, b, orderBy)
//     : (a: RowType, b: RowType) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(
//   array: Array<RowType>,
//   comparator: (a: RowType, b: RowType) => number
// ) {
//   const stabilizedThis = array.map((el: RowType, index: number) => ({
//     el,
//     index,
//   }));
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a.el, b.el);
//     if (order !== 0) return order;
//     return a.index - b.index;
//   });
//   return stabilizedThis.map((element) => element.el);
// }

// type HeadCell = {
//   id: string;
//   alignment: "left" | "center" | "right" | "justify" | "inherit" | undefined;
//   label: string;
//   disablePadding?: boolean;
//   width?: string;
// };
// const headCells: Array<HeadCell> = [
//   { id: "firstname", alignment: "left", label: "First Name", width: "15%" },
//   { id: "lastname", alignment: "left", label: "Last Name", width: "15%" },
//   { id: "usertype", alignment: "left", label: "Organisation", width: "15%" },
//   { id: "role", alignment: "left", label: "Role", width: "15%" },
//   { id: "status", alignment: "left", label: "Status", width: "15%" },
// ];

// type EnhancedTableHeadProps = {
//   numSelected: number;
//   order: "desc" | "asc";
//   orderBy: string;
//   rowCount: number;
//   onSelectAllClick: (e: any) => void;
//   onRequestSort: (e: any, property: string) => void;
// };
// const EnhancedTableHead: React.FC<EnhancedTableHeadProps> = (props) => {
//   const {
//     onSelectAllClick,
//     order,
//     orderBy,
//     numSelected,
//     rowCount,
//     onRequestSort,
//   } = props;
//   const createSortHandler = (property: string) => (event: any) => {
//     onRequestSort(event, property);
//   };

//   return (
//     <TableHead>
//       <TableRow>
//         <TableCell padding="checkbox" style={{ width: "5%" }}>
//           <Checkbox
//             indeterminate={numSelected > 0 && numSelected < rowCount}
//             checked={rowCount > 0 && numSelected === rowCount}
//             onChange={onSelectAllClick}
//             inputProps={{ "aria-label": "select all" }}
//           />
//         </TableCell>
//         {headCells.map((headCell: HeadCell) => (
//           <TableCell
//             key={headCell.id}
//             align={headCell.alignment}
//             padding={headCell.disablePadding ? "none" : "normal"}
//             sortDirection={orderBy === headCell.id ? order : false}
//             style={{ width: headCell.width }}
//           >
//             <TableSortLabel
//               active={orderBy === headCell.id}
//               direction={orderBy === headCell.id ? order : "asc"}
//               onClick={createSortHandler(headCell.id)}
//             >
//               {headCell.label}
//             </TableSortLabel>
//           </TableCell>
//         ))}
//         <TableCell style={{ width: "15%" }} />
//       </TableRow>
//     </TableHead>
//   );
// };

// type EnhancedTableToolbarProps = {
//   numSelected: number;
//   onManageAccess: () => void;
// };
// const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
//   const { numSelected, onManageAccess } = props;

//   return (
//     <Toolbar>
//       <ToolbarTitle>
//         {numSelected > 0 ? (
//           <Typography color="inherit" variant="subtitle1">
//             {numSelected} selected
//           </Typography>
//         ) : (
//           <Typography variant="h6" id="tableTitle">
//             Users
//           </Typography>
//         )}
//       </ToolbarTitle>
//       <Spacer />
//       <Button
//         variant="contained"
//         color="primary"
//         size="small"
//         disabled={numSelected === 0}
//         onClick={onManageAccess}
//       >
//         Manage Access
//       </Button>
//     </Toolbar>
//   );
// };

// function EnhancedTable() {
//   const [order, setOrder] = React.useState<"desc" | "asc">("asc");
//   const [orderBy, setOrderBy] = React.useState("customer");
//   const [selected, setSelected] = React.useState<Array<string>>([]);
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(6);
//   const [openDialog, setOpenDialog] = React.useState(false);
//   const [editingRow, setEditingRow] = React.useState<RowType | null>(null);
//   const [selectedUsers, setSelectedUsers] = React.useState<Array<string>>([]); //keeps selected users for multiple update
//   const [currentTab, setCurrentTab] = React.useState(0);
//   const [instrumentAccess, setInstrumentAccess] = React.useState("");
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const [userTypeFilter, setUserTypeFilter] = React.useState("All");
//   const [regionFilter, setRegionFilter] = React.useState("All");
//   const [projectFilter, setProjectFilter] = React.useState("All");
//   const [selectedRole, setSelectedRole] = React.useState(""); //stores role for selected users
//   const [users, setUsers] = React.useState<Array<RowType>>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [reloadUsers, setReloadUsers] = useState(false); // New state to trigger re-fetch

//   // -- ADDED--
//   // New state for Access tab
//   const [accessForm, setAccessForm] = React.useState({
//     labId: "",
//     channelId: "",
//     grantedBy: "",
//   });
//   const [labs, setLabs] = React.useState<
//     Array<{ id: number; labLocation: string }>
//   >([]);
//   const [channels, setChannels] = React.useState<
//     Array<{ id: number; name: string }>
//   >([]);
//   // --- End ADDED ----

//   // Added state for user feedback
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success" as "success" | "error" | "info" | "warning",
//   });

//   // Confirmation dialog state
//   const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
//   const [confirmDialogAction, setConfirmDialogAction] = React.useState<
//     "activate" | "deactivate"
//   >("deactivate");

//   // Close snackbar
//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

//   // Show feedback to user
//   const showFeedback = (
//     message: string,
//     severity: "success" | "error" | "info" | "warning"
//   ) => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     });
//   };

//   const formatStatus = (status: string) => {
//     switch (status) {
//       case "ACTIVE":
//         return "Active";
//       case "INACTIVE":
//         return "Inactive";
//       default:
//         return "Unknown";
//     }
//   };

//   // Fetch users function - single implementation
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       // Add timestamp to prevent caching
//       const timestamp = new Date().getTime();
//       const response = await fetch(`/api/auth/users?_t=${timestamp}`, {
//         cache: "no-store", // Force server to revalidate the data
//         headers: {
//           pragma: "no-cache",
//           "cache-control": "no-cache",
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const mappedUsers = data.map((user) => ({
//           id: user.id,
//           firstname: user.firstName,
//           lastname: user.lastName,
//           usertype: user.organisation || "Standard",
//           role: formatRole(user.userRole),
//           status: formatStatus(user.status),
//         }));

//         setUsers(mappedUsers);
//         console.log("Users fetched successfully:", mappedUsers);
//       } else {
//         console.error("Failed to fetch users:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- ADDED ---
//   // Fetch labs for Access tab
//   const fetchLabs = async () => {
//     try {
//       const response = await fetch("/api/access/labs");
//       if (response.ok) {
//         const data = await response.json();
//         setLabs(data);
//       } else {
//         console.error("Failed to fetch labs:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching labs:", error);
//     }
//   };

//   // Fetch channels for Access tab
//   const fetchChannels = async () => {
//     try {
//       const response = await fetch("/api/access/channels"); // Adjusted to match provided route
//       if (response.ok) {
//         const data = await response.json();
//         setChannels(data);
//       } else {
//         console.error("Failed to fetch channels:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching channels:", error);
//     }
//   };
//   // --- END ADDED ---

//   // to be uncommented
//   // Run fetchUsers on component mount and when reloadUsers changes
//   // useEffect(() => {
//   //   console.log("Fetching users...");
//   //   fetchUsers();
//   // }, [reloadUsers]);

//   // --- ADDED
//   // Run fetchUsers on component mount and when reloadUsers changes
//   useEffect(() => {
//     // --- MODIFIED ---
//     console.log("Fetching data...");
//     fetchUsers();
//     fetchLabs();
//     fetchChannels();
//   }, [reloadUsers]);
//   // --- END ADDED ---

//   // Function to manually refresh data
//   const handleRefreshData = () => {
//     showFeedback("Refreshing user data...", "info");
//     setReloadUsers((prev) => !prev);
//   };

//   const handleDeactivateUsers = async () => {
//     if (selectedUsers.length === 0) return;

//     try {
//       const response = await fetch("/api/auth/deactivate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userIds: selectedUsers }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text(); // Get the error message from the response body
//         try {
//           // Attempt to parse as JSON, in case the server sends a JSON error response
//           const errorJson = JSON.parse(errorText);
//           throw new Error(
//             `Failed to deactivate users: ${
//               errorJson.error || errorJson.message || errorText
//             }`
//           );
//         } catch (parseError) {
//           // If response isn't JSON, just throw the text error message
//           throw new Error(`Failed to deactivate users: ${errorText}`);
//         }
//       }

//       const result = await response.json();
//       console.log("Users deactivated successfully:", result);

//       // Trigger a re-fetch instead of manually updating state
//       setReloadUsers((prev) => !prev);

//       // // Update local state
//       // setUsers((prevUsers) =>
//       //   prevUsers.map((user) =>
//       //     selectedUsers.includes(user.id)
//       //       ? { ...user, status: "Inactive" }
//       //       : user
//       //   )
//       // );

//       // Cleanup
//       setSelected([]);
//       setSelectedUsers([]);
//       closeConfirmationDialog();

//       showFeedback(
//         `Successfully deactivated ${selectedUsers.length} user(s)`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Error deactivating users:", error);
//       showFeedback(`Failed to deactivate users: ${error.message}`, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleActivateUsers = async () => {
//     if (selectedUsers.length === 0) return;

//     try {
//       setLoading(true);
//       const response = await fetch("/api/auth/activate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ userIds: selectedUsers }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         try {
//           const errorJson = JSON.parse(errorText);
//           throw new Error(
//             `Failed to activate users: ${
//               errorJson.error || errorJson.message || errorText
//             }`
//           );
//         } catch (parseError) {
//           throw new Error(`Failed to activate users: ${errorText}`);
//         }
//       }

//       const result = await response.json();
//       console.log("Users activated successfully:", result);

//       // Trigger a re-fetch instead of manually updating state
//       setReloadUsers((prev) => !prev);

//       // // Update local state
//       // setUsers((prevUsers) =>
//       //   prevUsers.map((user) =>
//       //     selectedUsers.includes(user.id) ? { ...user, status: "Active" } : user
//       //   )
//       // );

//       // Cleanup
//       setSelected([]);
//       setSelectedUsers([]);
//       closeConfirmationDialog();

//       showFeedback(
//         `Successfully activated ${selectedUsers.length} user(s)`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Error activating users:", error);
//       showFeedback(`Failed to activate users: ${error.message}`, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Open confirmation dialog
//   const openConfirmationDialog = (action: "activate" | "deactivate") => {
//     setConfirmDialogAction(action);
//     setConfirmDialogOpen(true);
//   };

//   // Close confirmation dialog
//   const closeConfirmationDialog = () => {
//     setConfirmDialogOpen(false);
//   };

//   const formatRole = (role: string) => {
//     switch (role) {
//       case "ADMIN":
//         return "Admin";
//       case "STANDARD_USER":
//         return "Standard User";
//       case "SUPER_USER":
//         return "Super User";
//       case "TEMPORARY_USER":
//         return "Temporary User";
//       default:
//         return "Unknown Role";
//     }
//   };

//   // React.useEffect(() => {
//   //   const fetchUsers = async () => {
//   //     try {
//   //       const response = await fetch("/api/auth/users");
//   //       if (response.ok) {
//   //         const data = await response.json();
//   //         interface UserApiResponse {
//   //           id: string;
//   //           firstName: string;
//   //           lastName: string;
//   //           organisation?: string;
//   //           role: string;
//   //         }

//   //         interface MappedUser extends RowType {
//   //           id: string;
//   //           firstname: string;
//   //           lastname: string;
//   //           usertype: string;
//   //           role: string;
//   //           status: string;
//   //         }

//   //         const mappedUsers: MappedUser[] = data.map(
//   //           (user: UserApiResponse) => ({
//   //             id: user.id,
//   //             firstname: user.firstName,
//   //             lastname: user.lastName,
//   //             usertype: user.organisation || "Standard",
//   //             role: formatRole(user.role),
//   //             status: "Active",
//   //           })
//   //         );
//   //         setUsers(mappedUsers);
//   //       } else {
//   //         console.error("Failed to fetch users");
//   //       }
//   //     } catch (error) {
//   //       console.error("Error fetching users:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchUsers();
//   // }, []);

//   const handleEditClick = (row: RowType) => {
//     setEditingRow(row);
//     setSelectedUsers([row.id]);
//     const rawRole = getRawRoleValue(row.role);
//     setSelectedRole(rawRole);
//     // --- ADDED ---
//     setAccessForm({ labId: "", channelId: "", grantedBy: "" });
//     // --- END ADDED ---
//     setOpenDialog(true);
//   };

//   const getRawRoleValue = (formattedRole: string) => {
//     switch (formattedRole) {
//       case "Admin":
//         return "ADMIN";
//       case "Standard User":
//         return "STANDARD_USER";
//       case "Super User":
//         return "SUPER_USER";
//       case "Temporary User":
//         return "TEMPORARY_USER";
//       default:
//         return formattedRole;
//     }
//   };

//   const handleManageAccess = () => {
//     setSelectedUsers(selected);
//     if (selected.length > 0) {
//       const firstSelectedUser = users.find((user) => user.id === selected[0]);
//       if (firstSelectedUser) {
//         const rawRole = getRawRoleValue(firstSelectedUser.role);
//         setSelectedRole(rawRole);
//       } else {
//         setSelectedRole("STANDARD_USER"); //default value
//       }
//     }
//     // --- ADDED ---
//     setAccessForm({ labId: "", channelId: "", grantedBy: "" });
//     // --- END ADDED ---
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setEditingRow(null);
//     setSelectedUsers([]);
//     setCurrentTab(0);
//     // --- ADDED ---
//     setAccessForm({ labId: "", channelId: "", grantedBy: "" });
//     // --- END ADDED ---
//   };

//   //to uncomment
//   // const handleSaveChanges = async () => {
//   //   if (selectedUsers.length > 0) {
//   //     try {
//   //       console.log(
//   //         "Updating roles for selected users:",
//   //         selectedUsers,
//   //         selectedRole
//   //       );

//   //       // Get the current user's session
//   //       const session = await getSession();
//   //       console.log("Current session:", session);

//   //       const response = await fetch("/api/auth/users", {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({
//   //           userIds: selectedUsers,
//   //           role: selectedRole,
//   //           currentUserEmail: session?.user?.email,
//   //         }),
//   //       });

//   //       if (!response.ok) {
//   //         const errorText = await response.text();
//   //         try {
//   //           const errorJson = JSON.parse(errorText);
//   //           throw new Error(
//   //             `Failed to update roles: ${
//   //               errorJson.error || errorJson.message || errorText
//   //             }`
//   //           );
//   //         } catch (parseError) {
//   //           throw new Error(`Failed to update roles: ${errorText}`);
//   //         }
//   //       }

//   //       // Trigger a re-fetch
//   //       setReloadUsers((prev) => !prev);
//   //       setSelected([]);
//   //       showFeedback(
//   //         `Successfully updated role for ${selectedUsers.length} user(s)`,
//   //         "success"
//   //       );
//   //     } catch (error) {
//   //       console.error("Error updating roles:", error);
//   //       showFeedback(`Error updating roles: ${error.message}`, "error");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }
//   //   handleCloseDialog();
//   // };

//   const handleSaveChanges = async () => {
//     if (selectedUsers.length === 0) return;

//     try {
//       setLoading(true);
//       const session = await getSession();

//       // Handle role update (User Role tab)
//       if (currentTab === 0) {
//         console.log("Updating roles for users:", selectedUsers, selectedRole);
//         const response = await fetch("/api/auth/users", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             userIds: selectedUsers,
//             role: selectedRole,
//             currentUserEmail: session?.user?.email,
//           }),
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           try {
//             const errorJson = JSON.parse(errorText);
//             throw new Error(
//               `Failed to update roles: ${
//                 errorJson.error || errorJson.message || errorText
//               }`
//             );
//           } catch (parseError) {
//             throw new Error(`Failed to update roles: ${errorText}`);
//           }
//         }

//         showFeedback(
//           `Successfully updated role for ${selectedUsers.length} user(s)`,
//           "success"
//         );
//       }

//       // Handle access update (Resource Access tab)
//       if (currentTab === 2) {
//         console.log("Updating access for users:", selectedUsers, accessForm);
//         const accessData = {
//           userIds: selectedUsers,
//           labId: accessForm.labId ? parseInt(accessForm.labId) : null,
//           channelId: accessForm.channelId
//             ? parseInt(accessForm.channelId)
//             : null,
//           grantedBy: session?.user?.id ? parseInt(session.user.id) : null,
//         };

//         const response = await fetch("/api/access/user_access", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(accessData),
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           try {
//             const errorJson = JSON.parse(errorText);
//             throw new Error(
//               `Failed to update access: ${
//                 errorJson.error || errorJson.message || errorText
//               }`
//             );
//           } catch (parseError) {
//             throw new Error(`Failed to update access: ${errorText}`);
//           }
//         }

//         showFeedback(
//           `Successfully granted access for ${selectedUsers.length} user(s)`,
//           "success"
//         );
//       }

//       setReloadUsers((prev) => !prev); // Triggers re-fetch
//       setSelected([]);
//     } catch (error) {
//       console.error("Error updating:", error);
//       showFeedback(`Error updating: ${error.message}`, "error");
//     } finally {
//       setLoading(false);
//       handleCloseDialog();
//     }
//   };

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setCurrentTab(newValue);
//   };

//   // --- ADDED ---
//   const handleAccessFormChange = (field: string, value: string) => {
//     setAccessForm((prev) => ({ ...prev, [field]: value }));
//   };
//   // --- END ADDED ---

//   const handleRequestSort = (event: any, property: string) => {
//     const isAsc = orderBy === property && order === "asc";
//     setOrder(isAsc ? "desc" : "asc");
//     setOrderBy(property);
//   };

//   const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
//     if (event.target.checked) {
//       const newSelecteds: Array<string> = users.map((n: RowType) => n.id);
//       setSelected(newSelecteds);
//       return;
//     }
//     setSelected([]);
//   };

//   const handleClick = (
//     event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
//     id: string
//   ) => {
//     const selectedIndex = selected.indexOf(id);
//     let newSelected: Array<string> = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selected, id);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selected.slice(1));
//     } else if (selectedIndex === selected.length - 1) {
//       newSelected = newSelected.concat(selected.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selected.slice(0, selectedIndex),
//         selected.slice(selectedIndex + 1)
//       );
//     }

//     setSelected(newSelected);
//   };

//   const handleChangePage = (
//     event: React.MouseEvent<HTMLButtonElement> | null,
//     newPage: number
//   ) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setRowsPerPage(parseInt(event.target.value, 6));
//     setPage(0);
//   };

//   const isSelected = (id: string) => selected.indexOf(id) !== -1;

//   // Check if all selected users are active or inactive
//   const areAllSelectedUsersActive = () => {
//     if (selectedUsers.length === 0) return false;

//     return selectedUsers.every((userId) => {
//       const user = users.find((u) => u.id === userId);
//       return user && user.status === "Active";
//     });
//   };

//   const areAllSelectedUsersInactive = () => {
//     if (selectedUsers.length === 0) return false;

//     return selectedUsers.every((userId) => {
//       const user = users.find((u) => u.id === userId);
//       return user && user.status === "Inactive";
//     });
//   };

//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       searchTerm === "" ||
//       user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.lastname.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesUserType =
//       userTypeFilter === "All" || getRawRoleValue(user.role) === userTypeFilter;

//     return matchesSearch && matchesUserType;
//   });

//   const emptyRows =
//     rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);

//   return (
//     <div>
//       <SearchContainer>
//         <TextField
//           placeholder="Search"
//           variant="outlined"
//           size="small"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           InputProps={{
//             startAdornment: <SearchIcon color="action" />,
//           }}
//           sx={{ minWidth: 300 }}
//         />
//         <FormControl size="small" sx={{ minWidth: 150 }}>
//           <InputLabel>Role</InputLabel>
//           <Select
//             value={userTypeFilter}
//             label="Role"
//             onChange={(e) => setUserTypeFilter(e.target.value)}
//           >
//             <MenuItem value="All">All</MenuItem>
//             <MenuItem value="ADMIN">Admin</MenuItem>
//             <MenuItem value="SUPER_USER">Super User</MenuItem>
//             <MenuItem value="STANDARD_USER">Standard User</MenuItem>
//             <MenuItem value="TEMPORARY_USER">Temporary User</MenuItem>
//           </Select>
//         </FormControl>
//         <FormControl size="small" sx={{ minWidth: 150 }}>
//           <InputLabel>Region</InputLabel>
//           <Select
//             value={regionFilter}
//             label="Region"
//             onChange={(e) => setRegionFilter(e.target.value)}
//           >
//             <MenuItem value="All">All</MenuItem>
//             {/* Add region options */}
//           </Select>
//         </FormControl>
//         <FormControl size="small" sx={{ minWidth: 150 }}>
//           <InputLabel>Project</InputLabel>
//           <Select
//             value={projectFilter}
//             label="Project"
//             onChange={(e) => setProjectFilter(e.target.value)}
//           >
//             <MenuItem value="All">All</MenuItem>
//             {/* Add project options */}
//           </Select>
//         </FormControl>
//         <Button variant="contained" color="primary">
//           Go
//         </Button>
//         {/* Added refresh button for manual data refresh */}
//         <Button
//           variant="outlined"
//           onClick={handleRefreshData}
//           startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
//           disabled={loading}
//         >
//           {loading ? "Refreshing..." : "Refresh Data"}
//         </Button>
//       </SearchContainer>

//       <Paper>
//         <EnhancedTableToolbar
//           numSelected={selected.length}
//           onManageAccess={handleManageAccess}
//         />
//         <TableContainer>
//           <Table
//             aria-labelledby="tableTitle"
//             size={"medium"}
//             aria-label="enhanced table"
//           >
//             <EnhancedTableHead
//               numSelected={selected.length}
//               order={order}
//               orderBy={orderBy}
//               onSelectAllClick={handleSelectAllClick}
//               onRequestSort={handleRequestSort}
//               rowCount={users.length}
//             />
//             <TableBody>
//               {stableSort(filteredUsers, getComparator(order, orderBy))
//                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                 .map((row: RowType, index: number) => {
//                   const isItemSelected = isSelected(row.id);
//                   const labelId = `enhanced-table-checkbox-${index}`;

//                   return (
//                     <TableRow
//                       hover
//                       role="checkbox"
//                       aria-checked={isItemSelected}
//                       tabIndex={-1}
//                       key={`${row.id}-${index}`}
//                       selected={isItemSelected}
//                     >
//                       <TableCell padding="checkbox">
//                         <Checkbox
//                           checked={isItemSelected}
//                           inputProps={{ "aria-labelledby": labelId }}
//                           onClick={(event) => handleClick(event, row.id)}
//                         />
//                       </TableCell>
//                       <TableCell component="th" id={labelId} scope="row">
//                         <Customer>
//                           <Box>
//                             <Typography variant="body1">
//                               {row.firstname}
//                             </Typography>
//                           </Box>
//                         </Customer>
//                       </TableCell>
//                       <TableCell align="left">
//                         <Typography variant="body1">{row.lastname}</Typography>
//                       </TableCell>
//                       <TableCell align="left">
//                         <Typography variant="body1">{row.usertype}</Typography>
//                       </TableCell>
//                       <TableCell align="left">
//                         <Typography variant="body1">{row.role}</Typography>
//                       </TableCell>
//                       <TableCell align="left">
//                         <Typography variant="body1">{row.status}</Typography>
//                       </TableCell>
//                       <TableCell align="right">
//                         <IconButton
//                           color="primary"
//                           onClick={() => handleEditClick(row)}
//                         >
//                           <EditIcon />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               {emptyRows > 0 && (
//                 <TableRow style={{ height: 53 * emptyRows }}>
//                   <TableCell colSpan={7} />
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[6, 12, 18]}
//           component="div"
//           count={filteredUsers.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>

//       <Dialog open={openDialog} onClose={handleCloseDialog}>
//         <DialogTitle>
//           {selectedUsers.length > 1
//             ? `Edit Access (${selectedUsers.length} users selected)`
//             : "Edit Access"}
//         </DialogTitle>
//         <DialogContent>
//           <Tabs value={currentTab} onChange={handleTabChange}>
//             <Tab label="User Role" />
//             <Tab label="User Status" />
//             {/* // --- ADDED --- */}
//             <Tab label="Resource Access" />
//             {/* // --- END ADDED --- */}
//           </Tabs>

//           {currentTab === 0 && (
//             <Box sx={{ mt: 2 }}>
//               {/* User Role Selection */}
//               <FormControl fullWidth margin="dense">
//                 <InputLabel>User Role</InputLabel>
//                 <Select
//                   value={selectedRole}
//                   onChange={(e) => setSelectedRole(e.target.value)}
//                   label="User Role"
//                 >
//                   <MenuItem value="ADMIN">Admin</MenuItem>
//                   <MenuItem value="STANDARD_USER">Standard User</MenuItem>
//                   <MenuItem value="SUPER_USER">Super User</MenuItem>
//                   <MenuItem value="TEMPORARY_USER">Temporary User</MenuItem>
//                 </Select>
//               </FormControl>
//             </Box>
//           )}

//           {currentTab === 1 && (
//             <Box sx={{ mt: 2 }}>
//               {/* User Status Management */}
//               <Typography variant="body1" gutterBottom>
//                 Manage user status:
//               </Typography>

//               {areAllSelectedUsersActive() && (
//                 <Box mt={3} display="flex" justifyContent="flex-end">
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={() => openConfirmationDialog("deactivate")}
//                     disabled={selectedUsers.length === 0}
//                   >
//                     Deactivate Users
//                   </Button>
//                 </Box>
//               )}

//               {areAllSelectedUsersInactive() && (
//                 <Box mt={3} display="flex" justifyContent="flex-end">
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => openConfirmationDialog("activate")}
//                     disabled={selectedUsers.length === 0}
//                   >
//                     Activate Users
//                   </Button>
//                 </Box>
//               )}

//               {!areAllSelectedUsersActive() &&
//                 !areAllSelectedUsersInactive() &&
//                 selectedUsers.length > 0 && (
//                   <Typography color="error">
//                     Selected users have mixed statuses. Please select users with
//                     the same status.
//                   </Typography>
//                 )}
//             </Box>
//           )}
//           {/* // --- ADDED --- */}
//           {currentTab === 2 && (
//             <Box sx={{ mt: 2 }}>
//               <Typography variant="body1" gutterBottom>
//                 Grant access to resources:
//               </Typography>
//               <FormControl fullWidth margin="dense">
//                 <InputLabel>Lab</InputLabel>
//                 <Select
//                   value={accessForm.labId}
//                   onChange={(e) =>
//                     handleAccessFormChange("labId", e.target.value)
//                   }
//                   label="Lab"
//                 >
//                   <MenuItem value="">
//                     <em>None</em>
//                   </MenuItem>
//                   {labs.map((lab) => (
//                     <MenuItem key={lab.id} value={lab.id}>
//                       {lab.labLocation}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <FormControl fullWidth margin="dense">
//                 <InputLabel>Channel</InputLabel>
//                 <Select
//                   value={accessForm.channelId}
//                   onChange={(e) =>
//                     handleAccessFormChange("channelId", e.target.value)
//                   }
//                   label="Channel"
//                 >
//                   <MenuItem value="">
//                     <em>None</em>
//                   </MenuItem>
//                   {channels.map((channel) => (
//                     <MenuItem key={channel.id} value={channel.id}>
//                       {channel.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>
//           )}
//           {/* // --- END ADDED --- */}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} disabled={loading}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleSaveChanges}
//             color="primary"
//             disabled={loading}
//           >
//             {loading ? <CircularProgress size={24} /> : "Save"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Confirmation Dialog for Activation/Deactivation */}
//       <Dialog open={confirmDialogOpen} onClose={closeConfirmationDialog}>
//         <DialogTitle>
//           {confirmDialogAction === "deactivate"
//             ? "Confirm User Deactivation"
//             : "Confirm User Activation"}
//         </DialogTitle>
//         <DialogContent>
//           <Typography>
//             {confirmDialogAction === "deactivate"
//               ? `Are you sure you want to deactivate ${
//                   selectedUsers.length
//                 } selected user${
//                   selectedUsers.length !== 1 ? "s" : ""
//                 }? Deactivated users will no longer be able to access the system.`
//               : `Are you sure you want to activate ${
//                   selectedUsers.length
//                 } selected user${
//                   selectedUsers.length !== 1 ? "s" : ""
//                 }? Activated users will be able to access the system.`}
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={closeConfirmationDialog}>Cancel</Button>
//           <Button
//             onClick={
//               confirmDialogAction === "deactivate"
//                 ? handleDeactivateUsers
//                 : handleActivateUsers
//             }
//             variant="contained"
//             color={
//               confirmDialogAction === "deactivate" ? "secondary" : "primary"
//             }
//           >
//             {confirmDialogAction === "deactivate" ? "Deactivate" : "Activate"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }

// function Products() {
//   return (
//     <React.Fragment>
//       <Grid justifyContent="space-between" container spacing={10}>
//         <Grid>
//           <Typography variant="h3" gutterBottom display="inline">
//             Manage Access
//           </Typography>

//           <Breadcrumbs aria-label="Breadcrumb" mt={2}>
//             <Link component={NextLink} href="/">
//               Dashboard
//             </Link>
//             <Typography>Manage Access</Typography>
//           </Breadcrumbs>
//         </Grid>
//       </Grid>
//       <Divider my={6} />
//       <Grid container spacing={6}>
//         <Grid size={12}>
//           <EnhancedTable />
//         </Grid>
//       </Grid>
//     </React.Fragment>
//   );
// }

// export default Products;
