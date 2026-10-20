import Cardblue from "@/app/component/cardblue";
import PageContext from "@/app/providers/pagecontext";
import Image from "next/image";
import { useContext } from "react";

export default function Distance(props: { titleStyle?: String }) {
  const { titleStyle } = props;
  const { i18 } = useContext(PageContext);
  const delivery_Cancellation = i18?.DELIVERY_CANCELLATION;
  return (
    <div>
      {/* block 1 */}
      <Cardblue altStyle="sm:p-5 p-3 md:mb-20 mb-10 ">
        <div className="flex items-center justify-center flex-wrap md:gap-0 gap-5">
          <div className="xl:w-8/12 md:w-1/2 w-full">
            <h2 className={`${titleStyle} md:mb-10 mb-5`}>
              {delivery_Cancellation?.DISTANCE_BLK1_TITLE ||
                "Distance-Based Pricing with Discounts"}
            </h2>
            <p className="mb-2 font-normal  md:text-[20px] text-[16px] md:pr-10 ">
              {delivery_Cancellation?.DISTANCE_BLK1_DESC ||
                "Postier uses the Great Circle Distance formula to calculate the most direct distance between the pickup and drop-off locations. This method ensures fair and geographically accurate pricing for parcel deliveries—especially useful for cross-city, cross-country, and intercontinental trips."}
            </p>
          </div>
          <div className="xl:w-4/12 sm:w-1/2 w-full">
            <Image
              width={1000}
              height={1000}
              src="/svg/dis01.svg"
              alt={"dis01"}
              className="object-contain w-full xl:h-[442px] lg:h-[400px] h-[300px]"
            />
          </div>
        </div>
      </Cardblue>
      {/* block 2 */}
      <div className="relative flex flex-col justify-center items-center sm:mb-20 mb-28">
        <div className="sm:w-[600px] w-full relative aspect-square rounded-full sm:p-16 p-10 bg-[#0040808C]">
          <p className="w-full absolute sm:top-6 top-3 text-center -translate-x-1/2 left-1/2 md:text-[24px] sm:text-[20px] text-[17px]font-semibold text-[#fff]">
            1201+ km
          </p>
          <div className="size-full relative aspect-square rounded-full sm:p-16 p-10 bg-[#00408098]">
            <p className="w-full absolute sm:top-6 top-3 text-center -translate-x-1/2 left-1/2 md:text-[24px] sm:text-[20px] text-[17px] font-semibold text-[#fff]">
              701–1200 km
            </p>
            <div className="size-full relative aspect-square rounded-full sm:p-16 p-10 bg-[#004080a8]">
              <p className="w-full absolute sm:top-6 top-3 text-center -translate-x-1/2 left-1/2 md:text-[24px] sm:text-[20px] text-[17px] font-semibold text-[#fff]">
                301–700 km
              </p>
              <div className="size-full relative aspect-square rounded-full sm:p-16 p-10 bg-[#004080]">
                <p className="w-full absolute sm:top-6 top-3 text-center -translate-x-1/2 left-1/2 md:text-[24px] sm:text-[20px] text-[17px] font-semibold text-[#fff]">
                  0–300 km
                </p>
              </div>
            </div>
          </div>
        </div>
        <Cardblue altStyle="absolute bg-[#fff] sm:bottom-8 sm:top-auto top-1/2 sm:p-10 p-3 ">
          <div className="flex items-center text-center  justify-center flex-wrap">
            <h2 className={`${titleStyle} sm:mb-7 mb-4`}>
              {delivery_Cancellation?.DISTANCE_BLK2_TITLE ||
                "What Is Great Circle Distance?"}
            </h2>
            <p className="mb-2 md:text-[20px] font-normal text-[16px] max-w-[733px] ">
              {delivery_Cancellation?.DISTANCE_BLK2_DESC ||
                "The Great Circle Distance is the shortest path between two points on the surface of a sphere (like Earth). It accounts for the planet’s curvature, offering more precise results than flat, straight-line methods."}
            </p>
          </div>
        </Cardblue>
      </div>
      {/* block 3 */}
      <section className="md:mb-20 mb-10">
        {/* title */}
        <h3 className="font-semibold text-[30px] md:mb-5 mb-2 md:text-[45px] lg:text-[64px] text-[#004080]">
          {delivery_Cancellation?.DISCOUNTS || "Discounts"}
        </h3>
        {/* table */}
        <div className="overflow-auto scroll-container bg-white rounded-2xl shadow-lg border border-[#004080] md:mx-10">
          <table className="w-full min-w-[500px] table-auto">
            <thead className="bg-[#004080] text-white lg:font-semibold font-normal xl:text-[24px] lg:text-[20px] text-[17px]">
              <tr>
                <th className="sm:px-6 px-3 sm:py-3 py-2 text-center">
                  {delivery_Cancellation?.DISTANCE_RANGE || "Distance Range"}
                </th>
                <th className="sm:px-6 px-3 sm:py-3 py-2 text-center">
                  {delivery_Cancellation?.DISTANCE_FACTOR || "Distance Factor (€ per km)"}
                </th>
                <th className="sm:px-6 px-3 sm:py-3 py-2 text-center">
                  {delivery_Cancellation?.DISCOUNT_APPLIED || "Discount Applied"}
                </th>
              </tr>
            </thead>
            <tbody className="xl:text-[24px] lg:text-[20px] text-[16px] lg:font-semibold font-normal">
              <tr className="">
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2 xl:pt-14 lg:pt-8 pt-4">
                  0–300 km
                </td>
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2 xl:pt-14 lg:pt-8 pt-4 border-l border-[#004080]">
                  {delivery_Cancellation?.STANDARD_RATE || "Standard rate (e.g., €0.10/km)"}
                </td>
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2 xl:pt-14 lg:pt-8 pt-4 border-l border-[#004080]">
                  {delivery_Cancellation?.NO_DISCOUNT || "No discount"}
                </td>
              </tr>
              <tr className="">
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2">
                  301–700 km
                </td>
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2 border-l border-[#004080]">
                  10% {delivery_Cancellation?.DISTANCE_COST || "off distance cost"}
                </td>
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2 border-l border-[#004080]">
                  {delivery_Cancellation?.MID_RANGE || "Mid-range discount"}
                </td>
              </tr>
              <tr className="">
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2">
                  701–1200 km
                </td>
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2 border-l border-[#004080]">
                  20% {delivery_Cancellation?.DISTANCE_COST || "off distance cost"}
                </td>
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2 border-l border-[#004080]">
                  {delivery_Cancellation?.LONG_HAUL || "Long-haul discount"}
                </td>
              </tr>
              <tr className="">
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2 lg:pb-8 pb-4">
                  1201+ km
                </td>
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2 lg:pb-8 pb-4 border-l border-[#004080]">
                  30% {delivery_Cancellation?.DISTANCE_COST || "off distance cost"}
                </td>
                <td className="xl:px-16 lg:px-8 px-3 sm:py-4 py-2 lg:pb-8 pb-4 border-l border-[#004080]">
                  {delivery_Cancellation?.VERY_LONG_HAUL || "Very long-haul discount"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
