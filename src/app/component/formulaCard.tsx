import React, { useContext } from "react";
import Cardblue from "./cardblue";
import PageContext from "../providers/pagecontext";
import Image from "next/image";
import Button from "./button";

export default function FormulaCard({
  button = false,
  titleStyle = "font-bold text-[21px] sm:text-[30px] lg:text-[45px] xl:text-[55px] text-[#004080]",
}: {
  button?: boolean;
  titleStyle?: string;
}) {
  const { i18 } = useContext(PageContext);
  const delivery_Cancellation = i18?.DELIVERY_CANCELLATION;
  const dynamic_Calculation = i18?.DYNAMIC_CALCULATION;
  return (
    <Cardblue altStyle="p-5 md:mb-20 mb-10 ">
      <div className="flex items-center justify-center flex-wrap md:gap-0 gap-5">
        <div className="xl:w-8/12 md:w-1/2 w-full md:pr-3 pr-0">
          <h2 className={`${titleStyle} sm:mb-10 mb-5`}>
            {delivery_Cancellation?.PARCEL_BLK1_TITLE ||
              "Calculate actual weight and volumetric weight easily."}
          </h2>
          <p className="mb-2 md:text-[20px] text-[17px] ">
            {delivery_Cancellation?.VOLUMETRIC_WEIGHT || "Volumetric Weight"}{" "}
            (kg) = ({i18?.NEW?.LENGTH || "Length"} ×{" "}
            {i18?.NEW?.WEIGHT || "Width"} × {i18?.NEW?.HEIGHT || "Height"}) ÷
            5000
          </p>
          <p className="mb-2 md:text-[20px] text-[17px] ">
            {delivery_Cancellation?.PARCEL_BLK1_DESC ||
              "We always use the higher of actual weight and volumetric weight."}
          </p>
          {button && (
            <Button
              className={`text-[16px] sm:text-[18px] md:text-[20px] font-normal md:px-12 px-6 md:py-4 py-3 border rounded-lg bg-btncolor text-[#fff] my-4 md:mt-6 hover:scale-[1.05] duration-150`}
            >
              {dynamic_Calculation?.CALCULATE_NOW || "Calculate Now"}
            </Button>
          )}
        </div>
        <div className="xl:w-4/12 sm:w-1/2 w-full">
          <Image
            width={1000}
            height={1000}
            src="/svg/parcel 1.svg"
            alt={"parcel 1.svg"}
            className=" object-contain w-full lg:h-[300px] h-[270px]"
          />
        </div>
      </div>
    </Cardblue>
  );
}
