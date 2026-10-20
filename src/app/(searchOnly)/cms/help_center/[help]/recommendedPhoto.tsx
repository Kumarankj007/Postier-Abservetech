"use client";

import Cardblue from "@/app/component/cardblue";
import { SubTitle } from "@/app/component/subTtlFont";
import Image from "next/image";

export default function RecommendedPhoto(props: { data: any; fonts?: any }) {
  const { data, fonts } = props;
  return (
    <div className="inline-block xl:w-[65%]">
      <Cardblue altStyle={"p-5 py-7"} curved={true}>
        <p className={`${fonts.pFont} text-black mb-2`}>{data.P}</p>
        <SubTitle
          title={data?.PARCEL}
          img="/svg/icon/package2.svg"
          subTtlFont={fonts.pFont }
        />

        {/* list */}
        <ul>
          {data?.LISTS.length > 0 &&
            data?.LISTS?.map((item: any, ind: number) => (
              <li key={ind} className="mb-4">
                <SubTitle
                  title={item?.TITLE}
                  img="/svg/icon/bluetick.svg"
                  subTtlFont={fonts?.liTitle}
                />
                <ul className="-mt-2">
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
      </Cardblue>
    </div>
  );
}
