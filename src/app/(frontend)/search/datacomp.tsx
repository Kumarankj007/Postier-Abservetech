"use client";
import ParcelStore from "@/app/store/parcel";
import { FormatDateTime, priceFormat } from "@/utils";
import { Drawer, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import React, { useContext, useEffect, useMemo, useState } from "react";
import Filters from "./filters";
import RoleStore from "@/app/store/RoleStore";
import Store from "@/app/store/store";
import TypeStore from "@/app/store/typeStore";
import useScreenWidth from "@/app/hooks/usescreenwidth";
import Button from "@/app/component/button";
import PageContext from "@/app/providers/pagecontext";

function Datacomp() {
  const { i18 } = useContext(PageContext);
  const searchParams = useSearchParams();
  const router = UseLoadingRouter();
  const screen = useScreenWidth();
  const { RoleSwitch } = RoleStore();
  const { token } = Store();
  const { Type } = TypeStore();
  const [open, setOpen] = useState(false);
  const {
    FetchSearchTrip,
    SearchTrip,
    SearchTripCount,
    FetchSearchParcel,
    SearchParcel,
    SearchParcelCount,
  } = ParcelStore();
  const paramsObject = Object.fromEntries(searchParams.entries());

  const params = useMemo(() => {
    const excludedKeys = [
      "pickupAddress",
      "dropAddress",
      "pickupTime",
      "deliveryTime",
    ];

    const filteredParams = Object.fromEntries(
      Object.entries(paramsObject).filter(
        ([key]) => !excludedKeys.includes(key),
      ),
    );

    return filteredParams;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, paramsObject]);

  // const Type = useMemo(() => {
  //     if (token) {
  //         return RoleSwitch === 'user' ? 'sendparcel' : 'deliverparcel';
  //     } else {
  //         return Type;
  //     }
  // }, [ Type, token])
  // console.log('params', params)
  useEffect(() => {
    if (searchParams.size > 3)
      if (Type === "deliverparcel") {
        // console.log(searchParams, 'searchParams', RoleSwitch)
        FetchSearchParcel(params);
      } else {
        FetchSearchTrip(params);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React.useEffect(() => {
  //     return () => { console.log('datacomp component unmounted') };
  // }, [])
  const handleRedirect = (items: any, dropLat: any, dropLng: any) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (Type === "deliverparcel") {
      searchParams.set("id", items?._id);
      searchParams.set("type", "search");
      router.push(`/senderDetails?${searchParams}`);
    } else {
      searchParams.set("id", items?._id);
      searchParams.set("type", "search");
      searchParams.set("droplat", dropLat);
      searchParams.set("droplng", dropLng);
      router.push(`/deliveryDetails?${searchParams}`);
    }
  };

  return (
    <div className="flex gap-[40px] max-w-[1400px] mx-auto relative px-[30px] my-[30px] md:my-[70px]">
      {screen?.width && screen?.width > 1024 && (
        <div className=" min-w-[350px] overflow-y-auto relative h-screen scroll-container">
          <Filters />
        </div>
      )}
      {screen?.width && screen?.width < 1024 && (
        <Drawer
          anchor="right"
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            style: {
              width: screen.width > 696 ? "50%" : "90%",
              height: "100%",
              backgroundColor: "#fff",
            },
          }}
        >
          <div className="p-5">
            <div>
              <Image
                width={800}
                height={800}
                src="/svg/icon/close.svg"
                alt="img"
                className="w-[20px] h-[20px]"
                onClick={() => setOpen(false)}
              />
            </div>
            <Filters />
          </div>
        </Drawer>
      )}
      {/* overflow-y-auto relative h-screen scroll-container */}
      <div className="flex flex-col gap-[50px] w-full lg:overflow-y-auto lg:relative lg:h-screen scroll-container">
        <div className="flex flex-col gap-3 sticky top-0 bg-[#fff] p-2">
          <div className="flex flex-wrap justify-between gap-[20px]">
            <div className="flex gap-3 items-center w-full">
              <p className="text-[20px] font-[700] leading-[26px] whitespace-nowrap truncate">
                {paramsObject?.pickupAddress}
              </p>
              <Image
                width={800}
                height={800}
                src="/svg/icon/Arrow back.svg"
                alt="img"
                className="w-[20px] h-[20px]"
              />
              <p className="text-[20px] font-[700] leading-[26px] whitespace-nowrap truncate">
                {paramsObject?.dropAddress}
              </p>
            </div>
            {screen?.width && screen?.width < 1024 && (
              <Button
                className="flex items-center justify-center gap-3 p-3 border border-1 border-btncolor rounded-[11px] w-[100px]"
                onClick={() => setOpen(true)}
              >
                <p>{i18?.NEW?.FILTER || "Filter"}</p>
                <Image
                  src="/svg/icon/filtercolor.svg"
                  alt="img"
                  width={800}
                  height={800}
                  className="w-[20] h-[20px]"
                />
              </Button>
            )}
          </div>
          <p className="text-[20px] font-[400] leading-[26px] ">
            {Type === "deliverparcel" ? SearchParcelCount : SearchTripCount}{" "}
            {Type === "deliverparcel"
              ? i18?.NEW?.PARCELS_AVAILABLE || "Parcels Available"
              : i18?.NEW?.POSTIERS_AVAILABLE || "Postiers Available"}
          </p>
        </div>
        {Array.isArray(Type === "deliverparcel" ? SearchParcel : SearchTrip) &&
          (Type === "deliverparcel" ? SearchParcel : SearchTrip).map(
            (items: any, index: any) => {
              const pickup =
                Type === "deliverparcel"
                  ? items?.parcel?.pickupDate &&
                    FormatDateTime(items?.parcel?.pickupDate)
                  : items?.pickupDate && FormatDateTime(items?.pickupDate);
              const drop =
                Type === "deliverparcel"
                  ? items?.parcel?.deliveryDate &&
                    FormatDateTime(items?.parcel?.deliveryDate)
                  : items?.deliveryDate && FormatDateTime(items?.deliveryDate);

              const dropLat = items?.location?.endCoords?.coordinates[0];
              const dropLng = items?.location?.endCoords?.coordinates[1];
              const baseProfile =
                Type === "deliverparcel"
                  ? items?.consignor?.profile
                  : items?.postier?.profile;
              const userProfile = baseProfile?.startsWith("http")
                ? baseProfile
                : process.env.NEXT_PUBLIC_IMAGE_URL +
                  (Type === "deliverparcel"
                    ? items?.consignor?.profile
                    : items?.postier?.profile);

              const Array = [
                {
                  img: "/svg/icon/shopping-bag.svg",
                  text2: i18?.NEW?.AVAILABLE || "Available",
                  value:
                    Type === "deliverparcel"
                      ? items?.parcel?.weight
                      : items?.availableCapacity,
                  metric: "Kgs",
                },
                {
                  img: "/svg/icon/Text rotate vertical.svg",
                  text: i18?.NEW?.LENGTH || "Length",
                  value:
                    Type === "deliverparcel"
                      ? items?.parcel?.length
                      : items?.maxLength,
                  metric:
                    Type === "deliverparcel"
                      ? items?.parcel?.dimensionType
                      : items?.dimensionType,
                },
                {
                  img: "/svg/icon/Width.svg",
                  text: i18?.NEW?.WIDTH || "Width",
                  value:
                    Type === "deliverparcel"
                      ? items?.parcel?.width
                      : items?.maxWidth,
                  metric:
                    Type === "deliverparcel"
                      ? items?.parcel?.dimensionType
                      : items?.dimensionType,
                },
                {
                  img: "/svg/icon/Height.svg",
                  text: i18?.NEW?.HEIGHT || "Height",
                  value:
                    Type === "deliverparcel"
                      ? items?.parcel?.height
                      : items?.maxHeight,
                  metric:
                    Type === "deliverparcel"
                      ? items?.parcel?.dimensionType
                      : items?.dimensionType,
                },
                //   {
                //     img:'/svg/icon/truck (1).svg',
                //     text:'Delivery Type',
                //     value :items?.deliveryType
                //   },
                //   {
                //     img :'/svg/icon/box.svg',
                //     text :'Parcel Type',
                //     value :val
                //   },
              ];
              return (
                <div
                  key={index}
                  className="border border-1 border-btncolor  w-full  rounded-[11px] cursor-pointer"
                  onClick={() => handleRedirect(items, dropLat, dropLng)}
                >
                  <div className="border-b border-btncolor p-[20px] flex flex-col gap-6">
                    <div className="flex flex-col gap-6 md:flex-row justify-between md:items-center">
                      <div className="flex flex-row md:items-center justify-start gap-[20px] sm:gap-[30px]">
                        <div className="flex flex-col gap-3">
                          <p className="text-[12px] font-[400] text-[#222222] leading-[15px]">
                            {pickup?.date && pickup?.date} ,{" "}
                            {pickup?.time && pickup?.time}
                          </p>
                          <p className="text-[20px] font-[700] leading-[26px]">
                            {items?.location?.pickUp !== "" &&
                              items?.location?.pickUp}
                          </p>
                          <p className="text-[17px] font-[700] leading-[20px] text-[#222222]">
                            {items?.location?.pickUpCity !== "" &&
                              items?.location?.pickUpCity}
                          </p>
                        </div>
                        <Image
                          width={800}
                          height={800}
                          src="/svg/icon/Arrow back.svg"
                          alt="img"
                          className="w-[30px] h-[30px]"
                        />
                        {/* {
                                                (screen?.width && screen?.width > 768) ?
                                                    :
                                                    <Image width={800} height={800} src='/svg/icon/arrowdown.svg' alt="img" className="w-[30px] h-[30px]" />
                                            } */}

                        <div className="flex flex-col gap-3">
                          <p className="text-[12px] font-[400] text-[#222222 leading-[15px]">
                            {drop?.date && drop?.date} ,{" "}
                            {drop?.date && drop?.time}
                          </p>
                          {/* <p className="text-[20px] font-[700] leading-[26px]">{items?.location?.dropCity !== '' ? items?.location?.dropCity : items?.location?.drop}</p> */}
                          <p className="text-[20px] font-[700] leading-[26px]">
                            {items?.location?.drop !== "" &&
                              items?.location?.drop}
                          </p>
                          <p className="text-[17px] font-[700] leading-[20px] text-[#222222]">
                            {items?.location?.dropCity !== "" &&
                              items?.location?.dropCity}
                          </p>
                        </div>
                      </div>

                      <p className="text-[30px] font-[700] leading-[39px] ">
                        {Type === "deliverparcel"
                          ? priceFormat(Number(items?.parcel?.fare))
                          : priceFormat(Number(items?.avgPrice))}
                      </p>
                    </div>
                    {screen?.width && screen?.width > 627 && (
                      <div className="flex flex-wrap gap-8">
                        {Array.map((items: any, index: any) => {
                          return (
                            <div
                              key={index}
                              className="flex items-center justify-center"
                            >
                              <div className="flex gap-3 items-center justify-center">
                                <Image
                                  width={800}
                                  height={800}
                                  src={items.img}
                                  alt="img"
                                  className="w-[20px] h-[20px]"
                                />
                                {items.text && <p>{items.text} : </p>}
                              </div>
                              <p>
                                &nbsp;{items.value} {items?.metric}
                              </p>
                              {Type !== "deliverparcel" && items.text2 && (
                                <p>&nbsp; {items.text2}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="p-[20px]">
                    <div className="flex flex-col md:flex-row gap-4">
                      <Image
                        width={1000}
                        height={1000}
                        src={userProfile}
                        alt="img"
                        className="w-[70px] h-[70px] rounded-full object-fill"
                      />
                      <div className="flex flex-col  justify-around">
                        <p className="text-[18px] text-[#222222] font-[600] leading-[26px] md:max-w-[100px] md:whitespace-nowrap md:truncate">
                          {Type === "deliverparcel"
                            ? items?.consignor?.firstName &&
                              items?.consignor?.firstName
                            : items?.postier?.fname &&
                              items?.postier?.fname}{" "}
                          {Type === "deliverparcel"
                            ? items?.consignor?.lastName &&
                              items?.consignor?.lastName
                            : items?.postier?.lname && items?.postier?.lname}
                        </p>
                        <div className="flex gap-1">
                          <Image
                            width={800}
                            height={800}
                            src="/svg/icon/star.svg"
                            alt="img"
                            className="w-[20px] h-[20px]"
                          />
                          <p className="md:whitespace-nowrap md:truncate">
                            {items?.postier?.ratings?.totalValue || 0}{" "}
                            {i18?.NEW?.OUT_OF_5_STARS || "out of 5 stars"}
                          </p>
                        </div>
                      </div>
                      <div className="border border-r border-[rgba(0, 64, 128, 3)]" />
                      <div className="flex flex-col  justify-around">
                        <div className="flex gap-2 items-center">
                          <Image
                            width={800}
                            height={800}
                            src={
                              Type === "deliverparcel"
                                ? "/svg/icon/truck (1).svg"
                                : "/svg/icon/Directionscar.svg"
                            }
                            alt="img"
                            className="w-[30px] h-[30px]"
                          />
                          <p className="text-[18px] text-[#222222] font-[600] leading-[26px] whitespace-nowrap truncate">
                            {Type === "deliverparcel"
                              ? i18?.NEW?.DELIVERY_TYPE || "Delivery Type"
                              : i18?.NEW?.CAR || "Car"}
                          </p>
                        </div>
                        {Type === "deliverparcel" ? (
                          <p className="max-w-[100px] md:whitespace-nowrap md:truncate">
                            {items?.parcel?.deliveryType}
                          </p>
                        ) : (
                          <p className="whitespace-nowrap truncate">
                            {i18?.NEW?.TOTAL_CAPACITY || "Total Capacity"} :{" "}
                            {items?.capacity}
                          </p>
                        )}
                      </div>
                      <div className="border border-r border-[rgba(0, 64, 128, 3)]" />
                      <div className="flex flex-col  justify-around">
                        <div className="flex gap-2 items-center">
                          <Image
                            width={800}
                            height={800}
                            src={
                              Type === "deliverparcel"
                                ? "/svg/icon/box.svg"
                                : "/svg/icon/shopping-bag.svg"
                            }
                            alt="img"
                            className="w-[30px] h-[30px]"
                          />
                          <p className="text-[18px] text-[#222222] font-[600] leading-[26px] whitespace-nowrap truncate">
                            {Type === "deliverparcel"
                              ? i18?.NEW?.PARCEL_TYPE || "Parcel Type"
                              : i18?.NEW?.MAXWEIGHTPERPARCEL ||
                                "Max Weight Per Parcel"}{" "}
                          </p>
                        </div>
                        {Type === "deliverparcel" ? (
                          <p className="max-w-[130px] whitespace-nowrap truncate">
                            {items?.parcel?.type}
                          </p>
                        ) : (
                          <p className="max-w-[230px] whitespace-nowrap truncate">
                            {i18?.NEW?.MAXWEIGHTPERPARCEL ||
                              "Max Weight Per Parcel"}
                            : {items?.maxWeight}
                          </p>
                        )}
                      </div>
                      {Type !== "deliverparcel" &&
                        items?.instantBooking !== "inactive" && (
                          <>
                            <div className="border border-r border-[rgba(0, 64, 128, 3)]" />
                            <div className="flex flex-col  justify-around">
                              <div className="flex gap-2 items-center">
                                <Image
                                  width={800}
                                  height={800}
                                  src="/svg/icon/thunder.svg"
                                  alt="img"
                                  className="w-[30px] h-[30px]"
                                />
                                <p className="text-[18px] text-[#222222] font-[600] leading-[26px] whitespace-nowrap truncate">
                                  {" "}
                                  {i18?.NEW?.INSTANT_BOOKING ||
                                    "Instant Booking"}{" "}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              );
            },
          )}
      </div>
    </div>
  );
}

export default Datacomp;
