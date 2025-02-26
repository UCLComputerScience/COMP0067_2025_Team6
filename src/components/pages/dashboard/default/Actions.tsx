import React from "react";
import styled from "@emotion/styled";

import { Button as MuiButton, Menu, MenuItem } from "@mui/material";
import {
  Loop as LoopIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { spacing } from "@mui/system";
import { ActionsProps } from "@/types/devices";
import { el } from "date-fns/locale";

const Button = styled(MuiButton)(spacing);

const SmallButton = styled(Button)`
  padding: 4px;
  min-width: 0;

  svg {
    width: 0.9em;
    height: 0.9em;
  }
`;

const Actions: React.FC<ActionsProps> = ({ selectedOption, setSelectedOption }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [buttonText, setButtonText] = React.useState<string>("Today");

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle selecting a menu item
  const handleSelect = (option: string) => {
    if (option === "Today") {
      setSelectedOption("?days=1");
    } else if (option === "Last 7 Days") {
      setSelectedOption("?days=7");
    } else if (option === "Last 30 Days") {
      setSelectedOption("?days=30");
    } else if (option === "Last Year") {
      setSelectedOption("?days=365");
    } else if (option === "All Data") {
      setSelectedOption("");
    }
    setButtonText(option);               // Set the selected option as the button text
    handleClose();               // Close the menu after selection
  };

  return (
    <React.Fragment>
      <SmallButton size="small" mr={2}>
        <LoopIcon />
      </SmallButton>
      {/* <SmallButton size="small" mr={2}>
        <FilterListIcon />
      </SmallButton> */}
      <Button
        variant="contained"
        color="secondary"
        aria-owns={anchorEl ? "simple-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        {buttonText}  {/* Display the selected option here */}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {["Today", "Last 7 Days", "Last 30 Days", "Last Year", "All Data"].map((option) => (
          <MenuItem key={option} onClick={() => handleSelect(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

export default Actions;
