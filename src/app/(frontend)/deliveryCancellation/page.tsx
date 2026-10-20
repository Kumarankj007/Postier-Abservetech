"use client";
import { useContext, useState } from "react";
import Header from "../../component/cmsHeader";
import { Lists } from "../../../../content";
import GlobalToggle from "@/app/component/globaltoggle";
import Parcel from "./parcel";
import Distance from "./distance";
import Urgery from "./urgery";
import Delivery from "./delivery";
import Price from "./price";
import PageContext from "@/app/providers/pagecontext";

export default function Cancellation() {
  const [list, setList] = useState([...Lists()]);
  const [tab, setTab] = useState(0);
  const { i18 } = useContext(PageContext);
  const handleToggle = (index: number) => {
    setTab(index);
  };
  const delivery_Cancellation = i18?.DELIVERY_CANCELLATION;
  const titleStyle =
    "font-bold text-[21px] sm:text-[30px] lg:text-[45px] xl:text-[55px] text-[#004080]";
  return (
    <>
      <Header
        title={delivery_Cancellation?.TITLE || "How We Calculate Delivery Prices on Postier"}
        subtitle={delivery_Cancellation?.TITLE || "How We Calculate Delivery Prices on Postier"}
      />
      <div className="max-w-[1440px] w-full mx-auto">
        <section className="md:mt-[30px] mt-[10px] font-semibold p-4 lg:px-10 px-3 w-full">
          <h2 className="text-[16px] px-2 md:px-3 sm:text-[25px]	md:text-[36px] my-5 text-[#004080]">
            {delivery_Cancellation?.SUB_TITLE || "Postier uses a smart, fair pricing formula that combines:"}
          </h2>
          <GlobalToggle
            data={list}
            fnc={handleToggle}
            delivery={true}
            activeIndex={tab}
          />
          <div className="px-2 md:px-3 md:mt-20 mt-10">
            {tab == 0 ? (
              <Parcel titleStyle={titleStyle} />
            ) : tab == 1 ? (
              <Distance titleStyle={titleStyle} />
            ) : tab == 2 ? (
              <Urgery titleStyle={titleStyle} />
            ) : tab == 3 ? (
              <Delivery titleStyle={titleStyle} />
            ) : tab == 4 ? (
              <Price titleStyle={titleStyle} />
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}
