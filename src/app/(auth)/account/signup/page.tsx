/* eslint-disable @next/next/no-img-element */
// steps map:
// 1 -> step 1 WHATSYOUREMAIL
// 2 -> step 6 VERIFYYOUREMAIL
// 3 -> step 2 WHATSYOURNAME
// 4 -> step 3 WHATSYOURDATEOFBIRTH
// 5 -> step 4 WHATSYOURPHONENUMBER
// 6 -> step 7 VERIFYYOURPHONENUMBER
// 7 -> step 5 ENTERYOURPASSWORD
// 8 -> step 10 welcome

"use client";
import Input from "@/app/component/input";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Button from "@/app/component/button";
import { generateStrongPassword, setCookie } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { API } from "@/app/tools/apitools";
import useSnackbarStore from "@/app/store/toaster";
import Store from "@/app/store/store";
import { OTPConfig, SignupInputs } from "@/interface";
import { RegisterData, SendOtpApi, UserExist } from "@/app/tools/mutatefn/auth";
import { fetchUser } from "@/app/tools/queryfn/fetch";
import UserStore from "@/app/store/profile";
import UseCryptodeviceid from "@/app/hooks/deviceid";
import { IconButton, InputAdornment } from "@mui/material";
import Image from "next/image";
import ThreeDotLoader from "@/app/component/threedotloader";
import PhoneInputComponent from "@/app/component/phoneinput";
import OTPInput from "@/app/component/otpfield";
import { verifyFn } from "@/app/tools/mutatefn/userdetails";
import DatePickerComp from "@/app/component/datepicker";
import PageContext from "@/app/providers/pagecontext";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import { useFcmToken } from "@/app/firebase/firebaseToken";
import PopoverComponent from "@/app/component/popover";
import ContentTooptip from "@/app/component/contentTooptip";
import {
  DateofBirth,
  NameContent,
  PhoneNumber,
  VerifyContent,
  VerifyEmail,
} from "@/app/(profileDetails)/accountsettings/content";
import Welcome from "./welcome";
import useLoaderStore from "@/app/hooks/loader";
import RoleStore from "@/app/store/RoleStore";

