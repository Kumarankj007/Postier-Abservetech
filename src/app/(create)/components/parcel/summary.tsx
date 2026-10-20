"use client";
import VehicleImgCarousel from "@/app/(profileDetails)/accountsettings/manage-vehicles/vehicleimgCarousel";
import PageContext from "@/app/providers/pagecontext";
import StoreParcel from "@/app/store/store-parcel";
import VehicleStore from "@/app/store/vehicle";
import { FormatDateTime } from "@/utils";
import { Divider } from "@mui/material";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useMemo } from "react";

export default function Summary() {
  const path = usePathname();
  const { i18 } = useContext(PageContext);
  const { Parceldata } = StoreParcel();
  const { fetchVehicleDoc, VehicleDoc } = VehicleStore();
  const User_id =
    typeof window !== "undefined" &&
    window.localStorage.getItem("appUserId") !== ""
      ? window.localStorage.getItem("appUserId")
      : null;
  const value = useMemo(() => {
    const allImages: { name: string; file: string }[] = [];

    const imageGroups = [
      { name: "frontviewImage", files: Parceldata.frontviewImage || [] },
      { name: "primaryImage", files: Parceldata.primaryImage || [] },
      { name: "sideviewImage", files: Parceldata.sideviewImage || [] },
      { name: "topviewImage", files: Parceldata.topviewImage || [] },
    ];

    imageGroups.forEach(({ name, files }) => {
      files.forEach((file: any) => {
        const url = file instanceof File ? URL.createObjectURL(file) : file;
        allImages.push({ name, file: url });
      });
    });

    return allImages;
  }, [Parceldata]);
  const pickup =
    Parceldata?.pickupDate && FormatDateTime(Parceldata?.pickupDate);
  const drop =
    Parceldata?.deliveryDate && FormatDateTime(Parceldata?.deliveryDate);

  const val = Array.isArray(Parceldata?.category)
    ? Parceldata.category.map((item) => item?.name).join(", ")
    : "";

  const StopPoints = Array.isArray(Parceldata?.stopPointsArr)
    ? Parceldata.stopPointsArr.map((item) => item?.name).join(", ")
    : "";

  const Routes = `${Parceldata?.routeObject?.distanceText} - ${
    Parceldata?.routeObject?.hasTolls ? "Toll" : "No Toll"
  } - ${Parceldata?.routeObject?.durationText} `;
  const Grid = [
    ...(path === "/createtrip/" || path === "/choosetrip/"
      ? [
          {
            img: "/svg/icon/mapRoute.svg",
            text: i18?.NEW?.ROUTE || "Route",
            value: Routes,
          },
          ...(Parceldata?.stopPointsArr?.length > 0
            ? [
                {
                  img: "/svg/icon/map-pin.svg",
                  text: i18?.NEW?.STOP_POINTS || "Stop Points",
                  value: StopPoints,
                },
              ]
            : []),
          // {
          //   img: "/svg/icon/briefcase.svg",
          //   text: i18?.NEW?.VEHICLE_CAPACITY || "Vehicle Capacity",
          //   value: Parceldata?.VehicleCapacity,
          // },
          {
            img: "/png/dollar-sign.png",
            text: i18?.NEW?.AVERAGE_PRICE1 || "Average Price",
            value: `${Parceldata?.Price} EUR`,
          },
          {
            img: "/svg/icon/thunder-svgrepo-com 1.svg",
            text: i18?.NEW?.INSTANT_BOOKING || "Instant Booking",
            value: Parceldata?.instantBooking === "active" ? "Yes" : "No",
          },
        ]
      : []),
    {
      img: "/svg/icon/shopping-bag.svg",
      text: i18?.NEW?.WEIGHT || "Weight",
      value: Parceldata?.weight + " Kgs",
    },
    {
      img: "/svg/icon/Text rotate vertical.svg",
      text: i18?.NEW?.LENGTH || "Length",
      value: Parceldata?.length + " Centi Meter",
    },
    {
      img: "/svg/icon/Width.svg",
      text: i18?.NEW?.WIDTH || "Width",
      value: Parceldata?.width + " Centi Meter",
    },
    {
      img: "/svg/icon/Height.svg",
      text: i18?.NEW?.HEIGHT || "Height",
      value: Parceldata?.height + " Centi Meter",
    },
    {
      img: "/svg/icon/truck (1).svg",
      text: i18?.NEW?.DELIVERY_TYPE || "Delivery Type",
      value: Parceldata?.deliveryType,
    },
    {
      img: "/svg/icon/box.svg",
      text: i18?.NEW?.PARCEL_TYPE || "Parcel Type",
      value: val,
    },
  ];
  const VehicleImage = useMemo(() => {
    if (!Array.isArray(VehicleDoc)) return [];

    return VehicleDoc.flatMap((item: any) => {
      //
      if (item.name === "Vehicle Image" && Array.isArray(item?.fields)) {
        return item.fields.map((val: any) => ({
          name: val.indexName,
          file: val?.value || "",
        }));
      }
      return [];
    });
  }, [VehicleDoc]);

  // console.log("VehicleImage", VehicleImage);
  useEffect(() => {
    if (
      (path === "/createtrip/" || path === "/choosetrip/") &&
      Parceldata?.vehicleId
    ) {
      fetchVehicleDoc(User_id, Parceldata?.vehicleId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col gap-6 items-center h-full mt-[40px]">
      <h3 className="px-[20px] text-[30px] md:text-[50px] font-bold md:max-w-[880px] text-center leading-[37px] md:leading-[65px]">
        {i18?.NEW?.SUMMARYOFINFORMATION ||
          "Here’s the summary of information you have provided"}
      </h3>
      {/* <>
                <div className="p-2 flex justify-center items-center border border-1 border-btncolor rounded-[8px] w-full md:w-[720px]">
                    <p className="text-[24px] font-[700] leading-[31px]">Parcel Information</p>
                </div>

                <div className="p-[35px] mt-1 flex flex-col gap-5 border border-1 border-btncolor rounded-[8px] w-full md:w-[720px]">
                    {
                      Parceldata.pickupAddress && 
                      <p className="text-[17px] font-[700] leading-[31px]">Pickup Point: <span className="text-[17px] font-[400] leading-[31px]">{Parceldata?.pickupAddress?.primaryAddress}</span></p> 
                    }
                    {
                      Parceldata.dropAddress && 
                      <p className="text-[17px] font-[700] leading-[31px]">Destination Point: <span className="text-[17px] font-[400] leading-[31px]">{Parceldata?.dropAddress?.primaryAddress}</span></p> 
                    }
                    {
                      Parceldata.parcelByName && 
                      <p className="text-[17px] font-[700] leading-[31px]">Delivery Type: <span className="text-[17px] font-[400] leading-[31px]">{Parceldata.parcelByName}</span></p> 
                    }
                    {
                      Parceldata.category && 
                      <p className="flex gap-3 text-[17px] font-[700] leading-[31px]">Parcel Type: <span className="flex text-[17px] font-[400] leading-[31px]">
                        {Array.isArray(Parceldata.category) && Parceldata.category.map((items:any,index:any)=>{
                          return(
                            <div key={index}>
                               {items.name} {index < Parceldata.category.length - 1 && ', '}{''}
                            </div>
                          )
                      })} 
                      </span></p> 
                    }
                    {
                      (Parceldata.height || Parceldata.heightUnit) && 
                      <p className="text-[17px] font-[700] leading-[31px]">Parcel Width & Height: <span className="text-[17px] font-[400] leading-[31px]">{Parceldata.height} {Parceldata.heightType} & {Parceldata.width} {Parceldata.widthType}</span></p> 
                    }
                </div>
            </ div> */}
      <div className="px-[20px] md:p-[40px]">
        <div className="flex flex-col md:flex-row gap-[65px]">
          <div className="border border-1 border-btncolor rounded-[21px] p-4 max-h-[185px]">
            <VehicleImgCarousel
              VehicleDoc={
                path === "/createtrip/" || path === "/choosetrip/"
                  ? VehicleImage
                  : value
              }
              baseurl={
                path === "/createtrip/" || path === "/choosetrip/"
                  ? true
                  : false
              }
            />
          </div>
          <div className="flex flex-col gap-[30px]">
            <div className="flex items-center justify-start gap-[30px]">
              <div className="flex flex-col gap-3">
                <p className="text-[17px] font-[400] leading-[22px]">
                  {i18?.NEW?.PICK_UP || "Pick-up"}
                </p>
                <p className="text-[17px] font-[400] leading-[22px]">
                  {pickup?.date && pickup?.date} ,{" "}
                  {pickup?.time && pickup?.time}
                </p>
                <p className="text-[24px] md:text-[34px] font-[600] leading-[44px] max-w-[300px]">
                  {Parceldata?.pickUpCity
                    ? Parceldata?.pickUpCity
                    : Parceldata?.pickup}
                </p>
                <p className="text-[17px] font-[400] leading-[22px] max-w-[300px]">
                  {Parceldata?.pickup}
                </p>
              </div>

              <Image
                width={800}
                height={800}
                src="/svg/icon/Arrow back.svg"
                alt="img"
                className="w-[30px] h-[30px] mt-[33px]"
              />

              <div className="flex flex-col gap-3">
                <p className="text-[17px] font-[400] leading-[22px]">
                  {i18?.NEW?.DROP_OFF || "Drop-off"}
                </p>
                <p className="text-[17px] font-[400] leading-[22px]">
                  {drop?.date && drop?.date} , {drop?.date && drop?.time}
                </p>
                <p className="text-[24px] md:text-[34px] font-[600] leading-[44px] max-w-[300px]">
                  {Parceldata?.dropCity
                    ? Parceldata?.dropCity
                    : Parceldata?.drop}
                </p>
                <p className="text-[17px] font-[400] leading-[22px] max-w-[300px]">
                  {Parceldata?.drop}
                </p>
              </div>
            </div>

            <div className="border border-1 border-[rgba(0, 64, 128, 1)] " />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[35px]">
              {Grid.map((items, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <Image
                    src={items.img}
                    width={800}
                    height={800}
                    alt="img"
                    className="w-[20px] h-[20px]"
                  />
                  <p className="text-[17px] font-[400] leading-[22px] max-w-[300px] whitespace-nowrap truncate">
                    {items?.text} : {items?.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="border border-1 border-[rgba(0, 64, 128, 1)] " />

            <div className="flex flex-col gap-4">
              <p className="text-[17px] font-[700] leading-[22px] ">
                {i18?.NEW?.NOTE || "Note"}
              </p>
              <p>{Parceldata?.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
