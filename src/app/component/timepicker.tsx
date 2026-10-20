import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { TimeFormat } from '@/utils';



export default function Timepicker({ onDate, label,error }: any) {
    const theme = createTheme({
        components: {
            MuiOutlinedInput: {
                styleOverrides: {
                    notchedOutline: {
                        border: '1px solid #004080!important',
                        borderRadius:'7px',
                        ...(error && {
                            borderColor: 'red!important', // Change border color to red when error is true
                        })
                    }
    
                }
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        width: '100%'
                    }
                }
            },
            MuiStack: {
                styleOverrides: {
                    root: {
                        paddingTop: '0px!important',
                        width: '100%!important'
                    }
                }
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        color: '#00000!important',
                        fontFamily: '__DM_Sans_0dfae3, __DM_Sans_Fallback_0dfae3',
                        '&.Mui-focused': {
                            color: "#000000!important"
                        }
                    }
                }
            }
            // MuiInputAdornment:{
            //   styleOverrides:{
            //     root:{
            //       display:'none'
            //     }
            //   }
    
            // }
        }
    })
    const handleChange = (newValue: any | null) => {
        // const time = TimeFormat(newValue?.$H)
        onDate(newValue)
    };
    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
                <TimePicker views={['hours']}
                    onChange={handleChange}
                    label={label}
                />
            </LocalizationProvider>
        </ThemeProvider>
    )
}