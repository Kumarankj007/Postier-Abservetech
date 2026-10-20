import React, { useState } from 'react'
import OTPInput from '../otpfield'
import { OTPConfig } from '@/interface';
import Store from '@/app/store/store';
import Button from '../button';
import { useMutation } from '@tanstack/react-query';
import { Tracking } from '@/app/tools/mutatefn/request';
import useSnackbarStore from '@/app/store/toaster';
import { useSearchParams } from 'next/navigation';
import ParcelStore from '@/app/store/parcel';
import TripandParcelRequests from '@/app/store/requests';

function Sendotp({ data }: any) {
    const {setOtp,setModal} = Store()
    const { FetchParcelRequest,ParcelRequest } = TripandParcelRequests()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const { FetchMyparcelsDetails }: any = ParcelStore()
    const searchParams: any = useSearchParams()
    const currentParams = new URLSearchParams(searchParams);
    const postId: any = currentParams.get('parcelid') ? currentParams.get('parcelid') : null
    const tripId: any = currentParams.get('tripid') ? currentParams.get('tripid') : null
    const [
        { otp, numInputs, separator, minLength, maxLength, placeholder, inputType },
        setConfig,
    ] = useState<OTPConfig>({
        otp: "",
        numInputs: 4,
        separator: "",
        minLength: 0,
        maxLength: 40,
        placeholder: "",
        inputType: "text",
    });

    const handleOTPChange = (otp: any) => {
        setConfig((prevConfig) => ({ ...prevConfig, otp }));
        setOtp(otp);
      };
    const Verify = useMutation({
        mutationFn:Tracking,
        onSuccess: (data) => {
            showSnackbar(data.data.message, "success");
            const Type = 'payment'
            FetchMyparcelsDetails(postId, Type)
            FetchParcelRequest(tripId, data , undefined)
            setModal('')
        },
        onError: (err) => {
            showSnackbar(err.message, "error");
          }
    })
      const handleverify = () => {
        Verify.mutateAsync( {Parcel_id: data?.parcelid, Trip_id: tripId,data:{status : data?.type === 'pickup' ? 'Pickedup' : 'Delivered' , code:otp }})
      }
    return (
        <div className='flex flex-col gap-6 items-center justify-center'>
            <p className='text-[34px] font-[700] text-[#222222] leading-[31px]'>{data?.type === 'pickup' ? 'Enter Pickup Code' : 'Enter Delivery Code'}</p>
            <p className='text-[20px] font-[400] text-[#222222] leading-[31px]  text-center'>
                Lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor incididunt.
            </p>

            <OTPInput
                inputStyle="inputStyle"
                numInputs={numInputs}
                onChange={handleOTPChange}
                // renderSeparator={<span>{separator}</span>}
                renderSeparator={(index) => <span key={index}>{separator}</span>}
                value={otp}
                placeholder={placeholder}
                inputType={inputType}
                renderInput={(props: any) => (
                    <input
                        {...props}
                        className="px-[20px] w-[60px] h-[60px] lg:w-[85px] lg:h-[85px] border border-[#B6B6B6] rounded-xl"
                    />
                )}
                shouldAutoFocus
            />

            <Button onClick={handleverify}  className={`${otp.toString().length !== 4 ? "bg-gray-400" : "bg-btncolor"} px-8 py-4 text-[#fff] rounded-full`}>
                Verify
            </Button>
        </div>
    )
}

export default Sendotp