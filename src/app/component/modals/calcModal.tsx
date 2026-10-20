import React, { useContext, useState } from "react";
import Store from "@/app/store/store";
import Image from "next/image";
import { priceFormat } from "@/utils";
import { SubTitle } from "../subTtlFont";

function CalcModal({ data }: any) {
  const { setModal } = Store();

  // console.log(data, "calc");
  // state:

  // fonts:
  const fonts = {
    titleFont: "font-semibold md:text-[24px] sm:text-[20px] text-[18px]",
    pFont: "font-extrabold md:text-[20px] sm:text-[18px] text-[16px]",
    pSm: "font-extrabold md:text-[18px] text-[15px]",
    HeadFont:
      "font-bold md:text-[45px] md:text-[50px] lg:text-[60px] text-[35px] ",
  };

  const calcs = [
    {
      img: "/svg/icon/bl_location.svg",
      value: data?.greatCircleDistanceKM + " km",
    },
    {
      img: "/svg/icon/bl_cash.svg",
      value: "Base Rate " + priceFormat(Number(data?.baseFare)),
    },
    {
      img: "/svg/icon/bl_time.svg",
      value: data?.urgencyType + ` (×${data?.urgencyFareMultiplier})`,
    },
    {
      img: "/svg/icon/bl_percent.svg",
      value:
        "Discount " +
        (data?.weightDiscountMultiplier == 0.85
          ? "15"
          : data?.weightDiscountMultiplier == 0.9
          ? "10"
          : "5") +
        "% (" +
        data?.highestWeight +
        " kg)",
    },
    {
      img: `/svg/icon/${
        data?.parcelType == "fragile" ? "bl_glass" : "bl_box"
      }.svg`,
      value: data?.parcelType + ` (×${data?.parcelTypeFareMultiplier})`,
    },
  ];

  return (
    <div className="">
      <b
        className={
          fonts.titleFont + " block text-center text-white bg-[#004080] p-4"
        }
      >
        {data?.greatCircleDistanceKM >= 1050
          ? "International"
          : data?.greatCircleDistanceKM >= 800
          ? "Cross-Country"
          : data?.greatCircleDistanceKM >= 120
          ? "Intercity"
          : "City (Envelope)"}
      </b>
      <div className="flex md:flex-row flex-col">
        <div className="md:w-1/2 p-4 md:border-r border-[#004080]">
          <div className="aspect-square w-4/5 max-w-[300px] border border-[#004080] rounded-3xl mb-5 p-7 mx-auto">
            <Image
              className="object-contain w-full h-full "
              height={50}
              width={50}
              alt={"product"}
              src={
                data?.greatCircleDistanceKM < 800
                  ? "/svg/delType02.svg"
                  : "/svg/delType04.svg"
              }
            />
          </div>
          {/* amount */}
          <b
            className={
              fonts.HeadFont +
              " text-[#37474F] mx-auto text-center block text-wrap break-words"
            }
          >
            {priceFormat(Number(data?.finalPrice), 2)}
          </b>
        </div>
        <div className="md:w-1/2 p-4 flex flex-col justify-center items-center px-4">
          <p className={fonts.pSm + " text-[#37474F] text-center"}>
            {data?.length}x{data?.width}x{data?.height} cm
          </p>
          <p className={fonts.pSm + " text-[#37474F] text-center"}>
            Actual Weight= {data?.actualWeight} kg
          </p>
          <div className="md:m-3 mt-7 md:block flex flex-wrap gap-x-5 justify-center">
            {calcs.map((item: any, ind: number) => (
              <div key={ind}>
                <SubTitle
                  title={item?.value}
                  img={item.img}
                  size="25"
                  subTtlFont={fonts.pFont + " capitalize"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalcModal;
