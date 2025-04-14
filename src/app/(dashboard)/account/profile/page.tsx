"use client";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import PasswordIcon from '@mui/icons-material/Password';
import React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styled from "@emotion/styled";
import { Autocomplete } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
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
  // Grid as MuiGrid,
  Typography as MuiTypography,
  TextField,
  Chip as MuiChip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Edit } from "@mui/icons-material";
import { Grid } from "@mui/material";

const Breadcrumbs = styled(MuiBreadcrumbs)`
  margin-bottom: 16px;
`;

interface StyledButtonProps {
  component?: React.ElementType;
}

const Button = styled(MuiButton)<StyledButtonProps>`
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
const suggestedSkills = [
  "Scientific Research",
  "Experimental Design",
  "Critical Thinking",
  "Problem Solving",
  "Data Interpretation",
  "Data Analysis",
  "Report Writing",
  "Scientific Communication",
  "Technical Writing",
  "Project Management",
  "Attention to Detail",
  "Time Management",
  "Teamwork",
  "Innovation",
  "Health and Safety",
  "Regulatory Compliance",
  "Quality Control",
  "Safety Compliance",
  "Data Recording and Management",
  "Statistical Analysis",
  "Ethical Research Practices",
  "Collaboration",
  "Presentation Skills",
  "Adaptability",
  "Leadership",
  "Resource Management",
  "Organizational Skills",
  "Creativity",
  "Data Visualization",
  "Multidisciplinary Thinking",
  "Problem Identification",
  "Analytical Reasoning",
  "Mentoring",
  "Knowledge Sharing",
  "Effective Communication",
  "Decision Making",
  "Workplace Safety",
  "Documentation",
  "Self-Motivation"
];


const ProfileCompletion = () => {
  const { data: session } = useSession();
  const [completion, setCompletion] = useState<number>(0);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadProfile = async () => {
      try {
        const res = await fetch(`/api/auth/getProfile?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Failed to load profile for completion");
        const { user } = await res.json();
        
        const fields = [
          user.firstName, user.lastName, user.email, user.phoneNumber,
          user.addressLine1, user.city, user.county, user.postcode,
          user.specialisation?.length ? "yes" : "", user.description
        ];
        const filled = fields.filter((field) => field && field !== "").length;
        const percentage = Math.round((filled / fields.length) * 100);
        setCompletion(percentage);
      } catch (error) {
        console.error("Error loading profile completion:", error);
      }
    };

    loadProfile();
  }, [session]);

  if (completion === 100) return null;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="h6" color="primary">
            Complete Your Profile ({completion}%)
          </Typography>
          <LinearProgress variant="determinate" value={completion} />
          <Typography variant="body2" color="textSecondary">
            Please update your profile details to reach 100% completion.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProfileDetails = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    userRole: "STANDARD_USER",
    avatar: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;
  
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/auth/getProfile?userId=${session.user.id}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
  
        const { user } = await res.json();
  
        setUser({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          userRole: user.userRole || "STANDARD_USER",
          avatar: user.avatar || "",
        });
  
        setPreview(user.avatar || "/static/img/avatar.jpg");
  
        localStorage.setItem("personalInfo", JSON.stringify(user));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
  
    fetchProfile();
  }, [session]);

  const formatRole = (role: string) =>
    role.toLowerCase().split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;
  
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
  
    const storedData = localStorage.getItem("personalInfo");
    const updatedUser = storedData ? JSON.parse(storedData) : {};
    updatedUser.avatar = localUrl;
    localStorage.setItem("personalInfo", JSON.stringify(updatedUser));
  
    window.dispatchEvent(new Event("profileUpdated"));
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("userId", session.user.id); 
  
    try {
      const res = await fetch("/api/auth/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to upload image");
      const data = await res.json();
      updatedUser.avatar = data.avatarUrl; 
      localStorage.setItem("personalInfo", JSON.stringify(updatedUser));
      setPreview(data.avatarUrl);
      window.dispatchEvent(new Event("profileUpdated"));
  
      setShowSnackbar(true);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload avatar.");
    }
  };
  

 return (
    <>
      <Card>
        <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Avatar alt="User Profile" src={preview || "/static/img/avatar.jpg"} />
          <input type="file" accept="image/*" id="avatar-upload" style={{ display: "none" }} onChange={handleFileChange} />
          <label htmlFor="avatar-upload">
            <Button component="span" variant="outlined" color="primary" startIcon={<CloudUploadIcon />} sx={{ mt: 1, mb: 2 }}>
              Upload Avatar
            </Button>
          </label>

          <Typography variant="h5">{user.firstName} {user.lastName}</Typography>
          <Typography variant="subtitle1" color="textSecondary" mb={2}>
            {formatRole(user.userRole)}
          </Typography>

          <Box width="100%" mt={2}>
          <NextLink href="/account/profile" passHref>
            <Button variant="outlined" color="primary" fullWidth sx={{ display: "flex", justifyContent: "flex-start", gap: 1, py: 1.5 }}>
              <PersonIcon /> Personal Information
            </Button>
          </NextLink>
          <NextLink href="/account/profile/organisation" passHref>
            <Button variant="outlined" color="primary" fullWidth sx={{ display: "flex", justifyContent: "flex-start", gap: 1, py: 1.5, mt: 1 }}>
              <BusinessIcon /> Organisation Information
            </Button>
          </NextLink>
          <NextLink href="/account/profile/changePassword" passHref>
            <Button variant="outlined" color="primary" fullWidth sx={{ display: "flex", justifyContent: "flex-start", gap: 1, py: 1.5, mt: 1 }}>
              <PasswordIcon /> Change Password
            </Button>
          </NextLink>
        </Box>
      </CardContent>
    </Card>
    <Snackbar
        open={showSnackbar}
        autoHideDuration={10000} // 10 seconds
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" variant="filled" onClose={() => setShowSnackbar(false)}>
          Avatar updated! Please refresh the page in 10 seconds if you can't see the updated picture.
        </Alert>
      </Snackbar>
    </>
  );
};

  
const PersonalInformation = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    county: "",
    postcode: "",
  });
  const [lastSavedData, setLastSavedData] = useState<typeof formData | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const loadSavedData = async () => {
      try {
        const response = await fetch(`/api/auth/getProfile?userId=${session.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        const newData = { ...formData, ...data.user };
        setFormData(newData);
        setLastSavedData(newData);
        localStorage.setItem("personalInfo", JSON.stringify(newData));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    loadSavedData();
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    localStorage.setItem("personalInfo", JSON.stringify(updatedData));
  };

  const handleSaveChanges = async () => {
    if (!session?.user?.id) return;
    try {
      const response = await fetch("/api/auth/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, ...formData }),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      alert("Profile information saved!");
      setLastSavedData(formData);
      localStorage.setItem("personalInfo", JSON.stringify(formData));
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (error) {
      console.error(error);
      alert("Error saving profile.");
    }
  };

  const handleCancel = () => {
    if (lastSavedData) {
      setFormData(lastSavedData);
      localStorage.setItem("personalInfo", JSON.stringify(lastSavedData));
    }
    alert("Changes discarded.");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Personal Information</Typography>
        <Divider />
        {/* --- Fields --- */}
        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField label="First Name" name="firstName" fullWidth variant="outlined" value={formData.firstName} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Last Name" name="lastName" fullWidth variant="outlined" value={formData.lastName} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Email" name="email" fullWidth variant="outlined" value={formData.email} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Phone Number" name="phoneNumber" fullWidth variant="outlined" value={formData.phoneNumber} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Address Line 1" name="addressLine1" fullWidth variant="outlined" value={formData.addressLine1} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Address Line 2" name="addressLine2" fullWidth variant="outlined" value={formData.addressLine2} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="City" name="city" fullWidth variant="outlined" value={formData.city} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="County" name="county" fullWidth variant="outlined" value={formData.county} onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField label="Postcode" name="postcode" fullWidth variant="outlined" value={formData.postcode} onChange={handleInputChange} />
            </Grid>
          </Grid>
        </Box>

        {/* --- Save/Cancel Buttons --- */}
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSaveChanges}>Save Changes</Button>
          <Button variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>
        </Box>
      </CardContent>
    </Card>
  );
};


const Skills = () => {
  const { data: session } = useSession();
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchSkills = async () => {
      try {
        const response = await fetch(`/api/auth/getProfile?userId=${session.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        if (data.user.specialisation) {
          setSkills(data.user.specialisation);
          localStorage.setItem("userSkills", JSON.stringify(data.user.specialisation));
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, [session]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill("");
      localStorage.setItem("userSkills", JSON.stringify(updatedSkills));
    }
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToDelete);
    setSkills(updatedSkills);
    localStorage.setItem("userSkills", JSON.stringify(updatedSkills));
  };

  const handleSaveSkills = async () => {
    if (!session?.user?.id) return;
    try {
      const response = await fetch("/api/auth/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, specialisation: skills }),
      });
      if (!response.ok) throw new Error("Failed to save skills");
      alert("Skills saved successfully!");
    } catch (error) {
      console.error("Error saving skills:", error);
      alert("Error saving skills.");
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Specialisation</Typography>
          <Box display="flex" alignItems="center" gap={1}>
          <Autocomplete
              freeSolo
              options={suggestedSkills}
              inputValue={newSkill}
              onInputChange={(event, newInputValue) => {
                setNewSkill(newInputValue);
              }}
              onChange={(event, value) => {
                if (value) {
                  setNewSkill(value); // when clicking a suggestion
                }
              }}
              sx={{ width: 300 }}
              filterOptions={(options, state) =>
                state.inputValue === "" ? [] : options.filter((option) =>
                  option.toLowerCase().startsWith(state.inputValue.toLowerCase())
                )
              }
              renderInput={(params) => (
                <TextField {...params} label="Add a skill" size="small" variant="outlined" />
              )}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                const skillToAdd = newSkill.trim();
                if (skillToAdd && !skills.includes(skillToAdd)) {
                  const updatedSkills = [...skills, skillToAdd];
                  setSkills(updatedSkills);
                  setNewSkill(""); // clear input after adding
                  localStorage.setItem("userSkills", JSON.stringify(updatedSkills));
                }
              }}
              disabled={!newSkill.trim()}
            >
              Add
            </Button>
          </Box>
        </Box>
  
        <Divider sx={{ my: 2 }} />
  
        <Box display="flex" flexWrap="wrap" gap={1}>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                color="primary"
                onDelete={() => {
                  const updatedSkills = skills.filter((s) => s !== skill);
                  setSkills(updatedSkills);
                  localStorage.setItem("userSkills", JSON.stringify(updatedSkills));
                }}
              />
            ))
          )}
        </Box>
  
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSkills}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Skills"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )};
  

