import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, createTheme, ThemeProvider } from '@mui/material';


const theme = createTheme({
    components: {
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    MuiRadio: {
                        styleOverrides: {
                            root: {
                                 color: '#004080',
                                '&.Mui-checked': {
                                    color: '#004080'
                                }
            
                            }
                        }
                    }
                }
            }
        }
    }
})
const RadioButtonGroup = ({
    name,
    label,
    options,
    value,
    onChange,
    row = false,
    onClick
}: any) => {
    return (
        <ThemeProvider theme={theme}>
            <FormControl>
                <RadioGroup
                    row={row}
                    name={name}
                    value={value}
                    onChange={(event) => {
                        if(onChange)
                        onChange(event.target.value)
                    }}
                >
                    {options.map((option: any) => (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            checked={value===option.value}
                            control={<Radio 
                                onClick={(event) => {
                                    if(onClick)
                                    onClick(event)
                                }}
                            />}
                            label={option.label}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </ThemeProvider>
    );
};

export default RadioButtonGroup;
