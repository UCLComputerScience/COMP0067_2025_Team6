import React from "react";
import styled from "@emotion/styled";
import {
  Card as MuiCard,
  CardContent as MuiCardContent,
  Typography,
  Switch,
  LinearProgress,
} from "@mui/material";
import { Slider } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

const Card = styled(MuiCard)`
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardContent = styled(MuiCardContent)`
  &:last-child {
    padding-bottom: 16px;
    width: 100%;
  }
`;

const Section = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #fafafa;
  width: 100%;
`;

const StatusBadge = styled.div<{ status: "normal" | "warning" | "error" }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status }) =>
    status === "warning"
      ? "#FFEB3B"
      : status === "error"
      ? "#F44336"
      : "#E0E0E0"};
  color: ${({ status }) => (status === "error" ? "#FFFFFF" : "#000000")};
`;

const SwitchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  width: 100%;
`;

interface Sensor {
  name: string;
  value: number;
  unit: string;
  isIndicator: boolean;
  min: number;
  max: number;
}

interface LabCardProps {
  labName: string;
  deviceName: string;
  sensors: Sensor[];
  battery: number;
  startDate: string;
  status: "normal" | "warning" | "error";
  isActive: boolean;
}

const LabCard: React.FC<LabCardProps> = ({
  labName,
  deviceName,
  sensors,
  battery,
  startDate,
  status,
  isActive,
}) => {
  return (
    <Card>
      <CardContent>
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            cursor: "pointer",
          }}
        >
          <MenuIcon fontSize="large" />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <div>
            <Typography variant="h6">{labName}</Typography>
            <Typography variant="body2" color="textSecondary">
              {deviceName}
            </Typography>
          </div>
          {status !== "normal" && (
            <StatusBadge status={status}>
              {status === "warning" ? "Warning" : "Error"}
            </StatusBadge>
          )}
        </div>

        {sensors?.map((sensor, index) => (
          <Section>
            <div key={index} style={{ marginBottom: "16px" }}>
              <Typography variant="body2" fontWeight={600}>
                {sensor.name}
              </Typography>
              <Typography variant="body1" fontWeight={700}>
                {sensor.value}
                {sensor.unit}
              </Typography>
              <Slider
                defaultValue={sensor.value}
                min={sensor.min}
                max={sensor.max}
                sx={{ mt: 1 }}
              />
            </div>
          </Section>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <div>
            <Section>
              <Typography variant="body2" fontWeight={600}>
                Battery
              </Typography>
              <LinearProgress
                variant="determinate"
                value={battery}
                sx={{ width: "80px", height: "6px" }}
              />
              <Typography variant="caption" color="textSecondary">
                {battery}%
              </Typography>
            </Section>
          </div>
          <div>
            <Section>
              <Typography variant="body2" fontWeight={600}>
                Start Date
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {startDate}
              </Typography>
            </Section>
          </div>
        </div>
        <SwitchContainer>
          <Switch checked={isActive} />
        </SwitchContainer>
      </CardContent>
    </Card>
  );
};

export default LabCard;
