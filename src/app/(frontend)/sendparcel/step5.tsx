import { SendparcelInputs } from "@/interface";
import { Controller, useForm } from "react-hook-form";
import { packagecontent, parcelInfo, receiverInfo, senderinfo } from "../../../../content";
import Input from "@/app/component/input";
import CustomizedSwitches from "@/app/component/switch";
import React, { useState } from "react";
import Select from "@/app/component/select";
import Button from "@/app/component/button";
import Link from "next/link";
import Image from "next/image";


export default function Step5({ handleNext }: any) {
    const { handleSubmit, formState: { errors }, control } = useForm<SendparcelInputs>({

    });
    return (
        <div className='m-auto flex flex-col gap-5 items-center text-center'>
            <Image width={20} height={20} src='/svg/icon/success.svg' alt='svg' className='w-[100px] h-[100px]' />
            <p className='font-bold text-[15px] sm:text-[20px] md:text-[35px]'>
                Your Parcel Send Request Have <br />
                Been Submitted!
            </p>
            <p className='font-normal text-[16px] max-w-[600px]'>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
            <Link href="/mypost" className='font-normal text-[16px] max-w-[600px] underline decoration-1 text-btncolor' >
                View All Your Posts
            </Link>
        </div>
    )
}