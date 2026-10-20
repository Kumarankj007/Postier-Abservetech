import {  IconButton, InputAdornment, Typography } from "@mui/material"
import {  payments, tax } from "../../../content"
import { Controller, useForm } from "react-hook-form"
import Input from "./input"
import BpCheckbox from "./../component/checkbox"
import Button from "./button"
import { useState } from "react"
import DatePickerComp from "./datepicker"
import Image from "next/image"

type Inputs = {
    cardnum: string
    name: string
    date: string
    cvv: string
}

export default function Card() {
    const [showPassword, setShowPassword] = useState(false);
    const { handleSubmit, formState: { errors }, control } = useForm<Inputs>({

    });
    const handleNext = () => {

    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return(
        <>
         <h2 className="font-medium text-[17px] mb-6">Pay Using Cards</h2>
            <div className="flex flex-col">
                <div className="flex flex-col gap-8">
                    <div className="flex gap-5">
                        <Image width={20} height={20} src='/png/Mastercard_logo.png' alt='png' />
                        <Image width={20} height={20} src='/png/visa-card-png.png' alt='png' />
                    </div>
                    <form onSubmit={handleSubmit(handleNext)}>
                        <div className="flex flex-col gap-6">
                            <Controller
                                name="cardnum"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'card number is required' }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label='Enter your card number'
                                        type="text"
                                        error={!!errors.cardnum}
                                    />
                                )}
                            />
                            {/* {errors.cardnum && <span className='text-red-700'>{errors.cardnum.message}</span>} */}

                            <Controller
                                name="name"
                                control={control}
                                defaultValue=""
                                rules={{ required: ' Name is required' }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        label='Enter your name'
                                        type="text"
                                        error={!!errors.name}
                                    />
                                )}
                            />
                            {/* {errors.name && <span className='text-red-700'>{errors.name.message}</span>} */}

                            <Controller
                                name="date"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Date is required' }}
                                render={({ field }) => (
                                    <DatePickerComp
                                        {...field}
                                        label='Card Expiration Date'
                                        error={!!errors.date}
                                    />
                                )}
                            />
                            {/* {errors.date && <span className='text-red-700'>{errors.date.message}</span>} */}

                            <Controller
                                name="cvv"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'CVV is required' }}
                                render={({ field }) => (
                                    <div className="">
                                        <Input
                                            {...field}
                                            label='Enter your CVV'
                                            type={showPassword ? 'text' : 'password'}
                                            error={!!errors.cvv}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <Image width={20} height={20} src="/svg/icon/unlock.svg" alt="svg" /> : <Image width={20} height={20} src="/svg/icon/lock.svg" alt="svg" />}
                                                    </IconButton>
                                                </InputAdornment>,
                                            }}

                                        />

                                    </div>
                                )}
                            />
                            {/* {errors.cvv && <span className='text-red-700'>{errors.cvv.message}</span>} */}

                            <div className='flex items-center gap-4'>
                                <BpCheckbox />
                                <p className='text-[17px] font-normal'>Save Card</p>
                            </div>

                            <div className="flex">
                                <Button className='px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer' type="submit">Pay Now</Button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="border border-[#fff] rounded-[11px] py-[66px]">
                    <h3 className="font-bold text-[17px] mb-8">Payment Summary</h3>
                    <div className="flex flex-col gap-6">
                        {
                            payments.map((item: any) => {
                                return (
                                    <div key={item} className="flex justify-between">
                                        <p className="font-normal text-[17px]">
                                            {item.label1}
                                        </p>
                                        <p className="font-normal text-[17px]">
                                            {item.label2}
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <hr className="my-12" />
                    <div className="flex flex-col gap-6">
                        {
                            tax.map((item: any) => {
                                return (
                                    <div key={item} className="flex justify-between">
                                        <p className="font-normal text-[17px]">
                                            {item.label1}
                                        </p>
                                        <p className="font-normal text-[17px]">
                                            {item.label2}
                                        </p>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <hr className="my-12" />
                    <div className="flex justify-between">
                        <p className="font-normal text-[17px]">
                            Total
                        </p>
                        <p className="font-normal text-[17px]">
                            $35
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}