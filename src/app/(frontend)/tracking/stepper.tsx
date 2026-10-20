"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
  createTheme,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  ThemeProvider,
} from "@mui/material";
import { root } from "postcss";
import { color } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import ParcelStore from "@/app/store/parcel";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import useScreenWidth from "@/app/hooks/usescreenwidth";
import Store from "@/app/store/store";
import RoleStore from "@/app/store/RoleStore";
import PageContext from "@/app/providers/pagecontext";
import Button from "@/app/component/button";
import { useMutation } from "@tanstack/react-query";
import useSnackbarStore from "@/app/store/toaster";
import { FinishTrip } from "@/app/tools/mutatefn/tripReq";

const theme = createTheme({
  components: {
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: "17px",
          color: "#222",
          fontWeight: "700",

          "&.Mui-active": {
            fontSize: "17px",
            color: "#222",
            fontWeight: "700",
          },
          "&.Mui-completed": {
            fontSize: "17px",
            color: "#222",
            fontWeight: "700",
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {},
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderLeft: "1px dotted #222",
          minHeight: "70px",
        },
      },
    },
    MuiStepContent: {
      styleOverrides: {
        root: {
          borderLeft: "1px dotted #222",
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: "#fff",
          border: "7px solid #EFEFEF",
          borderRadius: "50%",
          "&.Mui-active": {
            color: "#fff",
            border: "7px solid #004080",
            borderRadius: "50%",
          },
          "&.Mui-completed": {
            color: "#fff",
            border: "7px solid #004080",
            borderRadius: "50%",
          },
        },
        text: {
          display: "none",
          "&.Mui-active": {
            display: "none",
          },
        },
      },
    },
  },
});
type Anchor = "bottom";

