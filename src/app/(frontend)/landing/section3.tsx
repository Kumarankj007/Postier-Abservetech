"use client";

import GlobalToggle from "@/app/component/globaltoggle";
import PageContext from "@/app/providers/pagecontext";
import { Box } from "@mui/material";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

export default function Section3({
  selectedTab,
}: {
  selectedTab: number | null;
}) {
  const [value, setValue] = useState(0);
  const { i18 } = useContext(PageContext);

  const tabData = [
    {
      title: i18?.NEW?.SECURITY || "Security First",
      img: '/svg/security01.svg',
      description:
        i18?.NEW?.TRANSPARENT ||
        "Every Postier (traveler) is verified, rated, and reviewed, ensuring your parcel is handled with trust and reliability. You have full control over choosing a trusted traveler based on their reviews and experience.",
    },
    {
      title: i18?.NEW?.SMART || "Smart & Efficient Delivery",
      img: '/svg/security02.svg',
      description:
        i18?.NEW?.ENVIRONMENT ||
        "By utilizing travelers who are already heading to your parcel’s destination, Postier ensures swift and timely deliveries, bypassing the delays of traditional logistics networks. Our advanced algorithm finds the best Postier to transport your parcel along the most direct and optimized route. No unnecessary detours, no delays – just Smart, Efficient and Eco-Friendly Deliveries.",
    },
    {
      title: i18?.NEW?.TRACK || "Smart Tracking",
      img: '/svg/security03.svg',
      description:
        i18?.NEW?.QUICK ||
        "Stay updated every step of the way with real-time tracking. Our intelligent system allows you to monitor your parcel’s journey, giving you peace of mind and full transparency until it reaches its destination.",
    },
    {
      title: i18?.NEW?.SAVING || "Lower Costs, Higher Savings",
      img: '/svg/security04.svg',
      description:
        i18?.NEW?.SAVING_DESC ||
        "Unlike traditional shipping, which relies on costly logistics networks, Postier connects you with existing travelers, reducing operational costs and saving you up to 70% compared to standard courier services.",
    },
    // {
    //   title: i18?.NEW?.DELIVERY || "Faster Delivery",
    //   description:
    //     i18?.NEW?.DELIVERY_DESC ||
    //     "Postier ensures swift and timely deliveries, bypassing delays...",
    // },
    // {
    //   title: i18?.NEW?.ECO || "Eco-Friendly Shipping",
    //   description:
    //     i18?.NEW?.ECO_DESC ||
    //     "Postier minimizes environmental impact by leveraging existing travel routes...",
    // },
  ];

  useEffect(() => {
    if (
      selectedTab !== null &&
      selectedTab >= 0 &&
      selectedTab < tabData.length
    ) {
      setValue(selectedTab);
    }
  }, [selectedTab,tabData.length]);

  const handleToggle = (index: number) => {
    setValue(index);
    // console.log(selectedTab, 'selectedTab')
  };

  return (
    <section
      className="fourthsec mt-[30px] p-4"
      aria-labelledby="about-us-heading"
      id="about-us"
    >
      <h2
        id="about-us-heading"
        className="text-center text-[40px] sm:text-[30px] md:text-[40px] font-bold"
      >
        {i18?.POSTIER?.ABOUTUS || "About Us"}
      </h2>

      <p className="text-[17px] text-center mt-[15px] leading-[31px] max-w-4xl mx-auto">
        {i18?.NEW?.INTERMEDIARYPLATFORM ||
          "An intermediary platform for the dispatch of letters, documents and parcels..."}
        <br />
        {i18?.NEW?.WITHINCOUNTRYANDABROAD ||
          "Within their country and abroad can contact through Postier..."}
        <br />
        {i18?.NEW?.TRANSPORTATIONFEE ||
          "Items on their journey for a transportation fee."}
      </p>

      <div className="relative m-auto mt-[50px] xs:mx-0 md:mx-[40px]">
        <Box className="m-auto">
          <GlobalToggle
            data={tabData.map((item) => item.title)}
            fnc={handleToggle}
            shadow={true}
            activeIndex={value}
          />

          <Box className="my-5">
            <div className="flex flex-col md:flex-row justify-between lg:justify-center md:gap-[80px] gap-5 items-center">
              <Image
                width={500}
                height={500}
                src={tabData[value].img}
                alt=""
                aria-hidden="true"
                className="w-[300px] h-[300px]"
              />

              <div className="px-4 text-left">
                <h3 className="text-[30px] font-bold mb-4 leading-[44px] text-center md:text-left">
                  {tabData[value].title}
                </h3>
                <p className="leading-[30px] text-[17px] max-w-[650px]">
                  {tabData[value].description}
                </p>
              </div>
            </div>
          </Box>
        </Box>
      </div>
    </section>
  );
}
