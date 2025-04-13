"use client";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import PasswordIcon from "@mui/icons-material/Password";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; 
import styled from "@emotion/styled";
import NextLink from "next/link";
import {
  Avatar as MuiAvatar,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  LinearProgress,
  Divider as MuiDivider,
  Grid as MuiGrid,
  Typography as MuiTypography,
  TextField,
  Chip as MuiChip,
} from "@mui/material";
import { Grid } from "@mui/material";

const Breadcrumbs = styled(MuiBreadcrumbs)`
  margin-bottom: 16px;
`;
const Button = styled(MuiButton)`
  margin-right: 8px;
`;
const Card = styled(MuiCard)`
  margin-bottom: 24px;
`;
const Divider = styled(MuiDivider)`
  margin: 24px 0;
`;
const Typography = styled(MuiTypography)``;
const Avatar = styled(MuiAvatar)`
  width: 128px;
  height: 128px;
  margin-bottom: 16px;
`;

const OrganisationCompletion = () => {
  const { data: session } = useSession();
  const [completion, setCompletion] = useState<number>(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadOrganisation = async () => {
      try {
        const res = await fetch(`/api/auth/getOrganisationProfile?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Failed to load organisation profile");
        const { user } = await res.json();

        const fields = [
          user.organisation,
          user.organisationRole,
          user.organisationEmail,
          user.organisationPhoneNumber,
          user.organisationAddressLine1,
          user.organisationCity,
          user.organisationCounty,
          user.organisationPostcode,
        ];

        const filled = fields.filter((field: string) => field && field.trim() !== "").length;
        const percentage = Math.round((filled / fields.length) * 100);
        setCompletion(percentage);
      } catch (error) {
        console.error("Error loading organisation completion:", error);
      }
    };

    loadOrganisation();
  }, [session]);

  if (completion === 100) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h6" color="primary">
            Complete Your Organisation Profile ({completion}%)
          </Typography>
          <LinearProgress variant="determinate" value={completion} />
          <Typography variant="body2" color="textSecondary">
            Please update your organisation details to reach 100% completion.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProfileDetails = () => {
  const [user, setUser] = useState({ firstName: "", lastName: "", userRole: "STANDARD_USER" });
  const [avatar, setAvatar] = useState("/static/img/avatar.jpg");

  const formatRole = (role: string): string => {
    if (!role) return "User";
    return role
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const storedData = localStorage.getItem("personalInfo");
    if (storedData) {
      const data = JSON.parse(storedData);
      setUser({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        userRole: data.userRole || "STANDARD_USER",
      });
      setAvatar(data.avatar || "/static/img/avatar.jpg");
    }
  }, []);

  return (
    <Card>
      <CardContent
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar alt="User Profile" src={avatar} />
        <Typography variant="h5">
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" mb={2}>
          {formatRole(user.userRole)}
        </Typography>

        <Box width="100%" mt={2}>
          <NextLink href="/account/profile" passHref>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ display: "flex", justifyContent: "flex-start", gap: 1, py: 1.5 }}
            >
              <PersonIcon />
              Personal Information
            </Button>
          </NextLink>

          <NextLink href="/account/profile/organisation" passHref>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 1,
                py: 1.5,
                mt: 1,
              }}
            >
              <BusinessIcon />
              Organisation Information
            </Button>
          </NextLink>

          <NextLink href="/account/profile/changePassword" passHref>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ display: "flex", justifyContent: "flex-start", gap: 1, py: 1.5, mt: 1 }}
            >
              <PasswordIcon />
              Change Password
            </Button>
          </NextLink>
        </Box>
      </CardContent>
    </Card>
  );
};

const OrganisationInformation = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    organisation: "",
    organisationRole: "",
    organisationEmail: "",
    organisationPhoneNumber: "",
    organisationAddressLine1: "",
    organisationAddressLine2: "",
    organisationCity: "",
    organisationCounty: "",
    organisationPostcode: "",
  });
  const [lastSavedData, setLastSavedData] = useState(formData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchOrganisationData = async () => {
      try {
        const response = await fetch(
          `/api/auth/getOrganisationProfile?userId=${session.user.id}`
        );
        if (!response.ok)
          throw new Error("Failed to fetch organisation data");

        const data = await response.json();
        if (data.user) {
          const updatedData = { ...formData, ...data.user };
          setFormData(updatedData);
          setLastSavedData(updatedData);
          localStorage.setItem(
            "organisationInfo",
            JSON.stringify(updatedData)
          );
        }
      } catch (error) {
        console.error("Error fetching organisation data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganisationData();
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    localStorage.setItem("organisationInfo", JSON.stringify(updatedData));
  };

  const handleSaveChanges = async () => {
    if (!session?.user?.id) return;
  
    try {
      setIsLoading(true);
  
      const response = await fetch("/api/auth/updateOrganisationProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, ...formData }), 
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to save changes: ${errorData.message || response.statusText}`
        );
      }
  
      const data = await response.json();
      alert("Organisation information saved!"); 
      setLastSavedData(formData); 
      localStorage.setItem("organisationInfo", JSON.stringify(formData));
    } catch (error: any) {
      console.error("Error saving organisation information:", error);
      alert(`Error saving: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleCancel = () => {
    setFormData(lastSavedData);
    localStorage.setItem("organisationInfo", JSON.stringify(lastSavedData));
    alert("Changes discarded.");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Organisation Information</Typography>
        <Divider />

        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <>
            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Organisation Name"
                    name="organisation"
                    fullWidth
                    variant="outlined"
                    value={formData.organisation}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Role"
                    name="organisationRole"
                    fullWidth
                    variant="outlined"
                    value={formData.organisationRole}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Business Email"
                    name="organisationEmail"
                    fullWidth
                    variant="outlined"
                    value={formData.organisationEmail}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Business Phone Number"
                    name="organisationPhoneNumber"
                    fullWidth
                    variant="outlined"
                    value={formData.organisationPhoneNumber}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Business Address Line 1"
                    name="organisationAddressLine1"
                    fullWidth
                    variant="outlined"
                    value={formData.organisationAddressLine1}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Business Address Line 2"
                    name="organisationAddressLine2"
                    fullWidth
                    variant="outlined"
                    value={formData.organisationAddressLine2}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box mt={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="City"
                    name="organisationCity"
                    fullWidth
                    variant="outlined"
                    value={formData.organisationCity}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="County"
                    name="organisationCounty"
                    fullWidth
                    variant="outlined"
                    value={formData.organisationCounty}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Postcode"
                    name="organisationPostcode"
                    fullWidth
                    variant="outlined"
                    value={formData.organisationPostcode}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const OrganisationPage = () => {
  return (
    <>
      <Typography variant="h4">Organisation Profile</Typography>
      <Breadcrumbs>
        <NextLink href="/">Home</NextLink>
        <Typography color="textPrimary">Organisation Profile</Typography>
      </Breadcrumbs>
      <OrganisationCompletion />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" gap={3} mb={3}>
            <Box width="300px">
              <ProfileDetails />
            </Box>
            <Box flex={1} display="flex" flexDirection="column">
              <OrganisationInformation />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default OrganisationPage;

