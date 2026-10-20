import Cardblue from "@/app/component/cardblue";
import Image from "next/image";
import { UrgeryMultiplier } from "../../../../content";
import PageContext from "@/app/providers/pagecontext";
import { useContext } from "react";

export default function Urgery(props: { titleStyle?: String }) {
  const { titleStyle } = props;
  const { i18 } = useContext(PageContext);
  const delivery_Cancellation = i18?.DELIVERY_CANCELLATION;
  return (
    <div>
      {/* block 1 */}
      <Cardblue altStyle="sm:p-5 p-3 md:mb-20 mb-10 ">
        <div className="flex items-center justify-center flex-wrap md:gap-0 gap-5">
          <div className="md:w-8/12 w-full md:pr-16">
            <h2 className={`${titleStyle} md:mb-10 mb-5`}>
              {delivery_Cancellation?.URGENCY_BLK1_TITLE || "Urgency Level"}
            </h2>
            <p className="mb-2 md:text-[20px] font-normal text-[16px] ">
              {delivery_Cancellation?.URGENCY_BLK1_DESC ||
                "The urgency level is applied after calculating the base rate and adjusted distance cost. Each urgency level corresponds to a specific multiplier that increases the price depending on how fast the delivery must be fulfilled."}
            </p>
          </div>
          <div className="md:w-4/12 w-full">
            <Image
              width={1000}
              height={1000}
              src="/svg/urg01.svg"
              alt={"urg01"}
              className="object-contain w-full lg:h-[320px] md:h-[280px] h-[250px]"
            />
          </div>
        </div>
      </Cardblue>
      {/* block 2 */}

      {/* multiplier section */}
      <section className="md:mb-20 mb-10">
        {/* title */}
        <div className="relative inline-block md:mb-10 mb-4">
          <h3 className="font-semibold text-[30px] md:text-[45px] lg:text-[64px] text-[#004080]">
            {delivery_Cancellation?.URGENCY_BLK2_TITLE || "Urgency Level Multiplier"}
          </h3>
        </div>

        <div className="flex justify-center overflow-visible">
          <div className="flex overflow-auto scroll-container mx-auto lg:gap-12 gap-7">
            {UrgeryMultiplier().map((item: any, index: number) => {
              return (
                <>
                  <Cardblue
                    key={index}
                    altStyle="w-[320px] md:min-w-[250px] min-w-[230px] rounded-xl overflow-hidden"
                  >
                    <div className="flex items-center min-h-[80px] bg-[#004080]">
                      <b className="block font-semibold text-[#fff] w-full text-center leading-tight  md:text-[24px] text-[20px] p-3">
                        {item.title}
                      </b>
                    </div>
                    <div className="w-full flex flex-col items-center md:p-8 p-4 ">
                      <div className="border border-[#004080] rounded-xl w-3/4 aspect-square p-6 mb-3">
                        <Image
                          width={100}
                          height={100}
                          src={item.img}
                          alt={item.img}
                          className="object-contain size-full aspect-square"
                        />
                      </div>
                      <p className="font-bold text-[#37474F] md:mb-6 mb-3 md:text-[24px] text-[20px]">
                        x {item.range}
                      </p>
                      <p className="font-semibold text-[#004080] text-center md:text-[24px] text-[20px]">
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
