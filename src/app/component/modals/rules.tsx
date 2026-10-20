import React, { useContext } from "react";
import DateTimePickers from "@/app/(create)/components/datetimepicker";
import Button from "../button";
import Store from "@/app/store/store";
import Image from "next/image";
import PageContext from "@/app/providers/pagecontext";
import { SubTitle } from "../subTtlFont";

// fonts:
const fonts = {
  subTitleFont: "font-bold md:text-[32px] text-[28px] text-[#004080]",
  pFont: "md:text-[17px] text-[15px] font-normal",
  pBold: "md:text-[17px] text-[16px] font-semibold",
  liTitle: "font-semibold sm:text-[17px] text-[16px] text-[#004080]",
  TitleFont: "font-semibold md:text-[30px] text-[26px] text-[#004080]",
  bFont: "font-bold text-[12px] text-white",
  numFont: "font-bold md:text-[22px] text-[19px] text-[#004080]",
};

export default function Schedule() {
  const { i18 } = useContext(PageContext);
  const { setModal, modal } = Store();
  const NEW = i18?.NEW;
  const defaultTitle = NEW?.CODE_OF_CONDUCT_RULES || "Code Of Conduct Rules";
  const fragileTitle =
    NEW?.FRAGILE_PACKING_RULE || "Fragile Parcels Must Be Packed Safe";
  const packageTitle =
    NEW?.DO_NOT_OPEN_PACKAGE_RULE || "Don’t Open The Package";
  const handleTitle = NEW?.HANDLE_WITH_CARE_RULE || "Handle With Care";
  const customerTitle =
    NEW?.CUSTOMER_RESPECT_RULE || "Be Respectful With Customers";
  const contactTitle =
    NEW?.CONTACT_SUPPORT_RULE || "Contact Support If Any Queries";
  const travelTitle = NEW?.TRAVEL_SAFELY_RULE || "Travel Safely";
  const declineTitle =
    NEW?.DECLINE_A_SAFELY_RULE || "Declining a Delivery Request";
  const reviewTitle =
    NEW?.REVIEW_SAFELY_RULE || "Review Before Accepting a Delivery Request";
  const inspectTitle =
    NEW?.INSPECT_SAFELY_RULE || "Inspect Your Parcel on Delivery";
  const reviewOfferTitle =
    NEW?.REVIEW_OFFER_SAFELY_RULE || "Review Before Accepting an Offer";
  const handleFragileTitle =
    NEW?.HANDLE_FRAGILE_SAFELY_RULE ||
    "Handling Fragile Parcels – Safety First";
  const decliningDeliveryTitle =
    NEW?.DECLINING_DELIVERY_SAFELY_RULE ||
    "Declining a Delivery Offer from a Postier";

  // content variable:
  const fragileContent = NEW?.FRAGILE_PACKING_RULE_CONTENT;
  const packageContent = NEW?.DO_NOT_OPEN_PACKAGE_CONTENT;
  const handleContent = NEW?.HANDLE_WITH_CARE_CONTENT;
  const customerContent = NEW?.CUSTOMER_RESPECT_CONTENT;
  const contactContent = NEW?.CONTACT_SUPPORT_CONTENT;
  const travelContent = NEW?.TRAVEL_SAFELY_CONTENT;
  const declineContent = NEW?.DECLINE_A_SAFELY_CONTENT;
  const reviewContent = NEW?.REVIEW_SAFELY_CONTENT;
  const inspectContent = NEW?.INSPECT_SAFELY_CONTENT;
  const reviewOfferContent = NEW?.REVIEW_OFFER_SAFELY_CONTENT;
  const handleFragileContent = NEW?.HANDLE_FRAGILE_SAFELY_CONTENT;
  const decliningDeliveryContent = NEW?.DECLINING_DELIVERY_SAFELY_CONTENT;

  const title = modal?.data?.head || defaultTitle;
  const data = [
    {
      img: "/svg/icon/box.svg",
      text: fragileTitle,
      content: {
        icon1: "/svg/icon/box.svg",
        content1:
          fragileContent?.CONTENT1 ||
          "If you're sending or transporting fragile items, proper packaging is essential to avoid damage during transit.",
        practice: {
          title: fragileContent?.PRACTICE_TITLE || "Best Practices:",
          icon: "/svg/icon/security.svg",
          list: [
            fragileContent?.PRACTICE_LIST1 ||
              "Wrap each item individually using bubble wrap, foam, or protective padding.",
            fragileContent?.PRACTICE_LIST2 ||
              "Use a sturdy box — double-wall cardboard boxes are ideal.",
            fragileContent?.PRACTICE_LIST3 ||
              "Fill empty spaces with cushioning materials like crumpled paper or packing peanuts to prevent movement.",
            fragileContent?.PRACTICE_LIST4 ||
              "Seal securely using strong tape on all edges and seams.",
            fragileContent?.PRACTICE_LIST5 ||
              "Clearly mark the parcel with a 'Fragile' label on multiple sides.",
          ],
        },
        proTip: {
          title: fragileContent?.PROTIP_TITLE || "Pro Tip:",
          icon: "/svg/icon/smart.svg",
          desc:
            fragileContent?.PROTIP_DESC ||
            "Add photos of the packaging before sealing — this helps with insurance and dispute resolution if issues arise.",
        },
        avoid: {
          icon: "/png/avoid.png",
          desc:
            fragileContent?.AVOID_DESC ||
            "Avoid packing glassware, electronics, or ceramic items loosely or with inadequate protection",
        },
      },
    },
    {
      img: "/png/box-open.png",
      text: packageTitle,
      content: {
        p1:
          packageContent?.DESC1 ||
          "For safety, trust, and legal reasons, parcels must never be opened during transportation.",
        p2:
          packageContent?.DESC2 ||
          "Opening a package without consent is a violation of Postier’s code of conduct and may lead to suspension or legal action.",
        p3:
          packageContent?.DESC3 ||
          "If a package seems suspicious or damaged, report it immediately to support — do not open it yourself.",
      },
    },
    {
      img: "/svg/icon/heart.svg",
      text: handleTitle,
      content: {
        subtitle:
          handleContent?.SUBTITLE || "Careful Handling Is Key to Safe Delivery",
        img: "/svg/icon/pick_truck.svg",
        intro:
          handleContent?.INTRO ||
          "As a Postier, you're trusted with packages that may include fragile, perishable, sensitive, or sentimental items. To ensure a smooth and professional delivery:",
        guidelines: [
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              handleContent?.GUIDELINES1 ||
              "Lift with both hands and avoid sudden movements.",
          },
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              handleContent?.GUIDELINES2 ||
              "Secure parcels properly in your vehicle or bag to prevent shifting during transport.",
          },
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              handleContent?.GUIDELINES3 ||
              "Do not place heavy parcels on top of lighter or fragile ones.",
          },
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              handleContent?.GUIDELINES4 ||
              "Avoid exposure to excessive heat, moisture, or vibrations.",
          },
          {
            icon: "/svg/icon/decline.svg",
            text:
              handleContent?.GUIDELINES5 ||
              "Never throw, drop, or squeeze parcels.",
          },
        ],
        reminder: {
          icon: "/svg/icon/security.svg",
          text:
            handleContent?.REMINDER ||
            "Reminder: Handling parcels with respect and care builds trust between you, the sender, and the receiver — and it ensures your continued success as a Postier.",
        },
      },
    },
    {
      img: "/svg/icon/user (1).svg",
      text: customerTitle,
      content: {
        subtitle: customerContent?.SUBTITLE || "Respect Builds Trust",
        img: "/svg/icon/commit.svg",
        intro:
          customerContent?.INTRO ||
          "Whether you're a sender, receiver, or Postier, treating each other with respect ensures a safe, supportive, and reliable community.",
        guidelines: [
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              customerContent?.GUIDELINES1 ||
              "Communicate clearly and politely.",
          },
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              customerContent?.GUIDELINES2 ||
              "Be patient and understanding with questions or delays.",
          },
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              customerContent?.GUIDELINES3 ||
              "Show appreciation for each other's time and effort.",
          },
          {
            text:
              customerContent?.GUIDELINES4 ||
              "❌ Avoid offensive language, aggressive behavior, or making assumptions.",
          },
        ],
        reminder: {
          icon: "/png/message-rnd.png",
          text:
            customerContent?.REMINDER ||
            "Remember: Behind every parcel is a person. A little kindness goes a long way in making every delivery a positive experience.",
        },
      },
    },
    {
      img: "/svg/icon/life-buoy.svg",
      text: contactTitle,
      content: {
        subtitle:
          contactContent?.SUBTITLE ||
          "Lost, confused, or facing an issue? We’ve got your back.",
        icon: "/png/compass-out.png",
        desc:
          contactContent?.DESC ||
          "Our Customer Support Team is available to assist you with:",
        sections: {
          list: [
            {
              icon: "/png/trip_issue.png",
              text: contactContent?.SECTION1 || "Parcel or trip issues",
            },
            {
              icon: "/svg/icon/security.svg",
              text: contactContent?.SECTION2 || "Verification or account help",
            },
            {
              icon: "/svg/icon/refund.svg",
              text: contactContent?.SECTION3 || "Payment or payout concerns",
            },
            {
              icon: "/png/bell-alert.png",
              text: contactContent?.SECTION4 || "Reporting suspicious activity",
            },
          ],
          title: contactContent?.SECTIONTITLE || "How to Reach Us",
          icon: "/png/phone.png",
          points: [
            {
              text:
                contactContent?.POINTS_1 ||
                "Go to “Help Center” in the app or website",
            },
            {
              text:
                contactContent?.POINTS_2 ||
                "Choose a topic or tap “Contact Support”",
            },
            {
              text:
                contactContent?.POINTS_3 ||
                "Use email (support@postier.org) – we’ll respond as quickly as possible",
            },
          ],
          icon2: "/svg/icon/wallClock.svg",
          title2:
            contactContent?.END ||
            "We’re here to help you every step of the way — before, during, and after your delivery.",
        },
      },
    },
    {
      img: "/svg/icon/sendicon.svg",
      text: travelTitle,
      content: {
        subtitle:
          travelContent?.SUBTITLE ||
          "Your safety comes first — every trip, every time.",
        img: "/svg/icon/pick_truck.svg",
        intro:
          travelContent?.INTRO ||
          "To ensure safe and secure parcel delivery, please follow these best practices:",
        guidelines: [
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              travelContent?.GUIDELINES1 ||
              "Plan your route ahead of time and check traffic or weather updates.",
          },
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              travelContent?.GUIDELINES2 ||
              "Take regular breaks to avoid fatigue on long journeys.",
          },
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              travelContent?.GUIDELINES3 ||
              "Secure parcels properly to avoid damage or distraction while driving.",
          },
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              travelContent?.GUIDELINES4 ||
              "Never rush deliveries — it's better to be safe and a few minutes late.",
          },
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              travelContent?.GUIDELINES5 ||
              "Avoid distractions: use hands-free mode if you must take a call.",
          },
          {
            icon: "/svg/icon/bluetick.svg",
            text:
              travelContent?.GUIDELINES6 ||
              "Share your trip with a trusted contact for extra peace of mind.",
          },
        ],
        reminder: {
          icon: "/png/bell-alert.png",
          text:
            travelContent?.REMINDER ||
            "If you ever feel unsafe or suspect suspicious activity, pause the delivery and contact Postier Support immediately.",
        },
      },
    },
    {
      img: "/png/decline.png",
      text: declineTitle,
      content: {
        subtitle:
          declineContent?.SUBTITLE ||
          "If you're unable to fulfill a delivery request, you can decline it with confidence.",
        intro: declineContent?.INTRO || "common reasons to decline:",
        guidelines: [
          {
            text:
              declineContent?.GUIDELINES1 || "Timing doesn’t fit your schedule",
          },
          {
            text:
              declineContent?.GUIDELINES2 ||
              "Parcel size or weight exceeds your preference",
          },
          {
            text:
              declineContent?.GUIDELINES3 ||
              "Concerns about the type of parcel",
          },
          {
            text:
              declineContent?.GUIDELINES4 ||
              "Route or location is out of your way",
          },
        ],
        reminder: {
          icon: "/svg/icon/smart.svg",
          text:
            declineContent?.REMINDER ||
            "You can add a short note to help the sender understand your decision. Being transparent helps maintain a respectful and trusted community.",
        },
      },
    },
    {
      img: "/svg/icon/commit.svg",
      text: reviewTitle,
      content: {
        subtitle:
          reviewContent?.SUBTITLE ||
          "Before you accept a delivery offer from a Postier, take a moment to carefully review the request to ensure everything matches your expectations.",
        introIcon: "/svg/icon/search.svg",
        intro: reviewContent?.INTRO || "Check these details:",
        guidelines: [
          {
            text: reviewContent?.GUIDELINE1 || "Delivery date and time",
            icon: "/svg/icon/package.svg",
          },
          {
            text: reviewContent?.GUIDELINE2 || "Proposed delivery fee",
            icon: "/svg/icon/costs.svg",
          },
          {
            text:
              reviewContent?.GUIDELINE3 ||
              "Postier’s vehicle type and capacity",
            icon: "/svg/icon/Directionscar.svg",
          },
          {
            text:
              reviewContent?.GUIDELINE4 || "Postier’s ratings and past reviews",
            icon: "/svg/icon/star.svg",
          },
          {
            text:
              reviewContent?.GUIDELINE5 ||
              "Route and estimated delivery duration",
            icon: "/png/route.png",
          },
        ],
        reminder: {
          icon: "/svg/icon/smart.svg",
          text:
            reviewContent?.REMINDER ||
            "Make sure your parcel is well-described and properly packaged before confirming. Clear communication leads to smoother deliveries!",
        },
      },
    },
    {
      img: "/png/box-search.png",
      text: inspectTitle,
      content: {
        desc: inspectContent?.DESC || "Before confirming the delivery:",
        list: [
          {
            item:
              inspectContent?.LIST1 ||
              "Check the parcel for any visible damage or signs of tampering.",
            icon: "/svg/icon/bluetick.svg",
          },
          {
            item:
              inspectContent?.LIST2 ||
              "Take photos if anything looks suspicious or differs from the expected condition.",
            icon: "/svg/icon/Camera.svg",
          },
          {
            item:
              inspectContent?.LIST3 ||
              "Verify the contents match what was expected (if applicable).",
            icon: "/svg/icon/edit_square.svg",
          },
        ],
        if_something_seems_off: {
          head:
            inspectContent?.SOMETHING_SEEMS_TITLE || "If something seems off:",
          desc:
            inspectContent?.SOMETHING_SEEMS_DESC ||
            "Contact Customer Support immediately through the Help Center for assistance with dispute resolution. We're here to help protect your delivery experience.",
          icon: "/png/phone.png",
        },
        tipIcon: "/svg/icon/smart.svg",
        tip:
          inspectContent?.TIPS ||
          "Tip: Confirming delivery closes the transaction, so it's best to inspect before accepting.",
      },
    },
    {
      img: "/png/handshake.png",
      text: reviewOfferTitle,
      content: {
        intro:
          reviewOfferContent?.INTRO ||
          "Before accepting a delivery request, carefully review all parcel details including:",
        guidelines: [
          {
            text:
              reviewOfferContent?.GUIDELINE1 || "Pickup and drop-off addresses",
          },
          {
            text:
              reviewOfferContent?.GUIDELINE2 ||
              "Parcel size, weight, and type (e.g., fragile or perishable)",
          },
          {
            text: reviewOfferContent?.GUIDELINE3 || "Scheduled dates and times",
          },
          {
            text:
              reviewOfferContent?.GUIDELINE4 ||
              "Sender’s profile and contact info",
          },
        ],
        reminder: {
          icon: "/svg/icon/bluetick.svg",
          text:
            reviewOfferContent?.REMINDER ||
            "Accept only if you're confident and available for the delivery",
        },
      },
    },
    {
      img: "/svg/icon/pick_truck.svg",
      text: handleFragileTitle,
      content: {
        descIcon: "/png/puzzle.png",
        desc: handleFragileContent?.DESC || "If a parcel is marked as fragile, please take the following precautions:",
        precautions: [
          handleFragileContent?.PRECAUTION1 || "Check for proper packaging before accepting it. If it's not safely packed, advise the sender to repack it.",
          handleFragileContent?.PRECAUTION2 || "Place fragile parcels on top of heavier items during transport to avoid pressure or damage.",
        ],
        suspicious_icon: "/png/bell-alert.png",
        suspicious_parcel_guidance:
          handleFragileContent?.SUSPICIOUS || "If a parcel appears suspicious or unsafe to transport, do not proceed — report it through the app and contact support immediately.",
        tipIcon: "/svg/icon/smart.svg",
        safety_note:
          handleFragileContent?.NOTE || "Your safety and the parcel’s condition matter equally. Take a moment to inspect, protect, and handle with care.",
      },
    },
    {
      img: "/png/decline.png",
      text: decliningDeliveryTitle,
      content: {
        subtitle:
          decliningDeliveryContent?.SUBTITLE || "If you’ve received an offer from a Postier that doesn’t meet your expectations, you can safely decline it.",
        intro: decliningDeliveryContent?.INTRO || "Here are a few reasons you might decline:",
        guidelines: [
          { text: decliningDeliveryContent?.GUIDELLINES1 || "The price is too high" },
          { text: decliningDeliveryContent?.GUIDELLINES2 || "The delivery time doesn’t match your needs" },
          {
            text: decliningDeliveryContent?.GUIDELLINES3 || "The Postier’s profile or rating doesn’t meet your trust level",
          },
          { text: decliningDeliveryContent?.GUIDELLINES4 || "You’re waiting for other offers" },
        ],
        reminder: {
          icon: "/svg/icon/smart.svg",
          text: decliningDeliveryContent?.REMINDER || "Tip: Add a short message when declining to help the Postier understand your decision — it supports respectful communication and improves future interactions.",
        },
      },
    },
  ];

  return (
    <div className="mt-5">
      {data?.some((itm) => itm?.text == title) && <hr className="mb-4" />}
      <div className="flex flex-col gap-6 justify-center">
        {defaultTitle == title && (
          <>
            <p className="mt-[20px]">
              At Postier, we believe that trust, respect, and cooperation are
              the foundation of every successful delivery — whether you&apos;re
              a sender, a traveler (Postier), or a receiver. Our platform
              connects people from different regions, cultures, and backgrounds,
              and it is essential that everyone engages in a safe, fair, and
              respectful way. This Code of Conduct outlines the behavior we
              expect from all members of our community. It exists to ensure a
              positive experience for everyone using Postier services and to
              protect the integrity of our platform. By using Postier, you agree
              to uphold these standards — whether you&apos;re interacting
              online, handling parcels, or meeting in person. Let’s work
              together to build a global logistics network based on mutual
              trust, transparency, and responsibility.
            </p>

            <div>
              <p className="text-[20px] font-[700] leading-[30px] py-[25px]">
                {i18?.NEW?.RULES || "Rules"}
              </p>
              <div className="border border-1 border-[rgba(0, 64, 128, 1)] " />
              {data.map((items: any, index: any) => {
                return (
                  <div
                    key={index}
                    onClick={() => {
                      setModal("Rules", {
                        head: items?.text,
                        img: items?.img,
                        onClose:
                          i18?.NEW?.CODE_OF_CONDUCT_RULES ||
                          "Code Of Conduct Rules",
                      });
                    }}
                  >
                    <div className="p-[30px] flex gap-3 cursor-pointer">
                      <Image
                        src={items?.img}
                        alt="img"
                        width={800}
                        height={800}
                        className="w-[25px] h-[25px]"
                      />
                      <p className="text-[17px] font-[400]">{items?.text}</p>
                    </div>
                    <div className="border border-1 border-[rgba(0, 64, 128, 1)] " />
                  </div>
                );
              })}
            </div>
          </>
        )}
        {fragileTitle == title && <SubModal1 content={data?.[0]?.content} />}
        {packageTitle == title && <SubModal2 content={data?.[1]?.content} />}
        {handleTitle == title && <SubModal3 content={data?.[2]?.content} />}
        {customerTitle == title && <SubModal3 content={data?.[3]?.content} />}
        {contactTitle == title && <SubModal5 content={data?.[4]?.content} />}
        {travelTitle == title && <SubModal3 content={data?.[5]?.content} />}
        {declineTitle == title && <SubModal3 content={data?.[6]?.content} />}
        {reviewTitle == title && <SubModal3 content={data?.[7]?.content} />}
        {inspectTitle == title && <SubModal9 content={data?.[8]?.content} />}
        {reviewOfferTitle == title && (
          <SubModal3 content={data?.[9]?.content} />
        )}
        {handleFragileTitle == title && (
          <SubModal11 content={data?.[10]?.content} />
        )}
        {decliningDeliveryTitle == title && (
          <SubModal3 content={data?.[11]?.content} />
        )}
      </div>
    </div>
  );
}

