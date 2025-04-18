import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DevicesIcon from '@mui/icons-material/Devices';

interface LabCardProps {
  lab: {
    id: number;
    name: string;
    location: string;
    deviceCount: number;
  };
}

export default function LabCard({ lab }: LabCardProps) {
  const router = useRouter();

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {lab.name}
        </Typography>
        
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOnIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {lab.location}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <DevicesIcon color="action" />
            <Typography variant="body2" color="text.secondary">
              {lab.deviceCount} devices
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            <Button 
              variant="contained" 
              onClick={() => router.push(`/reports/labs/${lab.id}`)}
            >
              View Report
            </Button>
            <Button 
              variant="outlined"
              onClick={() => router.push(`/reports/labs/${lab.id}/devices`)}
            >
              View Devices
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
} 