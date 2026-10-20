"use client";

import Cardblue from "@/app/component/cardblue";
import { SubTitle } from "@/app/component/subTtlFont";
import Image from "next/image";

export default function PublishATrip(props: { data: any; fonts?: any }) {
  const { data, fonts } = props;
  return (
    <div>
      <div className="inline-block xl:w-[75%]">
        <Cardblue altStyle="py-8 px-5 md:mb-12 mb-5" curved={true}>
          <p className={`${fonts.pFont} text-black mb-3`}>{data?.P}</p>
          {/* list */}
          <ul>
            {data?.LISTS.length > 0 &&
              data?.LISTS?.map((item: any, ind: number) => (
                <li key={ind} className="mb-4">
                  <SubTitle
                    title={item?.TITLE}
                    img="/svg/icon/li_icon.svg"
                    subTtlFont={fonts?.liTitle}
                  />
                  <ul className="-mt-2 list-disc ml-6">
                    {item.DATA.length > 0 &&
                      item.DATA?.map((items: any, i: number) => (
                        <li key={i}>
                          <p className={`${fonts.pFont} mb-2`}>{items}</p>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
          </ul>
          <SubTitle
            title={data?.SECURED}
            img="/svg/icon/lockHome.svg"
            subTtlFont={fonts.pFont}
          />
          <SubTitle
            title={data?.TIPS}
            img="/svg/icon/notes.svg"
            subTtlFont={fonts.pFont}
          />
        </Cardblue>
      </div>
      <h2 className={`${fonts.TitleFont} text-center md:mb-8 mb-4`}>
        {data?.TRIPSNO?.TITLE}
      </h2>
      <div className="flex flex-wrap justify-center sm:gap-5 gap-3">
        {data?.TRIPSNO?.DATA?.length > 0 &&
          data?.TRIPSNO?.DATA?.map((item: any, ind: number) => (
            <div
              key={ind}
              className="overflow-hidden border border-[#004080] rounded-lg sm:max-w-[150px] sm:w-full xs:w-[45%] xss:w-[80%] w-[100%]"
            >
              <b
                className={`block text-center ${fonts.bFont} bg-[#004080] p-2`}
              >
                {item?.NAME}
              </b>
              <div className="p-4 pb-6">
                <div className="border border-[#004080] rounded-xl w-[75%] mx-auto aspect-square p-2">
                  <Image
                    height={100}
                    width={100}
                    src={item?.IMG}
                    alt={item?.IMG}
                    className={`object-contain inline mr-1 h-full w-full`}
                  />
                </div>
                <p className={`${fonts?.numFont} text-center mt-3`}>
                  {item?.VALUE}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
