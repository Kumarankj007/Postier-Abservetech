"use client";

import Cardblue from "@/app/component/cardblue";
import { SubTitle } from "@/app/component/subTtlFont";
import Image from "next/image";

export default function ODR(props: { data: any; fonts?: any }) {
  const { data, fonts } = props;
  return (
    <div className="inline-block xl:w-[65%]">
      <Cardblue altStyle={"p-5 py-7"} curved={true}>
        <SubTitle title={data?.TITLE} subTtlFont={fonts?.liTitle} />
        <p className={fonts.pFont + " lg:my-8 my-6"}>
          {data?.POINTS?.length > 0 &&
            data?.POINTS?.map((item: any, ind: number) => (
              <>
                <span key={ind}>{item?.DATA}</span>
                {item?.LINK && item?.LINK != "" && (
                  <a
                    href={item?.LINK}
                    className="text-[#407BFF] hover:underline"
                  >
                    {item?.LINK}.
                  </a>
                )}
              </>
            ))}
        </p>
      </Cardblue>
    </div>
  );
}
