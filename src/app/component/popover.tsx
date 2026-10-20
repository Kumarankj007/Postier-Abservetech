import * as React from 'react';
import { Popover, ThemeProvider, createTheme } from '@mui/material';

export default function PopoverComponent({ id, open, anchorEl, onClose, children, width,background }: any) {
    const theme = createTheme({
        components: {
            MuiPopover: {
                styleOverrides: {
                    paper: {
                        borderRadius: '14px',
                        background:background ? background : '#FFFFFF',
                        width: width,
                        borderColor:'#004080'
                    }
                }
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        ":hover": {
                            backgroundColor: 'transparent'
                        }
                    }
                }
            }
        }
    })
    return (
        <ThemeProvider theme={theme}>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{zIndex:'9999999'}}
            >
                {children}
            </Popover>
        </ThemeProvider>

    );
}
