import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { createTheme, ThemeProvider } from "@mui/material";
import { useSearchParams } from "next/navigation";

const theme = createTheme({
  components: {
    MuiSlider: {
      styleOverrides: {
        rail: {
          backgroundColor: "#EFEFEF",
        },
        track: {
          border: "1px solid #004080",
          backgroundColor: "#004080",
        },
        thumb: {
          backgroundColor: "#fff",
          border: "5px solid #004080",
        },
      },
    },
  },
});
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function RangeSlider({ items, updateQuery, values }: any) {
  const searchParams = useSearchParams();
  // const params = new URLSearchParams(searchParams)
  const [value, setValue] = React.useState<number[]>([0, 10]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateQueryParams = React.useCallback(
    debounce((newValue: any) => {
      // console.log("newValue", newValue);
      updateQuery(items, newValue);
    }, 500),
    []
  );

  React.useEffect(() => {
    return () => {
      // console.log("component unmounted");
    };
  }, []);

  const handleChange = (event: Event, newValue: any | number[]) => {
    setValue(newValue as number[]);
    updateQueryParams(newValue);
    // Adjust debounce delay as needed
    // startTransition(()=>{
    //     params.set(`min${items}`, newValue[0])
    //     params.set(`max${items}`, newValue[1])
    //     window.history.replaceState({ path: params.toString() }, '', '?' + params.toString());
    // })
    // if(newValue)
  };
  // console.log('params',params)
  React.useEffect(() => {
    setValue(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: 300 }}>
        <Slider
          value={value}
          onChange={handleChange}
          disableSwap
          aria-label={`${items} range slider`}
        />
      </Box>
    </ThemeProvider>
  );
}
