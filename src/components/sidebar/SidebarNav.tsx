import React from "react";
import styled from "@emotion/styled";
import { List } from "@mui/material";
import SidebarNavSection from "./SidebarNavSection";
import { SidebarItemsType } from "@/types/sidebar";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.sidebar.background};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  flex-grow: 1;
`;

const Items = styled.div`
  padding-top: ${(props) => props.theme.spacing(2.5)};
  padding-bottom: ${(props) => props.theme.spacing(2.5)};
`;

interface SidebarNavProps {
  items: {
    title: string;
    pages: SidebarItemsType[];
  }[];
}

const SidebarNav = ({ items }: SidebarNavProps) => {
  console.log("Sidebar Items passed to SidebarNav: ", items); // Log passed items

  return (
    <Wrapper>
      <List disablePadding>
        <Items>
          {items &&
            items.map((item) => (
              <SidebarNavSection
                component="div"
                key={item.title}
                pages={item.pages}
                title={item.title}
              />
            ))}
        </Items>
      </List>
    </Wrapper>
  );
};

export default SidebarNav;
