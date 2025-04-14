"use client";

import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

import { Badge, Grid2 as Grid, Avatar, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

import useAuth from "@/hooks/useAuth";

const Footer = styled.div`
  background-color: ${(props) => props.theme.sidebar.footer.background} !important;
  padding: ${(props) => props.theme.spacing(2.75)} ${(props) => props.theme.spacing(4)};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const FooterText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
`;

const FooterSubText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  font-size: 0.7rem;
  display: block;
  padding: 1px;
`;

const FooterBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)};
  span {
    background-color: ${() => green[400]};
    border: 2px solid ${(props) => props.theme.sidebar.footer.background};
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
`;

const SidebarFooter: React.FC = ({ ...rest }) => {
  const { session, status } = useAuth();

  const [avatarSrc, setAvatarSrc] = useState<string>("/static/img/avatars/avatar-1.jpg");
  const [displayName, setDisplayName] = useState<string>("User");

  useEffect(() => {
    if (status !== "authenticated") return; 

    const loadUserData = () => {
      if (typeof window === "undefined") return;

      const storedData = localStorage.getItem("personalInfo");
      const parsed = storedData ? JSON.parse(storedData) : null;

      if (parsed?.firstName && parsed?.lastName) {
        setDisplayName(`${parsed.firstName} ${parsed.lastName}`);
      } else if (session?.user?.firstName && session?.user?.lastName) {
        setDisplayName(`${session.user.firstName} ${session.user.lastName}`);
      } else {
        setDisplayName(session?.user?.name || "User");
      }

      if (parsed?.avatar) {
        setAvatarSrc(parsed.avatar);
      } else {
        setAvatarSrc(session?.user?.avatar || "/static/img/avatars/avatar-1.jpg");
      }
    };

    loadUserData(); 

    window.addEventListener("profileUpdated", loadUserData);

    return () => {
      window.removeEventListener("profileUpdated", loadUserData);
    };
  }, [session, status]); 

  return (
    <Footer {...rest}>
      <Grid container spacing={2}>
        <Grid>
          <FooterBadge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
          >
            <Avatar alt={displayName} src={avatarSrc} />
          </FooterBadge>
        </Grid>
        <Grid>
          <FooterText variant="body2">{displayName}</FooterText>
          <FooterSubText variant="caption">
            UCL School of Pharmacy
          </FooterSubText>
        </Grid>
      </Grid>
    </Footer>
  );
};

export default SidebarFooter;

