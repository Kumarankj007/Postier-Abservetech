"use client";

import Cardblue from "@/app/component/cardblue";
import { SubTitle } from "@/app/component/subTtlFont";
import Image from "next/image";

export default function TrackingParcel(props: { data: any; fonts?: any }) {
  const { data, fonts } = props;
  return (
    <div className="inline-block xl:w-[60%]">
      <Cardblue altStyle="p-4" curved={true}>
        <p className={`${fonts.pFont} text-black mb-3`}>{data?.P}</p>
        {/* list */}
        <ul className="list-disc marker:text-[#004080] ml-6 my-5">
          {data?.LISTS.length > 0 &&
            data?.LISTS?.map((item: any, ind: number) => (
              <li key={ind} className="mb-3">
                {item?.TITLE && item?.TITLE.length > 0 ? (
                  <SubTitle
                    title={item?.TITLE}
                    img={item?.ICON}
                    subTtlFont={fonts?.liTitle}
                  />
                ) : (
                  <p className={" " + fonts.pFont}>{item?.DESC}</p>
                )}
              </li>
            ))}
        </ul>
        {/* QR Scan */}
        <div>
          <SubTitle
            title={data?.QR_SCAN?.TITLE}
            img="/svg/icon/qr_code.svg"
            subTtlFont={fonts?.liTitle}
          />
          <ul className="-mt-2 list-disc ml-6">
            {data?.QR_SCAN?.DATA.length > 0 &&
              data?.QR_SCAN?.DATA?.map((item: any, i: number) => (
                <li key={i}>
                  <p className={`${fonts.pFont} text-black mb-3`}>{item}</p>
                </li>
              ))}
          </ul>
        </div>
        {/* QR Scan */}
        <div>
          <SubTitle
            title={data?.SECURED?.TITLE}
            img="/svg/icon/gendrel.svg"
            subTtlFont={fonts?.liTitle}
          />
          <ul className="-mt-2 list-disc ml-6">
            {data?.SECURED?.DATA.length > 0 &&
              data?.SECURED?.DATA?.map((item: any, i: number) => (
                <li key={i}>
                  <p className={`${fonts.pFont} text-black mb-3`}>{item}</p>
                </li>
              ))}
          </ul>
        </div>
        {/* Tips */}
        <p className={`mb-4 ` + fonts.pFont}>
          <Image
            height={22}
            width={22}
            src="/svg/icon/notes.svg"
            alt={"notes.svg"}
            className={`object-contain inline mr-1 h-[22px] w-[22px]`}
          />
          <span className={fonts?.liTitle}>{data?.TIPS?.TITLE}</span>
          {data?.TIPS?.DESC}
        </p>

        {/* mail */}
        <p className={`mb-4 ` + fonts.pFont}>
          <Image
            height={22}
            width={22}
            src={"/svg/icon/mailbox.svg"}
            alt={"mailbox.svg"}
            className={`object-contain inline mr-1 h-[22px] w-[22px]`}
          />
          {data?.MAIL?.DESC}{" "}
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