export default function SignUp() {
  const fcmToken = useFcmToken();
  const { i18 } = useContext(PageContext);
  const deviceId: any = UseCryptodeviceid();
  const {
    setToken,
    email,
    setEmail,
    setOtp,
    setPhone,
    setPhonecode,
    Phone,
    Phonecode,
  } = Store();
  const { setUser } = UserStore();
  const { setRole } = RoleStore();
  const { loading: load } = useLoaderStore();
  const contentEmail = VerifyEmail();
  const ContentVerify = VerifyContent();
  const contentPhone = PhoneNumber();
  const contentName = NameContent();
  const contentDateofBirth = DateofBirth();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    getValues,
    reset,
    setError,
    clearErrors,
  } = useForm<SignupInputs>({
    defaultValues: {
      dob: "",
      fname: "",
      lname: "",
      email: "",
      phone: "",
      phoneCode: "",
      password: "",
      confirmPassword: "",
    },
  });
  const [step, setStep] = useState<any>(1);
  const [dob, setDob] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [ownPass, setOwn] = useState(false);
  const [suggestedPassword, setSuggestedPassword] = useState("");
  // console.log("suggestedPassword", suggestedPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // console.log("anchorEl", anchorEl);
  const handleClick = (event: any) => {
    const value = getValues();
    if (value?.password === "" && !ownPass) setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  // console.log("errors", errors);

  const handleOTPChange = (otp: any) => {
    setConfig((prevConfig) => ({ ...prevConfig, otp }));
    setOtp(otp);
  };
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

  const handlePhoneChange = (value: any, data: any) => {
    const code = data.dialCode;
    const number = value.slice(code.length);
    setValue("phone", number);
    setValue("phoneCode", code);
    setPhoneCode(code);
    setPhoneNumber(number);
  };

  const handleDateChange = (date: any) => {
    if (date) {
      setValue("dob", date, { shouldDirty: true, shouldValidate: true });
      setDob(date);
    }
  };
  const FetchProfile = async () => {
    const res: any = await fetchUser();
    if (res) {
      setUser(res.profile);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword2 = () => setShowPassword2((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };
  const saveMutation = useMutation({
    mutationFn: RegisterData,
    onSuccess: (data) => {
      setLoading(false);
      // router.push('/account/verify')

      // @ts-ignore
      if (typeof window !== "undefined") {
        // @ts-ignore

        window.localStorage.setItem("appToken", data.data.token);
        setCookie("appToken", data.data.token);
        API.token = data.data.token;
        API.deviceId = deviceId;
        setCookie("appUserId", data.data.user._id);
        setCookie("RoleSwitch", data?.data?.user?.type);
        window.localStorage.setItem("appUserId", data.data.user._id);
        window.localStorage.setItem("deviceId", deviceId);

        if (data.data.token) {
          setToken(true);
        }
        if (data.data.user._id) {
          FetchProfile();
          setRole(data?.data?.user?.type);
        }
        showSnackbar(data.data.message, "success");
        // @ts-ignore
        // router.push("/");
        setStep(10);
        // router.push(`/welcome?name=${fnameValue}`, undefined);
      }
    },
    onError: (err) => {
      setStep(1);
      reset({});
      setLoading(false);
      showSnackbar(err.message, "error");
    },
  });
  const sendOtp = useMutation({
    mutationFn: SendOtpApi,
    onSuccess: (data) => {
      setTimeLeft(60);
      showSnackbar(data.data.message, "success");
      if (step === 1) {
        setStep(6);
      } else if (step === 6) {
        setStep(6);
      } else if (step === 7) {
        setStep(7);
      } else {
        setStep(7);
      }
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const Exist: any = useMutation({
    mutationFn: UserExist,
    onSuccess: (data) => {
      setLoading(false);
      if (!data?.data?.account?.isExist) {
        if (step === 1) {
          sendOtp.mutateAsync({
            email: email,
            userType: "USER",
            verifyBy: "email",
            verifyFrom: "REGISTRATION",
          });
        } else {
          sendOtp.mutateAsync({
            phone: Phone,
            email: email,
            phoneCode: Phonecode,
            userType: "USER",
            verifyBy: "phone",
            verifyFrom: "REGISTRATION",
          });
        }
      } else {
        if (step === 1) {
          setError("email", {
            type: "manual",
            message: "User already exist",
          });
        } else {
          setError("phone", {
            type: "manual",
            message: "User already exist",
          });
        }
      }
    },
    onError: (err: any) => {
      setLoading(false);
    },
  });
  const verify = useMutation({
    mutationFn: verifyFn,
    onSuccess: (data) => {
      setLoading(false);
      showSnackbar(data.data.message, "success");
      setConfig((prevConfig) => ({ ...prevConfig, otp: "" }));
      if (step === 6) {
        setStep(2);
      } else {
        setStep(5);
      }
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const onSubmit = (data: SignupInputs, event: any) => {
    event.preventDefault();

    if (deviceId) {
      API.deviceId = deviceId;
    }
    if (step === 5 && data) {
      setLoading(true);
      if (fcmToken) {
        data.fcmId = fcmToken;
      }
      saveMutation.mutateAsync({
        ...data,
        fname: data?.fname?.trim() || "",
        lname: data?.lname?.trim() || "",
      });
    } else if (step === 1 || step === 4) {
      setLoading(true);
      if (step === 1) {
        Exist.mutateAsync({ email: data.email });
        setEmail(data?.email);
      } else {
        Exist.mutateAsync({ phoneCode: data.phoneCode, phone: data?.phone });
        setPhonecode(data.phoneCode);
        setPhone(data?.phone);
      }
    } else if (step === 6 || step === 7) {
      const data = {
        email: email,
        userType: "USER",
        verifyBy: "email",
        verifyFrom: "REGISTRATION",
        code: otp,
      };
      const data2 = {
        phone: Phone,
        phoneCode: Phonecode,
        userType: "USER",
        verifyBy: "phone",
        verifyFrom: "REGISTRATION",
        code: otp,
      };
      setLoading(true);
      verify.mutateAsync(step === 6 ? data : data2);
    } else {
      setStep((prev: any) => prev + 1);
    }
  };
  const handleResend = () => {
    if (step === 6) {
      sendOtp.mutateAsync({
        email: email,
        userType: "USER",
        verifyBy: "email",
        verifyFrom: "REGISTRATION",
      });
    } else {
      sendOtp.mutateAsync({
        phone: Phone,
        email: email,
        phoneCode: Phonecode,
        userType: "USER",
        verifyBy: "phone",
        verifyFrom: "REGISTRATION",
      });
    }
  };
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleKeyDown = (e: any) => {
    if (e.code === "Space") {
      e.preventDefault(); // Block spacebar
    }
  };
  const handleRecaptchaVerify = (token: string | null) => {
    setRecaptchaToken(token);
  };
  const emailValue = watch("email", "");
  const fnameValue = watch("fname", "");
  const phonevalue = watch("phone", "");
  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const isPasswordsMatch =
    password && confirmPassword && password === confirmPassword;
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
    emailValue,
  );
  // console.log(step, 'step')
  const isValidButton =
    (step === 1 && isEmailValid) ||
    (step === 2 && fnameValue) ||
    (step === 3 && dob) ||
    (step === 4 && phonevalue) ||
    (step === 5 && isPasswordsMatch) ||
    ((step === 6 || step === 7) && otp.length === 4);

  useEffect(() => {
    let timer: any;

    if (timeLeft > 0 && (step === 6 || step === 7)) {
      // console.log("timer run");
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) {
            return prev - 1;
          } else {
            clearInterval(timer);
            return 0;
          }
        });
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [timeLeft, step]);

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-full">
      {step == 10 ? (
        <Welcome name={fnameValue} />
      ) : (
        <>
          <h2 className="px-[20px] font-bold text-[30px] sm:text-[50px] mb-[20px] md:mb-[30px] leading-[37px] sm:leading-[65px] text-center">
            {step === 1 && (i18?.NEW?.WHATSYOUREMAIL || "What's Your Email?")}
            {step === 2 && (i18?.NEW?.WHATSYOURNAME || "What's Your Name?")}
            {step === 2 && (
              <span className="inline-flex">
                <ContentTooptip value={contentName} />
              </span>
            )}
            {step === 3 &&
              (i18?.NEW?.WHATSYOURDATEOFBIRTH || "What’s Your Date Of Birth?")}
            {step === 3 && (
              <span className="inline-flex">
                <ContentTooptip value={contentDateofBirth} />
              </span>
            )}
            {step === 4 &&
              (i18?.NEW?.WHATSYOURPHONENUMBER || "What's Your Phone Number")}
            {step === 4 && (
              <span className="inline-flex">
                <ContentTooptip value={contentPhone} />
              </span>
            )}
            {step === 5 &&
              (i18?.NEW?.ENTERYOURPASSWORD || "Enter Your Password")}
            {step === 6 &&
              (i18?.NEW?.VERIFYYOUREMAIL || "Verify your Email ID")}
            {step === 6 && (
              <span className="inline-flex">
                <ContentTooptip value={contentEmail} />
              </span>
            )}
            {step === 7 && (i18?.NEW?.VERIFYYOURPHONENUMBER || "Verify OTP")}
            {step === 7 && (
              <span className="inline-flex">
                <ContentTooptip value={ContentVerify} />
              </span>
            )}
          </h2>
          <div className="w-full sm:max-w-[500px] mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="px-[20px]">
              {step === 1 && (
                <div
                  style={{
                    height: "calc(100% - 56px)",
                  }}
                >
                  {/* Email */}
                  <div className="w-full">
                    <Controller
                      name="email"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Email is required",
                        pattern: {
                          value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
                          message: "Invalid email address",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          // onClick={() => clearErrors("email")}
                          placeholder={i18?.NEW?.EMAIL_ID || "Email id"}
                          autoFocus
                          id="email-input"
                          labelId="email-input"
                          error={!!errors.email}
                          onKeyDown={handleKeyDown}
                        />
                      )}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-red-700 ">
                      {errors.email.message}
                    </span>
                  )}
                  {/* <div className="flex items-center mt-4 gap-2">
                    <BpCheckbox />
                    <p>I don&#39;t want get news,good deals and gifts from postier</p>
                  </div> */}
                </div>
              )}

              {step === 2 && (
                <div
                  className="flex flex-col gap-6 w-full"
                  style={{
                    height: "calc(100% - 56px)",
                  }}
                >
                  <div>
                    {/* First Name */}
                    <Controller
                      name="fname"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "First Name is required",
                        minLength: {
                          value: 4,
                          message:
                            "Your first name should be more than 4 characters",
                        },
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: i18?.NEW?.VALID || "Enter valid name",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          autoFocus
                          placeholder={i18?.NEW?.FIRST_NAME || "First Name"}
                          id="fname-input"
                          labelId="fname-input"
                          error={!!errors.fname}
                        />
                      )}
                    />
                    {errors.fname && (
                      <span className="text-red-700">
                        {errors.fname.message}
                      </span>
                    )}
                  </div>
                  <div>
                    {/* Last Name */}
                    <Controller
                      name="lname"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Last Name is required",
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: i18?.NEW?.VALID || "Enter valid name",
                        },
                      }}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={i18?.NEW?.LAST_NAME || "Last Name"}
                          id="lname-input"
                          labelId="lname-input"
                          error={!!errors.lname}
                        />
                      )}
                    />
                    {errors.lname && (
                      <span className="text-red-700">
                        {errors.lname.message}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {step === 3 && (
                <div>
                  <Controller
                    name="dob"
                    control={control}
                    rules={{
                      validate: {
                        isAdult: (value) => {
                          const today = new Date();
                          const birthDate = new Date(value);
                          const age =
                            today.getFullYear() - birthDate.getFullYear();
                          const monthDiff =
                            today.getMonth() - birthDate.getMonth();
                          const dayDiff = today.getDate() - birthDate.getDate();

                          const isOver18 =
                            age > 18 ||
                            (age === 18 &&
                              (monthDiff > 0 ||
                                (monthDiff === 0 && dayDiff >= 0)));

                          return (
                            isOver18 || "You must be at least 18 years old"
                          );
                        },
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <label htmlFor="dob" className="sr-only">
                          {i18?.NEW?.DATE_OF_BIRTH || "Date of Birth"}
                        </label>
                        <DatePickerComp
                          {...field}
                          onDate={handleDateChange}
                          disablePast={false}
                          type="dob"
                          // label={i18?.NEW?.DATE_OF_BIRTH || "Date of Birth"}
                          error={!!errors?.dob}
                          id="dob"
                          // disableFuture={true}
                          // maxDate={minDate}
                        />
                      </>
                    )}
                  />
                  {errors.dob && (
                    <span className="text-red-700">{errors.dob.message}</span>
                  )}
                </div>
              )}

              {step === 4 && (
                <div
                  className=""
                  style={{
                    height: "calc(100% - 56px)",
                  }}
                >
                  {/* Phone */}
                  <Controller
                    name="phone"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Phone number is required" }}
                    render={({ field }) => (
                      <PhoneInputComponent
                        // value={field.value}
                        onPhoneChange={(
                          number: any,
                          code: any,
                          isValid: boolean,
                        ) => {
                          setValue("phone", number);
                          setValue("phoneCode", code);
                          setPhoneCode(code);
                          setPhoneNumber(number);
                          if (!isValid) {
                            setError("phone", {
                              type: "manual",
                              message:
                                "Invalid phone number for selected country",
                            });
                          } else {
                            clearErrors("phone");
                          }
                        }}
                        country={"us"}
                        errors={!!errors.phone}
                        inputId="phone-input"
                        labelId="phone-input"
                      />
                    )}
                  />
                  {errors.phone && (
                    <span className="text-red-700">{errors.phone.message}</span>
                  )}
                </div>
              )}

              {step === 5 && (
                <div
                  className="flex flex-col gap-6 w-full"
                  style={{
                    height: "calc(100% - 56px)",
                  }}
                >
                  <div>
                    {/* Password */}
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
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|\\;:'",.<>\/?`~\-]).+$/,
                          message:
                            "Password must include at least one uppercase letter, one number, and one special character",
                        },
                      }}
                      render={({ field }) => (
                        <div className="relative">
                          <Input
                            {...field}
                            autoFocus
                            placeholder={i18?.NEW?.PASSWORD || "Password"}
                            id="password-field"
                            labelId="password-field"
                            error={!!errors.password}
                            type={showPassword2 ? "text" : "password"}
                            onFocus={(e) => {
                              setSuggestedPassword(generateStrongPassword());
                            }}
                            onClick={(e) => handleClick(e)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword2}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showPassword2 ? (
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
                        </div>
                      )}
                    />
                    {errors.password && (
                      <span className="text-red-700">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  {/* <div className="absolute right-[-35px] top-5">
                <Tooltip title="Password must include at least one uppercase letter, one number, and one special character">
                    <Image src={'/svg/icon/information.svg'} alt="img" width={800} height={800} className="w-[20px] h-[20px]"/>
                  </Tooltip>
                </div> */}
                  <div>
                    {/* Confirm Password */}
                    <Controller
                      name="confirmPassword"
                      control={control}
                      defaultValue=""
                      rules={{
                        required: "Password confirmation is required",
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      }}
                      render={({ field }) => (
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder={
                              i18?.NEW?.RECONFIRM_PASSWORD ||
                              "Reconfirm Your Password"
                            }
                            id="confirmPassword-field"
                            labelId="confirmPassword-field"
                            error={!!errors.confirmPassword}
                            type={showPassword ? "text" : "password"}
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
                        </div>
                      )}
                    />
                    {errors.confirmPassword && (
                      <span className="text-red-700">
                        {errors.confirmPassword.message}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {(step === 6 || step === 7) && (
                <div className="flex flex-col gap-8 items-center justify-center">
                  <OTPInput
                    inputStyle="inputStyle"
                    numInputs={numInputs}
                    onChange={handleOTPChange}
                    // renderSeparator={<span>{separator}</span>}
                    renderSeparator={(index) => (
                      <span key={index}>{separator}</span>
                    )}
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
                  <div>
                    {timeLeft > 0 ? (
                      <p className="text-btncolor">
                        {i18?.NEW?.RESEND_OTP_IN || "Resend OTP in"} {timeLeft}s
                      </p>
                    ) : (
                      <p
                        onClick={handleResend}
                        className="text-btncolor cursor-pointer"
                      >
                        {i18?.NEW?.RESEND_OTP || "Resend OTP"}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {isValidButton && (
                <div className="flex items-center justify-center mt-6">
                  <Button
                    className={`px-6 py-4 ${
                      load ||
                      (otp.toString().length !== 4 &&
                        step !== 1 &&
                        step !== 2 &&
                        step !== 3 &&
                        step !== 4 &&
                        step !== 5 &&
                        step !== 6 &&
                        step !== 7)
                        ? "bg-[#EBEBEB]"
                        : "bg-btncolor"
                    } rounded-[7px] text-[#fff] cursor-pointer`}
                    type="submit"
                    disabled={
                      otp.toString().length !== 4 &&
                      step !== 1 &&
                      step !== 2 &&
                      step !== 3 &&
                      step !== 4 &&
                      step !== 5 &&
                      step !== 6 &&
                      step !== 7
                    }
                    // disabled={false}
                  >
                    {load ? (
                      <ThreeDotLoader />
                    ) : step === 5 ? (
                      "Submit"
                    ) : step === 6 || step === 7 ? (
                      "Verify"
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </>
      )}
      <PopoverComponent
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        width={"400px"}
      >
        <div className="">
          <h2 className="font-[700] p-4">
            Postier manager suggest a strong password for this website
          </h2>
          <hr />
          <div className="flex justify-end gap-4 p-4">
            <Button
              className="border border-1 border-btncolor text-btncolor rounded-full px-4 py-2 whitwspace-nowrap text-[14px]"
              onClick={() => {
                setValue("password", "");
                setValue("confirmPassword", "");
                setOwn(true);
                setAnchorEl(null);
              }}
            >
              Choose your own
            </Button>
            <Button
              className="bg-btncolor text-[#fff] rounded-full px-4 py-2  whitwspace-nowrap text-[14px]"
              onClick={() => {
                setValue("password", suggestedPassword);
                setValue("confirmPassword", suggestedPassword);
                setAnchorEl(null);
              }}
            >
              Use strong password
            </Button>
          </div>
        </div>
      </PopoverComponent>
    </div>
  );
}
