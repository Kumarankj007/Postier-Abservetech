import Cardblue from "@/app/component/cardblue";
import Image from "next/image";
import { DelType } from "../../../../content";
import PageContext from "@/app/providers/pagecontext";
import { useContext } from "react";

export default function Delivery(props: { titleStyle?: String }) {
  const { titleStyle } = props;
    const { i18 } = useContext(PageContext);
    const delivery_Cancellation = i18?.DELIVERY_CANCELLATION;
  return (
    <div>
      {/* block 1 */}
      <Cardblue altStyle="sm:p-5 p-3 md:mb-20 mb-10 ">
        <div className="flex items-center justify-center flex-wrap md:gap-0 gap-5">
          <div className=" md:w-7/12 w-full">
            <h2 className={`${titleStyle} md:mb-10 mb-5`}>{i18?.NEW?.DELIVERY_TYPE || "Delivery type"}</h2>
            <p className="mb-2 md:text-[20px] font-normal text-[16px] md:pr-10">
              {delivery_Cancellation?.DELIVERY_BLK1_DESC || "At Postier, we understand that not all parcels are the same. Some require special handling, extra care, or specific transportation conditions. To ensure accurate pricing and fair compensation for Postiers, we apply Delivery Type Adjustments based on the nature of the parcel."}
            </p>
          </div>
          <div className="md:w-5/12 w-full">
            <Image
              width={1000}
              height={1000}
              src="/svg/delType01.svg"
              alt={"delType01"}
              className="object-contain w-full xl:h-[392px] lg:h-[370px] sm:h-[300px] h-[250px] "
            />
          </div>
        </div>
      </Cardblue>
      {/* block 2 */}
      {/* delivery type */}
      <section className="md:mb-20 mb-10">
        {/* title */}
        <div className="relative inline-block md:mb-10 mb-4">
          <h3 className="font-semibold text-[30px] md:text-[45px] lg:text-[64px] text-[#004080]">
            {i18?.NEW?.DELIVERY_TYPE || "Delivery type"}
          </h3>
        </div>

        <div className="flex justify-center overflow-visible">
          <div className="flex overflow-auto scroll-container mx-auto lg:gap-6 gap-6">
            {DelType().map((item: any, index: number) => {
              return (
                <>
                  <Cardblue
                    key={index}
                    altStyle="w-[320px] md:min-w-[250px] flex flex-col  min-w-[230px] rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center md:min-h-[80px] min-h-[60px] bg-[#004080]">
                      <b className="block font-semibold text-[#fff] w-full text-center leading-tight  lg:text-[24px] md:text-[20px] text-[16px] p-3">
                        {item.title}
                      </b>
                    </div>
                    <div className="w-full flex flex-col items-center md:p-6 p-4 flex-1">
                      <div className="border-[1px] border-[#004080] rounded-xl w-3/4 aspect-square p-6 mb-3">
                        <Image
                          width={100}
                          height={100}
                          src={item.img}
                          alt={item.img}
                          className="object-contain size-full aspect-square"
                        />
                      </div>
                      <p className="font-bold text-[#37474F] md:mb-6 mb-3 lg:text-[24px] md:text-[20px] text-[16px]">
                        x {item.range}
                      </p>
                      <p className="font-semibold text-center lg:text-[24px] md:text-[20px] text-[16px] mb-3">
                        {item.desc}
                      </p>
                      <p className="font-semibold text-wrap text-[#004080] text-center lg:text-[24px] md:text-[20px] text-[16px] md:mx-4">
                        {item.value}
                      </p>
                    </div>
                  </Cardblue>
                </>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
