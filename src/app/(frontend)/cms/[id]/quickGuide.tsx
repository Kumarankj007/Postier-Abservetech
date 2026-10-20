"use client";
import { useContext, useState } from "react";
import CmsHeader from "../../../component/cmsHeader";
import ParcelSwiper from "@/app/component/swiper";
import HelpCarousel from "./swiper";
import Image from "next/image";
import Link from "next/link";
import PageContext from "@/app/providers/pagecontext";


export default function Quickguide() {
  const [tab, setTab] = useState(0);
  const { i18 } = useContext(PageContext);
  
  const quickGuide_content = {
    SEARCH: i18?.NEW?.SEARCH || "Search",
    CUSTOMER: i18?.NEW?.CUSTOMER || "Customer",
    POSTIER: i18?.NEW?.POSTIER || "Postier",
    getStarted: {
      title: i18?.NEW?.HELPHEADING || "Quick Guide to get started with us",
      data: [
        {
          name: i18?.HELP_CONTENT?.PUBLISH_A_TRIP_SUB_TITLE || "Publish a trip",
          img: "/svg/hlp_guide 1.svg",
          url: "/cms/help_center/publish_Your_Trip",
        },
        {
          name: i18?.HELP_CONTENT?.SENDING_PARCEL_SUB_TITLE || "Send a parcel",
          img: "/svg/hlp_guide 2.svg",
          url: "/cms/help_center/sending_parcel",
        },
        {
          name: i18?.HELP_CONTENT?.OFFER_A_PRICE_SUB_TITLE || "Counter offer a price",
          img: "/svg/hlp_guide 3.svg",
          url: "/cms/help_center/offer_a_price",
        },
        {
          name: i18?.HELP_CONTENT?.TRACKING_PARCEL_SUB_TITLE || "Tracking parcels",
          img: "/svg/hlp_guide 4.svg",
          url: "/cms/help_center/tracking_parcel",
        },
      ],
    },
    article: {
      title: i18?.NEW?.TOPARTICLE || "Top Articles",
      data: [
        {
          name: i18?.HELP_CONTENT?.WHY_STRIPE_SUB_TITLE || "Why We Use Stripe",
          img: "/svg/hlp_art 1.svg",
          url: "/cms/help_center/why_stripe",
        },
        {
          name: i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_SUB_TITLE || "Recommended Photo Upload Checklist for  Sending Parcels",
          img: "/svg/hlp_art 2.svg",
          url: "/cms/help_center/recommended_photo",
        },
        {
          name: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_SUB_TITLE || "Postier QR Code Pickup & Delivery Flow",
          img: "/svg/hlp_art 3.svg",
          url: "/cms/help_center/qr_pick_delivery",
        },
        {
          name: i18?.HELP_CONTENT?.PRICE_ESTIMATE_SUB_TITLE || "Postier Price Estimator Widget",
          img: "/svg/hlp_art 4.svg",
          url: "/cms/help_center/price_estimate",
        },
        {
          name: i18?.HELP_CONTENT?.ODR_SUB_TITLE || "Online Dispute Resolution (ODR)",
          img: "/svg/hlp_art 5.svg",
          url: "/cms/help_center/odr",
        },
        {
          name: i18?.HELP_CONTENT?.PHOTO_TIPS_SUB_TITLE || "Photo Tips",
          img: "/svg/hlp_art 6.svg",
          url: "/cms/help_center/photo_tips",
        },
      ],
    },
  };
  // fonts:
  const tabFont = "text-[#222] sm:text-[17px] text-[15px] p-2";
  const tabDynamic = `font-bold border-b-2 border-[#004080]`;
  const hFont = "text-[#222] font-bold md:text-[34px] text-[26px]";
  const descFont = "text-[#222] font-normal sm:text-[20px] text-[18px]";
  const hoverEffect =
    " hover:shadow-2xl hover:ring-4 hover:border-transparent duration-300 group ";

  return (
    <div>
      <CmsHeader title={i18?.NEW?.HELP_CENTER || "Help Center"} search={quickGuide_content.SEARCH} />
      <div className="max-w-[1440px] w-full mx-auto p-5">
        <div className="w-full border-[#004080] border-b flex mb-10 ">
          <p
            className={`${tabFont} ${
              tab == 0 ? tabDynamic : ""
            } cursor-pointer mr-3`}
            onClick={() => setTab(0)}
          >
            {quickGuide_content.CUSTOMER}
          </p>
          <p
            className={`${tabFont} ${
              tab == 1 ? tabDynamic : ""
            } cursor-pointer`}
            onClick={() => setTab(1)}
          >
            {quickGuide_content.POSTIER}
          </p>
        </div>
        {tab == 0 ? (
          <div className="md:my-10 my-5 w-full">
            <div className="md:mb-20 mb-10">
              <h2 className={`${hFont} sm:mb-10 mb-4`}>
                {quickGuide_content.getStarted.title}
              </h2>
              <HelpCarousel
                data={quickGuide_content.getStarted.data}
                font={descFont}
              />
            </div>
            <div>
              <h2 className={`${hFont} sm:mb-10 mb-4`}>
                {quickGuide_content.article.title}
              </h2>
              <div className="flex flex-wrap justify-between md:gap-y-10 gap-y-5 xl:px-20 lg:px-10">
                {quickGuide_content.article.data.length > 0 &&
                  quickGuide_content.article.data.map(
                    (item: any, i: number) => (
                      <Link
                        href={item.url}
                        key={i}
                        className={
                          hoverEffect +
                          "xl:w-[28%] lg:w-[30%] md:w-[32%] sm:w-[49%] w-full border-[1.8px] border-[#004080] overflow-hidden rounded-3xl p-4  "
                        }
                      >
                        <Image
                          height={300}
                          width={300}
                          alt="img"
                          src={item.img}
                          className="object-contain md:h-[250px] md:w-[270px] h-[180px] w-[200px] mb-2 mx-auto group-hover:scale-110 duration-300"
                        />
                        <p
                          className={
                            descFont +
                            ` text-center group-hover:text-[#004080] `
                          }
                        >
                          {item.name}
                        </p>
                      </Link>
                    )
                  )}
              </div>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
