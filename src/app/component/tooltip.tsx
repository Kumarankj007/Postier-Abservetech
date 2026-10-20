import * as Mui from '@mui/material';
import React, { useState } from 'react';


interface ReusableTooltipProps {
  title: string;
  children: React.ReactElement;
  className?: string;
}

const TooltipComp: React.FC<ReusableTooltipProps> = ({ title, children, className="" }) => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  return (
    // <Mui.ClickAwayListener onClickAway={handleTooltipClose}>
      <Mui.Tooltip
        title={title}
        arrow
        PopperProps={{
          disablePortal: false,
        }}
        // onClose={handleTooltipClose}
        // open={open}
        // disableFocusListener
        // disableHoverListener
        // disableTouchListener
      >
        <span className={className} onClick={handleTooltipOpen}>{children}</span>
      </Mui.Tooltip>
    // </Mui.ClickAwayListener>

  );
};

export default TooltipComp;
