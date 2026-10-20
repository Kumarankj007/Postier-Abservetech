import React, { SelectHTMLAttributes } from "react";
import Select from "@mui/material/Select";
import {
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  ThemeProvider,
} from "@mui/material";
import { color } from "framer-motion";
import LabeledInput from "./input";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: any;
}

const SelectC: React.FC<SelectProps & { labelId?: string }> = ({
  className,
  children,
  placeholder,
  label,
  required,
  error,
  labelId,
  ...props
}: any) => {
  const theme = createTheme({
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            width: "100%",
            borderRadius: "7px!important",
            // border: '1px solid #004080!important',
            // ':focus-visible': {
            //   borderColor: 'transparent!important',
            // }
          },
        },
      },

      MuiList: {
        styleOverrides: {
          root: {
            padding: "0px",
            borderRadius: "8px",
            // boxShadow: " 2px 2px 15px 0px #0000004D",
            maxHeight: "300px",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            padding: "15px",
            borderBottom: "1px solid #D4D4D4",

            "&.Mui-selected": {
              background: "#004080!important",
              borderRadius: "8px",
              color: "#fff",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            border: "1px solid #004080!important",
            ...(error && {
              borderColor: "red!important", // Change border color to red when error is true
            }),
          },
          input: {
            padding: "22px",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "#00000!important",
            fontFamily: "__DM_Sans_0dfae3, __DM_Sans_Fallback_0dfae3",
            "&.Mui-focused": {
              color: "#000000!important",
            },
          },
        },
      },
    },
  });
  return (
     <ThemeProvider theme={theme}>
    <FormControl sx={{ width: "100%" }} error={!!error} required={required}>
      {/* {label && (
        <InputLabel id={labelId} htmlFor={props.id}>
          {label}
        </InputLabel>
      )} */}
      <Select
        aria-invalid={!!error}
        {...props}
        displayEmpty
        label={label}
        labelId={labelId}
        id={props.id}
        MenuProps={{
          sx: {
            zIndex: 9999999,
          },
        }}
        input={
        <OutlinedInput sx={{ borderRadius: "7px" }} 
        // InputLabelProps={{
        //     htmlFor: props.id,
        //     id: labelId,
        //     className: "sr-only",
        //     shrink: false,
        //   }}
          inputProps={{
            "aria-labelledby": labelId,
          }}/>
      }
        renderValue={
          !props.value
            ? (selected: any) => {
                if (!selected) {
                  return <p className="text-gray-400">{label}</p>;
                }
                return undefined;
              }
            : undefined
        }
      >
        {children}
      </Select>
    </FormControl>
  </ThemeProvider>
  );
};

export default SelectC;
