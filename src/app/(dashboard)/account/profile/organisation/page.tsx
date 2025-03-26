"use client";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import PasswordIcon from "@mui/icons-material/Password";
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import {
  Avatar as MuiAvatar,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
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

//calculate profile completion
const OrganisationCompletion = () => {
  const loadOrganisationData = () => {
    const savedData = localStorage.getItem("organisationInfo");
    return savedData
      ? JSON.parse(savedData)
      : {
          organisation: "",
          organisationRole: "",
          organisationEmail: "",
          organisationPhoneNumber: "",
          organisationAddressLine1: "",
          organisationAddressLine2: "",
          organisationCity: "",
          organisationCounty: "",
          organisationPostcode: "",
        };
  };

  const [orgData, setOrgData] = useState(loadOrganisationData());

  useEffect(() => {
    const handleStorageChange = () => {
      setOrgData(loadOrganisationData());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const requiredFields = [
    "organisation",
    "organisationRole",
    "organisationEmail",
    "organisationPhoneNumber",
    "organisationAddressLine1",
    "organisationCity",
    "organisationCounty",
    "organisationPostcode",
  ];
  
  const filledFields = requiredFields.filter((field) => {
    const value = orgData[field];
    return value && typeof value === "string" && value.trim() !== "";
  }).length;
  
  const totalFields = requiredFields.length;
  const completionPercentage = Math.round((filledFields / totalFields) * 100);
  

  if (completionPercentage === 100) return null;

  return (
    <Card>
      <CardContent
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h6" color="primary">
            Complete Your Organisation Profile ({completionPercentage}%)
          </Typography>
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

  const formatRole = (role) => {
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

          <NextLink href="/auth/reset-password" passHref>
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
  const loadSavedData = () => {
    const savedData = localStorage.getItem("organisationInfo");
    return savedData
      ? JSON.parse(savedData)
      : {
          organisation: "",
          organisationRole: "",
          organisationEmail: "",
          organisationPhoneNumber: "",
          organisationAddressLine1: "",
          organisationAddressLine2: "",
          organisationCity: "",
          organisationCounty: "",
          organisationPostcode: "",
        };
  };

  const [formData, setFormData] = useState(loadSavedData);
  const [lastSavedData, setLastSavedData] = useState(loadSavedData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrganisationData = async () => {
      try {
        const response = await fetch(
          "/api/auth/getOrganisationProfile?userId=1"
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    localStorage.setItem("organisationInfo", JSON.stringify(updatedData));
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      console.log(
        "Saving Organisation Data:",
        JSON.stringify({ userId: 1, ...formData })
      );

      const response = await fetch("/api/auth/updateOrganisationProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1, ...formData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to save changes: ${errorData.message || response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Save Successful:", data);
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
    if (lastSavedData) {
      setFormData(lastSavedData);
      localStorage.setItem("organisationInfo", JSON.stringify(lastSavedData));
    }
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


