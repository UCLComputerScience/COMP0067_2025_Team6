import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";

import { green } from "@mui/material/colors";

import {
  Avatar,
  Badge,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
} from "@mui/material";
import { spacing } from "@mui/system";

import useAuth from "@/hooks/useAuth";

const IconButton = styled(MuiIconButton)`
  ${spacing};

  &:hover {
    background-color: transparent;
  }
`;

const AvatarBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)};
  span {
    background-color: ${() => green[400]};
    border: 2px solid ${(props) => props.theme.palette.background.paper};
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
`;

function NavbarUserDropdown() {
  const [anchorMenu, setAnchorMenu] = React.useState<any>(null);
  const router = useRouter();
  const { session, signOut } = useAuth();

  const toggleMenu = (event: React.SyntheticEvent) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/sign-in");
  };

  const handleProfile = () => {
    router.push("/account/profile");
    closeMenu();
  }

  const handleSettings = () => {
    router.push("/account/settings");
    closeMenu();
  }

  return (
    <React.Fragment>
      <Tooltip title="Account">
        <IconButton
          aria-owns={anchorMenu ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          p={0}
          mx={1}
        >
          <AvatarBadge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            {!!session?.user && <Avatar alt={session?.user.displayName} src={session?.user.avatar} />}
            {/* Demo data */}
            {!session?.user && (
              <Avatar
                alt="Lucy Lavender"
                src="/static/img/avatars/avatar-1.jpg"
              />
            )}
          </AvatarBadge>
        </IconButton> 
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleSettings}>Settings & Privacy</MenuItem>
        <Divider />
        <MenuItem onClick={closeMenu}>Help</MenuItem>
        <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default NavbarUserDropdown;