const Description = () => {
  const { data: session } = useSession();
  const [description, setDescription] = useState("");
  const [lastSavedDescription, setLastSavedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchDescription = async () => {
      try {
        const response = await fetch(`/api/auth/getProfile?userId=${session.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch description");
        const data = await response.json();
        if (data.user.description) {
          setDescription(data.user.description);
          setLastSavedDescription(data.user.description);
          localStorage.setItem("userDescription", data.user.description);
        }
      } catch (error) {
        console.error("Error fetching description:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDescription();
  }, [session]);

  const handleSaveChanges = async () => {
    if (!session?.user?.id) return;
    try {
      const response = await fetch("/api/auth/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, description }),
      });
      if (!response.ok) throw new Error("Failed to save description");
      alert("Description saved!");
      setLastSavedDescription(description);
      localStorage.setItem("userDescription", description);
    } catch (error) {
      console.error("Error saving description:", error);
      alert("Error saving description.");
    }
  };

  const handleCancel = () => {
    setDescription(lastSavedDescription);
    localStorage.setItem("userDescription", lastSavedDescription);
    alert("Changes discarded.");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Description</Typography>
        <Divider />
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <TextField multiline rows={4} fullWidth variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} />
        )}
        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSaveChanges} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};


const ProfilePage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <Typography>Loading profile...</Typography>; 
  }

  if (!session) {
    return <Typography>You must be signed in to view your profile.</Typography>; 
  }

  return (
    <>
      <Typography variant="h4">Personal Profile</Typography>
      <Breadcrumbs>
        <NextLink href="/">Home</NextLink>
        <Typography color="textPrimary">Personal Profile</Typography>
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
