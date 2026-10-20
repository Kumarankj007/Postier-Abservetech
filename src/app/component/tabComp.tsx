import React, { useState } from 'react';

import { Tabs, Tab, Box, Typography, createTheme, ThemeProvider } from '@mui/material';

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

const theme = createTheme({
    components: {
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'capitalize',
                    fontSize: '17px',
                    fontWeight: '400',
                    color: '#000',
                    '&.Mui-selected': {
                        color: '#000',
                        fontWeight: '800'
                    },
                    fontFamily: '__DM_Sans_0dfae3, __DM_Sans_Fallback_0dfae3'
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#004080!important',
                        height: '3px',
                        // borderRadius: '10px 10px 0px 0px'
                    },
                },
            },
        },
    }
});



const CustomTabComponent = ({ tabs }: any) => {
    const [value, setValue] = useState(0);

    const visibleTabs = tabs.filter((tab: any) => tab.value !== false);

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: '40px' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        {visibleTabs.map((tab: any, index: any) => (
                            <Tab key={index} label={tab.label} />
                        ))}
                    </Tabs>
                </Box>
                {visibleTabs.map((tab: any, index: any) => (
                    <TabPanel key={index} value={value} index={index}>
                        {tab.content}
                    </TabPanel>
                ))}
            </Box>
        </ThemeProvider>
    );
};



export default CustomTabComponent;
