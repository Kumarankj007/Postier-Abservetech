"use client";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Box, Grid } from "@mui/material";
import UserStore from "../store/profile";
import { DatePicker } from "@mui/x-date-pickers";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function DatePickerComp({
  id,
  onDate,
  date,
  disablePast = true,
  type,
  label,
  error,
  searchBar = false,
}: any) {
  const { user } = UserStore();
  const [values, setValue] = React.useState<Dayjs | null>(null);
  const dateFormat = date ? dayjs(date) : null;
  const currentDate: any = dayjs(new Date());
  const minDate = dayjs().subtract(18, "year");

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    if (newValue) {
      const dateObject = newValue.utc().toDate();
      onDate(dateObject);
    } else {
      onDate(null);
    }
  };

  const theme = createTheme({
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            border: searchBar ? "none" : "1px solid #004080!important",
            borderRadius: "7px",
            ...(error && {
              borderColor: "red!important", // Change border color to red when error is true
            }),
          },
          input: {
            padding: searchBar ? "0px" : "16.5px 14px",
            width: searchBar && "130px",
            fontSize: "13.5px",
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
      MuiStack: {
        styleOverrides: {
          root: {
            paddingTop: "0px!important",
          },
        },
      },
      MuiPopper: {
        styleOverrides: {
          root: {
            "& .MuiPickersPopper-root": {
              zIndex: "99999!important",
            },
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
      MuiGrid: {
        styleOverrides: {
          root: {
            display: "flex",
          },
        },
      },
      // MuiIconButton:{
      //   styleOverrides:{
      //     root:{
      //       display: searchBar && ''
      //     }
      //   }
      // }
      // MuiInputAdornment:{
      //   styleOverrides:{
      //     root:{
      //       display:'none'
      //     }
      //   }

      // }
    },
  });
  return (
    <ThemeProvider theme={theme}>
      {/* <Grid> */}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <DatePicker
          minDate={disablePast ? dayjs(new Date()) : undefined}
          disableFuture={type === "dob" ? true : false}
          maxDate={type === "dob" ? minDate : undefined}
          value={dateFormat}
          onChange={handleChange}
          label={label}
          slotProps={{
            textField: {
              id,
              variant: "outlined",
              fullWidth: true,
            },
          }}
        />
      </LocalizationProvider>
      {/* </Grid> */}
    </ThemeProvider>
  );
}
