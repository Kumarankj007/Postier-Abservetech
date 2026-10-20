'use client'
import ResetPassword from "@/app/(auth)/account/resetpassword/page";
import CustomBreadCrumb from "@/app/component/breadcrumbs";
import Button from "@/app/component/button";
import Input from "@/app/component/input";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import useSnackbarStore from "@/app/store/toaster";
import { ChangePassword } from "@/app/tools/mutatefn/auth";
import { ChangePassInputs } from "@/interface";
import { IconButton, InputAdornment } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function Changepassword() {
     const  router  = UseLoadingRouter();
    const { i18 } = useContext(PageContext);
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPassword2 = () => setShowPassword2((show) => !show);
    const handleClickShowPassword3 = () => setShowPassword3((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const { handleSubmit, formState: { errors }, control, watch } = useForm<ChangePassInputs>({
    });
    const saveMutation = useMutation({
        mutationFn: ChangePassword,
        onSuccess: (data) => {
            showSnackbar(data.data.message, 'success')
            router.push('/')
        },
        onError: (err) => {
            showSnackbar(err.message, 'error')

        }
    })
    const onSubmit = (data: ChangePassInputs) => {
        // console.log("data", data)
        saveMutation.mutateAsync(data)
    };
    return (
        <div className="flex flex-col mt-[50px]  m-[20px] md:m-[40px] lg:m-[70px]">
            <div className='mb-[50px]'>
                <CustomBreadCrumb pathSegments={i18?.NEW?.RESETPASS||'Reset Your Password'} />
            </div>
            <div className="m-auto flex flex-col gap-6 md:gap-10 p-5">
                <h2 className="font-bold text-[20px] sm:text-[30px] md:text-[50px] leading-265px] sm:leading-[35px] md:leading-[65px] text-center w-full md:w-[850px]">
                { i18?.LOGIN?.CHANGEPASSWORD || 'Reset your password'}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-6">
                        <div >
                            {/* Password */}
                            <Controller
                                name="oldpassword"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must have at least 6 characters',
                                    },
                                }}
                                render={({ field }) => (
                                    <div className='relative'>
                                        <Input
                                            {...field}
                                            label={i18?.NEW?.ENTER_OLD_PASSWORD || 'Enter your old password'}
                                            type={showPassword ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <Image width={20} height={20}  src="/svg/icon/unlock.svg" alt="svg" /> : <Image width={20} height={20} src="/svg/icon/lock.svg" alt="svg"/>}
                                                    </IconButton>
                                                </InputAdornment>,
                                            }}

                                        />

                                    </div>
                                )}
                            />
                            {errors.oldpassword && <span className='text-red-700'>{errors.oldpassword.message}</span>}
                        </div>
                        <div >
                            {/* Password */}
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must have at least 6 characters',
                                    },
                                }}
                                render={({ field }) => (
                                    <div className='relative'>
                                        <Input
                                            {...field}
                                            label={i18?.NEW?.ENTER_PASSWORD || 'Enter your password'}
                                            type={showPassword2 ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword2}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword2 ? <Image width={20} height={20} src="/svg/icon/unlock.svg" alt="svg" /> : <Image width={20} height={20} src="/svg/icon/lock.svg" alt="svg" />}
                                                    </IconButton>
                                                </InputAdornment>,
                                            }}

                                        />

                                    </div>
                                )}
                            />
                            {errors.password && <span className='text-red-700'>{errors.password.message}</span>}
                        </div>
                        <div>
                            <Controller
                                name="newpassword"
                                control={control}
                                defaultValue=""
                                rules={{
                                    required: 'Password confirmation is required',
                                    validate: value => value === watch('password') || 'Passwords do not match'
                                }}
                                render={({ field }) => (
                                    <div className='relative'>
                                        <Input
                                            {...field}
                                            label={i18?.NEW?.RECONFIRM_PASSWORD || 'Reconfirm Your Password'}
                                            type={showPassword3 ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="start">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword3}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword3 ? <Image src="/svg/icon/unlock.svg" alt="svg"  width={20} height={20} /> : <Image width={20} height={20}  src="/svg/icon/lock.svg" alt="svg" />}
                                                    </IconButton>
                                                </InputAdornment>,
                                            }}

                                        />

                                    </div>
                                )}
                            />
                            {errors.newpassword && <span className='text-red-700'>{errors.newpassword.message}</span>}
                        </div>
                        <div className="flex justify-center">
                            <Button className='px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer' type="submit">{ i18?.LOGIN?.CONFIRMPASS || "Confirm Password"}</Button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}