"use client";
import { createTheme, ThemeProvider } from "@mui/material";
import TextField, { StandardTextFieldProps } from "@mui/material/TextField";
import React, { forwardRef } from "react";

interface InputProps extends StandardTextFieldProps {
  className?: string;
  placeholder?: string;
  required?: boolean;
  value?: string | number;
  labelId?: string; // NEW: allows external aria-labelledby reference
  borderStyle?: any;
  inputStyle?: any;
  rootStyle?: any;
}

const LabeledInput = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, placeholder, required, value, error, labelId,  borderStyle = {}, inputStyle = {}, rootStyle = {}, ...props },
    ref
  ) => {
    const theme = createTheme({
      components: {
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#004080 !important",
                borderRadius: "7px",
                ...(error && {
                  borderColor: "red!important",
                }),
                ...borderStyle,
              },
              fontFamily: "var(--base-font)",
              fontStyle: "normal",
              ...rootStyle,
            },
            input: {
              // padding: "22px",
              ...inputStyle,
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              width: "100%",
            },
          },
        },
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <label
          id={labelId}
          htmlFor={props.id || "outlined-basic"}
          className="sr-only"
        >
          {placeholder}
        </label>
        <TextField
          ref={ref}
          id={props.id || "outlined-basic"}
          // label={props.label}
          placeholder={placeholder}
          // variant="outlined"
          value={value || ""}
          error={error}
          className={className}
          // InputLabelProps={{
          //   htmlFor: props.id,
          //   id: labelId,
          //   className: "sr-only",
          //   shrink: false,
          // }}
          inputProps={{
            "aria-labelledby": labelId,
          }}
          {...props}
        />
      </ThemeProvider>
    );
  }
);

LabeledInput.displayName = "LabeledInput";

export default LabeledInput;
