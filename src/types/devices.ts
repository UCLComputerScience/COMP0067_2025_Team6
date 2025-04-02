import { Theme } from "@mui/material";

export type DevicePropsTheme = {
  theme: Theme,
  channel_id: number,
  channel: string,
  field: string,
  DeviceData: Array<number>,
  DeviceLabels: Array<string>,
  setData: React.Dispatch<React.SetStateAction<string>>;
};

export type ChannelProps = Array<{
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
}>;

export type FeedProps = {
  created_at: string;
  entry_id: number;
  field1: string;
  field2: string;
  field3: string;
};

export type FeedPropsDb = {
  createdAt: string;
  entry_id: number;
  field1: string;
  field2: string;
  field3: string;
};

export type DeviceProps = {
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

  export type ActionsProps = {
    selectedOption: string;
    setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  }

  export type DataProps = {
    data: string;
    setData: React.Dispatch<React.SetStateAction<string>>;
  }

  export type DeviceNameProps = {
    data: string;
    setData: React.Dispatch<React.SetStateAction<string>>;
    device: string;
    setDevice: React.Dispatch<React.SetStateAction<string>>;
  }