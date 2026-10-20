"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFormContext } from "../FormCotext";
import Button from "@/app/component/button";
import StoreParcel from "@/app/store/store-parcel";
import useSnackbarStore from "@/app/store/toaster";
import { useMutation } from "@tanstack/react-query";
import {
  CreateParcel,
  CreateTrip,
  UpdateParcel,
  UpdateTrip,
} from "@/app/tools/mutatefn/Parcelpost";
import RoleStore from "@/app/store/RoleStore";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";

export default function Header() {
  const { i18 } = useContext(PageContext);
  const path = usePathname();
  const router = UseLoadingRouter();
  const { setRole } = RoleStore();
  const param = useSearchParams();
  const Trip_id = param.get("trip_id");
  const Parcel_id = param.get("parcel_id");
  const { step } = useFormContext();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { Parceldata, clearAllParcelData } = StoreParcel();
  const saveandexist = path === "/createtrip/" ? 18 : 14;
  const Post = useMutation({
    mutationFn: CreateParcel,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      router.push("/mypost/");
      clearAllParcelData();
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const Update = useMutation({
    mutationFn: UpdateTrip,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      router.push("/mytrips/");
      clearAllParcelData();
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const UpdatePost = useMutation({
    mutationFn: UpdateParcel,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      router.push("/mypost/");
      clearAllParcelData();
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const trip = useMutation({
    mutationFn: CreateTrip,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      router.push("/mytrips/");
      clearAllParcelData();
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const handleSaveandExistPost = () => {
    // debugger
    const formData = new FormData();
    const data = Parceldata;
    formData.append("description", data.desc);
    formData.append("status", "Pending");
    const fileFields = [
      "frontviewImage",
      "primaryImage",
      "sideviewImage",
      "topviewImage",
    ];
    fileFields.forEach((field) => {
      if (Array.isArray(data[field]) && data[field].length > 0) {
        data[field].forEach((file: any) => formData.append(field, file));
      }
    });

    Object.keys(data).forEach((key) => {
      if (key === "pickupAddress" || key === "dropAddress") {
        formData.append(key, data[key].primaryAddress);
      } else if (!fileFields.includes(key) && key !== "category") {
        formData.append(key, data[key]);
      }
    });

    const categoryString = data.category
      .map((item: any) => item.name)
      .join(",");
    formData.append("type", categoryString);
    const logFormData = (formData: any) => {
      for (const [key, value] of formData.entries()) {
        // console.log(`${key}:`, value);
      }
    };
    logFormData(formData);

    // console.log("formDatasss", formData);
    if (Parcel_id) {
      UpdatePost.mutateAsync({ Parcel_id, formData });
    } else {
      Post.mutateAsync(formData);
    }
  };
  const handleSaveandExistTrip = () => {
    // debugger
    const data = Parceldata;
    const values: any = {};
    values.status = "Pending";
    if (data.desc) {
      values.description = data.desc;
    }
    if (data.category) {
      const val = data.category.map((item: any) => item?.name).join(", ");
      values.type = val;
    }
    if (data?.pickUpCity) {
      values.pickUpCity = data?.pickUpCity;
    }
    if (data?.dropCity) {
      values.dropCity = data?.dropCity;
    }
    if (data?.pickupLng) {
      values.pickupLng = data?.pickupLng;
    }
    if (data?.pickupLat) {
      values.pickupLat = data?.pickupLat;
    }
    if (data?.dropLng) {
      values.dropLng = data?.dropLng;
    }
    if (data?.dropLat) {
      values.dropLat = data?.dropLat;
    }
    if (data?.pickupDate) {
      values.pickupDate = data?.pickupDate;
    }
    if (data?.deliveryDate) {
      values.deliveryDate = data?.deliveryDate;
    }
    if (data?.deliveryType) {
      values.deliveryType = data?.deliveryType;
    }
    // if (data?.VehicleCapacity) {
    //   values.capacity = parseInt(data?.VehicleCapacity);
    // }

    if (data?.weight) {
      values.maxWeight = parseInt(data?.weight);
    }
    if (data?.width) {
      values.maxWidth = parseInt(data?.width);
    }
    if (data?.height) {
      values.maxHeight = parseInt(data?.height);
    }
    if (data?.length) {
      values.maxLength = parseInt(data?.length);
    }
    if (data?.Price) {
      values.avgPrice = parseInt(data?.Price);
    }
    if (data?.wayPointId) {
      values.wayPointId = data?.wayPointId;
    }
    if (data?.vehicleId) {
      values.vehicleId = data?.vehicleId;
    }
    if (data?.stopPointsArr) {
      values.stopPointsArr = data?.stopPointsArr;
    }
    if (data?.instantBooking) {
      values.instantBooking = data?.instantBooking;
    }
    if (data?.pickup) {
      values.pickup = data?.pickup;
    }
    if (data?.drop) {
      values.drop = data?.drop;
    }

    if (Trip_id) {
      Update.mutateAsync({ Trip_id, values });
    } else {
      trip.mutateAsync(values);
    }
  };
  // useEffect(()=>{
  //   if(localStorage.getItem('app-Role')){
  //     const value:any = localStorage.getItem('app-Type') ? localStorage.getItem('app-Role') : null
  //     const json = JSON.parse(value)
  //     setRole(json?.state?.RoleSwitch)
  //   }
  // },[])
  // console.log("path", path);

  //  useEffect(()=>{
  //   clearAllParcelData()
  //  },[])
  return (
    <div className="w-full sticky top-0 bg-white z-[999]  shadow-md">
      <div className="px-10  flex justify-between items-center w-full shadow-shadowbox ">
        <Image
          width={100}
          height={100}
          src="/svg/postier.svg"
          alt=""
              priority
          aria-hidden="true"
          onClick={() => router.push("/")}
          className="cursor-pointer"
        />
        {step === saveandexist && (
          <Button
            onClick={
              path === "/createtrip/"
                ? handleSaveandExistTrip
                : handleSaveandExistPost
            }
            className=" border-2 border-btncolor rounded-full px-5 py-2 h-[50px]"
          >
            {i18?.NEW?.SAVE_EXIT_BUTTON || "Save & Exit"}
          </Button>
        )}
      </div>
    </div>
  );
}
