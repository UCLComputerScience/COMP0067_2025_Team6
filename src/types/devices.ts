import { Theme } from "@mui/material";

export type DevicePropsTheme = {
  theme: Theme,
  channel: string,
  field: string,
  DeviceData: Array<number>,
};

export type DeviceProps = {
    device: {
      channel: {
        id: number;
        name: string;
        latitude: string;
        longitude: string;
        field1: string;
        field2: string;
        field3: string;
        created_at: string;
        updated_at: string;
        last_entry_id: number;
      };
      feeds: Array<{
        created_at: string;
        entry_id: number;
        field1: string;
        field2: string;
        field3: string;
      }>;
    };
  };