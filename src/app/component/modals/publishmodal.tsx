import Store from "@/app/store/store";
import Button from "../button";
import { useMutation } from "@tanstack/react-query";
import { CreateParcel, UpdateParcel } from "@/app/tools/mutatefn/Parcelpost";
import useSnackbarStore from "@/app/store/toaster";
import StoreParcel from "@/app/store/store-parcel";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DateTimePickers from "@/app/(create)/components/datetimepicker";
import { RequestFor, RequestForUpdate } from "@/app/tools/mutatefn/request";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import path from "path";
import PageContext from "@/app/providers/pagecontext";
import useTransitionStore from "@/app/store/transition";
import useLoaderStore from "@/app/hooks/loader";
import ThreeDotLoader from "../threedotloader";
import ParcelStore from "@/app/store/parcel";

dayjs.extend(utc);
dayjs.extend(timezone);


export default function PublishModal({ data }: any) {
    const { i18 } = useContext(PageContext);
    const { setModal } = Store()
    const { loading } = useLoaderStore()
    const param = useSearchParams()
    const path = usePathname()
    const Parcel_id = param.get('parcel_id')
    const suggestion_id = param.get('id')
    const router = UseLoadingRouter();
    const { setPending } = useTransitionStore();
    const { MyTripsDetails }: any = ParcelStore()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const { Parceldata, clearAllParcelData } = StoreParcel()
    const [schedule, setSchedule] = useState('')
    const type = data?.type
    const estimatestorage = localStorage.getItem('estimationnew');
    const estimationObj = estimatestorage ? JSON.parse(estimatestorage) : null;

    const REQ = useMutation({
        mutationFn: RequestForUpdate,
        onSuccess: (data: any) => {
            showSnackbar(data.message, "success");

        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })

    const Post = useMutation({
        mutationFn: CreateParcel,
        onSuccess: (data) => {
            showSnackbar(data.data.message, "success");
            setModal('')
            if (path === '/chooseparcel/') {
                if (MyTripsDetails?.instantBooking === 'inactive') {
                    setModal('biddinginchat', ({ Trip_id: suggestion_id, Parcel_id: data?.data?.post?._id, data: { amount: data?.data?.post?.parcel?.fare } }));
                }
                else if (MyTripsDetails?.instantBooking === 'active') {
                    router.push(`/tracking/payments?parcelid=${data?.data?.post?._id}&tripid=${suggestion_id}`)
                }
            } else {
                router.push('/mypost/')
                clearAllParcelData()
            }
            // if(suggestion_id !== null){
            //     REQ.mutateAsync({ Trip_id: suggestion_id, Parcel_id: data?.data?.post?._id })
            // }
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    const Update = useMutation({
        mutationFn: UpdateParcel,
        onSuccess: (data) => {
            showSnackbar(data.data.message, "success");
            setModal('')
            router.push('/mypost/')
            clearAllParcelData()
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
        }
    })
    // console.log('data', type)
    const handlePublish = () => {
        // debugger
        const formData = new FormData();
        const data = Parceldata;

        if (estimationObj?.estimation?.finalPrice) {
            // data.price = estimationObj?.estimation?.finalPrice;
            data.fare = estimationObj?.estimation?.finalPrice;
        }


        formData.append('description', data.desc)
        const val: any = schedule !== '' ? true : false
        formData.append('isScheduleLater', val)

        if (val) {
            formData.append('scheduleTime', schedule)
        }
        const fileFields = ['frontviewImage', 'primaryImage', 'sideviewImage', 'topviewImage'];
        fileFields.forEach((field) => {
            if (Array.isArray(data[field]) && data[field].length > 0) {
                data[field].forEach((file: any) => formData.append(field, file));
            }
        });
        ;
        Object.keys(data).forEach((key) => {
            if (key === 'pickupAddress' || key === 'dropAddress') {
                formData.append(key, data[key].primaryAddress);
            }
            else if (!fileFields.includes(key) && key !== 'category') {
                formData.append(key, data[key]);
            }
            else if (key === 'pickupDate' || key === 'deliveryDate') {
                formData.append(key, data[key] + 'Z');
            }
        });

        const categoryString = data.category.map((item: any) => item.name).join(',');
        formData.append('type', categoryString);
        const logFormData = (formData: any) => {
            for (const [key, value] of formData.entries()) {
                // console.log(`${key}:`, value);
            }
        };
        logFormData(formData)
        if (Parcel_id) {
            Update.mutateAsync({ Parcel_id, formData })
        } else {
            Post.mutateAsync(formData)
        }
    }
    const handleDateChange = (date: any) => {
        if (date) {
            const data = dayjs.utc(date)
            const dateformat = data.format('YYYY-MM-DDTHH:mm:ss.000Z')
            setSchedule(dateformat);
        }
    };
    // console.log('Parceldata', Parceldata)
    return (
        type === 'publish'
            ?
            <div className="flex flex-col gap-6">
                <p className="text-[34px] leading-[31px] font-[700] text-center">{i18?.NEW?.CONFIRMATION || "Confirmation"}</p>
                <p className="text-[20px] leading-[31px] font-[500] text-center w-full md:max-w-[567px]">{i18?.NEW?.CONFIRM_SEND_PARCEL || "Do you confirm the request to send your parcel, ensuring all details provided are accurate and ready for processing?"}</p>
                <div className="flex justify-center gap-6">
                    {
                        loading ?
                            <Button className="bg-[#EBEBEB] py-[15px] px-[25px] rounded-full">
                                <ThreeDotLoader />
                            </Button>
                            :
                            <Button onClick={handlePublish} className="bg-btncolor text-[#fff] py-[15px] px-[25px] rounded-full">
                                {i18?.NEW?.CONFIRM_SEND_PARCEL_BUTTON || "Confirm Send Parcel"}
                            </Button>
                    }

                    <Button onClick={() => setModal('')} className="border boder-1 border-btncolor text-btncolor py-[15px] px-[25px] rounded-full">
                        {i18?.NEW?.CANCEL_BUTTON || "Cancel"}
                    </Button>
                </div>
            </div>
            :
            <div className="flex flex-col gap-6 justify-center">
                <p className="text-[34px] leading-[31px] font-[700] text-center">{i18?.NEW?.SCHEDULE || "Schedule"}</p>
                <p className="text-[20px] leading-[31px] font-[500] text-center w-full ">{i18?.NEW?.PREFERRED_PUBLISH_DATETIME || "Select your preferred date & time for your parcel to publish"}</p>
                <DateTimePickers onDate={handleDateChange} date={schedule} type='schedule' minimumDate={dayjs()} maximumDate={Parceldata?.pickupDate} />
                <div className="flex justify-center gap-6">
                    {
                        loading ?
                            <Button className="bg-[#EBEBEB] py-[15px] px-[25px] rounded-full">
                                <ThreeDotLoader />
                            </Button>
                            :
                            <Button onClick={handlePublish} className="bg-btncolor text-[#fff] py-[15px] px-[25px] rounded-full" disabled={schedule === ''}>
                                {i18?.NEW?.SCHEDULE || "Schedule"}
                            </Button>
                    }

                    <Button onClick={() => setModal('')} className="border boder-1 border-btncolor text-btncolor py-[15px] px-[25px] rounded-full">
                        {i18?.NEW?.CANCEL_BUTTON || "Cancel"}
                    </Button>
                </div>
            </div>
    )
}