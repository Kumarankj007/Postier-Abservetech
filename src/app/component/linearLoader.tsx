'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Store from '../store/store';
import useLoaderStore from '../hooks/loader';

const theme = createTheme({
    components: {
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    height: '3px!important',
                    position:'absolute',
                    width:'100%' 
                },
                bar: {
                    backgroundColor: '#004080!important'
                }
            }
        }
    },
});
export default function LinearLoader() {
    const { loading, RouterLoader } = useLoaderStore();
    return (    
        <ThemeProvider theme={theme}>
            {
                loading &&
                <LinearProgress />
            }
        </ThemeProvider>

    );
}
