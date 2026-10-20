/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { createTheme, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, ThemeProvider } from '@mui/material';
import { root } from 'postcss';
import { color } from 'framer-motion';
import { usePathname, useSearchParams } from 'next/navigation';
import ParcelStore from '@/app/store/parcel';
import UseLoadingRouter from '@/app/hooks/useLoadingRoutes';
import useScreenWidth from '@/app/hooks/usescreenwidth';
import Store from '@/app/store/store';
import RoleStore from '@/app/store/RoleStore';
import PageContext from '@/app/providers/pagecontext';
import Button from '@/app/component/button';
import { useMutation } from '@tanstack/react-query';
import useSnackbarStore from '@/app/store/toaster';
import { FinishTrip } from '@/app/tools/mutatefn/tripReq';
import RouteMap from '../routemaptracking';
import LoaderScript from '@/app/component/loadingscript';
import TripandParcelRequests from '@/app/store/requests';
import useTrackingStore from '@/app/store/tracking';
import { decodePolyline } from '@/utils';


const theme = createTheme({
    components: {
        MuiStepLabel: {
            styleOverrides: {
                label: {
                    fontSize: '17px',
                    color: '#222',
                    fontWeight: '700',

                    '&.Mui-active': {
                        fontSize: '17px',
                        color: '#222',
                        fontWeight: '700'
                    },
                    '&.Mui-completed': {
                        fontSize: '17px',
                        color: '#222',
                        fontWeight: '700'
                    }
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {

                },
            },
        },
        MuiStepConnector: {
            styleOverrides: {
                line: {
                    borderLeft: '1px dotted #222',
                    minHeight: '70px',
                },
            },
        },
        MuiStepContent: {
            styleOverrides: {
                root: {
                    borderLeft: '1px dotted #222',
                },
            }
        },
        MuiStepIcon: {
            styleOverrides: {
                root: {
                    color: '#fff',
                    border: '7px solid #EFEFEF',
                    borderRadius: '50%',
                    '&.Mui-active': {
                        color: '#fff',
                        border: '7px solid #004080',
                        borderRadius: '50%',
                    },
                    '&.Mui-completed': {
                        color: '#fff',
                        border: '7px solid #004080',
                        borderRadius: '50%',
                    }
                },
                text: {
                    display: 'none',
                    '&.Mui-active': {
                        display: 'none',
                    }
                }
            }
        },

    },
});
type Anchor = 'bottom';

export default function LinearStepper() {
    const { i18 } = React.useContext(PageContext);
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const { setModal } = Store()
    const [activeStep, setActivestep] = React.useState(0);
    const [decodedPolyline, setDecodedPolyline] = React.useState([]);
    const screen = useScreenWidth()
    const pathToStepMapping: any = {
        "/tracking/details/": 1,
        "/tracking/payments/": 0,
        "/tracking/": 2,
        "/tracking/transit/": 3,
        "/tracking/delivered/": 4,
        "/tracking/reviews/": 5,
    };

    // Zustand persist hydration/loading check
    const [isHydrated, setIsHydrated] = React.useState(false);
    const trackingData = useTrackingStore((state) => state.trackingData);
    React.useEffect(() => {
        setIsHydrated(true);
    }, []);

    React.useEffect(() => {

    const checkAndDecodePolyline = () => {
        if (trackingData?.route?.overviewPolyline && window.google?.maps?.geometry) {
        const decoded: any = decodePolyline(trackingData?.route?.overviewPolyline);
        setDecodedPolyline(decoded);
        }
    };

    if (window.google?.maps?.geometry) {
        // If Google Maps is already loaded, decode immediately
        checkAndDecodePolyline();
    } else {
        // Add a listener for when the Google Maps library is fully loaded
        const intervalId = setInterval(() => {
        if (window.google?.maps?.geometry) {
            clearInterval(intervalId);
            checkAndDecodePolyline();
        }
        }, 100); // Check every 100ms
    }
    }, []);

    // Debug: show Zustand store content for troubleshooting

    // Now you can safely use trackingData below
    // console.log('trackingData11', trackingData)


    React.useLayoutEffect(() => {
        if (trackingData?.post?.status === 'Delivered') {
            setActivestep(2);
        } else if (trackingData?.post?.status === 'Transit') {
            setActivestep(1);
        } else {
            setActivestep(0); // default for paid but unknown status
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trackingData])

    const steps = [
        {
            label: 'Postier Parcel Pickup',
            description: 'Our courier will arrive at your location to collect the parcel. Make sure the item is securely packed and ready for handover at the scheduled time.'
        },
        {
            label: i18?.NEW?.PARCEL_IN_TRANSIT || 'Parcel In Transit',
            description: 'Your parcel is on its way! You can track its journey in real time as it moves through our delivery network to the destination.',
        },
        {
            label: 'Postier Delivered Parcels',
            description: 'The parcel has been successfully delivered to the recipient. Confirmation and proof of delivery will be available in your delivery history.',
            link: i18?.NEW?.CODE || 'Show Delivery Code',
            fnc: () => setModal('GenerateOTP', ({ Code: trackingData?.post?.consignee?.deliveryCode, type: 'drop' })),
            condition: (trackingData && trackingData?.post?.status === 'Transit') ? true : false,
        },
        {
            label: 'Ratings & Reviews',
            description: 'Hand over the parcel to the correct recipient and confirm delivery via app or code verification. Ensure a photo or signature is captured as proof of delivery.',
            link: 'Share your review and ratings for Postier',
            fnc: () => {},
            condition: (trackingData && trackingData?.post?.status === 'Delivered') ? true : false,
        },
        // ...(RoleSwitch !== 'postier'
        //     ? [
        //         {
        //             label: i18?.NEW?.PARCEL_IN_TRANSIT || 'Parcel In Transit',
        //             description: i18?.NEW?.YOUR_PARCEL || 'Your parcel is on its way! You can track its journey in real time as it moves through our delivery network to the destination.',
        //         },
        //         {
        //             label: i18?.NEW?.POSTIER_DELIVERED_PARCELS || 'Postier Delivered Parcels',
        //             description: i18?.NEW?.PARCEL_SUCCESS || 'The parcel has been successfully delivered to the recipient. Confirmation and proof of delivery will be available in your delivery history.',
        //             link: RoleSwitch === 'postier' ? undefined : i18?.NEW?.CODE || 'Show Delivery Code',
        //             fnc: () => setModal('GenerateOTP', ({ Code: MyParcelsDetails?.consignee?.deliveryCode, type: 'drop' })),
        //             condition: (MyParcelsDetails && trackingData?.post?.status === 'Transit') ? true : false,

        //         },
        //         {
        //             label: i18?.NEW?.RATINGS_REVIEWS || 'Ratings & Reviews',
        //             description: i18?.NEW?.EXPERIENCE || 'Share your experience! Let us know how we did and help improve our service for future deliveries',
        //             link: RoleSwitch === 'postier' ? undefined : i18?.NEW?.POSTIER_RATING || 'Share your review and ratings for Postier',
        //             fnc: () => setModal('reviewandrating'),
        //             condition: (MyParcelsDetails && trackingData?.post?.status === 'Delivered') ? true : false
        //         },
        //     ]
        //     : []),
    ];
    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({ ...state, [anchor]: open });
            };
    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: anchor === 'bottom' ? 'auto' : 250, height: '450px' }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <div className='p-[30px] bg-[#fff]'>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {steps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel >
                                    {step.label}
                                    <Typography sx={{ my: '15px' }}>{step.description}</Typography>
                                    {
                                        step?.condition &&
                                        <p onClick={step.fnc && step.fnc} className='text-[14px] font-[400] leading-[15px] underline cursor-pointer'>{step?.link}</p>
                                    }
                                </StepLabel>

                            </Step>
                        ))}
                    </Stepper>
                </div>
            </List>

        </Box>
    );

    // console.log('trackingDatacoords', trackingData?.post?.location?.startCoords?.coordinates)
    return (

                <div className={` ${screen.width && screen.width > 1054 ? 'flex gap-[20px]' : 'flex'} `}>
                    <div className={` ${screen.width && screen.width > 1054 ? 'w-1/4' : 'fixed bottom-0 w-[100%] bg-white shadow-[0_0_6px_rgba(0,0,0,0.1)] h-[50px] text-center z-[9] flex justify-center item-center'} `}>
                        <ThemeProvider theme={theme}>
                            {
                                (screen.width && screen.width > 1054) ?
                                    <div className='p-[30px] bg-[#FBFBFB] flex'>
                                        <Stepper activeStep={activeStep} orientation="vertical" className=''>
                                            {steps.map((step, index) => (
                                                <Step key={step.label}>
                                                    <StepLabel>
                                                        {step.label}
                                                        <Typography sx={{ my: '15px' }}>{step.description}</Typography>
                                                        {
                                                            step?.condition &&
                                                            <p onClick={step.fnc && step.fnc} className='text-[14px] font-[400] leading-[15px] underline cursor-pointer'>{step?.link}</p>
                                                        }
                                                    </StepLabel>

                                                </Step>
                                            ))}
                                        </Stepper>
                                    </div> :
                                    <div>
                                        {(['bottom'] as const).map((anchor) => (
                                            <React.Fragment key={anchor}>
                                                <Button onClick={toggleDrawer(anchor, true)} className='text-600'>Track Parcel</Button>
                                                <SwipeableDrawer
                                                    anchor={anchor}
                                                    open={state[anchor]}
                                                    onClose={toggleDrawer(anchor, false)}
                                                    onOpen={toggleDrawer(anchor, true)}
                                                >
                                                    {list(anchor)}
                                                </SwipeableDrawer>
                                            </React.Fragment>
                                        ))}
                                    </div>
                            }
                        </ThemeProvider>
                    </div>

            <div className={` ${screen.width && screen.width > 1054 ? 'w-3/4' : 'w-[100%]'} `}>
                {trackingData && Object.keys(trackingData).length > 0 && (
                    <div className='w-full xl:h-full h-[80vh]'>
                        <LoaderScript>
                            <RouteMap
                                startCoords={[parseFloat(trackingData?.post?.location?.startCoords?.coordinates[0]), parseFloat(trackingData?.post?.location?.startCoords?.coordinates[1])]}
                                endCoords={[parseFloat(trackingData?.post?.location?.endCoords?.coordinates[0]), parseFloat(trackingData?.post?.location?.endCoords?.coordinates[1])]}
                                // screen={{ width: '1200' }}
                                SingleRoutes={decodedPolyline}
                                MyParcelsDetails={trackingData}
                                MyTripsDetails={trackingData}
                                // ParcelRequest={ParcelRequest}
                                ParcelRequest={trackingData?.post}
                            />
                        </LoaderScript>
                    </div>
                )}
            </div>
        </div>
    );
}
