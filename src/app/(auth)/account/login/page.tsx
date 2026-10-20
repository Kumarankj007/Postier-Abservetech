"use client";
import Input from "@/app/component/input";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import BpCheckbox from "@/app/component/checkbox";
import Button from "@/app/component/button";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "@/utils";
import { API } from "@/app/tools/apitools";
import CustomSnackbar from "@/app/component/toast";
import { useMutation } from "@tanstack/react-query";
import useSnackbarStore from "@/app/store/toaster";
import RecaptchaComponent from "@/app/component/recaptcha";
import { LoginInputs } from "@/interface";
import { LoginData } from "@/app/tools/mutatefn/auth";
import Cryptodeviceid from "@/app/hooks/deviceid";
import { fetchUser } from "@/app/tools/queryfn/fetch";
import UserStore from "@/app/store/profile";
import Store from "@/app/store/store";
import UseCryptodeviceid from "@/app/hooks/deviceid";
import { IconButton, InputAdornment } from "@mui/material";
import { Nextbutton } from "../../../../../public/svg/svgcomponent";
import PageContext from "@/app/providers/pagecontext";
import Image from "next/image";
import LoginWithPhone from "@/app/component/phonelogin";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import { useFcmToken } from "@/app/firebase/firebaseToken.js";
import RoleStore from "@/app/store/RoleStore";

export default function Login() {
  const router = UseLoadingRouter();
  const fcmToken = useFcmToken();
  const searchParams = useSearchParams();
  const search = searchParams.get("with");
  const { i18 } = useContext(PageContext);
  const [showPassword, setShowPassword] = useState(false);
  const deviceId: any = UseCryptodeviceid();
  const { setToken, setRememberMe, rememberMe } = Store();
  const { setUser } = UserStore();
  const { setRole } = RoleStore();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const handleNavigation = () => {
    router.push("/account/sendotp");
  };
  const handleKeyDown = (e: any) => {
    if (e.code === "Space") {
      e.preventDefault(); // Block spacebar
    }
  };
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<LoginInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const FetchProfile = async () => {
    const res: any = await fetchUser();
    if (res) {
      setUser(res.profile);
    }
  };
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const saveMutation = useMutation({
    mutationFn: LoginData,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("appToken", data.data.token);
        if (rememberMe) {
          setCookie("appToken", data.data.token, 60);
        } else {
          setCookie("appToken", data.data.token);
        }
        API.token = data.data.token;
        API.deviceId = deviceId;
        setCookie("appUserId", data?.data?.user?._id);
        setCookie("RoleSwitch", data?.data?.user?.type);
        setRole(data?.data?.user?.type)
        window.localStorage.setItem("appUserId", data.data.user._id);
        window.localStorage.setItem("deviceId", deviceId);
        if (data.data.token) {
          setToken(true);
        }
        if (data.data.user._id) {
          FetchProfile();
        }
        showSnackbar(data.data.message, "success");
        router.push("/");
      }
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const onSubmit = (data: LoginInputs) => {
    if (deviceId) {
      API.deviceId = deviceId;
    }
    if (fcmToken) {
      data.fcmId = fcmToken;
    }
    saveMutation.mutateAsync(data);
  };

  // console.log("rememberMe", rememberMe);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      {search === "email" ? (
        <>
          <h2 className="px-[20px] font-bold text-[30px] sm:text-[50px] mb-[20px] md:mb-[30px] leading-[37px] sm:leading-[65px] text-center">
            {i18?.LOGIN?.EMAILPASS || "Enter Your Email and Password"}
          </h2>
          <div className="w-full sm:max-w-[500px] mx-auto px-[20px]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6 ">
                <div>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTER_EMAIL_ID || "Enter your email id"
                        }
                        id="email_id"
                        labelId="email_id"
                        type="text"
                        error={!!errors.email}
                        onKeyDown={handleKeyDown}
                      />
                    )}
                  />
                  {errors.email && (
                    <span className="text-red-700">{errors.email.message}</span>
                  )}
                </div>

                <div>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must have at least 8 characters",
                      },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|\\;:'",.<>\/?`~\-]).+$/,
                        message:
                          "Password must include at least one uppercase letter, one number, and one special character",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTER_PASSWORD || "Enter your password"
                        }
                        id="password_field"
                        labelId="password_field"
                        type={showPassword ? "text" : "password"}
                        error={!!errors.password}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <Image
                                    width={20}
                                    height={20}
                                    src="/svg/icon/unlock.svg"
                                    alt="svg"
                                  />
                                ) : (
                                  <Image
                                    width={20}
                                    height={20}
                                    src="/svg/icon/lock.svg"
                                    alt="svg"
                                  />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  {errors.password && (
                    <span className="text-red-700">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-6 mt-6 ">
                <div className="flex items-center gap-2">
                  <BpCheckbox
                    onChange={(e: any) => setRememberMe(e.target.checked)}
                  />
                  <p className="text-[17px] font-normal">
                    {i18?.LOGIN?.REMEMBERME || "Remember me"}
                  </p>
                </div>
                <div
                  className="flex items-center  cursor-pointer"
                  onClick={handleNavigation}
                >
                  <p className="text-[17px] text-[#004080] font-bold underline">
                    {i18?.LOGIN?.FORGOTPASS || "Forgot password?"}
                  </p>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    className="px-6 py-4 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer"
                    type="submit"
                  >
                    {i18?.LOGIN?.LOG || "Login"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <LoginWithPhone />
      )}
    </div>
  );
}