const SubModal1 = ({ content }: any) => {
  return (
    <div>
      <SubTitle
        title={content?.content1}
        img={content?.icon1}
        subTtlFont={fonts.pFont}
      />
      <SubTitle
        title={content?.practice?.title}
        img={content?.practice?.icon}
        subTtlFont={fonts.pFont}
      />
      <ul className="list-disc ml-6">
        {content?.practice?.list?.length > 0 &&
          content?.practice?.list?.map((item: any, i: number) => (
            <li key={i}>
              <p className={`${fonts.pFont} mb-2`}>{item}</p>
            </li>
          ))}
      </ul>
      <SubTitle
        title={content?.proTip?.title}
        img={content?.proTip?.icon}
        subTtlFont={fonts.pFont}
      />
      <p className={`${fonts.pFont} mb-2`}>{content?.proTip?.desc}</p>
      <SubTitle
        title={content?.avoid?.desc}
        img={content?.avoid?.icon}
        subTtlFont={fonts.pFont}
      />
    </div>
  );
};

const SubModal2 = ({ content }: any) => {
  return (
    <>
      <p className={`${fonts.pFont} mb-2`}>{content?.p1}</p>
      <p className={`${fonts.pFont} mb-2`}>{content?.p2}</p>
      <p className={`${fonts.pFont} mb-2`}>{content?.p3}</p>
    </>
  );
};

