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
import UserInfoPopup from "./components/UserInfoPopup";

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
  channelCount?: number;
};

interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  organisation: string | null;
  role: string;
  status: string;
  access: {
    channelId: number | null;
    channelName: string | null;
  }[];
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
  width?: string;
};
const headCells: Array<HeadCell> = [
  { id: "firstname", alignment: "left", label: "First Name", width: "15%" },
  { id: "lastname", alignment: "left", label: "Last Name", width: "15%" },
  { id: "usertype", alignment: "left", label: "Organisation", width: "15%" },
  { id: "role", alignment: "left", label: "Role", width: "15%" },
  { id: "status", alignment: "left", label: "Status", width: "15%" },
  { id: "channelCount", alignment: "left", label: "Number of Channels", width: "10%" },
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

// function EnhancedTable() {
//   const [order, setOrder] = React.useState<"desc" | "asc">("asc");
//   const [orderBy, setOrderBy] = React.useState("customer");
//   const [selected, setSelected] = React.useState<Array<string>>([]);
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(6);
//   const [openDialog, setOpenDialog] = React.useState(false);
//   const [editingRow, setEditingRow] = React.useState<RowType | null>(null);
//   const [selectedUsers, setSelectedUsers] = React.useState<Array<string>>([]);
//   const [currentTab, setCurrentTab] = React.useState(0);
//   const [instrumentAccess, setInstrumentAccess] = React.useState("");
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const [userTypeFilter, setUserTypeFilter] = React.useState("All");
//   const [selectedRole, setSelectedRole] = React.useState("");
//   const [users, setUsers] = React.useState<Array<RowType>>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [reloadUsers, setReloadUsers] = useState(false);
//   const [accessAction, setAccessAction] = React.useState<"grant" | "remove">("grant");
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success" as "success" | "error" | "info" | "warning",
//   });
//   const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
//   const [confirmDialogAction, setConfirmDialogAction] = React.useState<
//     "activate" | "deactivate"
//   >("deactivate");
//   const [accessForm, setAccessForm] = React.useState({
//     channelId: "",
//     grantedBy: "",
//   });
//   const [channels, setChannels] = React.useState<
//     Array<{ id: number; name: string }>
//   >([]);
//   const [popupOpen, setPopupOpen] = React.useState(false);
//   const [selectedUserInfo, setSelectedUserInfo] =
//     React.useState<UserInfo | null>(null);

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

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

//   // In-memory cache for access data
//   const accessCache: { [userId: string]: { channelCount: number } } = {};

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       console.log("Fetching users from /api/auth/users...");
//       const timestamp = new Date().getTime();
//       const response = await fetch(`/api/auth/users?_t=${timestamp}`, {
//         cache: "no-store",
//         headers: {
//           pragma: "no-cache",
//           "cache-control": "no-cache",
//         },
//       });

//       if (!response.ok) {
//         console.error("Failed to fetch users:", response.status, response.statusText);
//         showFeedback("Failed to load users", "error");
//         setUsers([]);
//         return;
//       }

//       const data = await response.json();
//       console.log("Users data received:", data);

//       if (!Array.isArray(data) || data.length === 0) {
//         console.warn("No users found");
//         showFeedback("No users found", "info");
//         setUsers([]);
//         return;
//       }

//       interface UserApiResponse {
//         id: string;
//         firstName: string;
//         lastName: string;
//         organisation?: string;
//         userRole: string;
//         status: string;
//       }

//       interface MappedUser extends RowType {
//         id: string;
//         firstname: string;
//         lastname: string;
//         usertype: string;
//         role: string;
//         status: string;
//         channelCount?: number;
//       }

//       const mappedUsers: MappedUser[] = await Promise.all(
//         (data as UserApiResponse[]).map(async (user: UserApiResponse) => {
//           const baseUser = {
//             id: user.id,
//             firstname: user.firstName,
//             lastname: user.lastName,
//             usertype: user.organisation || "Standard",
//             role: formatRole(user.userRole),
//             status: formatStatus(user.status),
//           };

//           // Check cache
//           if (accessCache[user.id]) {
//             console.log(`Using cached access for user ${user.id}`);
//             return {
//               ...baseUser,
//               channelCount: accessCache[user.id].channelCount,
//             };
//           }

//           // Fetch access data
//           let channelCount = 0;
//           try {
//             console.log(`Fetching access for user ${user.id}...`);
//             const accessResponse = await fetch(`/api/access/users/${user.id}`);
//             if (accessResponse.ok) {
//               const userAccess = await accessResponse.json();
//               console.log(`Access data for user ${user.id}:`, userAccess);
//               channelCount = userAccess.access.filter((a: { channelId: number | null }) => a.channelId !== null).length;
//               accessCache[user.id] = { channelCount };
//             } else {
//               console.warn(`No access data for user ${user.id}:`, accessResponse.statusText);
//             }
//           } catch (error) {
//             console.error(`Error fetching access for user ${user.id}:`, error);
//           }

//           return {
//             ...baseUser,
//             channelCount,
//           };
//         })
//       );

//       console.log("Mapped users:", mappedUsers);
//       setUsers(mappedUsers);
//     } catch (error) {
//       console.error("Error in fetchUsers:", error);
//       showFeedback("Error loading users", "error");
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchChannels = async () => {
//     try {
//       const response = await fetch("/api/access/channels");
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

//   const fetchUserInfo = async (userId: string) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/access/users/${userId}`);
//       if (response.ok) {
//         const userData = await response.json();
//         setSelectedUserInfo(userData);
//         setPopupOpen(true);
//       } else {
//         showFeedback("Failed to fetch user details", "error");
//       }
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//       showFeedback("Error fetching user details", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log("Fetching data...");
//     // Clear cache on reload
//     Object.keys(accessCache).forEach((key) => delete accessCache[key]);
//     fetchUsers();
//     fetchChannels();
//   }, [reloadUsers]);

//   const handlePopupManageAccess = (userId: number) => {
//     setSelectedUsers([userId.toString()]);
//     const user = users.find((u) => u.id === userId.toString());
//     if (user) {
//       const rawRole = getRawRoleValue(user.role);
//       setSelectedRole(rawRole);
//     } else {
//       setSelectedRole("STANDARD_USER");
//     }
//     setAccessForm({ channelId: "", grantedBy: "" });
//     setOpenDialog(true);
//     setPopupOpen(false); // Close popup
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
//         const errorText = await response.text();
//         try {
//           const errorJson = JSON.parse(errorText);
//           throw new Error(
//             `Failed to deactivate users: ${
//               errorJson.error || errorJson.message || errorText
//             }`
//           );
//         } catch (parseError) {
//           throw new Error(`Failed to deactivate users: ${errorText}`);
//         }
//       }

//       const result = await response.json();
//       console.log("Users deactivated successfully:", result);

//       setReloadUsers((prev) => !prev);
//       setSelected([]);
//       setSelectedUsers([]);
//       closeConfirmationDialog();

//       showFeedback(
//         `Successfully deactivated ${selectedUsers.length} user(s)`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Error deactivating users:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";
//       showFeedback(`Failed to deactivate users: ${errorMessage}`, "error");
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

//       setReloadUsers((prev) => !prev);
//       setSelected([]);
//       setSelectedUsers([]);
//       closeConfirmationDialog();

//       showFeedback(
//         `Successfully activated ${selectedUsers.length} user(s)`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Error activating users:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";
//       showFeedback(`Failed to activate users: ${errorMessage}`, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openConfirmationDialog = (action: "activate" | "deactivate") => {
//     setConfirmDialogAction(action);
//     setConfirmDialogOpen(true);
//   };

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

//   const handleEditClick = (row: RowType) => {
//     setEditingRow(row);
//     setSelectedUsers([row.id]);
//     const rawRole = getRawRoleValue(row.role);
//     setSelectedRole(rawRole);
//     setAccessForm({ channelId: "", grantedBy: "" });
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
//         setSelectedRole("STANDARD_USER");
//       }
//     }
//     setAccessForm({ channelId: "", grantedBy: "" });
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setEditingRow(null);
//     setSelectedUsers([]);
//     setCurrentTab(0);
//     setAccessForm({ channelId: "", grantedBy: "" });
//   };

//   const handleClosePopup = () => {
//     setPopupOpen(false);
//     setSelectedUserInfo(null);
//   };

//   const handleSaveChanges = async () => {
//     if (selectedUsers.length === 0) return;

//     try {
//       setLoading(true);
//       const session = await getSession();

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

//       if (currentTab === 2) {
//         console.log(
//           `${accessAction === "grant" ? "Granting" : "Removing"} access for users:`,
//           selectedUsers,
//           accessForm
//         );
//         const accessData = {
//           userIds: selectedUsers,
//           channelId: accessForm.channelId
//             ? parseInt(accessForm.channelId)
//             : null,
//           grantedBy: session?.user?.id ? parseInt(session.user.id) : null,
//         };

//         const endpoint =
//           accessAction === "grant"
//             ? "/api/access/user_access"
//             : "/api/access/remove_access";

//         const response = await fetch(endpoint, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(accessData),
//         });

//         const result = await response.json();

//         if (!response.ok) {
//           if (response.status === 409 || response.status === 404) {
//             showFeedback(result.message, "warning");
//           } else {
//             throw new Error(
//               result.error ||
//                 `Failed to ${
//                   accessAction === "grant" ? "grant" : "remove"
//                 } access: ${response.statusText}`
//             );
//           }
//         } else {
//           showFeedback(result.message, "success");
//         }
//       }

//       setReloadUsers((prev) => !prev);
//       setSelected([]);
//     } catch (error) {
//       console.error("Error updating:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";
//       showFeedback(errorMessage, "error");
//     } finally {
//       setLoading(false);
//       handleCloseDialog();
//     }
//   };

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setCurrentTab(newValue);
//   };

//   const handleAccessFormChange = (field: string, value: string) => {
//     setAccessForm((prev) => ({ ...prev, [field]: value }));
//   };

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

//   const handleCheckboxClick = (
//     event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
//     id: string
//   ) => {
//     event.stopPropagation();
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

//   const handleRowClick = (row: RowType) => {
//     fetchUserInfo(row.id);
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
//         <Box sx={{ flexGrow: 1 }} />
//         <Button
//           variant="contained"
//           color="primary"
//           size="small"
//           disabled={selected.length === 0}
//           onClick={handleManageAccess}
//           sx={{
//             height: "32px", // Match TextField and Select height
//             minWidth: "120px", // Optional: ensure readable width
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           Manage Access
//         </Button>
//       </SearchContainer>

//       <Paper>
//         <EnhancedTableToolbar numSelected={selected.length} />
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
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <CircularProgress />
//                   </TableCell>
//                 </TableRow>
//               ) : users.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <Typography>No users found</Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 stableSort(filteredUsers, getComparator(order, orderBy))
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row: RowType, index: number) => {
//                     const isItemSelected = isSelected(row.id);
//                     const labelId = `enhanced-table-checkbox-${index}`;

//                     return (
//                       <TableRow
//                         hover
//                         role="checkbox"
//                         aria-checked={isItemSelected}
//                         tabIndex={-1}
//                         key={`${row.id}-${index}`}
//                         selected={isItemSelected}
//                         onClick={() => handleRowClick(row)}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <TableCell padding="checkbox">
//                           <Checkbox
//                             checked={isItemSelected}
//                             inputProps={{ "aria-labelledby": labelId }}
//                             onClick={(event) => handleCheckboxClick(event, row.id)}
//                           />
//                         </TableCell>
//                         <TableCell component="th" id={labelId} scope="row">
//                           <Customer>
//                             <Box>
//                               <Typography variant="body1">{row.firstname}</Typography>
//                             </Box>
//                           </Customer>
//                         </TableCell>
//                         <TableCell align="left">
//                           <Typography variant="body1">{row.lastname}</Typography>
//                         </TableCell>
//                         <TableCell align="left">
//                           <Typography variant="body1">{row.usertype}</Typography>
//                         </TableCell>
//                         <TableCell align="left">
//                           <Typography variant="body1">{row.role}</Typography>
//                         </TableCell>
//                         <TableCell align="left">
//                           <Typography variant="body1">{row.status}</Typography>
//                         </TableCell>
//                         <TableCell align="left">
//                           <Typography variant="body1">{row.channelCount ?? 0}</Typography>
//                         </TableCell>
//                         <TableCell align="right">
//                           <IconButton
//                             color="primary"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleEditClick(row);
//                             }}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//               )}
//               {!loading && users.length > 0 && emptyRows > 0 && (
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

//       <UserInfoPopup
//         open={popupOpen}
//         user={selectedUserInfo}
//         onClose={handleClosePopup}
//         onManageAccess={handlePopupManageAccess}
//       />

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
//             <Tab label="Resource Access" />
//           </Tabs>

//           {currentTab === 0 && (
//             <Box sx={{ mt: 2 }}>
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

// {currentTab === 2 && (
//             <Box sx={{ mt: 2 }}>
//               <Typography variant="body1" gutterBottom>
//                 Manage resource access:
//               </Typography>
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
//                     <em>Select a channel</em>
//                   </MenuItem>
//                   {channels.map((channel) => (
//                     <MenuItem key={channel.id} value={channel.id}>
//                       {channel.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => setAccessAction("grant")}
//                   disabled={!accessForm.channelId}
//                 >
//                   Grant Access
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={() => setAccessAction("remove")}
//                   disabled={!accessForm.channelId}
//                 >
//                   Remove Access
//                 </Button>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button
//             onClick={handleSaveChanges}
//             color="primary"
//             disabled={currentTab === 2 && !accessForm.channelId}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

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

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
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


// function EnhancedTable() {
//   const [order, setOrder] = React.useState<"desc" | "asc">("asc");
//   const [orderBy, setOrderBy] = React.useState("customer");
//   const [selected, setSelected] = React.useState<Array<string>>([]);
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(6);
//   const [openDialog, setOpenDialog] = React.useState(false);
//   const [editingRow, setEditingRow] = React.useState<RowType | null>(null);
//   const [selectedUsers, setSelectedUsers] = React.useState<Array<string>>([]);
//   const [currentTab, setCurrentTab] = React.useState(0);
//   const [instrumentAccess, setInstrumentAccess] = React.useState("");
//   const [searchTerm, setSearchTerm] = React.useState("");
//   const [userTypeFilter, setUserTypeFilter] = React.useState("All");
//   const [selectedRole, setSelectedRole] = React.useState("");
//   const [users, setUsers] = React.useState<Array<RowType>>([]);
//   const [loading, setLoading] = React.useState(true);
//   const [reloadUsers, setReloadUsers] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success" as "success" | "error" | "info" | "warning",
//   });
//   const [confirmDialogOpen, setConfirmDialogOpen] = React.useState(false);
//   const [confirmDialogAction, setConfirmDialogAction] = React.useState<
//     "activate" | "deactivate"
//   >("deactivate");
//   const [accessForm, setAccessForm] = React.useState({
//     channelId: "",
//     grantedBy: "",
//   });
//   const [channels, setChannels] = React.useState<
//     Array<{ id: number; name: string }>
//   >([]);
//   const [popupOpen, setPopupOpen] = React.useState(false);
//   const [selectedUserInfo, setSelectedUserInfo] =
//     React.useState<UserInfo | null>(null);
//   // New states for independent button actions
//   const [grantClicked, setGrantClicked] = React.useState(false);
//   const [removeClicked, setRemoveClicked] = React.useState(false);

//   const handleCloseSnackbar = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };

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

//   // In-memory cache for access data
//   const accessCache: { [userId: string]: { channelCount: number } } = {};

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       console.log("Fetching users from /api/auth/users...");
//       const timestamp = new Date().getTime();
//       const response = await fetch(`/api/auth/users?_t=${timestamp}`, {
//         cache: "no-store",
//         headers: {
//           pragma: "no-cache",
//           "cache-control": "no-cache",
//         },
//       });

//       if (!response.ok) {
//         console.error("Failed to fetch users:", response.status, response.statusText);
//         showFeedback("Failed to load users", "error");
//         setUsers([]);
//         return;
//       }

//       const data = await response.json();
//       console.log("Users data received:", data);

//       if (!Array.isArray(data) || data.length === 0) {
//         console.warn("No users found");
//         showFeedback("No users found", "info");
//         setUsers([]);
//         return;
//       }

//       interface UserApiResponse {
//         id: string;
//         firstName: string;
//         lastName: string;
//         organisation?: string;
//         userRole: string;
//         status: string;
//       }

//       interface MappedUser extends RowType {
//         id: string;
//         firstname: string;
//         lastname: string;
//         usertype: string;
//         role: string;
//         status: string;
//         channelCount?: number;
//       }

//       const mappedUsers: MappedUser[] = await Promise.all(
//         (data as UserApiResponse[]).map(async (user: UserApiResponse) => {
//           const baseUser = {
//             id: user.id,
//             firstname: user.firstName,
//             lastname: user.lastName,
//             usertype: user.organisation || "Standard",
//             role: formatRole(user.userRole),
//             status: formatStatus(user.status),
//           };

//           // Check cache
//           if (accessCache[user.id]) {
//             console.log(`Using cached access for user ${user.id}`);
//             return {
//               ...baseUser,
//               channelCount: accessCache[user.id].channelCount,
//             };
//           }

//           // Fetch access data
//           let channelCount = 0;
//           try {
//             console.log(`Fetching access for user ${user.id}...`);
//             const accessResponse = await fetch(`/api/access/users/${user.id}`);
//             if (accessResponse.ok) {
//               const userAccess = await accessResponse.json();
//               console.log(`Access data for user ${user.id}:`, userAccess);
//               channelCount = userAccess.access.filter((a: { channelId: number | null }) => a.channelId !== null).length;
//               accessCache[user.id] = { channelCount };
//             } else {
//               console.warn(`No access data for user ${user.id}:`, accessResponse.statusText);
//             }
//           } catch (error) {
//             console.error(`Error fetching access for user ${user.id}:`, error);
//           }

//           return {
//             ...baseUser,
//             channelCount,
//           };
//         })
//       );

//       console.log("Mapped users:", mappedUsers);
//       setUsers(mappedUsers);
//     } catch (error) {
//       console.error("Error in fetchUsers:", error);
//       showFeedback("Error loading users", "error");
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchChannels = async () => {
//     try {
//       const response = await fetch("/api/access/channels");
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

//   const fetchUserInfo = async (userId: string) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`/api/access/users/${userId}`);
//       if (response.ok) {
//         const userData = await response.json();
//         setSelectedUserInfo(userData);
//         setPopupOpen(true);
//       } else {
//         showFeedback("Failed to fetch user details", "error");
//       }
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//       showFeedback("Error fetching user details", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     console.log("Fetching data...");
//     // Clear cache on reload
//     Object.keys(accessCache).forEach((key) => delete accessCache[key]);
//     fetchUsers();
//     fetchChannels();
//   }, [reloadUsers]);

//   const handlePopupManageAccess = (userId: number) => {
//     setSelectedUsers([userId.toString()]);
//     const user = users.find((u) => u.id === userId.toString());
//     if (user) {
//       const rawRole = getRawRoleValue(user.role);
//       setSelectedRole(rawRole);
//     } else {
//       setSelectedRole("STANDARD_USER");
//     }
//     setAccessForm({ channelId: "", grantedBy: "" });
//     setOpenDialog(true);
//     setPopupOpen(false); // Close popup
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
//         const errorText = await response.text();
//         try {
//           const errorJson = JSON.parse(errorText);
//           throw new Error(
//             `Failed to deactivate users: ${
//               errorJson.error || errorJson.message || errorText
//             }`
//           );
//         } catch (parseError) {
//           throw new Error(`Failed to deactivate users: ${errorText}`);
//         }
//       }

//       const result = await response.json();
//       console.log("Users deactivated successfully:", result);

//       setReloadUsers((prev) => !prev);
//       setSelected([]);
//       setSelectedUsers([]);
//       closeConfirmationDialog();

//       showFeedback(
//         `Successfully deactivated ${selectedUsers.length} user(s)`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Error deactivating users:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";
//       showFeedback(`Failed to deactivate users: ${errorMessage}`, "error");
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

//       setReloadUsers((prev) => !prev);
//       setSelected([]);
//       setSelectedUsers([]);
//       closeConfirmationDialog();

//       showFeedback(
//         `Successfully activated ${selectedUsers.length} user(s)`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Error activating users:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";
//       showFeedback(`Failed to activate users: ${errorMessage}`, "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openConfirmationDialog = (action: "activate" | "deactivate") => {
//     setConfirmDialogAction(action);
//     setConfirmDialogOpen(true);
//   };

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

//   const handleEditClick = (row: RowType) => {
//     setEditingRow(row);
//     setSelectedUsers([row.id]);
//     const rawRole = getRawRoleValue(row.role);
//     setSelectedRole(rawRole);
//     setAccessForm({ channelId: "", grantedBy: "" });
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
//         setSelectedRole("STANDARD_USER");
//       }
//     }
//     setAccessForm({ channelId: "", grantedBy: "" });
//     setGrantClicked(false); // Reset
//     setRemoveClicked(false); // Reset
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setEditingRow(null);
//     setSelectedUsers([]);
//     setCurrentTab(0);
//     setAccessForm({ channelId: "", grantedBy: "" });
//     setGrantClicked(false); // Reset
//     setRemoveClicked(false); // Reset
//   };

//   const handleClosePopup = () => {
//     setPopupOpen(false);
//     setSelectedUserInfo(null);
//   };

//   const handleSaveChanges = async () => {
//     if (selectedUsers.length === 0) {
//       console.warn("No users selected for save action");
//       showFeedback("Please select at least one user", "warning");
//       return;
//     }

//     try {
//       setLoading(true);
//       const session = await getSession();
//       console.log("Session data:", session);

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

//       if (currentTab === 2) {
//         console.log("Access action requested:", { grantClicked, removeClicked, selectedUsers, accessForm });

//         if (!accessForm.channelId) {
//           console.warn("No channel selected for access action");
//           showFeedback("Please select a channel", "warning");
//           return;
//         }

//         if (!session?.user?.id) {
//           console.warn("No user ID in session for grantedBy");
//           showFeedback("Authentication required", "error");
//           return;
//         }

//         if (!grantClicked && !removeClicked) {
//           console.warn("No access action selected");
//           showFeedback("Please click Grant Access or Remove Access", "warning");
//           return;
//         }

//         const accessData = {
//           userIds: selectedUsers,
//           channelId: parseInt(accessForm.channelId),
//           grantedBy: parseInt(session.user.id),
//         };

//         console.log("Sending access data:", accessData);

//         const endpoint = grantClicked
//           ? "/api/access/user_access"
//           : "/api/access/remove_access";

//         const response = await fetch(endpoint, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(accessData),
//         });

//         const result = await response.json();
//         console.log("API response:", result);

//         if (!response.ok) {
//           if (response.status === 409 || response.status === 404) {
//             showFeedback(result.message || "Action not completed", "warning");
//           } else {
//             throw new Error(
//               result.error ||
//                 `Failed to ${grantClicked ? "grant" : "remove"} access: ${response.statusText}`
//             );
//           }
//         } else {
//           showFeedback(result.message, "success");
//         }
//       }

//       setReloadUsers((prev) => !prev);
//       setSelected([]);
//       setGrantClicked(false); // Reset
//       setRemoveClicked(false); // Reset
//     } catch (error) {
//       console.error("Error in handleSaveChanges:", error);
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";
//       showFeedback(errorMessage, "error");
//     } finally {
//       setLoading(false);
//       handleCloseDialog();
//     }
//   };

//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setCurrentTab(newValue);
//     setGrantClicked(false); // Reset when changing tabs
//     setRemoveClicked(false); // Reset when changing tabs
//   };

//   const handleAccessFormChange = (field: string, value: string) => {
//     console.log("Access form change:", { field, value });
//     setAccessForm((prev) => ({ ...prev, [field]: value }));
//   };

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

//   const handleCheckboxClick = (
//     event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
//     id: string
//   ) => {
//     event.stopPropagation();
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

//   const handleRowClick = (row: RowType) => {
//     fetchUserInfo(row.id);
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
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const isSelected = (id: string) => selected.indexOf(id) !== -1;

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
//     rowsPerPage - Math.min(rowsPerPage, filteredUsers.length - page * rowsPerPage);

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
//         <Box sx={{ flexGrow: 1 }} />
//         <Button
//           variant="contained"
//           color="primary"
//           size="small"
//           disabled={selected.length === 0}
//           onClick={handleManageAccess}
//           sx={{
//             height: "32px",
//             minWidth: "120px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           Manage Access
//         </Button>
//       </SearchContainer>

//       <Paper>
//         <EnhancedTableToolbar numSelected={selected.length} />
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
//               rowCount={filteredUsers.length}
//             />
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <CircularProgress />
//                   </TableCell>
//                 </TableRow>
//               ) : filteredUsers.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center">
//                     <Typography>No users found</Typography>
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 stableSort(filteredUsers, getComparator(order, orderBy))
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row: RowType, index: number) => {
//                     const isItemSelected = isSelected(row.id);
//                     const labelId = `enhanced-table-checkbox-${index}`;

//                     return (
//                       <TableRow
//                         hover
//                         role="checkbox"
//                         aria-checked={isItemSelected}
//                         tabIndex={-1}
//                         key={`${row.id}-${index}`}
//                         selected={isItemSelected}
//                         onClick={() => handleRowClick(row)}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <TableCell padding="checkbox">
//                           <Checkbox
//                             checked={isItemSelected}
//                             inputProps={{ "aria-labelledby": labelId }}
//                             onClick={(event) => handleCheckboxClick(event, row.id)}
//                           />
//                         </TableCell>
//                         <TableCell component="th" id={labelId} scope="row">
//                           <Customer>
//                             <Box>
//                               <Typography variant="body1">{row.firstname}</Typography>
//                             </Box>
//                           </Customer>
//                         </TableCell>
//                         <TableCell align="left">
//                           <Typography variant="body1">{row.lastname}</Typography>
//                         </TableCell>
//                         <TableCell align="left">
//                           <Typography variant="body1">{row.usertype}</Typography>
//                         </TableCell>
//                         <TableCell align="left">
//                           <Typography variant="body1">{row.role}</Typography>
//                         </TableCell>
//                         <TableCell align="left">
//                           <Typography variant="body1">{row.status}</Typography>
//                         </TableCell>
//                         <TableCell align="left">
//                           <Typography variant="body1">{row.channelCount ?? 0}</Typography>
//                         </TableCell>
//                         <TableCell align="right">
//                           <IconButton
//                             color="primary"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleEditClick(row);
//                             }}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//               )}
//               {!loading && filteredUsers.length > 0 && emptyRows > 0 && (
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

//       <UserInfoPopup
//         open={popupOpen}
//         user={selectedUserInfo}
//         onClose={handleClosePopup}
//         onManageAccess={handlePopupManageAccess}
//       />

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
//             <Tab label="Resource Access" />
//           </Tabs>

//           {currentTab === 0 && (
//             <Box sx={{ mt: 2 }}>
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

//           {currentTab === 2 && (
//             <Box sx={{ mt: 2 }}>
//               <Typography variant="body1" gutterBottom>
//                 Manage resource access:
//               </Typography>
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
//                     <em>Select a channel</em>
//                   </MenuItem>
//                   {channels.map((channel) => (
//                     <MenuItem key={channel.id} value={channel.id}>
//                       {channel.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//               <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => {
//                     console.log("Grant Access clicked");
//                     setGrantClicked(true);
//                     setRemoveClicked(false);
//                   }}
//                   disabled={!accessForm.channelId}
//                 >
//                   Grant Access
//                 </Button>
//                 <Button
//                   variant="contained"
//                   color="secondary"
//                   onClick={() => {
//                     console.log("Remove Access clicked");
//                     setRemoveClicked(true);
//                     setGrantClicked(false);
//                   }}
//                   disabled={!accessForm.channelId}
//                 >
//                   Remove Access
//                 </Button>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog}>Cancel</Button>
//           <Button
//             onClick={() => {
//               console.log("Save clicked, current state:", { currentTab, grantClicked, removeClicked, accessForm });
//               handleSaveChanges();
//             }}
//             color="primary"
//             disabled={currentTab === 2 && !accessForm.channelId}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

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

//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: "100%" }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// }

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
    channelId: "",
    grantedBy: "",
  });
  const [channels, setChannels] = React.useState<
    Array<{ id: number; name: string }>
  >([]);
  const [popupOpen, setPopupOpen] = React.useState(false);
  const [selectedUserInfo, setSelectedUserInfo] =
    React.useState<UserInfo | null>(null);

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

  // In-memory cache for access data
  const accessCache: { [userId: string]: { channelCount: number } } = {};

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users from /api/auth/users...");
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/auth/users?_t=${timestamp}`, {
        cache: "no-store",
        headers: {
          pragma: "no-cache",
          "cache-control": "no-cache",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch users:", response.status, response.statusText);
        showFeedback("Failed to load users", "error");
        setUsers([]);
        return;
      }

      const data = await response.json();
      console.log("Users data received:", data);

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("No users found");
        showFeedback("No users found", "info");
        setUsers([]);
        return;
      }

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
        channelCount?: number;
      }

      const mappedUsers: MappedUser[] = await Promise.all(
        (data as UserApiResponse[]).map(async (user: UserApiResponse) => {
          const baseUser = {
            id: user.id,
            firstname: user.firstName,
            lastname: user.lastName,
            usertype: user.organisation || "Standard",
            role: formatRole(user.userRole),
            status: formatStatus(user.status),
          };

          // Check cache
          if (accessCache[user.id]) {
            console.log(`Using cached access for user ${user.id}`);
            return {
              ...baseUser,
              channelCount: accessCache[user.id].channelCount,
            };
          }

          // Fetch access data
          let channelCount = 0;
          try {
            console.log(`Fetching access for user ${user.id}...`);
            const accessResponse = await fetch(`/api/access/users/${user.id}`);
            if (accessResponse.ok) {
              const userAccess = await accessResponse.json();
              console.log(`Access data for user ${user.id}:`, userAccess);
              channelCount = userAccess.access.filter((a: { channelId: number | null }) => a.channelId !== null).length;
              accessCache[user.id] = { channelCount };
            } else {
              console.warn(`No access data for user ${user.id}:`, accessResponse.statusText);
            }
          } catch (error) {
            console.error(`Error fetching access for user ${user.id}:`, error);
          }

          return {
            ...baseUser,
            channelCount,
          };
        })
      );

      console.log("Mapped users:", mappedUsers);
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      showFeedback("Error loading users", "error");
      setUsers([]);
    } finally {
      setLoading(false);
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
        showFeedback("Failed to fetch channels", "error");
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
      showFeedback("Error fetching channels", "error");
    }
  };

  const fetchUserInfo = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/access/users/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setSelectedUserInfo(userData);
        setPopupOpen(true);
      } else {
        showFeedback("Failed to fetch user details", "error");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      showFeedback("Error fetching user details", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching data...");
    // Clear cache on reload
    Object.keys(accessCache).forEach((key) => delete accessCache[key]);
    fetchUsers();
    fetchChannels();
  }, [reloadUsers]);

  const handlePopupManageAccess = (userId: number) => {
    setSelectedUsers([userId.toString()]);
    const user = users.find((u) => u.id === userId.toString());
    if (user) {
      const rawRole = getRawRoleValue(user.role);
      setSelectedRole(rawRole);
    } else {
      setSelectedRole("STANDARD_USER");
    }
    setAccessForm({ channelId: "", grantedBy: "" });
    setOpenDialog(true);
    setPopupOpen(false); // Close popup
  };

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
    setAccessForm({ channelId: "", grantedBy: "" });
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
    setAccessForm({ channelId: "", grantedBy: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRow(null);
    setSelectedUsers([]);
    setCurrentTab(0);
    setAccessForm({ channelId: "", grantedBy: "" });
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedUserInfo(null);
  };

  const handleGrantAccess = async () => {
    if (selectedUsers.length === 0) {
      console.warn("No users selected for grant access");
      showFeedback("Please select at least one user", "warning");
      return;
    }

    if (!accessForm.channelId) {
      console.warn("No channel selected for grant access");
      showFeedback("Please select a channel", "warning");
      return;
    }

    try {
      setLoading(true);
      const session = await getSession();
      console.log("Session data for grant:", session);

      if (!session?.user?.id) {
        console.warn("No user ID in session for grantedBy");
        showFeedback("Authentication required", "error");
        return;
      }

      const accessData = {
        userIds: selectedUsers,
        channelId: parseInt(accessForm.channelId),
        grantedBy: parseInt(session.user.id),
      };

      console.log("Sending grant access data:", accessData);

      const response = await fetch("/api/access/user_access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accessData),
      });

      const result = await response.json();
      console.log("Grant access response:", result);

      if (!response.ok) {
        if (response.status === 409 || response.status === 404) {
          showFeedback(result.message || "Action not completed", "warning");
        } else {
          throw new Error(
            result.error || `Failed to grant access: ${response.statusText}`
          );
        }
      } else {
        showFeedback(result.message, "success");
      }

      setReloadUsers((prev) => !prev);
      setSelected([]);
    } catch (error) {
      console.error("Error granting access:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      showFeedback(errorMessage, "error");
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleRemoveAccess = async () => {
    if (selectedUsers.length === 0) {
      console.warn("No users selected for remove access");
      showFeedback("Please select at least one user", "warning");
      return;
    }

    if (!accessForm.channelId) {
      console.warn("No channel selected for remove access");
      showFeedback("Please select a channel", "warning");
      return;
    }

    try {
      setLoading(true);
      const session = await getSession();
      console.log("Session data for remove:", session);

      if (!session?.user?.id) {
        console.warn("No user ID in session for grantedBy");
        showFeedback("Authentication required", "error");
        return;
      }

      const accessData = {
        userIds: selectedUsers,
        channelId: parseInt(accessForm.channelId),
        grantedBy: parseInt(session.user.id),
      };

      console.log("Sending remove access data:", accessData);

      const response = await fetch("/api/access/remove_access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accessData),
      });

      const result = await response.json();
      console.log("Remove access response:", result);

      if (!response.ok) {
        if (response.status === 409 || response.status === 404) {
          showFeedback(result.message || "Action not completed", "warning");
        } else {
          throw new Error(
            result.error || `Failed to remove access: ${response.statusText}`
          );
        }
      } else {
        showFeedback(result.message, "success");
      }

      setReloadUsers((prev) => !prev);
      setSelected([]);
    } catch (error) {
      console.error("Error removing access:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      showFeedback(errorMessage, "error");
    } finally {
      setLoading(false);
      handleCloseDialog();
    }
  };

  const handleSaveChanges = async () => {
    if (selectedUsers.length === 0) {
      console.warn("No users selected for save action");
      showFeedback("Please select at least one user", "warning");
      return;
    }

    try {
      setLoading(true);
      const session = await getSession();
      console.log("Session data:", session);

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
        console.log("No save action in Resource Access tab");
        showFeedback("Please use Grant Access or Remove Access buttons", "warning");
        return;
      }

      setReloadUsers((prev) => !prev);
      setSelected([]);
    } catch (error) {
      console.error("Error in handleSaveChanges:", error);
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
    console.log("Access form change:", { field, value });
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

  const handleCheckboxClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    event.stopPropagation();
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

  const handleRowClick = (row: RowType) => {
    fetchUserInfo(row.id);
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
    rowsPerPage - Math.min(rowsPerPage, filteredUsers.length - page * rowsPerPage);

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
          sx={{
            height: "32px",
            minWidth: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
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
              rowCount={filteredUsers.length}
            />
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography>No users found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                stableSort(filteredUsers, getComparator(order, orderBy))
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
                        onClick={() => handleRowClick(row)}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ "aria-labelledby": labelId }}
                            onClick={(event) => handleCheckboxClick(event, row.id)}
                          />
                        </TableCell>
                        <TableCell component="th" id={labelId} scope="row">
                          <Customer>
                            <Box>
                              <Typography variant="body1">{row.firstname}</Typography>
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
                        <TableCell align="left">
                          <Typography variant="body1">{row.channelCount ?? 0}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(row);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
              {!loading && filteredUsers.length > 0 && emptyRows > 0 && (
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

      <UserInfoPopup
        open={popupOpen}
        user={selectedUserInfo}
        onClose={handleClosePopup}
        onManageAccess={handlePopupManageAccess}
      />

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
                Manage resource access:
              </Typography>
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
                    <em>Select a channel</em>
                  </MenuItem>
                  {channels.map((channel) => (
                    <MenuItem key={channel.id} value={channel.id}>
                      {channel.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGrantAccess}
                  disabled={!accessForm.channelId || selectedUsers.length === 0}
                >
                  Grant Access
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleRemoveAccess}
                  disabled={!accessForm.channelId || selectedUsers.length === 0}
                >
                  Remove Access
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSaveChanges}
            color="primary"
            disabled={currentTab === 2 || (currentTab === 0 && !selectedRole)}
          >
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




