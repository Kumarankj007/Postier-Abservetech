'use client'
import PhoneInputComponent from "@/app/component/phoneinput";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { useContext } from "react";
import PageContext from "@/app/providers/pagecontext";

export default function Verification() {
    const{ i18 } = useContext(PageContext);
     const  router  = UseLoadingRouter();
    const {
        formState: { errors },
        control,
        setValue,
    } = useForm<any>({});

    const handlePhoneChange = (value: any, data: any) => {
        const code = data.dialCode;
        const number = value.slice(code.length);
        setValue("phone", number);
        setValue("phoneCode", code);
    };
    return (
        <div className="flex h-full justify-center items-center">
            <div className="flex flex-col gap-6 sm:w-[400px] md:w-[600px]">
                <h2 className="font-bold text-[20px] sm:text-[30px] md:text-[40px] leading-[65px] text-center"> {i18?.NEW?.VERIFY_MOBILE_NUMBER || "Verify your mobile number"}</h2>
                <div>
                    <Controller
                        name="phonenumber"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <PhoneInputComponent
                                // value={field.value}
                                onPhoneChange={(number:any,code:any)=>{
                                    setValue("phone", number);
                                    setValue("phoneCode", code);
                                }}
                                errors={!!errors.phonenumber}
                                country={'us'} />
                        )}
                    />
                </div>
                <div className=" border-[1px] border-[#B7B7B7]" />
                <div className="cursor-pointer " onClick={()=>router.push('/')}>
                    <div className="flex justify-between hover:bg-[#EBEBEB] p-4 rounded-[8px]">
                        <p className="font-normal text-[17px]">
                            I&#39;ll do it later
                        </p>
                        <div className="flex gap-10">
                            <Image width={10} height={10} src='/svg/icon/rightarrow.svg' alt='svg' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}