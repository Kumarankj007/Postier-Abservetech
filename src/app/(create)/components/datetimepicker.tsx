import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MobileDateTimePicker } from "@mui/x-date-pickers/MobileDateTimePicker";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& $notchedOutline": {
            borderColor: "#004080",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#004080 !important",
          },
          "&:hover $notchedOutline": {
            borderColor: "#004080",
          },
          "&$focused $notchedOutline": {
            border: "2px solid #004080",
          },
          fontFamily: "__DM_Sans_0dfae3",
          fontStyle: "normal",
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
            zIndex: "999999!important",
          },
          zIndex: "999999!important",
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
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.MuiMultiSectionDigitalClockSection-item.Mui-selected": {
            backgroundColor: "#004080",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#004080", // Change the color on hover
            },
          },
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.MuiPickersDay-root.Mui-selected": {
            backgroundColor: "#004080",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#004080", // Change the color on hover
            },
          },
        },
      },
    },
    // MuiInputAdornment:{
    //   styleOverrides:{
    //     root:{
    //       display:'none'
    //     }
    //   }

    // }
  },
});

export default function DateTimePickers({
  id,
  onDate,
  date,
  type,
  range,
  label,
  pickupDate,
  maximumDate,
  minimumDate,
}: any) {
  const [values, setValue] = React.useState<Dayjs | null>(null);
  const dateFormat = date ? dayjs(date) : null;
  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    if (newValue) {
      const dateObject = newValue.toDate();
      onDate(dateObject);
    } else {
      onDate(null);
    }
  };

  const minDate: any = React.useMemo(() => {
    if (type === "Express Delivery") {
      if (pickupDate) {
        // 2024-10-15T10:55:00.000+05:30
        const date: any = dayjs(pickupDate);
        return date;
      } else {
        return dayjs(new Date()).startOf("day");
      }
    } else if (type === "Schedule Delivery") {
      if (pickupDate) {
        const date: any = dayjs(pickupDate);
        return date;
      } else {
        return null;
      }
    } else if (type === "Standard Delivery") {
      if (pickupDate) {
        const date: any = dayjs(pickupDate);
        return date;
      }
    } else if (type === "schedule") {
      return dayjs(minimumDate);
    } else {
      return dayjs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, range, pickupDate]);

  const maxDate: any = React.useMemo(() => {
    if (type === "Express Delivery") {
      return dayjs(pickupDate).endOf("day");
    } else if (type === "Schedule Delivery") {
      if (range === "from") {
        return null;
      } else {
        if (pickupDate) {
          return dayjs(pickupDate).endOf("day");
        }
      }
    } else if (type === "schedule") {
      return dayjs(maximumDate);
    } else {
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, range, date]);

  // console.log("maxDate", maxDate);
  // console.log("type", type);
  // console.log('maxDate', maxDate.format('YYYY-MM-DD HH:mm:ss'))

  // const lastSecondOfToday = dayjs().endOf('day');
  // console.log('endofday', lastSecondOfToday.format());
  // if (pickupDate)
  //     console.log('pickupDate', pickupDate)
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DesktopDateTimePicker"]}>
          <DateTimePicker
            // timezone='UTC'
            disablePast
            minDateTime={minDate}
            maxDateTime={maxDate}
            onChange={handleChange}
            closeOnSelect={false}
            value={dateFormat || values}
            label={label}
            slotProps={{
              textField: {
                id,
                variant: "outlined",
                fullWidth: true,
              },
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
