import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function StepperComponent({stepperState , type , steps}:any) {
    const theme = createTheme({
        components: {
          MuiSvgIcon: {
              styleOverrides: {
                      root: {
                          width: type === 'form' ? '65px' : '',
                          height: type === 'form' ? '65px' : '',
                          '&.Mui-active': {
                            color:'#004080 !important'
                          },
                          '&.Mui-completed':{
                            color : '#004080 !important'
                        },
                      },
              },
          },
          MuiStepConnector: {
              styleOverrides: {
                line: {
                  // borderColor: '#9E9E9E',
                  // borderTopWidth : 3,
                  marginRight: type === 'form' ? "90px" : "",
                  marginLeft:type === 'form' ?'90px': '',
                  border:type === 'form' ?'3px dashed #9E9E9E': '',
                  borderRadius:type === 'form' ?'10px' : '',
                  marginTop:type === 'form' ? '24px' : ''
                },
              },
            },
        },
      });
      // console.log('stepperState',stepperState)
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' ,marginBottom:'50px'}}>
                <Stepper activeStep={stepperState} alternativeLabel>
                    {steps.map((item:any, ind:number) => (
                        <Step key={ind} >
                            <StepLabel>
                                 <p className='font-medium text-[17px] mb-5'>{item.label}</p>
                                 {item.sub && <p className='font-medium text-[11px]'>{item.sub}</p>}   
                                </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </ThemeProvider>

    );
}
