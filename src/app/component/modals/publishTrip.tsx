import Store from "@/app/store/store";
import Button from "../button";
import { useMutation } from "@tanstack/react-query";
import { CreateTrip, UpdateTrip } from "@/app/tools/mutatefn/Parcelpost";
import useSnackbarStore from "@/app/store/toaster";
import StoreParcel from "@/app/store/store-parcel";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import DateTimePickers from "@/app/(create)/components/datetimepicker";
import { RequestFor } from "@/app/tools/mutatefn/request";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import ThreeDotLoader from "../threedotloader";
import useLoaderStore from "@/app/hooks/loader";
import ParcelStore from "@/app/store/parcel";


export default function PublishTripModal({ data }: any) {
   const { i18 } = useContext(PageContext);
   const param = useSearchParams()
   const path = usePathname()
   const { loading } = useLoaderStore()
   const Trip_id = param.get('trip_id')
   const router = UseLoadingRouter();
   const suggestion_id = param.get('id')
   const amount = param.get('amount')
   const { setModal } = Store()
   const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const estimatestorage = localStorage.getItem('estimationnew');
    const estimationObj = estimatestorage ? JSON.parse(estimatestorage) : null;
   
   const { Parceldata, clearAllParcelData } = StoreParcel()
   const type = data?.type
   const [schedule, setSchedule] = useState('')

   const handleDateChange = (date: any) => {
      if (date) {
         const data = dayjs(date)
         const dateformat = data.format('YYYY-MM-DDTHH:mm:ss.000') + 'Z'
         setSchedule(dateformat);
      }
   };
   const REQ = useMutation({
      mutationFn: RequestFor,
      onSuccess: (data: any) => {
         showSnackbar(data.message, "success");
      },
      onError: (err) => {
         showSnackbar(err.message, "error");
      }
   })
   const Post = useMutation({
      mutationFn: CreateTrip,
      onSuccess: (item) => {
         showSnackbar(item.data.message, "success");

         // if (suggestion_id !== null) {
         //    REQ.mutateAsync({ Trip_id: data?.data?.trip?._id, Parcel_id: suggestion_id, ...(amount && { data: { amount: amount, status: 'Bidded' } }) })
         // }
         setModal('')
         if (path === '/choosetrip/') {
            setModal('biddinginchat', ({ Trip_id: item?.data?.trip?._id, Parcel_id: suggestion_id, amount: item?.data?.trip?.avgPrice, ...(data?.redirectUrl && { redirectUrl: data?.redirectUrl }) }));
         } else {
            router.push('/mytrips/')
            clearAllParcelData()
         }
      },
      onError: (err) => {
         showSnackbar(err.message, "error");
      }
   })
   const Update = useMutation({
      mutationFn: UpdateTrip,
      onSuccess: (data) => {
         showSnackbar(data.data.message, "success");
         setModal('')
         router.push('/mytrips/')
         clearAllParcelData()
      },
      onError: (err) => {
         showSnackbar(err.message, "error");
      }
   })
   const handlePublish = () => {
      // debugger
      const data = Parceldata;
      const values: any = {};
      if (data.desc) {
         values.description = data.desc
      }
      const val: any = schedule !== '' ? true : false
      values.isScheduleLater = val
      if (val) {
         values.scheduleTime = schedule
      }
      if (data.category) {
         const val = data.category.map((item: any) => item?.name).join(', ');
         values.type = val
      }
      if (data?.pickUpCity) {
         values.pickUpCity = data?.pickUpCity
      }
      if (data?.dropCity) {
         values.dropCity = data?.dropCity
      }
      if (data?.pickupLng) {
         values.pickupLng = data?.pickupLng
      }
      if (data?.pickupLat) {
         values.pickupLat = data?.pickupLat
      }
      if (data?.dropLng) {
         values.dropLng = data?.dropLng
      }
      if (data?.deliveryType) {
         values.deliveryType = data?.deliveryType
      }
      if (data?.dropLat) {
         values.dropLat = data?.dropLat
      }
      if (data?.pickupDate) {
         values.pickupDate = data?.pickupDate
      }
      if (data?.deliveryDate) {
         values.deliveryDate = data?.deliveryDate
      }
      if (data?.dimensionType) {
         values.dimensionType = data?.dimensionType
      }
      if (data?.VehicleCapacity) {
         values.capacity = parseInt(data?.VehicleCapacity)
      }

      if (data?.weight) {
         values.maxWeight = parseInt(data?.weight)
      }
      if (data?.width) {
         values.maxWidth = parseInt(data?.width)
      }
      if (data?.height) {
         values.maxHeight = parseInt(data?.height)
      }
      if (data?.length) {
         values.maxLength = parseInt(data?.length)
      }
      // if (data?.Price) {
      //    values.avgPrice = parseInt(data?.Price)
      // }
       if (estimationObj?.estimation?.finalPrice) {
         // data.price = estimationObj?.estimation?.finalPrice;
      }
      values.avgPrice = estimationObj?.estimation?.finalPrice || parseInt(data?.Price);
      if (data?.wayPointId) {
         values.wayPointId = data?.wayPointId
      }
      if (data?.vehicleId) {
         values.vehicleId = data?.vehicleId
      }
      if (data?.stopPointsArr) {
         values.stopPointsArr = data?.stopPointsArr
      }
      if (data?.instantBooking) {
         values.instantBooking = data?.instantBooking
      }
      if (data?.pickup) {
         values.pickup = data?.pickup
      }
      if (data?.drop) {
         values.drop = data?.drop
      }
      if (Trip_id) {
         Update.mutateAsync({ Trip_id, values })
      } else {
         Post.mutateAsync(values)
      }

   }

   // console.log('Parceldata', Parceldata)
   return (
      type === 'publish'
         ?
         <div className="flex flex-col gap-6">
            <p className="text-[34px] leading-[31px] font-[700] text-center">{i18?.NEW?.CONFIRMATION || "Confirmation"}</p>
            <p className="text-[20px] leading-[31px] font-[500] text-center w-full md:max-w-[567px]">{i18?.NEW?.PUBLISH_TRIP_PROMPT || "Do you want to publish your trip and accept parcel request from the customers?"}</p>
            <div className="flex justify-center gap-6">
               {
                  loading ?
                     <Button className="bg-[#EBEBEB] py-[15px] px-[25px] rounded-full">
                        <ThreeDotLoader />
                     </Button>
                     :
                     <Button onClick={handlePublish} className="bg-btncolor text-[#fff] py-[15px] px-[25px] rounded-full">
                        {i18?.NEW?.CONFIRM_ADD_TRIP_BUTTON || "Confirm Add Trip"}
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
            <DateTimePickers onDate={handleDateChange} date={schedule} maximumDate={Parceldata?.pickupDate} type='schedule'/>
            <div className="flex justify-center gap-6">
               {
                  loading ?
                     <Button className="bg-[#EBEBEB] py-[15px] px-[25px] rounded-full">
                        <ThreeDotLoader />
                     </Button>
                     :
                     <Button onClick={handlePublish} className="bg-btncolor text-[#fff] py-[15px] px-[25px] rounded-full">
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