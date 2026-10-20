import Cardblue from "@/app/component/cardblue";
import PageContext from "@/app/providers/pagecontext";
import Image from "next/image";
import { useContext } from "react";

export default function Price(props: { titleStyle?: String }) {
  const { titleStyle } = props;
  const { i18 } = useContext(PageContext);
  const delivery_Cancellation = i18?.DELIVERY_CANCELLATION;
  return (
    <div>
      <h2 className="text-[16px] font-semibold sm:text-[25px]	md:text-[36px] my-5 md:mb-10 text-[#004080]">
        {delivery_Cancellation?.FLAT_SUBTITLE || "Flat Rate Pricing Model"}
      </h2>
      {/* block 1 */}
      <Cardblue altStyle="sm:p-5 p-3 md:mb-20 mb-10 ">
        <div className="flex items-center justify-center flex-wrap md:gap-0 gap-5">
          <div className=" md:w-7/12 w-full lg:pr-10 md:pr-5">
            <h2 className={`${titleStyle} md:mb-10 mb-5`}>
              {delivery_Cancellation?.FLAT_BLK1_TITLE ||
                "Flat Rate Pricing Model for Intercontinental Postiers"}
            </h2>
            <p className="mb-2 md:text-[20px] font-normal text-[16px] ">
              {delivery_Cancellation?.FLAT_BLK1_DESC ||
                "For Postiers traveling internationally, the pricing model is specially designed to reflect the realities of air travel while remaining fair and attractive to all parties involved."}
            </p>
          </div>
          <div className="md:w-5/12 w-full">
            <Image
              width={1000}
              height={1000}
              src="/svg/price01.svg"
              alt={"price01"}
              className="object-contain w-full xl:h-[392px] lg:h-[370px] sm:h-[300px] h-[250px] "
            />
          </div>
        </div>
      </Cardblue>
      {/* block 2 */}
      <Cardblue altStyle="sm:p-5 p-3 md:mb-20 mb-10 ">
        <div className="flex items-center justify-center flex-wrap md:gap-0 gap-5">
          <div className="md:w-4/12 w-full ">
            <Image
              width={1000}
              height={1000}
              src="/svg/price02.svg"
              alt={"price02"}
              className="object-contain w-full xl:h-[392px] lg:h-[370px] sm:h-[300px] h-[250px] "
            />
          </div>
          <div className=" md:w-8/12 w-full lg:px-10 md:px-5">
            <h2 className={`${titleStyle} md:mb-10 mb-5`}>
              {delivery_Cancellation?.FLAT_BLK2_TITLE ||
                "Long distances and high travel costs"}
            </h2>
            <p className="mb-2 md:text-[20px] font-normal text-[16px]">
              {delivery_Cancellation?.FLAT_BLK2_DESC ||
                "Long distances and high travel costs are accounted for through base flat rates that ensure Postiers are meaningfully compensated."}
            </p>
          </div>
        </div>
      </Cardblue>
      {/* block 3 */}
      <Cardblue altStyle="sm:p-5 p-3 md:mb-20 mb-10 ">
        <div className="flex items-center justify-center flex-wrap md:gap-0 gap-5">
          <div className=" md:w-7/12 w-full lg:pr-10 md:pr-5">
            <h2 className={`${titleStyle} md:mb-10 mb-5`}>
              {delivery_Cancellation?.FLAT_BLK3_TITLE ||
                "Luggage limits and parcel constraints"}
            </h2>
            <p className="mb-2 md:text-[20px] font-normal text-[16px] ">
              {delivery_Cancellation?.FLAT_BLK3_DESC ||
                "Luggage limits and parcel constraints are considered by categorizing parcels into realistic size/weight brackets (Envelope, Small, Medium, Large, Trolley)."}
            </p>
          </div>
          <div className="md:w-5/12 w-full">
            <Image
              width={1000}
              height={1000}
              src="/svg/price03.svg"
              alt={"price03"}
              className="object-contain w-full xl:h-[392px] lg:h-[370px] sm:h-[300px] h-[250px] "
            />
          </div>
        </div>
      </Cardblue>
      {/* block 4 */}
      <Cardblue altStyle="sm:p-5 p-3 md:mb-20 mb-10 ">
        <div className="flex items-center justify-center flex-wrap md:gap-0 gap-5">
          <div className="md:w-4/12 w-full ">
            <Image
              width={1000}
              height={1000}
              src="/svg/price04.svg"
              alt={"price04"}
              className="object-contain w-full xl:h-[392px] lg:h-[370px] sm:h-[300px] h-[250px] "
            />
          </div>
          <div className=" md:w-8/12 w-full lg:px-10 md:px-5">
            <h2 className={`${titleStyle} md:mb-10 mb-5`}>
              {delivery_Cancellation?.FLAT_BLK4_TITLE ||
                "Balanced affordability"}
            </h2>
            <p className="mb-2 md:text-[20px] font-normal text-[16px]">
              {delivery_Cancellation?.FLAT_BLK4_DESC ||
                "Balanced affordability ensures senders benefit from a cost-effective alternative to expensive international couriers."}
            </p>
          </div>
        </div>
      </Cardblue>
      {/* block 5 */}
      <Cardblue altStyle="sm:p-5 p-3 md:mb-20 mb-10 ">
        <div className="flex items-center justify-center flex-wrap md:gap-0 gap-5">
          <div className=" md:w-7/12 w-full lg:pr-10 md:pr-5">
            <h2 className={`${titleStyle} md:mb-10 mb-5`}>
              {delivery_Cancellation?.FLAT_BLK5_TITLE || "Postiers earn more"}
            </h2>
            <ul className="list-disc ml-8">
              <li>
                <p className="mb-2 md:text-[20px] font-normal text-[16px] ">
                  {delivery_Cancellation?.FLAT_BLK5_DESC1 ||
                    "⏱️ Urgency Level Multiplier – Extra earnings for Express or Same-Day deliveries"}
                </p>
              </li>
              <li>
                <p className="mb-2 md:text-[20px] font-normal text-[16px] ">
                  {delivery_Cancellation?.FLAT_BLK5_DESC2 ||
                    "📦 Delivery Type Multiplier – Higher rates for handling fragile, oversized, or temperature-sensitive parcels"}
                </p>
              </li>
              <li>
                <p className="mb-2 md:text-[20px] font-normal text-[16px] ">
                  {delivery_Cancellation?.FLAT_BLK5_DESC3 ||
                    "🧳 Package Type Tiers – Flat rate per size/weight class, such as envelopes or full trolley bags"}
                </p>
              </li>
            </ul>
          </div>
          <div className="md:w-5/12 w-full">
            <Image
              width={1000}
              height={1000}
              src="/svg/price05.svg"
              alt={"price05"}
              className="object-contain w-full xl:h-[392px] lg:h-[370px] sm:h-[300px] h-[250px] "
            />
          </div>
        </div>
      </Cardblue>
      {/* Table */}
      <div className="overflow-auto scroll-container bg-white rounded-2xl shadow-lg border border-[#004080]">
        <table className="w-full min-w-[700px] table-auto bg-[#004080]">
          <thead className="bg-[#004080] text-white lg:font-semibold font-normal xl:text-[24px] lg:text-[20px] text-[17px]">
            <tr>
              <th className="sm:px-6 px-3 sm:py-3 py-2 text-center">
                {delivery_Cancellation?.PARCEL_TYPE || "Parcel Type"}
              </th>
              <th className="sm:px-6 px-3 sm:py-3 py-2 text-center ">
                {delivery_Cancellation?.SIZE_WEIGHT || "Size/Weight"}
              </th>
              <th className="sm:px-6 px-3 sm:py-3 py-2 text-center ">
                {delivery_Cancellation?.BASE_RATE || "Base Rate (€)"}
              </th>
              <th className="sm:px-6 px-3 sm:py-3 py-2 text-center ">
                {delivery_Cancellation?.EXAMPPLE_ROUTES || "Example Routes"}
              </th>
            </tr>
          </thead>
          <tbody className="xl:text-[24px] lg:text-[20px] text-[16px] md:font-semibold font-normal bg-[#fff] box-border">
            <tr>
              <td className="lg:px-8 px-3 sm:py-6 py-3 border-[#004080] border-b text-center">
                <Image
                  width={200}
                  height={200}
                  src="/svg/pricetb01.svg"
                  alt={"pricetb01"}
                  className="object-contain w-full md:h-[120px] h-[80px] mb-2"
                />
                <p>
                  {delivery_Cancellation?.ENVELOPE_DOCS || "Envelope / Docs"}
                </p>
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b ">
                &lt; 0.5 kg / {delivery_Cancellation?.FLAT || "flat"}
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b">
                €15–€25
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b">
                {delivery_Cancellation?.PARIS_BERLIN ||
                  "Paris → NYC, Berlin → Lagos"}
              </td>
            </tr>
            <tr>
              <td className="lg:px-8 px-3 sm:py-6 py-3 border-[#004080] border-b text-center">
                <Image
                  width={200}
                  height={200}
                  src="/svg/pricetb02.svg"
                  alt={"pricetb02"}
                  className="object-contain w-full md:h-[120px] h-[100px] mb-2"
                />
                <p>{delivery_Cancellation?.SMALL_PARCEL || "Small Parcel"}</p>
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b ">
                2 kg / 15×20×20 cm
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b">
                €25–€40
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b">
                {delivery_Cancellation?.BRUSSELS_PARIS ||
                  "Brussels → Dubai, Paris → Tokyo"}
              </td>
            </tr>
            <tr>
              <td className="lg:px-8 px-3 sm:py-6 py-3 border-[#004080] border-b text-center">
                <Image
                  width={200}
                  height={200}
                  src="/svg/pricetb03.svg"
                  alt={"pricetb03"}
                  className="object-contain w-full md:h-[120px] h-[100px] mb-2"
                />
                <p>{delivery_Cancellation?.MEDIUM_PARCEL || "Medium Parcel"}</p>
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b ">
                2–5 kg / {delivery_Cancellation?.SHOEBOX_SIZE || "shoebox size"}
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b">
                €40–€60
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b">
                {delivery_Cancellation?.PARIS_LISBON ||
                  "Paris → Dakar, Lisbon → Toronto"}
              </td>
            </tr>
            <tr>
              <td className="lg:px-8 px-3 sm:py-6 py-3 border-[#004080] border-b text-center">
                <Image
                  width={200}
                  height={200}
                  src="/svg/pricetb04.svg"
                  alt={"pricetb04"}
                  className="object-contain w-full md:h-[120px] h-[100px] mb-2"
                />
                <p>{delivery_Cancellation?.LARGE_PARCEL || "Large Parcel"}</p>
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b ">
                5–10 kg /{" "}
                {delivery_Cancellation?.SUICASE || "carry-on suitcase"}
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b">
                €60–€100
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080] border-b">
                {delivery_Cancellation?.FRANKFURT_ROME ||
                  "Frankfurt → Accra, Rome → JFK"}
              </td>
            </tr>
            <tr>
              <td className="lg:px-8 px-3 sm:py-6 py-3 border-[#004080] text-center">
                <Image
                  width={200}
                  height={200}
                  src="/svg/pricetb05.svg"
                  alt={"pricetb05"}
                  className="object-contain w-full md:h-[120px] h-[100px] mb-2"
                />
                <p>
                  {delivery_Cancellation?.TROLLEY_PACKAGE || "Trolley Package"}
                </p>
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080]">
                10–23 kg /{" "}
                {delivery_Cancellation?.LUGGAGE || "fits checked luggage"}
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080]">
                €100–€200
              </td>
              <td className="text-center lg:px-8 px-3 md:py-4 py-2 border-l border-[#004080]">
                {delivery_Cancellation?.MUNICH_PARIS ||
                  "Munich → Nairobi, Paris → NYC"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
