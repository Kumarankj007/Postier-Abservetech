import { forwardRef } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";

const PopDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiBackdrop-root": {
    backdropFilter: "blur(4px)", // <-- BLUR AMOUNT
    backgroundColor: "rgba(0,0,0,0.5)", // optional: darken background
  },
  overflow: "hidden",
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    border: "1px solid #fff",
    width: "calc(100% - 8px)",
    margin: "10px",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#00000080",
      borderRadius: "20px",
      border: "1px solid transparent",
      backgroundClip: "content-box",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#000000bf",
    },
    [theme.breakpoints.up("sm")]: {
      width: "calc(100% - 32px)",
      margin: "21px",
    },
    [theme.breakpoints.up("md")]: {
      width: "calc(100% - 64px)",
      margin: "32px",
    },
  },
}));

const Transition = forwardRef(function Transition(props: any, ref) {
  return (
    <Slide direction="down" ref={ref} {...props}>
      {props.children}
    </Slide>
  );
});

const CustomModal = (props: any) => {
  const {
    className,
    className2,
    maxWidth,
    style,
    open,
    fullWidth,
    children,
    onClose = false,
    title,
    sx,
    icon,
    dontClose = false, // New prop
    cookie = false,
  } = props;

  return (
    <PopDialog
      open={open}
      onClose={onClose == false ? undefined : onClose} // Disable closing if dontClose is true
      className={className}
      TransitionComponent={Transition}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      style={style}
      sx={{ zIndex: "999999", ...sx }}
      disableEscapeKeyDown={dontClose} // Prevent escape key from closing
    >
      <div className={`${!cookie && "p-5"} ${className2}`}>
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            {icon && icon != "" && (
            <Image
              width={25}
              height={25}
              src={icon}
              alt="icon"
            />
            )}
            <h5 className="font-medium text-[20px] m-0 flex items-center">
              {title}
            </h5>
          </div>

          {/* Hide close button if dontClose is true */}
          {!dontClose && (
            <IconButton onClick={onClose}>
              <Image
                width={25}
                height={25}
                src="/svg/icon/close.svg"
                alt="close"
              />
            </IconButton>
          )}
        </div>
        {children}
      </div>
    </PopDialog>
  );
};

export default CustomModal;