export default function LinearStepper() {
  const { i18 } = React.useContext(PageContext);
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  // const [activeStep, setActiveStep] = React.useState(0);
  const pathname = usePathname();
  const { setModal } = Store();
  const { RoleSwitch } = RoleStore();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const {
    FetchMyparcelsDetails,
    FetchMyTripsDetails,
    MyParcelsDetails,
    MyTripsDetails,
  }: any = ParcelStore();
  const router = UseLoadingRouter();
  const [activeStep, setActivestep] = React.useState(0);
  const searchParams: any = useSearchParams();
  const currentParams = new URLSearchParams(searchParams);
  const postId: any = currentParams.get("parcelid");
  const tripId: any = currentParams.get("tripid");
  const PostId: any = postId ? postId : null;
  const screen = useScreenWidth();
  const pathToStepMapping: any = {
    "/tracking/details/": 1,
    "/tracking/payments/": 0,
    "/tracking/": 2,
    "/tracking/transit/": 3,
    "/tracking/delivered/": 4,
    "/tracking/reviews/": 5,
  };
  // const activeStep = pathToStepMapping[pathname] ?? 0;

  React.useLayoutEffect(() => {
    if (RoleSwitch === "user") {
      const hasConsigneeDetails = MyParcelsDetails.consignee?.firstName !== "";
      const isPaid = MyParcelsDetails.paymentStatus === "PAID";

      // Step 0: Fill in details
      if (!hasConsigneeDetails) {
        setActivestep(0);
        router.push(`/tracking/details?${currentParams}`);
      }
      // Step 1: Go to payment if details are filled but not paid
      else if (hasConsigneeDetails && !isPaid) {
        setActivestep(1);
        router.push(`/tracking/payments?${currentParams}`);
      }
      // Step 2-4: Tracking (once paid)
      else if (isPaid) {
        if (MyParcelsDetails.status === "Delivered") {
          setActivestep(2);
        } else if (MyParcelsDetails.status === "Transit") {
          setActivestep(1);
        } else if (MyParcelsDetails.status === "Accepted") {
          setActivestep(0);
        } else {
          setActivestep(1); // default for paid but unknown status
        }
        router.push(`/tracking?${currentParams}`);
      }
    } else {
      if (MyParcelsDetails.status === "Delivered") {
        setActivestep(2);
      } else if (MyParcelsDetails.status === "Transit") {
        setActivestep(1);
        router.push(`/tracking?${currentParams}`);
      } else if (MyParcelsDetails.status === "Accepted") {
        setActivestep(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MyParcelsDetails, pathname]);

  // console.log(MyParcelsDetails.paymentStatus, "sss", RoleSwitch , MyParcelsDetails.status);
    const steps = [
        ...(MyParcelsDetails?.paymentStatus === "PAID" && RoleSwitch === "user" ? [] : [
          {
              label: RoleSwitch === 'postier' ? i18?.NEW?.PICK_UP_PARCEL || 'Pick-up Parcel' : i18?.NEW?.ENTER_SENDER_RECEIVER_DETAILS || 'Enter Sender & Receiver Details',
              description: RoleSwitch === 'postier' ? i18?.NEW?.COLLECT_THE_PARCEL || 'Collect the parcel from the sender at the scheduled location. Verify the pickup code and inspect the package for secure sealing before confirming pickup.' : i18?.NEW?.ACCURATE_INFO || 'Fill in accurate information about the sender and receiver to ensure smooth delivery. This includes names, addresses, and contact detail',
          },
          {
              label: RoleSwitch === 'postier' ?i18?.NEW?.IN_TRANSIT || 'In Transit'  : i18?.NEW?.INITIATE_PAYMENT || 'Initiate Payment',
              description: RoleSwitch === 'postier' ?i18?.NEW?.TRANSPORT || 'Safely transport the parcel to the destination. Handle with care and follow the assigned delivery route. Keep the recipient informed if there are any delays.'  : i18?.NEW?.PAYMENT_METHOD || 'Choose Payment Method',
          },
        ]),
        ...(MyParcelsDetails.paymentStatus !== "PAID" && RoleSwitch === "user" ? [] : [
          {
              label: RoleSwitch === 'postier' ? i18?.NEW?.PARCEL_DELIVERED || 'Parcel Delivered' : i18?.NEW?.POSTIER_PARCEL_PICKUP || 'Postier Parcel Pickup',
              description: RoleSwitch === 'postier' ? i18?.NEW?.DELIVERED_PARCEL || 'Hand over the parcel to the correct recipient and confirm delivery via app or code verification. Ensure a photo or signature is captured as proof of delivery.' : i18?.NEW?.COLLECT_PARCEL || 'Our courier will arrive at your location to collect the parcel. Make sure the item is securely packed and ready for handover at the scheduled time.',
              link: RoleSwitch === 'postier' ? undefined : 'Show PickUp Code',
              fnc: () => setModal('GenerateOTP', ({ Code: MyParcelsDetails?.pickUpCode, type: 'pickup' })),
              condition: (MyParcelsDetails && MyParcelsDetails.paymentStatus == "PAID" && (MyParcelsDetails.status === 'Accepted' || MyParcelsDetails.status === 'Pickedup')) ? true : false,
              button: true,
              condition2: (MyParcelsDetails && MyParcelsDetails?.status === 'Delivered') ? true : false,
          },
        ]),
        ...(RoleSwitch !== 'postier' && MyParcelsDetails.paymentStatus == "PAID"
            ? [
                {
                    label: i18?.NEW?.PARCEL_IN_TRANSIT || 'Parcel In Transit',
                    description: i18?.NEW?.YOUR_PARCEL || 'Your parcel is on its way! You can track its journey in real time as it moves through our delivery network to the destination.',
                },
                {
                    label: i18?.NEW?.POSTIER_DELIVERED_PARCELS || 'Postier Delivered Parcels',
                    description: i18?.NEW?.PARCEL_SUCCESS || 'The parcel has been successfully delivered to the recipient. Confirmation and proof of delivery will be available in your delivery history.',
                    link: RoleSwitch === 'postier' ? undefined : i18?.NEW?.CODE || 'Show Delivery Code',
                    fnc: () => setModal('GenerateOTP', ({ Code: MyParcelsDetails?.consignee?.deliveryCode, type: 'drop' })),
                    condition: (MyParcelsDetails && MyParcelsDetails.status === 'Transit') ? true : false,

                },
                {
                    label: i18?.NEW?.RATINGS_REVIEWS || 'Ratings & Reviews',
                    description: i18?.NEW?.EXPERIENCE || 'Share your experience! Let us know how we did and help improve our service for future deliveries',
                    link: RoleSwitch === 'postier' ? undefined : i18?.NEW?.POSTIER_RATING || 'Share your review and ratings for Postier',
                    fnc: () => setModal('reviewandrating'),
                    condition: (MyParcelsDetails && MyParcelsDetails.status === 'Delivered') ? true : false
                },
            ]
            : []),
    ];
  React.useEffect(() => {
    const Type = "payment";
    // console.log(postId, "postI");
    FetchMyparcelsDetails(postId, Type);
    FetchMyTripsDetails(tripId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };
  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "bottom" ? "auto" : 250, height: "450px" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <div className="p-[30px] bg-[#fff]">
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  {step.label}
                  <Typography sx={{ my: "15px" }}>
                    {step.description}
                  </Typography>
                  {step?.condition && (
                    <p
                      onClick={step.fnc && step.fnc}
                      className="text-[14px] font-[400] leading-[15px] underline cursor-pointer"
                    >
                      {step?.link}
                    </p>
                  )}
                  {step?.button &&
                    RoleSwitch === "postier" &&
                    step?.condition2 && (
                      <Button className="px-6 py-3 bg-btncolor text-[#fff]">
                        Finish Trip
                      </Button>
                    )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </List>
    </Box>
  );
  // console.log("RoleSwitch", RoleSwitch);
  // console.log("MyParcelsDetails", MyParcelsDetails);
  const Put = useMutation({
    mutationFn: FinishTrip,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      router.push(`/deliveryDetails/?id=${tripId}`);
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const handleClick = () => {
    Put.mutateAsync({ tripId: tripId, status: "Finished" });
  };
  return (
    <ThemeProvider theme={theme}>
      {screen.width && screen.width > 1054 ? (
        <div className="p-[30px] bg-[#FBFBFB] shadow-xl h-full">
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  {step.label}
                  <Typography sx={{ my: "15px" }}>
                    {step.description}
                  </Typography>
                  {step?.condition && (
                    <p
                      onClick={step.fnc && step.fnc}
                      className="text-[14px] font-[400] leading-[15px] underline cursor-pointer"
                    >
                      {step?.link}
                    </p>
                  )}
                  {step?.button &&
                    RoleSwitch === "postier" &&
                    step?.condition2 && (
                      <Button
                        onClick={handleClick}
                        className="px-6 py-3 bg-btncolor text-[#fff] rounded-[7px]"
                      >
                        Finish Trip
                      </Button>
                    )}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      ) : (
        <div>
          {(["bottom"] as const).map((anchor) => (
            <React.Fragment key={anchor}>
              <Button onClick={toggleDrawer(anchor, true)} className="text-600">
                Track Parcel
              </Button>
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
      )}
    </ThemeProvider>
  );
}
