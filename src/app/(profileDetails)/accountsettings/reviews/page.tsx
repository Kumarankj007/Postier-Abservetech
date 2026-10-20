"use client";
import React, { useContext } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import ReceivedTab from "@/app/component/profileDetails/profileVerified/ReceivedTab";
import GivenTab from "@/app/component/profileDetails/profileVerified/GivenTab";
import PageContext from "@/app/providers/pagecontext";
import CustomBreadCrumb from "@/app/component/breadcrumbs";
import dynamic from "next/dynamic";
import Image from "next/image";
import useScreenDetector from "@/app/hooks/useresize";
import { usePathname } from "next/navigation";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import ContentTooptip from "@/app/component/contentTooptip";
import { NotificationPreferences } from "../content";

const CustomTabComponent = dynamic(() => import("@/app/component/tabComp"), {
  ssr: false,
});

const Page = () => {
  const { i18 } = useContext(PageContext);
  const pathname = usePathname();
  const Router = UseLoadingRouter();
  const screen = useScreenDetector();
  const rightSection = [
    {
      img: "/svg/icon/starvaccum.svg",
      head: i18?.NEW?.RIVIEWS_RATING || "Review & Rate Postiers",
      para:
        i18?.NEW?.RATINGS_CONTENT ||
        "Share your experience by rating postiers after each delivery. Help others choose the best with your honest feedback.",
    },
    {
      img: "/svg/icon/award.svg",
      head: i18?.NEW?.TRUST || "Ratings Improves Trust",
      para:
        i18?.NEW?.TRUST_RATING ||
        "Reliable ratings build a stronger community. Know who you&apos;re dealing with before you send or receive.",
    },
  ];

  const leftSection = [
    {
      head: i18?.NEW?.REVIEWS_YOU || "Reviews Given By You",
      path: pathname + "you",
    },
    {
      head: i18?.NEW?.REVIEWS_OTHERS || "Reviews Received From Others",
      path: pathname + "others",
    },
  ];

  const tabs = [
    {
      label: i18?.ACCOUNTSETTINGS?.RECEIVED || "Received",
      content: <ReceivedTab />,
    },
    { label: i18?.ACCOUNTSETTINGS?.GIVEN || "Given", content: <GivenTab /> },
  ];
  return (
    <div className="p-6  m-[20px] md:m-[40px] lg:m-[70px] ">
      <div className="mb-[30px]">
        <CustomBreadCrumb
          pathSegments={i18?.NEW?.RATINGS || "Review & Ratings"}
        />
      </div>
      <div className="flex items-center  mb-8">
        <p className="text-[34px] font-[700] leading-[44px]">
          Reviews & Rating
        </p>
        <ContentTooptip value={NotificationPreferences()} />
      </div>
      <div className="flex justify-between">
        <div className=" w-full md:w-1/2">
          <div className="flex flex-col gap-6">
            {leftSection.map((items: any, index: any) => {
              return (
                <div
                  key={index}
                  onClick={() => Router.push(items?.path)}
                  className="border border-1 border-btncolor px-4 py-10 cursor-pointer"
                >
                  {items.head}
                </div>
              );
            })}
          </div>
        </div>
        {screen === "desktop" && (
          <div className="w-1/2 flex  justify-center">
            <div className="flex flex-col gap-6">
              {rightSection.map((items, index) => (
                <div
                  key={index}
                  className="border border-1 border-btncolor flex flex-col gap-6 p-5 rounded-[31px] w-full md:w-[350px]"
                >
                  <Image
                    width={800}
                    height={800}
                    src={items.img}
                    alt="svg"
                    className="w-[50px] h-[50px]"
                  />
                  <p className="text-[17px] font-[700] leading-[22px]">
                    {items.head}
                  </p>
                  <p className="text-[17px] font-[400] leading-[22px]">
                    {items.para}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
