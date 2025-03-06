"use client";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import React from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { useState, useEffect } from "react";
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

const ProfileCompletion = () => (
  <Card>
    <CardContent style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Box>
        <Typography variant="h6" color="primary">
          Complete Your Organisation Profile
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Please update your organisation details to keep your information current.
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

const ProfileDetails = () => (
  <Card>
    <CardContent style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Avatar alt="User Profile" src="/static/img/avatar.jpg" />
      <Typography variant="h5">Jerome Hansel</Typography>
      <Typography variant="subtitle1" color="textSecondary" mb={2}>
        Admin
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
            sx={{ display: "flex", justifyContent: "flex-start", gap: 1, py: 1.5, mt: 1 }}
          >
            <BusinessIcon />
            Organisation Information
          </Button>
        </NextLink>
      </Box>
    </CardContent>
  </Card>
);


const OrganisationInformation = () => {
  const loadSavedData = () => {
    const savedData = localStorage.getItem("organisationInfo");
    return savedData
      ? JSON.parse(savedData)
      : {
          organisationName: "",
          role: "",
          businessEmail: "",
          businessPhone: "",
          businessAddress1: "",
          businessAddress2: "",
          city: "",
          county: "",
          postcode: "",
        };
  };

  const [formData, setFormData] = useState(loadSavedData);
  const [lastSavedData, setLastSavedData] = useState(loadSavedData);

  useEffect(() => {
    localStorage.setItem("organisationInfo", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = () => {
    setLastSavedData(formData); 
    localStorage.setItem("organisationInfo", JSON.stringify(formData));
    alert("Profile information saved and will persist after leaving the page!");
  };

  const handleCancel = () => {
    setFormData(lastSavedData);
    alert("Changes discarded. Restored to last saved data.");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Organisation Information</Typography>
        <Divider />

        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Organisation Name"
                name="organisationName"
                fullWidth
                variant="outlined"
                value={formData.organisationName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Role"
                name="role"
                fullWidth
                variant="outlined"
                value={formData.role}
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
                name="businessEmail"
                fullWidth
                variant="outlined"
                value={formData.businessEmail}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Business Phone Number"
                name="businessPhone"
                fullWidth
                variant="outlined"
                value={formData.businessPhone}
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
                name="businessAddress1"
                fullWidth
                variant="outlined"
                value={formData.businessAddress1}
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
                name="businessAddress2"
                fullWidth
                variant="outlined"
                value={formData.businessAddress2}
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
                name="city"
                fullWidth
                variant="outlined"
                value={formData.city}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="County"
                name="county"
                fullWidth
                variant="outlined"
                value={formData.county}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Postcode"
                name="postcode"
                fullWidth
                variant="outlined"
                value={formData.postcode}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const OrganisationPage = () => {
  return (
    <>
      <Typography variant="h4">Profile</Typography>
      <Breadcrumbs>
        <NextLink href="/">Home</NextLink>
        <Typography color="textPrimary">Profile</Typography>
      </Breadcrumbs>
      <ProfileCompletion />
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
