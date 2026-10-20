"use client";
import Button from "@/app/component/button";
import Input from "@/app/component/input";
import OTPInput from "@/app/component/otpfield";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { API } from "@/app/tools/apitools";

import { ReactElement, ReactNode, useContext, useEffect, useState } from "react";
import { OTPConfig, OtpInputs } from "@/interface";
import Store from "@/app/store/store";
import PageContext from "@/app/providers/pagecontext";
import { SendOtpApi, UserExist } from "@/app/tools/mutatefn/auth";
import useSnackbarStore from "@/app/store/toaster";
import EmptyPage from "@/app/component/emptydatapage";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";

export default function SendOtp() {
  const { email, setEmail, setOtp } = Store();
  const { i18 } = useContext(PageContext);
  const router = UseLoadingRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const [otpfield, setOtpField] = useState(false);
  const [emailTemp, setemailTemp] = useState(false);
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
  const {
    handleSubmit,
    formState: { errors },
    control,
    setError
  } = useForm<OtpInputs>({
    defaultValues: {
      email: "",
    },
  });

  // const sendOtp = async (data: any) => {
  //   const getapi = await API.GET(`common/user/exists`, {
  //     email: data.email
  //   });
  //   if (getapi.data.account.isExist) {
  //     // setOtpField(true);
  //     const res = await API.POST("common/sendOtp", {
  //       ...data,
  //       userType: "USER",
  //       verifyBy: "email",
  //       verifyFrom: "FORGETPASSWORD",
  //     });
  //     return res;
  //   } else {
  //     setError('email', {
  //       type: 'server',
  //       message: 'User not exist',
  //     });
  //   }
  // };
  const sendOtp = useMutation({
    mutationFn: SendOtpApi,
    onSuccess: () => {
      setemailTemp(true)
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    }
  })
  const verify = async (data: any) => {
    const res = await API.POST("common/user/verification", {
      email: data.email,
      userType: "USER",
      verifyBy: "email",
      verifyFrom: "FORGETPASSWORD",
      code: otp,
    });
    return res;
  };
  const Exist = useMutation({
    mutationFn: UserExist,
    onSuccess: (data) => {
      if (data?.data?.account?.isExist) {
        sendOtp.mutateAsync({
          email: email,
          userType: "USER",
          verifyBy: "email",
          verifyFrom: "FORGETPASSWORD",
        })
      } else {
        setError('email', {
          type: 'server',
          message: 'User not exist',
        });
      }
    },
  });
  const otpmutation = useMutation({
    mutationFn: verify,
    onSuccess: (data) => {
      router.push("/account/resetpassword");
    },
  });
  const onSubmit = (data: OtpInputs) => {
    Exist.mutateAsync(data);
    setEmail(data?.email);
  };
  const onSubmitOtp = (data: any) => {
    otpmutation.mutateAsync(data);
    // if(data){
    //   router.push("/account/resetpassword");
    // }

  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <h2 className="font-bold px-[20px] text-[30px] md:text-[50px] leading-[37px] sm:leading-[65px] mb-[20px] md:mb-[30px] text-center max-w-[800px]">
        {!emailTemp && (i18?.LOGIN?.FORGETPASSHEADER || "Enter the email id associated with your account")}
      </h2>
      <div className="w-full sm:max-w-[500px] mx-auto px-[20px]">
        {!emailTemp && (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center">
            <div className=" w-full md:w-[500px] ">
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    label= {i18?.NEW?.EMAIL_ID || "Email id"}
                    error={!!errors.email}
                  />
                )}
              />
              {errors.email && (
                <span className="text-red-700">{errors.email.message}</span>
              )}

              <div className="mt-6 flex justify-center">
                <Button
                  className="px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer"
                  type="submit"
                >
                  {i18?.LOGIN?.SEND || "send"}
                </Button>
              </div>
            </div>
          </form>
        )}
        {/* {otpfield && (
          <form onSubmit={handleSubmit(onSubmitOtp)}>
            <div className="flex justify-center">
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
                    className="p-0   w-[60px] h-[60px] sm:w-[85px] sm:h-[85px] md:w-[60px] md:h-[60px] lg:w-[85px] lg:h-[85px] border border-[#B6B6B6] rounded-xl"
                  />
                )}
                shouldAutoFocus
              />
            </div>
            <div className="mt-6 flex justify-center">
              <Button
                className="px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer"
                type="submit"
              >
                {i18?.LOGIN?.SEND || "send"}
              </Button>
            </div>
          </form>
        )} */}
        {
          emailTemp &&
          <div>
            <EmptyPage image='/svg/icon/success.svg' text='Email Send Successfully' linktext='Back to login' link='/account/login/?with=email' />
          </div>
        }
      </div>
    </div>
  );
}
