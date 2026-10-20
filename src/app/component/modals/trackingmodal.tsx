import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { color } from 'framer-motion';
import { Rating } from '@mui/material';
import Input from '../input';
import { useMutation } from '@tanstack/react-query';
import useSnackbarStore from '@/app/store/toaster';
import { Review, Tracking } from '@/app/tools/mutatefn/tripReq';
import { useSearchParams } from 'next/navigation';
import Button from '../button';
import ReviewData from '@/app/store/reviews';
import PostDetailsStore from '@/app/store/parcelDetails';
import Store from '@/app/store/store';
import PageContext from '@/app/providers/pagecontext';



const theme = createTheme({
    components: {
        MuiStepConnector: {
            styleOverrides: {
                line: {
                    minHeight: '80px',
                    borderLeft: '2px dashed #004080',
                },
                root: {
                    '&.Mui-completed .MuiStepConnector-line': {
                        borderLeft: '2px solid #004080 !important'
                    }
                }
            }
        },
        MuiStepIcon: {
            styleOverrides: {
                root: {
                    color: 'transparent',
                    border: '2px solid #004080',
                    borderRadius: '50%',
                    '&.Mui-active': {
                        color: 'transparent',
                        border: '2px solid #004080',
                        borderRadius: '50%'
                    },
                    '&.Mui-completed': {
                        color: '#004080',
                        border: 'none'
                    }
                }
            }
        },


    }
});
export default function VerticalLinearStepper({ data }: any) {
    const { i18 } = React.useContext(PageContext);
    const { FetchReviews, Reviews } = ReviewData()
    const { setModal, Modalstepper, setModalStepper, ModalStep, setModalStep }: any = Store()
    const { fetchfindPost, }: any = PostDetailsStore()
    const findPost = data?.findPost || {}
    const [value, setValue] = React.useState<number | null>(0);
    const [review, setReview] = React.useState('');
    const [submittedReview, setSubmittedReview] = React.useState('');
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const searchParams: any = useSearchParams()
    const currentParams = new URLSearchParams(searchParams);
    const trip: any = currentParams.get('id')
    const tripId: any = trip ? trip : null
    const postId = findPost?._id || null
    const steps = [
        {
            label: i18?.TRACKINGMODAL?.PAYREC || 'Payment Received',
        },
        {
            label: i18?.TRACKINGMODAL?.INITIALPic ||'Order Pickup',
        },
        {
            label: i18?.TRACKINGMODAL?.PARCELTRANS ||'Parcel In Transit',
        },
        {
            label: i18?.TRACKINGMODAL?.PARCELDEl ||'Parcel Delivered',
        },
    
        {
            label: i18?.TRACKINGMODAL?.RATING ||'Rate & Review',
        },
    ];
    const StatusVal = () => {
        switch (ModalStep) {
            case 2:
                return 'Pickedup';
            case 3:
                return 'Transit';
            case 4:
                return 'Delivered';
            case 5:
                return 'Review'
            default:
                return null;
        }
    }
    const stepperValue = StatusVal()
    const Post = useMutation({
        mutationFn: Tracking,
        onSuccess: (data) => {
            showSnackbar(data.data.message, "success");
            setModalStep(ModalStep + 1);
            setModalStepper(Modalstepper + 1);
            fetchfindPost(tripId)
            // setModal('')
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    const ReviewPost = useMutation({
        mutationFn: Review,
        onSuccess: (data) => {
            showSnackbar(data.data.message, "success");
            setModalStep(6);
            setModalStepper(5);
            fetchfindPost(tripId)
            // FetchNearestMatches(PostId)
            // setModal('')
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    const handleNext = () => {
        const val = StatusVal()
        if (val !== 'Review') {
            Post.mutateAsync({ tripId, postId, val })
        }

    };
    const handleReview = () => {
        ReviewPost.mutateAsync({ value, review, id: postId, module: 'Post' })
    }

    const handleText = (event: any) => {
        setReview(event.target.value);
    };

    React.useEffect(() => {
        if (Reviews?.rating?.length !== 0 && Reviews?.rating?.length !== undefined) {
            setModalStep(6);
            setModalStepper(5);
        }  else if (findPost?.status === 'Delivered') {
            setModalStep(5);
            setModalStepper(4);
        } else if (findPost?.status === 'Transit') {
            setModalStep(4);
            setModalStepper(3);
        } else if (findPost?.status === 'Pickedup') {
            setModalStep(3);
            setModalStepper(2);
        }else if (findPost?.paymentStatus === "PAID") {
            setModalStep(2);
            setModalStepper(1);
        }
         else if (findPost?.status === 'Accepted') {
            setModalStep(1);
            setModalStepper(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 
    

    React.useEffect(() => {
        if(postId)
            FetchReviews({ moduleId: postId, moduleType: 'Post' })
    }, [FetchReviews, postId])
    // console.log('findPost', Reviews)
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ maxWidth: 400, marginTop: '20px' }}>
                <Stepper activeStep={Modalstepper} orientation="vertical">
                    {steps.map((step, index) => (
                        <Step key={step.label} sx={{ display: 'flex', height: '27px' }}>
                            <StepLabel
                            >
                                {step.label} 
                            </StepLabel>
                            <StepContent sx={{ borderLeft: '1px solid transparent' }}>
                                <Box sx={{ mb: 2 }}>
                                    {
                                        (ModalStep === 5 || ModalStep === 1 ) ?
                                            <>
                                            </>
                                            :
                                            <div>
                                                <Button
                                                    onClick={handleNext}
                                                    className='bg-btncolor py-2 px-4 text-[#fff] rounded'
                                                >
                                                    { i18?.TRACKINGMODAL?.BTN|| "Mark as completed"}
                                                </Button>

                                            </div>
                                    }
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {
                    ModalStep === 5 &&

                    <div className='flex flex-col gap-5 mt-5'>
                        <Rating onClick={(e: any) => setValue(e.target.value)} defaultValue={value ? value : 0} />
                        <Input
                            className='border border-[#004080] w-[100%] p-5 rounded-[7px] placeholder-black outline-none'
                            placeholder={i18?.NEW?.ENTER_YOUR_REVIEW || 'Enter your review'}
                            onChange={handleText}
                            value={review}
                        />
                        <div className='flex '>
                            <Button
                                onClick={handleReview}
                                className='bg-btncolor py-2 px-4 text-[#fff] rounded'
                            >
                                {i18?.NEW?.SUBMIT || "Submit"}
                            </Button>
                        </div>

                    </div>

                }
                {/* {submittedReview && (
                    <div className='flex flex-col gap-5 mt-5'>
                        <div className='flex gap-3'>
                            <Rating value={value} readOnly />
                            <p className='font-normal text-[17px] underline cursor-pointer' onClick={handleEdit}>Edit</p>
                        </div>
                        <p>{submittedReview}</p>
                    </div>
                )} */}
            </Box>
        </ThemeProvider>

    );
}
