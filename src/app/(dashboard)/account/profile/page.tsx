"use client";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import PasswordIcon from '@mui/icons-material/Password';
import React from "react";
import { useState, useEffect } from "react";
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
            addressLine1: "",
            addressLine2: "",
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
      const filledFields = Object.values(profileData).filter((value) => value !== "").length;
      const totalFields = Object.keys(profileData).length;
      const skillsCompleted = skills.length > 0 ? 1 : 0; 
      const descriptionCompleted = description.trim() !== "" ? 1 : 0;
  
      return Math.round(((filledFields + skillsCompleted + descriptionCompleted) / (totalFields + 2)) * 100);
    };
  
    const completionPercentage = calculateCompletion();
  
    if (completionPercentage === 100) return null;
  
    return (
      <Card>
        <CardContent style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6" color="primary">
              Complete Your Personal Profile ({completionPercentage}%)
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Please update your profile details to reach 100% completion.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };
  const ProfileDetails = () => {
    const [user, setUser] = useState({
      firstName: "",
      lastName: "",
      userRole: "STANDARD_USER",
      avatar: "",
    });
  
    const [preview, setPreview] = useState<string | null>(null);
  
    useEffect(() => {
      const storedData = localStorage.getItem("personalInfo");
      if (storedData) {
        const data = JSON.parse(storedData);
        setUser({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          userRole: data.userRole || "STANDARD_USER",
          avatar: data.avatar || "",
        });
        setPreview(data.avatar || "");
      }
    }, []);
  
    const formatRole = (role: string) => {
      if (!role) return "User";
      return role
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };
  
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      const formData = new FormData();
      formData.append("avatar", file);
      formData.append("userId", "1");
  
      try {
        const res = await fetch("/api/auth/upload", {
          method: "POST",
          body: formData,
        });
  
        if (!res.ok) {
          throw new Error("Failed to upload image");
        }
  
        const data = await res.json();
        const avatarUrl = data.avatarPath;
  
        setPreview(avatarUrl);
  
        const updatedUser = { ...user, avatar: avatarUrl };
        setUser(updatedUser);
        localStorage.setItem("personalInfo", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Upload error:", error);
        alert("Failed to upload avatar.");
      }
    };
  
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
          <Avatar alt="User Profile" src={preview || "/static/img/avatar.jpg"} />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="avatar-upload"
            onChange={handleFileChange}
          />
          <label htmlFor="avatar-upload">
            <Button
              variant="outlined"
              // component="span"
              color="primary"
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 1, mb: 2 }}
            >
              Upload Avatar
            </Button>
          </label>
  
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
                sx={{ display: "flex", justifyContent: "flex-start", gap: 1, py: 1.5, mt: 1 }}
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

//   const completionPercentage = calculateCompletion();

//   if (completionPercentage === 100) return null;

//   return (
//     <Card>
//       <CardContent
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Box>
//           <Typography variant="h6" color="primary">
//             Complete Your Profile ({completionPercentage}%)
//           </Typography>
//           <Typography variant="body2" color="textSecondary">
//             Please update your profile details to reach 100% completion.
//           </Typography>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

const PersonalInformation = () => {
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

  const [lastSavedData, setLastSavedData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    county: string;
    postcode: string;
  } | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("personalInfo");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setFormData(parsedData);
      setLastSavedData(parsedData);
    }
    
    loadSavedData();
  }, []);
  
  const loadSavedData = async () => {
    try {
      const response = await fetch("/api/auth/getProfile?userId=1");
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

  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    county: string;
    postcode: string;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedData: FormData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    localStorage.setItem("personalInfo", JSON.stringify(updatedData));
  };

  const handleSaveChanges = async () => {
    try {
      console.log("Sending data:", JSON.stringify({ userId: 1, ...formData }));
      
      const response = await fetch("/api/auth/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1, ...formData }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update profile: ${errorData.message || response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Success response:", data);
      alert("Profile information saved!");
      setLastSavedData(formData);
      localStorage.setItem("personalInfo", JSON.stringify(formData));
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Error saving profile: ${errorMessage}`);
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
              <TextField label="Address Line 1" name="addressLine1" fullWidth variant="outlined" value={formData.addressLine1} onChange={handleInputChange} />
            </Grid>
          </Grid>
        </Box>

        <Box mt={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField label="Address Line 2" name="addressLine2" fullWidth variant="outlined" value={formData.addressLine2} onChange={handleInputChange} />
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
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedSkills = localStorage.getItem("userSkills");
    if (storedSkills) {
      setSkills(JSON.parse(storedSkills));
      setIsLoading(false);
    }
    
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/getProfile?userId=1");
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      if (data.user.specialisation && Array.isArray(data.user.specialisation)) {
        setSkills(data.user.specialisation);
        localStorage.setItem("userSkills", JSON.stringify(data.user.specialisation));
      } 
    } catch (error) {
      console.error("Error fetching skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    try {
      setIsLoading(true);
      console.log("Sending skills data:", JSON.stringify({ userId: 1, specialisation: skills }));
      
      const response = await fetch("/api/auth/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: 1,
          specialisation: skills 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to save skills: ${errorData.message || response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Success response:", data);
      alert("Skills saved successfully!");
      
      localStorage.setItem("userSkills", JSON.stringify(skills));
    } catch (error) {
      console.error("Error saving skills:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      alert(`Error saving skills: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
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
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            skills.map((skill: string, index: number) => (
              <Chip key={index} label={skill} color="primary" onDelete={() => handleDeleteSkill(skill)} />
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
  );
};

const Description = () => {
  const [description, setDescription] = useState("");
  const [lastSavedDescription, setLastSavedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedDescription = localStorage.getItem("userDescription");
    if (storedDescription) {
      setDescription(storedDescription);
      setLastSavedDescription(storedDescription);
      setIsLoading(false);
    }
    
    fetchDescription();
  }, []);

  const fetchDescription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/getProfile?userId=1");
      if (!response.ok) throw new Error("Failed to fetch user data");

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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    localStorage.setItem("userDescription", e.target.value);
  };

  const handleSaveChanges = async () => {
    try {
        setIsLoading(true);
        const response = await fetch("/api/auth/updateProfile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: 1,
                description,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update profile description");
        }

        const data = await response.json();
        alert("Description saved!");
        setLastSavedDescription(description);
        
        localStorage.setItem("userDescription", description);
        console.log("Updated User Description:", data.user);
    } catch (error) {
        console.error("Error updating profile description:", error);
        alert("Error saving description. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDescription(lastSavedDescription);
    localStorage.setItem("userDescription", lastSavedDescription);
    alert("Changes discarded. Restored last saved description.");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Description</Typography>
        <Divider />
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Enter description here"
            variant="outlined"
            value={description}
            onChange={handleDescriptionChange}
          />
        )}
        <Box mt={2} display="flex" justifyContent="flex-end" gap={2}>
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
      </CardContent>
    </Card>
  );
};

const ProfilePage = () => {
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
