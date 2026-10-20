"use client";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import Input from "@/app/component/input";
import { Controller, Form, useForm } from "react-hook-form";
import Button from "@/app/component/button";
import { useRouter, useSearchParams } from "next/navigation";
import UserStore from "@/app/store/profile";
import { MyProfileInputs } from "@/interface";
import useScreenWidth from "@/app/hooks/usescreenwidth";
import ProfilePicture from "../profilepicture";
import { useMutation } from "@tanstack/react-query";
import {
  DeteleUser,
  UserUpdate,
  verifyFn,
} from "@/app/tools/mutatefn/userdetails";
import useSnackbarStore from "@/app/store/toaster";
import { fetchUser } from "@/app/tools/queryfn/fetch";
import DatePickerComp from "../datepicker";
import dayjs, { Dayjs } from "dayjs";
import Store from "@/app/store/store";
import { debug } from "console";
import TypeStore from "@/app/store/typeStore";
import PageContext from "@/app/providers/pagecontext";
import { SendOtpApi, UserExist } from "@/app/tools/mutatefn/auth";
import Select from "../select";
import VehicleCategory from "../vehicleCate";
import LocationStore from "@/app/store/locations";
import { MenuItem } from "@mui/material";
import CustomBreadCrumb from "../breadcrumbs";
import Image from "next/image";
import PhoneInputComponent from "../phoneinput";
import LabeledInput from "@/app/component/input";
import useScreenDetector from "@/app/hooks/useresize";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import { setCookie } from "@/utils";
import Link from "next/link";
import Password from "./password";
import ContentTooptip from "../contentTooptip";
import {
  DeleteContent,
  PersonalInformation,
} from "@/app/(profileDetails)/accountsettings/content";
import RoleStore from "@/app/store/RoleStore";

