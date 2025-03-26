"use client";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import React from "react";
import { useState, useEffect } from "react";
import styled from "@emotion/styled";
// import withAuth from "@/lib/withAuth"; // Import the withAuth HOC
import NextLink from "next/link";
import {
  Avatar as MuiAvatar,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  // Grid as MuiGrid,
  Typography as MuiTypography,
  TextField,
  Chip as MuiChip,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
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
const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Typography = styled(MuiTypography)``;

const Avatar = styled(MuiAvatar)`
  width: 128px;
  height: 128px;
  margin-bottom: 16px;
`;

const Chip = styled(MuiChip)`
  margin: 4px;
`;

const ProfileCompletion = () => {
  const loadSavedData = () => {
    const savedData = localStorage.getItem("personalInfo");
    return savedData
      ? JSON.parse(savedData)
      : {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          address1: "",
          address2: "",
          city: "",
          county: "",
          postcode: "",
        };
  };

  const [profileData, setProfileData] = useState(loadSavedData);
  const [skills, setSkills] = useState<string[]>(() => {
    const savedSkills = localStorage.getItem("userSkills");
    return savedSkills ? JSON.parse(savedSkills) : [];
  });
  const [description, setDescription] = useState(() => {
    const savedDescription = localStorage.getItem("userDescription");
    return savedDescription || "";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setProfileData(loadSavedData());
      setSkills(JSON.parse(localStorage.getItem("userSkills") || "[]"));
      setDescription(localStorage.getItem("userDescription") || "");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const calculateCompletion = () => {
    const filledFields = Object.values(profileData).filter(
      (value) => value !== ""
    ).length;
    const totalFields = Object.keys(profileData).length;
    const skillsCompleted = skills.length > 0 ? 1 : 0;
    const descriptionCompleted = description.trim() !== "" ? 1 : 0;

    return Math.round(
      ((filledFields + skillsCompleted + descriptionCompleted) /
        (totalFields + 2)) *
        100
    );
  };

  const completionPercentage = calculateCompletion();

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
            Complete Your Profile ({completionPercentage}%)
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Please update your profile details to reach 100% completion.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProfileDetails = () => (
  <Card>
    <CardContent
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
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
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              gap: 1,
              py: 1.5,
            }}
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
      </Box>
    </CardContent>
  </Card>
);

const PersonalInformation = () => {
  const loadSavedData = () => {
    const savedData = localStorage.getItem("personalInfo");
    return savedData
      ? JSON.parse(savedData)
      : {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          address1: "",
          address2: "",
          city: "",
          county: "",
          postcode: "",
        };
  };

  const [formData, setFormData] = useState(loadSavedData);
  const [lastSavedData, setLastSavedData] = useState(loadSavedData);

  useEffect(() => {
    localStorage.setItem("personalInfo", JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = () => {
    setLastSavedData(formData);
    alert("Profile information saved!");
  };

  const handleCancel = () => {
    setFormData(lastSavedData);
    alert("Changes discarded.");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Personal Information</Typography>
        <Divider />

        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                name="firstName"
                fullWidth
                variant="outlined"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                name="lastName"
                fullWidth
                variant="outlined"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                fullWidth
                variant="outlined"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Address Line 1"
                name="address1"
                fullWidth
                variant="outlined"
                value={formData.address1}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Address Line 2"
                name="address2"
                fullWidth
                variant="outlined"
                value={formData.address2}
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
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

const Skills = () => {
  const loadSavedSkills = (): string[] => {
    const savedSkills = localStorage.getItem("userSkills");
    return savedSkills
      ? JSON.parse(savedSkills)
      : ["Pharmaceutical Science", "Chemistry"];
  };

  const [skills, setSkills] = useState<string[]>(loadSavedSkills);
  const [newSkill, setNewSkill] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("userSkills", JSON.stringify(skills));
  }, [skills]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToDelete)
    );
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Specialisation</Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <TextField
              value={newSkill}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewSkill(e.target.value)
              }
              placeholder="Add a skill"
              size="small"
              variant="outlined"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" flexWrap="wrap" gap={1}>
          {skills.map((skill: string, index: number) => (
            <Chip
              key={index}
              label={skill}
              color="primary"
              onDelete={() => handleDeleteSkill(skill)}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const Description = () => {
  const loadSavedDescription = () => {
    const savedDescription = localStorage.getItem("userDescription");
    return savedDescription ? savedDescription : "";
  };

  const [description, setDescription] = useState(loadSavedDescription);
  const [lastSavedDescription, setLastSavedDescription] =
    useState(loadSavedDescription);

  useEffect(() => {
    localStorage.setItem("userDescription", description);
  }, [description]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSaveChanges = () => {
    setLastSavedDescription(description);
    alert("Description saved!");
  };

  const handleCancel = () => {
    setDescription(lastSavedDescription);
    alert("Changes discarded. Restored last saved description.");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Description</Typography>
        <Divider />
        <TextField
          multiline
          rows={4}
          fullWidth
          placeholder="Enter description here"
          variant="outlined"
          value={description}
          onChange={handleDescriptionChange}
        />
        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
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

const ProfilePage = () => {
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
              <PersonalInformation />
              <Skills />
              <Description />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default ProfilePage;
