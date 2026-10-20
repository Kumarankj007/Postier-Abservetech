"use client";

import Cardblue from "@/app/component/cardblue";
import { SubTitle } from "@/app/component/subTtlFont";
import Image from "next/image";

export default function PriceEstimate(props: { data: any; fonts?: any }) {
  const { data, fonts } = props;
  return (
    <div className="inline-block xl:w-[65%]">
      <Cardblue altStyle={"p-5 py-7"} curved={true}>
        <SubTitle title={data?.NOTE?.TITLE} img="/svg/icon/outline_message.svg" size="25" subTtlFont={fonts?.liTitle}/>
        <p className={fonts.pFont+ " lg:my-8 my-6"}>{data?.NOTE?.DESC}</p>
        <b className={fonts.pBold}>{data?.NOTE?.USES}</b>
      </Cardblue>
    </div>
  );
}
