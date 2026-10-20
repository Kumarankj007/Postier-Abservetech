"use client";
import Button from "@/app/component/button";
import LabeledInput from "@/app/component/input";
import PhoneInputComponent from "@/app/component/phoneinput";
import SelectC from "@/app/component/select";
import CustomizedSwitches from "@/app/component/switch";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import ParcelStore from "@/app/store/parcel";
import Store from "@/app/store/store";
import useSnackbarStore from "@/app/store/toaster";
import { Participants, UpdateParcel } from "@/app/tools/mutatefn/Parcelpost";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PageContext from "@/app/providers/pagecontext";
import Link from "next/link";
import AutocompleteComp from "@/app/component/autocomplete";
import LoaderScript from "@/app/component/loadingscript";

interface details {
  firstName: string;
  lastName: string;
  phone: number;
  phCode: number;
  email: string;
  address: string;
  country: string;
  city: string;
  pinCode: string;
  favaddress: string;
  consigneeFirstName: string;
  consigneeLastName: string;
  consigneeEmail: string;
  consigneePhoneCode: number;
  consigneePhone: number;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeState: string;
  consigneeCountry: string;
  consigneePinCode: number;
}
function Details() {
  const { i18 } = useContext(PageContext);
  const [state, setState] = useState("sender");
  const router = UseLoadingRouter();
  const { FetchMyparcelsDetails, MyParcelsDetails }: any = ParcelStore();
  const { setModal } = Store();
  const searchParams: any = useSearchParams();
  const currentParams = new URLSearchParams(searchParams);
  const postId: any = currentParams.get("parcelid");
  const Parcel_id: any = postId ? postId : null;
  const {
    handleSubmit,
    formState: { errors, dirtyFields, isDirty },
    control,
    setValue,
    setError,
    clearErrors,
    reset,
    register,
  } = useForm<details>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: 0,
      email: "",
      address: "",
      country: "",
      city: "",
      pinCode: "",
      favaddress: "",
      phCode: 0,
      consigneeFirstName: "",
      consigneeLastName: "",
      consigneeEmail: "",
      consigneePhoneCode: 0,
      consigneePhone: 0,
      consigneeAddress: "",
      consigneeCity: "",
      consigneeState: "",
      consigneeCountry: "",
      consigneePinCode: 0,
    },
  });
  const PhoneNumber = MyParcelsDetails
    ? `${MyParcelsDetails?.consignor?.phoneCode}${MyParcelsDetails?.consignor?.phone}`
    : null;
  const PhoneNumberRecvr = MyParcelsDetails
    ? `${MyParcelsDetails?.consignee?.phoneCode}${MyParcelsDetails?.consignee?.phone}`
    : null;

  const onSubmit = (data: any) => {
    if (state === "receiver" && isDirty) {
      // console.log(data, "Addressconfirm");
      setModal("Addressconfirm", { data });
    } else if (state === "sender") {
      setState("receiver");
    } else {
      router.push(`/tracking?${currentParams}`);
    }
  };
  useEffect(() => {
    const value = MyParcelsDetails?.consignor && MyParcelsDetails?.consignor;
    const recvrVal = MyParcelsDetails?.consignee && MyParcelsDetails?.consignee;
    // console.log(value, 'value')
    const data = {
      firstName: value?.firstName,
      lastName: value?.lastName,
      email: value?.email,
      address: value?.address,
      country: value?.country,
      city: value?.city,
      pinCode: value?.pinCode,
      phone: value?.phone,
      phCode: value?.phoneCode,
      consigneeFirstName: recvrVal?.firstName,
      consigneeLastName: recvrVal?.lastName,
      consigneeEmail: recvrVal?.email,
      consigneePhoneCode: recvrVal?.phoneCode,
      consigneePhone: recvrVal?.phoneCode,
      consigneeAddress: recvrVal?.address,
      consigneeCity: recvrVal?.city,
      consigneeState: recvrVal?.consigneeState,
      consigneeCountry: recvrVal?.country,
      consigneePinCode: recvrVal?.pinCode,
    };
    reset(data);
    // console.log("data", data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MyParcelsDetails]);
  // console.log("MyParcelsDetails", MyParcelsDetails);

  const onPlaceChangedpickup = (co: any, add: any) => {
    const filtered =
      add.description?.split(",").map((p: string) => p.trim()) || [];
    const countryName = filtered.slice(-2).join(", ") || "";
    const stateName = filtered.at(-3) || "";
    const rest = filtered.slice(0, -3).join(", ");
    setValue("address", rest, { shouldDirty: true, shouldValidate: true });
    setValue("city", stateName, { shouldDirty: true, shouldValidate: true });
    setValue("country", countryName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors(["address", "city", "country"]);
  };

  const onPlaceChangedDrop = (co: any, add: any) => {
    const filtered =
      add.description?.split(",").map((p: string) => p.trim()) || [];
    const countryName = filtered.slice(-2).join(", ") || "";
    const stateName = filtered.at(-3) || "";
    const rest = filtered.slice(0, -3).join(", ");
    setValue("consigneeAddress", rest, { shouldDirty: true, shouldValidate: true });
    setValue("consigneeCity", stateName, { shouldDirty: true, shouldValidate: true });
    setValue("consigneeCountry", countryName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors(["consigneeAddress", "consigneeCity", "consigneeCountry"]);
  };
  return (
    <div className="p-[30px]">
      <div className="flex justify-between p-[20px]">
        <p className="text-[34px] font-[700] leading-[44px]">
          {i18?.NEW?.SENDERANDRECEIVERDETAILS || "Sender & Receiver Details"}
        </p>
        <Link
          href={"/cms/help_center"}
          className="p-4 bg-btncolor rounded-[31px] text-[#fff] flex gap-4 items-center"
        >
          {i18?.NEW?.GETHELP || "Get Help"}
          <Image
            src="/svg/icon/headphones.svg"
            alt="image"
            width={800}
            height={800}
            className="w-[20px] h-[20px]"
          />
        </Link>
      </div>
      <div className="flex gap-4 p-[20px]">
        <p
          className={`text-[20px] font-[700] leading-[26px] ${
            state === "sender" ? "text-btncolor" : "text-[#222]"
          }  underline cursor-pointer`}
          onClick={() => setState("sender")}
        >
          {i18?.NEW?.SENDERINFORMATION || "Sender Information"}
        </p>
        <p
          className={`text-[20px] font-[700] leading-[26px] ${
            state === "receiver" ? "text-btncolor" : "text-[#222]"
          } underline cursor-pointer`}
          onClick={() => setState("receiver")}
        >
          {i18?.NEW?.RECEIVERINFORMATION || "Receiver Information"}
        </p>
      </div>
      <div className="p-5 bg-[#FBFBFB] ">
        <form onSubmit={handleSubmit(onSubmit)}>
          {state === "sender" && (
            <div className="flex flex-col gap-8 m-auto">
              <div className="md:flex gap-5">
                <div className="w-full flex flex-col gap-5">
                  <label
                    id="first-name-label"
                    htmlFor="firstNameInput"
                    className="sr-only"
                  >
                    Enter Your First name
                  </label>
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "First Name is required",
                      validate: (value) =>
                        (typeof value === "string" && value.trim() !== "") ||
                        "First Name cannot be just spaces",
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        id="firstNameInput"
                        placeholder={
                          i18?.NEW?.ENTERYOURFIRSTNAME ||
                          "Enter Your First name"
                        }
                        labelId="first-name-label"
                      />
                    )}
                  />
                  {errors.firstName && (
                    <span className="text-red-700">
                      {errors?.firstName?.message}
                    </span>
                  )}
                </div>
                <div className="w-full flex flex-col gap-5">
                  <label
                    id="last-name-label"
                    htmlFor="lastNameInput"
                    className="sr-only"
                  >
                    Enter Your Last name
                  </label>
                  <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Last Name is required",
                      validate: (value) =>
                        (typeof value === "string" && value.trim() !== "") ||
                        "Last Name cannot be just spaces",
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTERYOURLASTNAME || "Enter Your Last name"
                        }
                        id="lastNameInput"
                        labelId="last-name-label"
                      />
                    )}
                  />
                  {errors.lastName && (
                    <span className="text-red-700">
                      {errors?.lastName?.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="md:flex gap-5">
                <div className="w-full flex flex-col gap-5">
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: "PhoneNumber is required" }}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <>
                          <label
                            id="consigneePhone-label"
                            htmlFor="consigneePhoneInput"
                            className="sr-only"
                          >
                            Consignee Phone Number
                          </label>
                          <PhoneInputComponent
                            {...field}
                            value={PhoneNumber}
                            errors={!!error}
                            onPhoneChange={(
                              number: any,
                              code: any,
                              isValid,
                            ) => {
                              // console.log(isValid, 'isValid')
                              // field.onChange(number);
                              setValue("phCode", code, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                              setValue("phone", number, {
                                shouldDirty: true,
                                shouldValidate: true,
                              });
                              // setTimeout(() => {
                              //   if (!isValid) {
                              //     setError("phone", { type: "manual", message: "Invalid phone number" });
                              //   } else {
                              //     clearErrors("phone");
                              //   }
                              // });
                            }}
                            country={"us"}
                            inputId="consigneePhoneInput"
                            labelId="consigneePhone-label"
                          />
                        </>
                      );
                    }}
                  />
                  {errors.phone && (
                    <span className="text-red-700">
                      {errors?.phone?.message}
                    </span>
                  )}
                </div>

                <div className="w-full flex flex-col gap-5">
                  <label
                    id="email-label"
                    htmlFor="emailInput"
                    className="sr-only"
                  >
                    Enter Your Email
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                      validate: (value) =>
                        (typeof value === "string" && value.trim() !== "") ||
                        "Email cannot be just spaces",
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTERYOUREMAIL || "Enter Your Email"
                        }
                        id="emailInput"
                        labelId="email-label"
                      />
                    )}
                  />
                  {errors.email && (
                    <span className="text-red-700">
                      {errors?.email?.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="border border-btncolor rounded-lg p-3">
                <LoaderScript>
                  <AutocompleteComp
                    onPlaceChangedpickup={onPlaceChangedpickup}
                    type="pickup"
                    placeholder={"Autocomplete Address"}
                  />
                </LoaderScript>
              </div>

              <div>
                <label
                  id="address-label"
                  htmlFor="addressInput"
                  className="sr-only"
                >
                  Enter Your Address
                </label>
                <Controller
                  name="address"
                  control={control}
                  rules={{
                    required: "Address is required",
                    validate: (value) =>
                      (typeof value === "string" && value.trim() !== "") ||
                      "Address cannot be just spaces",
                  }}
                  render={({ field }) => (
                    <LabeledInput
                      {...field}
                      placeholder={
                        i18?.NEW?.ENTERYOURADDRESS || "Enter Your Address"
                      }
                      id="addressInput"
                      labelId="address-label"
                    />
                  )}
                />
                {errors.address && (
                  <span className="text-red-700">
                    {errors?.address?.message}
                  </span>
                )}
              </div>

              <div className="md:flex gap-5">
                <div className="w-full flex flex-col gap-5">
                  <label
                    id="country-label"
                    htmlFor="countryInput"
                    className="sr-only"
                  >
                    Enter Your Country
                  </label>
                  <Controller
                    name="country"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Country is required",
                      validate: (value) =>
                        (typeof value === "string" && value.trim() !== "") ||
                        "Country cannot be just spaces",
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTERYOURCOUNTRY || "Enter Your Country"
                        }
                        id="countryInput"
                        labelId="country-label"
                      />
                    )}
                  />
                  {errors.country && (
                    <span className="text-red-700">
                      {errors?.country?.message}
                    </span>
                  )}
                </div>

                <div className="w-full flex flex-col gap-5">
                  <label
                    id="city-label"
                    htmlFor="cityInput"
                    className="sr-only"
                  >
                    Enter Your City
                  </label>
                  <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "City is required",
                      validate: (value) =>
                        (typeof value === "string" && value.trim() !== "") ||
                        "City cannot be just spaces",
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTERYOURCITY || "Enter Your City"
                        }
                        id="cityInput"
                        labelId="city-label"
                      />
                    )}
                  />
                  {errors.city && (
                    <span className="text-red-700">
                      {errors?.city?.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="md:flex gap-5">
                <div className="w-[49%] flex flex-col gap-5">
                  <label
                    id="pinCode-label"
                    htmlFor="pinCodeInput"
                    className="sr-only"
                  >
                    Enter Your PinCode
                  </label>
                  <Controller
                    name="pinCode"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "PinCode is required",
                      validate: (value) =>
                        (typeof value === "string" && value.trim() !== "") ||
                        "Pincode cannot be just spaces",
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTERYOURPINCODE || "Enter Your PinCode"
                        }
                        id="pinCodeInput"
                        labelId="pinCode-label"
                      />
                    )}
                  />
                  {errors.pinCode && (
                    <span className="text-red-700">
                      {errors?.pinCode?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {state === "receiver" && (
            <div className="flex flex-col gap-8 m-auto">
              {/* <div className='md:flex gap-5'>
                <div className='w-full md:w-[49%] flex flex-col gap-5'>
                  <Controller
                    name="favaddress"
                    control={control}
                    defaultValue=""
                    // rules={{ required: 'First Name is required' }}
                    render={({ field }) => (
                      <SelectC label={i18?.NEW?.PICKADDRESSFROMBOOK || 'Pick address from book'} />
                    )}
                  />
                </div>
              </div> */}

              <div className="md:flex gap-5">
                <div className="w-full flex flex-col gap-5">
                  <label
                    id="firstname-label"
                    htmlFor="firstnameInput"
                    className="sr-only"
                  >
                    Enter Your First name
                  </label>
                  <Controller
                    name="consigneeFirstName"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "First Name is required",
                      validate: (value) =>
                        (typeof value === "string" && value.trim() !== "") ||
                        "First Name cannot be just spaces",
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTERYOURFIRSTNAME ||
                          "Enter Your First name"
                        }
                        id="firstnameInput"
                        labelId="firstname-label"
                        required={true}
                      />
                    )}
                  />
                  {errors.consigneeFirstName && (
                    <span className="text-red-700">
                      {errors?.consigneeFirstName?.message}
                    </span>
                  )}
                </div>
                <div className="w-full flex flex-col gap-5">
                  <label
                    id="lastName-label"
                    htmlFor="lastNameInput"
                    className="sr-only"
                  >
                    Enter Your Last name
                  </label>
                  <Controller
                    name="consigneeLastName"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Last Name is required",
                      validate: (value) =>
                        (typeof value === "string" && value.trim() !== "") ||
                        "Last Name cannot be just spaces",
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTERYOURLASTNAME || "Enter Your Last name"
                        }
                        id="lastNameInput"
                        labelId="lastName-label"
                        required={true}
                      />
                    )}
                  />
                  {errors.consigneeLastName && (
                    <span className="text-red-700">
                      {errors?.consigneeLastName?.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="md:flex gap-5">
                <div className="w-full flex flex-col gap-5">
                  <Controller
                    name="consigneePhone"
                    control={control}
                    rules={{ required: "Phone Number is required" }}
                    render={({ field }) => (
                      <>
                        <label
                          id="consigneePhone-label"
                          htmlFor="consigneePhoneInput"
                          className="sr-only"
                        >
                          Consignee Phone Number
                        </label>
                        <PhoneInputComponent
                          value={PhoneNumberRecvr}
                          onPhoneChange={(number: any, code: any) => {
                            setValue("consigneePhone", number, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setValue("consigneePhoneCode", code, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                          inputId="consigneePhoneInput"
                          labelId="consigneePhone-label"
                        />
                      </>
                    )}
                  />
                  {errors.consigneePhone && (
                    <span className="text-red-700">
                      {errors?.consigneePhone?.message}
                    </span>
                  )}
                </div>

                <div className="w-full flex flex-col gap-5">
                  <label
                    id="email-label"
                    htmlFor="emailInput"
                    className="sr-only"
                  >
                    Enter Your Email
                  </label>
                  <Controller
                    name="consigneeEmail"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                      validate: (value) =>
                        (typeof value === "string" && value.trim() !== "") ||
                        "Email cannot be just spaces",
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTERYOUREMAIL || "Enter Your Email"
                        }
                        required={true}
                        id="emailInput"
                        labelId="email-label"
                      />
                    )}
                  />
                  {errors.consigneeEmail && (
                    <span className="text-red-700">
                      {errors?.consigneeEmail?.message}
                    </span>
                  )}
                </div>
              </div>


              <div className="border border-btncolor rounded-lg p-3">
                <LoaderScript>
                  <AutocompleteComp
                    onPlaceChangedpickup={onPlaceChangedDrop}
                    type="pickup"
                    placeholder={"Autocomplete Address"}
                  />
                </LoaderScript>
              </div>

              <div>
                <label
                  id="address-label"
                  htmlFor="addressInput"
                  className="sr-only"
                >
                  Enter Your Address
                </label>
                <Controller
                  name="consigneeAddress"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Address is required",
                    validate: (value) =>
                      (typeof value === "string" && value.trim() !== "") ||
                      "Address cannot be just spaces",
                  }}
                  render={({ field }) => (
                    <LabeledInput
                      {...field}
                      placeholder={
                        i18?.NEW?.ENTERYOURADDRESS || "Enter Your Address"
                      }
                      required={true}
                      id="addressInput"
                      labelId="address-label"
                    />
                  )}
                />
                {errors.consigneeAddress && (
                  <span className="text-red-700">
                    {errors?.consigneeAddress?.message}
                  </span>
                )}
              </div>
              {/* <CustomizedSwitches
                  label={i18?.NEW?.MARKTHISADDRESSASFAVOURITE || "Mark this address as favourite"}
                /> */}

              <div className="md:flex gap-5">
                <div className="w-full flex flex-col gap-5">
                  <label
                    id="country-label"
                    htmlFor="countryInput"
                    className="sr-only"
                  >
                    Enter Your Country
                  </label>
                  <Controller
                    name="consigneeCountry"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Country is required",
                      validate: (value) =>
                        (typeof value === "string" && value.trim() !== "") ||
                        "Country cannot be just spaces",
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTERYOURCOUNTRY || "Enter Your Country"
                        }
                        required={true}
                        id="countryInput"
                        labelId="country-label"
                      />
                    )}
                  />
                  {errors.consigneeCountry && (
                    <span className="text-red-700">
                      {errors?.consigneeCountry?.message}
                    </span>
                  )}
                </div>

                <div className="w-full flex flex-col gap-5">
                  <label
                    id="city-label"
                    htmlFor="cityInput"
                    className="sr-only"
                  >
                    Enter Your City
                  </label>
                  <Controller
                    name="consigneeCity"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "City is required",
                      validate: (value) =>
                        (typeof value === "string" && value.trim() !== "") ||
                        "City cannot be just spaces",
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTERYOURCITY || "Enter Your City"
                        }
                        required={true}
                        id="cityInput"
                        labelId="city-label"
                      />
                    )}
                  />
                  {errors.consigneeCity && (
                    <span className="text-red-700">
                      {errors?.consigneeCity?.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="md:flex gap-5">
                <div className="w-[49%] flex flex-col gap-5">
                  <label
                    id="pinCode-label"
                    htmlFor="pinCodeInput"
                    className="sr-only"
                  >
                    Enter Your PinCode
                  </label>
                  <Controller
                    name="consigneePinCode"
                    control={control}
                    rules={{
                      required: "PinCode is required",
                      validate: (value) => {
                        if (typeof value !== "string") return "Pincode cannot be just spaces";

                        const trimmed = value;

                        if (!trimmed) return "Pincode cannot be just spaces";
                        if (!/^\d+$/.test(trimmed))
                          return "Pincode must contain only numbers";

                        return true;
                      },
                    }}
                    render={({ field }) => (
                      <LabeledInput
                        {...field}
                        placeholder={
                          i18?.NEW?.ENTERYOURPINCODE || "Enter Your PinCode"
                        }
                        required={true}
                        id="pinCodeInput"
                        labelId="pinCode-label"
                      />
                    )}
                  />
                  {errors.consigneePinCode && (
                    <span className="text-red-700">
                      {errors?.consigneePinCode?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* {
            <div className='flex mt-6'>
              <Button className='text-[#fff] py-5 px-8 rounded-full bg-btncolor text-[17px] font-[500]'>
                {isDirty ? (i18?.NEW?.SUBMIT || 'Submit') : (i18?.NEW?.NEXT || 'Next')}
              </Button>
            </div>
          } */}
          {
            <div className="flex mt-6">
              <Button className="text-[#fff] py-5 px-8 rounded-full bg-btncolor text-[17px] font-[500]">
                {state === "receiver"
                  ? i18?.NEW?.SUBMIT || "Submit"
                  : i18?.NEW?.NEXT || "Next"}
              </Button>
            </div>
          }
        </form>
      </div>
    </div>
  );
}

export default Details;
