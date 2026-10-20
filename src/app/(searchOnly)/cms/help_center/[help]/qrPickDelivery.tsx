"use client";

import Cardblue from "@/app/component/cardblue";
import { SubTitle } from "@/app/component/subTtlFont";
import Image from "next/image";

export default function QrPickDelivery(props: { data: any; fonts?: any }) {
  const { data, fonts } = props;
  return (
    <div className="inline-block xl:w-[65%]">
      <Cardblue altStyle={"p-5 py-7"} curved={true}>
        {/* Steps */}
        {data?.STEPS?.length > 0 &&
          data?.STEPS?.map((items: any, ind: number) => (
            <section key={ind} className="mb-7">
              <b className={fonts.pBold + " mb-3 block"}>{items?.TITLE}</b>
              <ul>
                {items?.LISTS?.length > 0 &&
                  items?.LISTS?.map((item: any, i: number) => (
                    <li key={i}>
                      <p className={fonts.pFont}>
                        <Image
                          height={22}
                          width={22}
                          src={"/svg/icon/li_icon.svg"}
                          alt={"/svg/icon/li_icon.svg"}
                          className={`object-contain inline lg:mr-3 mr-2 h-[22px] w-[22px]`}
                        />
                        {item?.IMG && item?.IMG != "" && (
                          <Image
                            height={22}
                            width={22}
                            src={item?.IMG}
                            alt={item?.IMG}
                            className={`object-contain inline mr-1 h-[20px] w-[20px]`}
                          />
                        )}
                        {item?.DESC}
                      </p>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        {/* Get paid */}
        <SubTitle
          title={data?.GET_PAID}
          subTtlFont={fonts.pFont}
          img="/svg/icon/rocket.svg"
          size="26"
        />
        {/* uses  */}
        <div className="flex items-center flex-wrap">
          {data?.USES?.length > 0 &&
            data?.USES?.map((item: any, ind: number) => (
              <div key={ind} className="flex items-center">
                <SubTitle
                  title={item?.USE}
                  img={item?.IMG}
                  size="25"
                  subTtlFont={fonts.pFont}
                />
                {data?.USES?.length - 1 !== ind && (
                  <div className="w-[1.6px] h-[17px] bg-black mb-4 mx-2"></div>
                )}
              </div>
            ))}
        </div>
      </Cardblue>
    </div>
  );
}