const SubModal3 = ({ content }: any) => {
  return (
    <div>
      <SubTitle
        title={content?.subtitle}
        img={content?.img}
        subTtlFont={fonts.pFont}
      />
      <SubTitle
        title={content?.intro}
        img={content?.introIcon}
        subTtlFont={fonts.pFont}
      />
      {/* <p className={`${fonts.pFont} mb-2`}>{content?.intro}</p> */}
      <ul className="list-disc ml-6 my-4">
        {content?.guidelines?.length > 0 &&
          content?.guidelines?.map((item: any, i: number) => (
            <li key={i}>
              <SubTitle
                title={item?.text}
                img={item?.icon}
                subTtlFont={fonts.pFont}
              />
            </li>
          ))}
      </ul>
      <SubTitle
        title={content?.reminder?.text}
        img={content?.reminder?.icon}
        subTtlFont={fonts.pFont}
      />
    </div>
  );
};

const SubModal5 = ({ content }: any) => {
  return (
    <div>
      <SubTitle
        title={content?.subtitle}
        img={content?.icon}
        subTtlFont={fonts.pFont}
      />
      <p className={`${fonts.pFont} mb-2`}>{content?.desc}</p>
      <ul className="list-disc ml-6 my-4">
        {content?.sections?.list?.length > 0 &&
          content?.sections?.list?.map((item: any, i: number) => (
            <li key={i}>
              <SubTitle
                title={item?.text}
                img={item?.icon}
                subTtlFont={fonts.pFont}
              />
            </li>
          ))}
      </ul>
      <SubTitle
        title={content?.sections?.title}
        img={content?.sections?.icon}
        subTtlFont={fonts.pFont}
      />
      <ul className="list-disc ml-6 my-4">
        {content?.sections?.points?.length > 0 &&
          content?.sections?.points?.map((item: any, i: number) => (
            <li key={i}>
              <p className={`${fonts.pFont} mb-2`}>{item?.text}</p>
            </li>
          ))}
      </ul>
      <SubTitle
        title={content?.sections?.title2}
        img={content?.sections?.icon2}
        subTtlFont={fonts.pFont}
      />
    </div>
  );
};

