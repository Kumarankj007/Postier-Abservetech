"use client";

import Cardblue from "@/app/component/cardblue";
import { SubTitle } from "@/app/component/subTtlFont";
import Image from "next/image";

export default function PhotoTips(props: { data: any; fonts?: any }) {
  const { data, fonts } = props;
  return (
    <div className="inline-block xl:w-[60%]">
      <Cardblue altStyle={"p-5 py-7"} curved={true}>
        <SubTitle title={data?.TITLE} subTtlFont={fonts?.liTitle} />
        <ul className="list-disc ml-6">
          {data?.LISTS?.length > 0 &&
            data?.LISTS?.map((item: any, i: number) => (
              <li key={i}>
                <p className={`${fonts.pFont} text-black mb-2`}>{item}</p>
              </li>
            ))}
        </ul>
        <SubTitle
          title={data?.SECURED}
          img="/svg/icon/lockHome.svg"
          subTtlFont={fonts.pFont}
        />
        {/* Tips */}
        <p className={`mb-4 ` + fonts.pFont}>
          <Image
            height={22}
            width={22}
            src="/svg/icon/notes.svg"
            alt={"notes.svg"}
            className={`object-contain inline mr-1 h-[22px] w-[22px]`}
          />
          <span className={fonts?.pBold + " mr-2"}>{data?.TIPS?.TITLE}</span>
          {data?.TIPS?.DESC}
        </p>
      </Cardblue>
    </div>
  );
}
