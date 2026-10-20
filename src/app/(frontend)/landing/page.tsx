/* app/(landing)/landingpage.tsx */
"use client";

import React, { useContext, useRef, useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import PageContext from "@/app/providers/pagecontext";

import SearchBar from "@/app/component/searchbar"; // assumes internal a11y handled
import ToggleButton from "@/app/component/togglebtn"; // idem
import GlobalToggle from "@/app/component/globaltoggle";
import Section2 from "./section2";
import Section3 from "./section3";
import Section4 from "./section4";
import Section5 from "./section5";

export default function LandingPage() {
  const { i18 } = useContext(PageContext);

  const section3Ref = useRef<HTMLDivElement>(null);
  const [selectedTab, setSelectedTab] = useState<number | null>(null);

  const scrollToSection3 = (tabIndex: number) => {
    setSelectedTab(tabIndex);
    setTimeout(() => {
      section3Ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  /* Banner cards */
  const bannersec = [
    {
      image: "/svg/icon/security.svg",
      content: i18?.NEW?.SECURITY || "Security First",
      tabIndex: 0,
    },
    {
      image: "/svg/icon/smart.svg",
      content: i18?.NEW?.SMART || "Smart & Efficient Delivery",
      tabIndex: 1,
    },
    {
      image: "/svg/icon/location.svg",
      content: i18?.NEW?.TRACK || "Smart Tracking",
      tabIndex: 2,
    },
    {
      image: "/svg/icon/costs.svg",
      content: i18?.NEW?.SAVING || "Lower Costs, Higher Savings",
      tabIndex: 3,
    },
    // {
    //   image: "/svg/icon/faster.svg",
    //   content: i18?.NEW?.DELIVERY || "Faster Delivery",
    //   tabIndex: 4,
    // },
    // {
    //   image: "/svg/icon/eco.svg",
    //   content: i18?.NEW?.ECO || "Eco-Friendly Shipping",
    //   tabIndex: 5,
    // },
  ];

  return (
    <>
      <header className="md:h-screen py-20 bg-black flex items-center bg-center background-image-landing">
        <div className="w-full relative flex flex-col items-center md:gap-10 gap-14 px-4">
          <h1 className="text-white font-bold text-center text-xl sm:text-3xl md:text-5xl max-w-[700px] leading-[30px] sm:leading-[45px] md:leading-[65px]">
            {i18?.HOMEPAGE?.HEADER?.HEADING ??
              "Send, Deliver a Parcel From Anywhere to Anyplace"}
          </h1>
          <ToggleButton />
          <SearchBar />
        </div>
      </header>

      <main>
        <nav
          aria-labelledby="banner-section-heading"
          className="bg-btncolor py-10 px-5"
        >
          <h2 id="banner-section-heading" className="sr-only text-white">
            Quick links to feature sections
          </h2>

          <ul className="max-w-[1340px] mx-auto grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-8">
            {bannersec.map((data, index) => (
              <li key={index} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => scrollToSection3(data.tabIndex)}
                  className="rounded-full bg-white w-[100px] h-[100px] flex items-center justify-center"
                  aria-label={`Scroll to feature: ${data.content}`}
                  aria-controls="section3"
                >
                  <Image
                    src={data.image}
                    width={30}
                    height={30}
                    alt=""
                    aria-hidden="true"
                    className="object-contain w-auto h-auto"
                  />
                </button>
                <span className="text-white text-[18px] mt-4 text-center">
                  {data.content}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <Section2 />

        <div ref={section3Ref} id="section3">
          <Section3 selectedTab={selectedTab} />
        </div>

        <Section4 />
        <Section5 />
      </main>
    </>
  );
}
