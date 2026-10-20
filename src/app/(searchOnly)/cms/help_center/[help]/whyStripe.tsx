"use client";

import Cardblue from "@/app/component/cardblue";
import { SubTitle } from "@/app/component/subTtlFont";
import Image from "next/image";

export default function WhyStripe(props: { data: any; fonts?: any }) {
  const { data, fonts } = props;
  return (
    <div className="inline-block xl:w-[65%]">
      <Cardblue altStyle={"p-5"} curved={true}>
        <ul className="list-disc ml-6">
          {data?.LISTS?.length > 0 &&
            data?.LISTS?.map((item: any, i: number) => (
              <li key={i}>
                <p className={`${fonts.pFont} text-black mb-2`}>{item.DATA}</p>
              </li>
            ))}
          <li>
            <p className={"mt-2 " + fonts.pFont}>
              {data?.ANY_QUES?.DATA}
              <a
                href={"mailto:" + data?.ANY_QUES?.URL}
                className="text-[#407BFF] hover:underline mx-2"
              >
                {data?.ANY_QUES?.URL}.
              </a>
            </p>
            <p className={"mt-2 " + fonts.pFont}>{data?.ANY_QUES?.LETS_US}</p>
          </li>
        </ul>
      </Cardblue>
    </div>
  );
}
