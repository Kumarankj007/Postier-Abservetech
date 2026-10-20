import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Senderinfo from '@/app/component/profileDetails/parcelDetails/senderinfo';
import { useQuery } from '@tanstack/react-query';
import { fetchPostDetails } from '@/app/tools/queryfn/fetch';
import { ParcelObject } from '@/interface';
import { useSearchParams } from 'next/navigation';
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import Receiverinfo from '@/app/component/profileDetails/parcelDetails/receiverinfo';
import ParcelInfo from '@/app/component/profileDetails/parcelDetails/parcelinfo';
import Button from '@/app/component/button';
import Store from '@/app/store/store';
import { ThemeProvider, createTheme } from '@mui/material';
import Image from 'next/image';

const theme = createTheme({
    components: {
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    backgroundColor: '#004080',
                    borderRadius:'7px',
                    marginBottom:'15px',
                    boxShadow:'none',
                    borderBottom:'none'
                }
            }
        },
        MuiAccordion:{
            styleOverrides:{
                root:{
                    margin:'0px',
                    boxShadow:'none'
                }
            }
        }
    },
});

export default function AccordionComponent() {
     const  router  = UseLoadingRouter();
    const { setStep, setStepper } = Store()
    const searchParams: any = useSearchParams()
    const currentParams = new URLSearchParams(searchParams);
    const postId: any = currentParams.get('id')
    const PostId: any = postId ? postId : null
    const { data, error, isLoading } = useQuery({
        queryKey: ['post', { PostId }],
        queryFn: fetchPostDetails,
        retry: 0
    });
    const handleNavigate = (props: any) => {
        currentParams.set('type', 'edit')
        router.replace(`?${currentParams}`, { scroll: false })
        setStep(props.step)
        setStepper(props.stepper)
    }
    const ParcelDetails: ParcelObject = data ? data : {}
    return (
        <ThemeProvider theme={theme}>
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<Image width={20} height={20} src='/svg/icon/whitedownarrow.svg' alt='icon' className='w-[20px] h-[20px]'/>}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <h2 className="font-bold text-[15px] sm:text-[20px] md:text-[35px] text-[#fff] leading-[65px] text-center">
                        Sender Information
                    </h2>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='flex justify-end'>
                        <Button onClick={() => handleNavigate({ step: 1, stepper: 0 })} className="w-[60px] h-[60px] rounded-full bg-btncolor flex items-center justify-center">
                            <Image width={20} height={20} src='/svg/icon/pencil.svg' alt='svg' className="cursor-pointer" />
                        </Button>
                    </div>
                    <Senderinfo senderinfo={ParcelDetails ? ParcelDetails : {}}  />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<Image width={20} height={20} src='/svg/icon/whitedownarrow.svg' alt='icon'  className='w-[20px] h-[20px]'/>}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <h2 className="font-bold text-[15px] sm:text-[20px] md:text-[35px] text-[#fff] leading-[65px] text-center ">
                        Receiver Information
                    </h2>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='flex justify-end'>
                        <Button onClick={() => handleNavigate({ step: 3, stepper: 2 })} className="w-[60px] h-[60px] rounded-full bg-btncolor flex items-center justify-center">
                            <Image width={20} height={20} src='/svg/icon/pencil.svg' alt='svg' className="cursor-pointer" />
                        </Button>
                    </div>
                    <Receiverinfo receiverData={ParcelDetails?.receiver ? ParcelDetails?.receiver : {}} />
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<Image width={20} height={20} src='/svg/icon/whitedownarrow.svg' alt='icon'  className='w-[20px] h-[20px]'/>}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <h2 className="font-bold text-[15px] sm:text-[20px] md:text-[35px] text-[#fff] leading-[65px] text-center ">
                        Parcel Information
                    </h2>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='flex justify-end'>
                        <Button onClick={() => handleNavigate({ step: 2, stepper: 1 })} className="w-[60px] h-[60px] rounded-full bg-btncolor flex items-center justify-center">
                            <Image width={20} height={20} src='/svg/icon/pencil.svg' alt='svg' className="cursor-pointer" />
                        </Button>
                    </div>
                    <ParcelInfo parcelData={ParcelDetails?.parcel ? ParcelDetails?.parcel : {}} />
                </AccordionDetails>
            </Accordion>
        </ThemeProvider>
    );
}
