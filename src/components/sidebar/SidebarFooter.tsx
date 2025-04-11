import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

import { Badge, Grid2 as Grid, Avatar, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

import useAuth from "@/hooks/useAuth";

const Footer = styled.div`
  background-color: ${(props) =>
    props.theme.sidebar.footer.background} !important;
  padding: ${(props) => props.theme.spacing(2.75)}
    ${(props) => props.theme.spacing(4)};
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
  const { firstName, lastName, session } = useAuth();

  const [avatarSrc, setAvatarSrc] = useState<string>("/static/img/avatars/avatar-1.jpg");

  const loadAvatar = () => {
    const storedData = typeof window !== "undefined" ? localStorage.getItem("personalInfo") : null;
    if (storedData) {
      const parsed = JSON.parse(storedData);
      if (parsed.avatar) {
        setAvatarSrc(parsed.avatar);
        return;
      }
    }
    setAvatarSrc(session?.user?.avatar || "/static/img/avatars/avatar-1.jpg");
  };

  useEffect(() => {
    loadAvatar(); // Load once when mounted

    const handleProfileUpdate = () => {
      loadAvatar(); // Reload when profile is updated
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [session]); // re-run if session changes too

  const displayName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : session?.user?.name || "Stephen Hilton";

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
