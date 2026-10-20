"use client";

import Cardblue from "@/app/component/cardblue";
import { SubTitle } from "@/app/component/subTtlFont";
import Image from "next/image";

export default function OfferAPrice(props: { data: any; fonts?: any }) {
  const { data, fonts } = props;
  return (
    <div className="inline-block xl:w-[75%]">
      <Cardblue altStyle="p-4" curved={true}>
        <p className={`${fonts.pFont} text-black mb-5`}>{data?.P}</p>
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
        {/* TIPS */}
        <SubTitle
          title={data?.TIPS?.TITLE}
          img="/svg/icon/notes.svg"
          subTtlFont={fonts.pFont + " text-[#004080] font-semibold"}
        />
        <p className={fonts.pFont + " -mt-2 mb-5"}>{data?.TIPS?.DESC}</p>
        {/* mail */}
        <p className={` ` + fonts.pFont}>
          <Image
            height={22}
            width={22}
            src={"/svg/icon/mailbox.svg"}
            alt={"mailbox.svg"}
            className={`object-contain inline mr-1 h-[22px] w-[22px]`}
          />
          {data?.MAIL?.DESC}
          <a
            href={`mailto:${data?.MAIL?.URL}`}
            className="text-[#407BFF] hover:underline"
          >
            {data?.MAIL?.URL}
          </a>
        </p>
      </Cardblue>
    </div>
  );
}
