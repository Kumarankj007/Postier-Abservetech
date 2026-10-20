import Cardblue from "@/app/component/cardblue";
import FormulaCard from "@/app/component/formulaCard";
import PageContext from "@/app/providers/pagecontext";
import Image from "next/image";
import { useContext } from "react";

export default function Parcel(props: { titleStyle?: string }) {
  const { titleStyle } = props;
  const { i18 } = useContext(PageContext);
  const delivery_Cancellation = i18?.DELIVERY_CANCELLATION;
  return (
    <>
      {/* formula */}
      <FormulaCard titleStyle={titleStyle} />
      {/* caluculation */}
      <Cardblue altStyle="p-5 md:mb-20 mb-10 ">
        <h2 className={`${titleStyle} lg:mb-10 mb-4`}>
          {delivery_Cancellation?.PARCEL_BLK2_TITLE ||
            "Example Calculation For Volumetric Weight"}
        </h2>
        <div className="flex items-center justify-center flex-wrap md:gap-0 gap-5">
          <div className="xl:w-8/12 md:w-1/2 w-full">
            <div className="xl:text-[24px] lg:text-[20px] w-full font-semibold md:px-3">
              <div className="mb-4 flex items-center">
                <p className="xl:w-1/4 w-1/2 text-[#004080]">
                  {delivery_Cancellation?.ACTUAL_WEIGHT || "Actual weight"}
                </p>
                <p className="sm:pr-10 pr-3">=</p>
                <p className="xl:w-3/5 w-1/2">0.5 kg</p>
              </div>
              <div className="mb-4 flex items-center">
                <p className="xl:w-1/4 w-1/2 text-[#004080]">
                  {delivery_Cancellation?.DIMENSIONS || "Dimensions"}
                </p>
                <p className="sm:pr-10 pr-3">=</p>
                <p className="xl:w-3/5 w-1/2">
                  30cm x 20cm x 10cm ({i18?.NEW?.LENGTH?.[0] || "L"} ×{" "}
                  {i18?.NEW?.WEIGHT?.[0] || "W"} ×{" "}
                  {i18?.NEW?.HEIGHT?.[0] || "H"})
                </p>
              </div>
              <div className="mb-4 flex items-center">
                <p className="xl:w-1/4 w-1/2 text-[#004080]">
                  {delivery_Cancellation?.FORMULA || "Formula"}
                </p>
                <p className="sm:pr-10 pr-3">=</p>
                <p className="xl:w-3/5 w-1/2">
                  ({i18?.NEW?.LENGTH || "Length"} ×{" "}
                  {i18?.NEW?.WEIGHT || "Width"} × {i18?.NEW?.HEIGHT || "Height"}
                  ) ÷ 5000
                </p>
              </div>
              <div className="mb-4 flex items-center">
                <p className="xl:w-1/4 w-1/2 text-[#004080]">
                  {delivery_Cancellation?.CALCULATION || "Calculation"}
                </p>
                <p className="sm:pr-10 pr-3">=</p>
                <div className="xl:w-3/5 w-1/2 flex flex-wrap items-center">
                  <div className="flex flex-col items-center mr-5 ">
                    <p className="border-b-2 border-black mb-2 pb-2">
                      (30 × 20 ×10)
                    </p>
                    <p>5000</p>
                  </div>
                  <p>= 1.2</p>
                </div>
              </div>
            </div>
            <p className="mt-10 text-[#004080] xl:text-[30px] lg:text-[25px] font-semibold">
              {delivery_Cancellation?.PARCEL_BLK2_DESC ||
                "The volumetric weight of the package amounts to 1.2kg."}
            </p>
          </div>
          <div className="xl:w-4/12 md:w-1/2 sm:w-3/4">
            <Image
              width={1000}
              height={1000}
              src="/svg/parcel 2.svg"
              alt={"parcel 2.svg"}
              className="object-contain w-full lg:h-[477px] h-auto"
            />
          </div>
        </div>
      </Cardblue>
      {/* discount section */}
      <section className="md:mb-20 mb-10">
        {/* title */}
        <div className="relative inline-block md:mb-5 mb-2">
          <h3 className="font-semibold text-[30px] md:text-[45px] lg:text-[64px] text-[#004080]">
            {delivery_Cancellation?.DISCOUNTS || "Discounts"}
          </h3>
          <Image
            width={100}
            height={60}
            src="/svg/parcel 3.svg"
            alt={"parcel 3.svg"}
            className="object-contain absolute w-[50px] -top-[5px] -right-[44px] md:w-[80px] md:-top-[10px] md:-right-[67px] lg:w-[100px]  lg:-top-[8px] lg:-right-[85px]"
          />
        </div>
        <div className="flex items-center flex-wrap justify-center md:gap-0 gap-5">
          {/* table */}
          <div className="overflow-auto scroll-container bg-white md:w-1/2 w-full rounded-2xl shadow-lg border border-[#004080] ">
            <table className="w-full min-w-[450px] table-auto">
              <thead className="bg-[#004080] text-white font-semibold xl:text-[24px] lg:text-[20px] text-[17px]">
                <tr>
                  <th className="sm:px-6 px-3 sm:py-3 py-2 text-center">
                    {delivery_Cancellation?.PARCEL_WEIGHT_RANGE ||
                      "Parcel Weight Range"}
                  </th>
                  <th className="sm:px-6 px-3 sm:py-3 py-2 text-center">
                    {delivery_Cancellation?.WEIGHT_ADJUSTMENT ||
                      "Weight Adjustment"}
                  </th>
                </tr>
              </thead>
              <tbody className="xl:text-[24px] lg:text-[20px] text-[17px] font-semibold">
                <tr className="">
                  <td className="sm:px-6 px-3 sm:py-4 py-2 sm:pt-8 pt-4 text-center">
                    0–10 kg
                  </td>
                  <td className="sm:px-6 px-3 sm:py-4 py-2 sm:pt-8 pt-4 text-center border-l border-[#004080]">
                    {delivery_Cancellation?.NO_DISCOUNT || "No discount"}
                  </td>
                </tr>
                <tr className="">
                  <td className="sm:px-6 px-3 sm:py-4 py-2 text-center">
                    11–30 kg
                  </td>
                  <td className="sm:px-6 px-3 sm:py-4 py-2 text-center border-l border-[#004080]">
                    5%{" "}
                    {delivery_Cancellation?.SHIPPING_COST ||
                      "off total shipping cost"}
                  </td>
                </tr>
                <tr className="">
                  <td className="sm:px-6 px-3 sm:py-4 py-2 text-center">
                    31–70 kg
                  </td>
                  <td className="sm:px-6 px-3 sm:py-4 py-2 text-center border-l border-[#004080]">
                    10%{" "}
                    {delivery_Cancellation?.SHIPPING_COST ||
                      "off total shipping cost"}
                  </td>
                </tr>
                <tr className="">
                  <td className="sm:px-6 px-3 sm:py-4 py-2 sm:pb-8 pb-4 text-center">
                    71+ kg
                  </td>
                  <td className="sm:px-6 px-3 sm:py-4 py-2 sm:pb-8 pb-4 text-center border-l border-[#004080]">
                    15%{" "}
                    {delivery_Cancellation?.SHIPPING_COST ||
                      "off total shipping cost"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* img */}
          <div className="md:w-1/2 sm:w-3/4 w-full md:pl-10">
            <Image
              width={500}
              height={500}
              className="w-full sm:object-cover object-contain"
              src={"/svg/parcel 4.svg"}
              alt={"parcel 4.svg"}
            />
          </div>
        </div>
      </section>
    </>
  );
}