export default function MyProfile() {
  const { i18 } = useContext(PageContext);
  const { user, fetchProfile, setUser } = UserStore();
  const noPassword = user?.noPassword;
  const { setRole } = RoleStore();
  const InputValue = [
    // ...(user?.hash === '' && user?.salt === ''
    //   ? [{
    //     Input: i18?.NEW?.PASSWORD || 'Password',
    //     name: 'password',
    //     inputType: 'password'
    //   }]
    //   : []),
    {
      Input: i18?.NEW?.PROFILE_FIRST_NAME || "First Name",
      name: "fname",
      inputType: "input",
    },
    {
      Input: i18?.NEW?.PROFILE_LAST_NAME || "Last Name",
      name: "lname",
      inputType: "input",
    },
    {
      Input: i18?.NEW?.PROFILE_EMAIL_ID || "Email ID",
      name: "email",
      inputType: "input",
    },
    {
      Input: i18?.NEW?.PROFILE_PHONE || "Phone Number",
      name: "phone",
      inputType: "phone",
    },
    {
      Input: i18?.NEW?.PROFILE_DOB || "Date Of Birth",
      name: "dob",
      inputType: "datepicker",
    },
  ];
  
  const rightSection = [
    {
      img: "/svg/icon/blueEye.svg",
      head: i18?.NEW?.ENHANCED_PRIVACY || "Enhanced Privacy",
      para:
        i18?.NEW?.PRIVACY ||
        " Your data is never shared with third parties without your explicit consent.",
    },
    {
      img: "/svg/icon/share-2 (1).svg",
      head: i18?.NEW?.NO_INFORMATION_SHARING || "No Information Sharing",
      para:
        i18?.NEW?.NO_INFORMATION ||
        "All personal details are encrypted and stored in compliance with GDPR and international privacy laws.",
    },
    {
      img: "/svg/icon/shield.svg",
      head: i18?.NEW?.PROFILE_PHOTO_PROTECTED || "Profile Photo Is Protected",
      para:
        i18?.NEW?.PROFILE_PHOTO ||
        "All identity and address verifications are strictly used for trust and security purposes and are not visible to other users.",
    },
  ];

  const router = UseLoadingRouter();
  const params = useSearchParams();
  const screen = useScreenDetector();
  const searchParams = useSearchParams();
  const type = params.get("type");
  const { setModal, setToken, token } = Store();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  // const Params = useSearchParams()
  // const PageType = Params ? Params.get('type') : null
  // console.log("step1");
  const {
    handleSubmit,
    formState: { errors, dirtyFields },
    control,
    getValues,
    reset,
    setValue,
    setError,
  } = useForm<MyProfileInputs | any>({
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      phoneCode: 0,
      dob: "",
    },
  });
  const [edit, setEdit] = useState("");
  const [fieldValue, setFieldvalue] = useState<any>({});
  const handleDateChange = (date: any) => {
    if (date) {
      // const dateFormat: string = date.format('DD/MM/YYYY');
      setValue("dob", date, { shouldDirty: true, shouldValidate: true });
    }
  };
  // console.log("step2");
  const sendOtp = useMutation({
    mutationFn: SendOtpApi,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      if (fieldValue?.email) {
        setModal("VerificationModal", { email: user?.email });
      } else {
        setModal("PhoneverifyModal", {
          phone: user?.phone,
          phoneCode: user?.phoneCode?.replace("+", ""),
        });
      }
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const Exist: any = useMutation({
    mutationFn: UserExist,
    onSuccess: (data) => {
      // setLoading(false)
      if (!data?.data?.account?.isExist) {
        if (fieldValue?.email) {
          Profile.mutateAsync({ email: fieldValue?.email });
        } else {
          Profile.mutateAsync({
            phone: fieldValue?.phone,
            phoneCode: fieldValue?.phoneCode,
          });
        }
      } else {
        showSnackbar(data?.data?.message, "error");
        setError("email", {
          type: "server",
          message: "User already exist",
        });
        setError("phone", {
          type: "server",
          message: "User already exist",
        });
      }
    },
    onError: (err: any) => {
      // setLoading(false)
    },
  });

  const Profile = useMutation({
    mutationFn: UserUpdate,
    onSuccess: (data) => {
      setEdit("");
      showSnackbar(data.data.message, "success");
      fetchProfile();
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });

  const DeleteProfile = useMutation({
    mutationFn: DeteleUser,
    onSuccess: (data) => {
      window.localStorage.clear();
      setToken(false);
      setCookie("appToken", "", -1);
      setCookie("appUserId", "", -1);
      setCookie("RoleSwitch", "", -1);
      setUser({});
      setRole(null)
      showSnackbar(data.data.message, "success");
      // window.location.reload()
      router.push("/");
      setModal("");
    },
  });
  // console.log("step3");
  const handleSave = (val: any) => {
    const allValue: any = getValues();
    if (val === "email" || val === "phone") {
      setFieldvalue({
        [val]: (allValue && allValue[val]) || (user && user[val]),
        phoneCode:
          val === "phone"
            ? allValue && allValue.phoneCode
              ? allValue.phoneCode
              : user && user.phoneCode
            : undefined,
      });
      Exist.mutateAsync({
        [val]: allValue && allValue[val] ? allValue[val] : user && user[val],
        phoneCode:
          val === "phone"
            ? allValue && allValue.phoneCode
              ? allValue?.phoneCode?.replace("+", "")
              : user && user.phoneCode?.replace("+", "")
            : undefined,
      });
    } else {
      const values: any = {};
      if (allValue[val]) {
        values[val] = allValue[val];
      }
      Profile.mutateAsync(values);
    }
  };

  const handleDelete = async () => {
    await DeleteProfile.mutateAsync(user?.id);
  };

  const PhoneNumber = user ? `${user.phoneCode}${user.phone}` : null;

  useEffect(() => {
    const data: MyProfileInputs = {
      fname: user?.fname ? user?.fname : "",
      lname: user?.lname ? user?.lname : "",
      email: user?.email ? user?.email : "",
      phone: user?.phone ? user?.phone : "",
      phoneCode: user?.phoneCode ? user?.phoneCode : "",
      dob: user?.dob ? user?.dob : "",
    };
    if (data) reset(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  const handleVerify = (values: any) => {
    setFieldvalue({ [values]: values });
    if (values === "email") {
      sendOtp.mutateAsync({
        email: user?.email,
        userType: "USER",
        verifyBy: "email",
        verifyFrom: "VERIFICATION",
      });
    } else {
      sendOtp.mutateAsync({
        phone: user?.phone,
        phoneCode: user?.phoneCode?.replace("+", ""),
        userType: "USER",
        verifyBy: "phone",
        verifyFrom: "VERIFICATION",
      });
    }
  };
  // console.log("step4");
  useEffect(() => {
    if (type === "auth") {
      if (user?.emailVerified && user?.phoneVerified) {
        router.push("/");
      }
    } else {
      if (user?._id)
        if (!user?.emailVerified || !user?.phoneVerified) {
          const currentParams = new URLSearchParams(searchParams.toString());
          currentParams.set("type", "auth");
          const newUrl = `?${currentParams.toString()}`;
          // console.log("router push newurl", newUrl);
          router.push(newUrl);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  // console.log("step5");
  return (
    <div className="mt-[20px] m-[40px] md:m-[70px]">
      <div className="flex flex-col gap-3 mb-[30px]">
        {/* <CustomBreadCrumb pathSegments={i18?.NEW?.MYPROFILE||'My Profile'} /> */}
        <CustomBreadCrumb pathSegments="Personal Information" />
        <div className="flex items-center">
          <p className=" text-[20px] sm:text-[30px] md:text-[34px] font-[700] leading-[44px] ">
            {i18?.NEW?.PERSONAL_INFORMATION || "Personal Information"}
          </p>
          <ContentTooptip value={PersonalInformation()} />
        </div>
      </div>
      {type && (
        <div className="border border-1 border-btncolor p-5 rounded-[8px] mb-8 w-1/2">
          <div className="flex gap-5">
            <Image
              src="/svg/icon/warning-alert-svgrepo-com.svg"
              alt="img"
              width={800}
              height={800}
              className="w-[50px] h-[50px]"
            />
            <p className="flex items-center text-[17px] font-[500]">
              {i18?.NEW?.VERIFY_EMAIL_PHONE ||
                "Verify Your Email and Phone Number & Fill Other Informations For Better Expirence"}
            </p>
          </div>
        </div>
      )}
      <div className="flex">
        <div className="w-full md:w-1/2">
            <div className=" px-2 py-6 md:p-8 border-b flex flex-col justify-center">
              <div className="flex justify-between">
                <p className="text-[17px] font-[700] leading-[22px]">
                  {noPassword ? "Password" : "Change Password"}
                </p>
                {edit === "password" ? (
                  <p
                    onClick={() => setEdit("")}
                    className="bg-[#fff] text-[17px] font-[400] leading-[22px] underline cursor-pointer"
                  >
                    {i18?.NEW?.CANCEL || "Cancel"}
                  </p>
                ) : (
                  <p
                    className="text-btncolor text-[17px] font-[700] leading-[22px] cursor-pointer"
                    onClick={() => setEdit("password")}
                  >
                    {i18?.NEW?.SET || "Set"}
                  </p>
                )}
              </div>
              {edit === "password" && (
                <div className="w-full  mt-[30px]">
                  <Password noPassword={noPassword} setEdit={setEdit} />
                </div>
              )}
            </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div>
              {InputValue.map((items: any, index: any) => (
                <div key={index}>
                  <Controller
                    name={items.name}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <div className=" px-2 py-6 md:p-8 border-b flex flex-col justify-center">
                          <div className="flex justify-between">
                            <div className="flex flex-col gap-4">
                              <p className="text-[17px] font-[700] leading-[22px]">
                                {items.Input}
                              </p>
                              {edit !== items.name ? (
                                <div>
                                  {items.name === "dob" && (
                                    <p className="text-[17px] font-[400] leading-[22px]">
                                      {user && user[items?.name]
                                        ? dayjs(user[items?.name]).format(
                                            "DD-MM-YYYY"
                                          )
                                        : "DD-MM-YYYY"}
                                    </p>
                                  )}
                                  {items.name === "phone" && (
                                    <div className="flex gap-2">
                                      <div className="flex items-center gap-2">
                                        <p className="text-[17px] font-[400] leading-[22px]">
                                          {user && (user?.phoneCode?.startsWith("+") ? user.phoneCode : `+${user.phoneCode}` )}{" "}
                                          {user && user[items.name]}
                                        </p>
                                        {user &&
                                          user[items.name] &&
                                          ((items.name === "phone" &&
                                            !user?.phoneVerified) ||
                                            (items.name === "email" &&
                                              !user?.emailVerified)) && (
                                            <Button
                                              onClick={() =>
                                                handleVerify(items.name)
                                              }
                                              className="font-bold text-[#6EC207]"
                                            >
                                              {i18?.NEW?.VERIFY || "Verify"}
                                            </Button>
                                          )}
                                      </div>
                                      {user?.phoneVerified && (
                                        <div className="flex gap-2">
                                          <Image
                                            width={20}
                                            height={20}
                                            src="/svg/icon/verified.svg"
                                            alt="Image"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {items.name !== "dob" &&
                                    items.name !== "phone" &&
                                    (items.name === "email" ? (
                                      <div className="flex gap-2">
                                        <p className="text-[17px] font-[400] leading-[22px]">
                                          {user &&
                                            (user[items?.name]
                                              ? user[items?.name]
                                              : "")}
                                        </p>
                                        {items.name === "email" &&
                                        !user?.emailVerified ? (
                                          <Button
                                            onClick={() =>
                                              handleVerify(items.name)
                                            }
                                            className="font-bold text-[#6EC207]"
                                          >
                                            {i18?.NEW?.VERIFY || "Verify"}
                                          </Button>
                                        ) : (
                                          <div className="flex gap-2">
                                            <Image
                                              width={20}
                                              height={20}
                                              src="/svg/icon/verified.svg"
                                              alt="Image"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-[17px] font-[400] leading-[22px]">
                                        {user &&
                                          (user[items?.name]
                                            ? user[items?.name]
                                            : "--")}
                                      </p>
                                    ))}
                                </div>
                              ) : null}
                            </div>
                            {edit === items.name ? (
                              <p
                                onClick={() => setEdit("")}
                                className="bg-[#fff] text-[17px] font-[400] leading-[22px] underline cursor-pointer"
                              >
                                {i18?.NEW?.CANCEL || "Cancel"}
                              </p>
                            ) : (
                              <p
                                onClick={() => setEdit(items.name)}
                                className="bg-[#fff] text-[17px] font-[400] leading-[22px] underline cursor-pointer"
                              >
                                {i18?.NEW?.EDIT || "Edit"}
                              </p>
                            )}
                          </div>
                          {edit === items.name ? (
                            <div className="flex flex-col gap-4 mt-4">
                              {items.inputType === "input" && (
                                <>
                                  <LabeledInput
                                    {...field}
                                    id={`${items.name}-input`}
                                    labelId={`${items.name}-input`}
                                    placeholder={`Enter the ${items.name}`}
                                    error={!!errors[items.name]}
                                  />
                                  {errors[items.name] && (
                                    <span className="text-red-700">
                                      {String(errors[items?.name]?.message)}
                                    </span>
                                  )}
                                </>
                              )}
                              {items.inputType === "phone" && (
                                <>
                                  <PhoneInputComponent
                                    errors={!!errors[items.name]}
                                    value={PhoneNumber}
                                    onPhoneChange={(number: any, code: any) => {
                                      setValue("phone", number);
                                      setValue("phoneCode", code);
                                    }}
                                    inputId={`${items.name}-input`}
                                    labelId={`${items.name}-input`}
                                  />
                                  {errors[items.name] && (
                                    <span className="text-red-700">
                                      {String(errors[items?.name]?.message)}
                                    </span>
                                  )}
                                </>
                              )}
                              {items.inputType === "datepicker" && (
                                <DatePickerComp
                                  {...field}
                                  onDate={handleDateChange}
                                  date={user?.dob ? user?.dob : null}
                                  disablePast={false}
                                  type="dob"
                                  label={
                                    i18?.NEW?.DATE_OF_BIRTH || "Date of Birth"
                                  }
                                />
                              )}
                              {items?.name !== "password" && (
                                <div className="flex gap-4 items-center">
                                  <Button
                                    onClick={() => handleSave(items.name)}
                                    className="px-8 py-4 bg-btncolor rounded-full text-[#fff]"
                                  >
                                    {" "}
                                    {i18?.NEW?.SAVE || "Save"}
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-[17px] font-[400] leading-[22px]"></p>
                          )}
                        </div>
                      </>
                    )}
                  />
                </div>
              ))}
              {/* <div className=" p-8 border-b flex flex-col gap-4 justify-center">
                <div className="flex justify-between">
                  <p className="text-[17px] font-[700] leading-[22px]">Profile Photo</p>
                  <p className="bg-[#fff] text-[17px] font-[400] leading-[22px] underline cursor-pointer">Update</p>
                </div>
                <div className="w-[80px] h-[80px] rounded-full bg-[#D9D9D9] flex items-center justify-center">
                  <Image width={800} height={800} src='/svg/icon/user-svgrepo-com (1).svg' alt="image" className="w-[30px] h-[30px]" />
                </div>
              </div> */}
              <ProfilePicture />
              <div className="border-t">
                <div className=" bg-red-600 w-52 rounded-full px-5 py-3 mt-6 space-x-3  flex items-center justify-center text-white ">
                  <Image
                    width={20}
                    height={20}
                    src="/svg/icon/trash-white.svg"
                    alt="Image"
                  />
                  {/* onClick={() => handleDelete()} */}
                  <button
                    onClick={() =>
                      setModal("confirmDelete", {
                        title: i18?.NEW?.DELETE_CONFIRMATION_TITLE || "Delete Confirmation",
                        heading: i18?.NEW?.DO_YOU_WANT_DELETE ||  "Do you want Delete Account",
                        fncD: handleDelete,
                      })
                    }
                  >
                    Delete Account
                  </button>
                </div>
                <div className="pt-4 flex items-center">
                  <Image
                    src={"/svg/icon/Bulb.svg"}
                    alt="Bulb"
                    width={20}
                    height={20}
                  />
                  <p className="text-md font-medium text-[#000] pl-[10px]">
                    {i18?.NEW?.HINT ||
                      "We're Sad to See You Go – Permanently Delete Your Account"}
                  </p>
                  <ContentTooptip value={DeleteContent()} />
                </div>
              </div>
            </div>
          </form>
        </div>

        {screen === "desktop" && (
          <div className="w-1/2 flex justify-end md:justify-center">
            <div className="flex flex-col gap-6">
              {rightSection.map((items, index) => (
                <div
                  key={index}
                  className="border border-1 border-btncolor flex flex-col gap-6 p-5 rounded-[31px] w-full md:w-[350px]"
                >
                  <Image
                    width={800}
                    height={800}
                    src={items.img}
                    alt="svg"
                    className="w-[50px] h-[50px]"
                  />
                  <p className="text-[17px] font-[700] leading-[22px]">
                    {items.head}
                  </p>
                  <p className="text-[17px] font-[400] leading-[22px]">
                    {items.para}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
