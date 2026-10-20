"use client";
import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function MonthPickerComp({
  onDate,
  date,
  disablePast = true,
  type,
  label,
  error,
  searchBar = false,
}: any) {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const dateFormat = date ? dayjs(date, "MM/YY") : null;

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue) {
      const formattedDate = newValue.format("MM/YY"); // Convert to MM/YY format
      setValue(newValue);
      onDate(formattedDate); // Pass MM/YY string to parent
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
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={["month", "year"]} // Only allow selection of Month & Year
          minDate={disablePast ? dayjs(new Date()) : undefined}
          disableFuture={type === "dob"}
          maxDate={type === "dob" ? dayjs().subtract(18, "year") : undefined}
          value={dateFormat}
          onChange={handleChange}
          label={label}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
