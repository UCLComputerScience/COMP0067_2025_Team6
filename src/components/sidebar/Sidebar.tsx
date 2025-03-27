import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import { useSession } from "next-auth/react"; // Import useSession

import { green } from "@mui/material/colors";

import {
  Box,
  Chip,
  Drawer as MuiDrawer,
  ListItemButton,
  ListItemButtonProps,
} from "@mui/material";

import { SidebarItemsType } from "@/types/sidebar";

import Logo from "@/vendor/logo.svg";

import Footer from "./SidebarFooter";
import SidebarNav from "./SidebarNav";

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
    scrollbar-width: none;
  }
`;

const Brand = styled(ListItemButton)<
  ListItemButtonProps & { component?: typeof Link; href?: string }
>`
  font-size: ${(props) => props.theme.typography.h5.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightMedium};
  color: ${(props) => props.theme.sidebar.header.color};
  background-color: ${(props) => props.theme.sidebar.header.background};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(6)};
  padding-right: ${(props) => props.theme.spacing(6)};
  justify-content: center;
  cursor: pointer;
  flex-grow: 0;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }

  &:hover {
    background-color: ${(props) => props.theme.sidebar.header.background};
  }
`;

const BrandIcon = styled(Logo)`
  margin-right: ${(props) => props.theme.spacing(2)};
  color: ${(props) => props.theme.sidebar.header.brand.color};
  fill: ${(props) => props.theme.sidebar.header.brand.color};
  width: 32px;
  height: 32px;
`;

const BrandChip = styled(Chip)`
  background-color: ${green[700]};
  border-radius: 5px;
  color: ${(props) => props.theme.palette.common.white};
  font-size: 55%;
  height: 18px;
  margin-left: 2px;
  margin-top: -16px;
  padding: 3px 0;

  span {
    padding-left: ${(props) => props.theme.spacing(1.375)};
    padding-right: ${(props) => props.theme.spacing(1.375)};
  }
`;

export interface SidebarProps {
  PaperProps: {
    style: {
      width: number;
    };
  };
  variant?: "permanent" | "persistent" | "temporary";
  open?: boolean;
  onClose?: () => void;
  items: {
    title: string;
    pages: SidebarItemsType[];
  }[];
  showFooter?: boolean;
}

const Sidebar = ({ items, showFooter = true, ...rest }: SidebarProps) => {
  const { data: session } = useSession();
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    const filterItems = () => {
      let newFilteredItems = [...items]; // Start with all items

      if (session?.user?.userRole) {
        const userRole = session.user.userRole;
        console.log("Session User Role:", userRole); // Debugging log to see role

        if (userRole === "TEMPORARY_USER") {
          // TEMPORARY_USER should only see "User" and "Account" sections
          newFilteredItems = newFilteredItems.filter(
            (item) => item.title === "User" || item.title === "Account"
          );
          console.log("Filtered Items for TEMPORARY_USER:", newFilteredItems); // Log filtered items
        } else if (userRole === "ADMIN") {
          newFilteredItems = items; // Admin sees all items
        } else if (userRole === "SUPER_USER") {
          newFilteredItems = newFilteredItems.map((item) => {
            if (item.title === "Admin") {
              item.pages = item.pages.filter(
                (page) => page.title !== "Manage Access"
              );
            }
            return item;
          });
        } else if (userRole === "STANDARD_USER") {
          newFilteredItems = newFilteredItems.map((item) => {
            if (item.title === "Admin") {
              item.pages = item.pages.filter((page) => page.title === "Alerts");
            }
            return item;
          });
        }
      }

      // Log the final filtered items to ensure it's working
      console.log("Final Filtered Items:", newFilteredItems);

      // Set the filtered items state to trigger a re-render
      setFilteredItems(newFilteredItems);
    };

    filterItems();
  }, [session, items]); // Trigger re-filtering when session or items change

  return (
    <Drawer variant="permanent" {...rest}>
      <Brand component={Link} href="/">
        {/* <BrandIcon />{" "} */}
        <Box ml={1}>
          Hilton Labs
          {/* Mira <BrandChip label="PRO" /> */}
        </Box>
      </Brand>
      <SidebarNav items={filteredItems} />
      {!!showFooter && <Footer />}
    </Drawer>
  );
};

export default Sidebar;