const SubModal9 = ({ content }: any) => {
  return (
    <div>
      <p className={`${fonts.pFont} mb-2`}>{content?.desc}</p>
      <ul className="list-disc ml-6 my-4">
        {content?.list?.length > 0 &&
          content?.list?.map((item: any, i: number) => (
            <li key={i}>
              <SubTitle
                title={item?.item}
                img={item?.icon}
                subTtlFont={fonts.pFont}
              />
            </li>
          ))}
      </ul>
      <p className={`${fonts.pFont} mb-2`}>
        {content?.if_something_seems_off?.head}
      </p>
      <SubTitle
        title={content?.if_something_seems_off?.desc}
        img={content?.if_something_seems_off?.icon}
        subTtlFont={fonts.pFont}
      />
      <SubTitle
        title={content?.tip}
        img={content?.tipIcon}
        subTtlFont={fonts.pFont}
      />
    </div>
  );
};

const SubModal11 = ({ content }: any) => {
  return (
    <div>
      <SubTitle
        title={content?.desc}
        img={content?.descIcon}
        subTtlFont={fonts.pFont}
      />
      <ul className="list-disc ml-6 my-4">
        {content?.precautions?.length > 0 &&
          content?.precautions?.map((item: any, i: number) => (
            <li key={i}>
              <SubTitle
                title={item}
                img={"/svg/icon/bluetick.svg"}
                subTtlFont={fonts.pFont}
              />
            </li>
          ))}
      </ul>
      <SubTitle
        title={content?.suspicious_parcel_guidance}
        img={content?.suspicious_icon}
        subTtlFont={fonts.pFont}
      />
      <SubTitle
        title={content?.safety_note}
        img={content?.tipIcon}
        subTtlFont={fonts.pFont}
      />
    </div>
  );
};
