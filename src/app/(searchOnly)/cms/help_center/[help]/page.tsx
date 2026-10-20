"use client";
import PageContext from "@/app/providers/pagecontext";
import Store from "@/app/store/store";
import { useParams } from "next/navigation";
import { useContext } from "react";
import fallback from "@/app/component/dictionaries/fallback_translate.json";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import Image from "next/image";
import { SubTitle } from "@/app/component/subTtlFont";
import PublishATrip from "./publishATrip";
import SendingParcel from "./sendingParcel";
import OfferAPrice from "./offerAPrice";
import TrackingParcel from "./trackingParcel";
import WhyStripe from "./whyStripe";
import RecommendedPhoto from "./recommendedPhoto";
import QrPickDelivery from "./qrPickDelivery";
import PriceEstimate from "./priceEstimate";
import ODR from "./ODR";
import PhotoTips from "./photoTips";
import CmsHeader from "@/app/component/cmsHeader";

export default function Helppages() {
  const params: any = useParams();
  const router = UseLoadingRouter();
  const { i18 } = useContext(PageContext);
  const help = {
    RETURNHOME: i18?.HELP_CONTENT?.RETURNHOME || "Return Home",
    PUBLISH_A_TRIP: {
      HEADER: {
        BANNER: "/svg/hlp_guide 1.svg",
        SUB_TITLE:
          i18?.HELP_CONTENT?.PUBLISH_A_TRIP_SUB_TITLE || "Publish Your Trip",
        ICON: "/svg/icon/del02.svg",
      },
      CONTENT: {
        P:
          i18?.HELP_CONTENT?.PUBLISH_A_TRIP_P ||
          "Make your journey even more valuable — publish your upcoming trip and help deliver parcels along the way!",
        LISTS: [
          {
            TITLE:
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI1_TITLE ||
              "Enter your travel details:",
            DATA: [
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI1_D1 ||
                "Departure and destination cities",
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI1_D2 ||
                "Dates and estimated times",
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI1_D3 ||
                "Available cargo space and type of vehicle",
            ],
          },
          {
            TITLE:
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI2_TITLE ||
              "Set your travel conditions:",
            DATA: [
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI2_D1 ||
                "Maximum parcel size or weight you can carry",
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI2_D2 ||
                "Preferred types of parcels (e.g., fragile, standard, documents)",
            ],
          },
          {
            TITLE:
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI3_TITLE ||
              "Increase your chances:",
            DATA: [
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI3_D1 ||
                "Publish trips early to get more parcel matches.",
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI3_D2 ||
                'Add a clear description and special notes if needed (e.g., "No oversized items", "Only carry-on accepted").',
            ],
          },
          {
            TITLE:
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI4_TITLE ||
              "Visibility and matching:",
            DATA: [
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI4_D1 ||
                "Your trip will be instantly visible to senders matching your route.",
              i18?.HELP_CONTENT?.PUBLISH_A_TRIP_LI4_D2 ||
                "Our smart algorithm will suggest the best parcel deliveries based on your path and preferences.",
            ],
          },
        ],
        SECURED:
          i18?.HELP_CONTENT?.PUBLISH_A_TRIP_SECURED ||
          "All deliveries are tracked and secured. You’ll receive payment after successful delivery confirmation.",
        TIPS:
          i18?.HELP_CONTENT?.TIPS ||
          "Tip: Update your trip details if your schedule changes — flexibility increases your match rate!",
        TRIPSNO: {
          TITLE:
            i18?.HELP_CONTENT?.PUBLISH_A_TRIP_TIPS_TITLE || "Trips by Numbers",
          DATA: [
            {
              NAME:
                i18?.HELP_CONTENT?.PUBLISH_A_TRIP_TIPS_D1 || "Overall Parcels",
              IMG: "/svg/icon/del02.svg",
              VALUE: "24,566",
            },
            {
              NAME:
                i18?.HELP_CONTENT?.PUBLISH_A_TRIP_TIPS_D2 || "Active Parcels",
              IMG: "/svg/icon/hlp_trip_2.svg",
              VALUE: "877",
            },
            {
              NAME:
                i18?.HELP_CONTENT?.PUBLISH_A_TRIP_TIPS_D3 ||
                "Completed Parcels",
              IMG: "/svg/icon/hlp_trip_3.svg",
              VALUE: "24,689",
            },
            {
              NAME:
                i18?.HELP_CONTENT?.PUBLISH_A_TRIP_TIPS_D4 || "Average Rating",
              IMG: "/svg/icon/hlp_trip_4.svg",
              VALUE: "48",
            },
          ],
        },
      },
    },
    SENDING_PARCEL: {
      HEADER: {
        BANNER: "/svg/hlp_guide 2.svg",
        SUB_TITLE:
          i18?.HELP_CONTENT?.SENDING_PARCEL_SUB_TITLE || "Sending parcel",
        ICON: "/svg/icon/package.svg",
      },
      CONTENT: {
        PARCEL: {
          TITLE:
            i18?.HELP_CONTENT?.SENDING_PARCEL_TITLE ||
            "Sending Your Parcel with Postier",
          DESC:
            i18?.HELP_CONTENT?.SENDING_PARCEL_DESC ||
            "Send parcels securely and confidently with trusted Postiers!",
        },
        LISTS: [
          {
            TITLE:
              i18?.HELP_CONTENT?.SENDING_PARCEL_LI1_TITLE ||
              "Create your parcel listing:",
            DATA: [
              {
                DATA:
                  i18?.HELP_CONTENT?.SENDING_PARCEL_LI1_D1 ||
                  "Enter pickup and delivery details (address, contact info).",
              },
              {
                DATA:
                  i18?.HELP_CONTENT?.SENDING_PARCEL_LI1_D2 ||
                  "Add parcel information: size, weight, content type (e.g., documents, gifts, electronics).",
              },
            ],
          },
          {
            TITLE:
              i18?.HELP_CONTENT?.SENDING_PARCEL_LI2_TITLE ||
              "Prepare your parcel:",
            DATA: [
              {
                DATA:
                  i18?.HELP_CONTENT?.SENDING_PARCEL_LI2_D1 ||
                  "Pack your items carefully and securely.",
              },
              {
                DATA:
                  i18?.HELP_CONTENT?.SENDING_PARCEL_LI2_D2 ||
                  "Clearly label if the parcel is fragile or requires special handling.",
              },
            ],
          },
          {
            TITLE:
              i18?.HELP_CONTENT?.SENDING_PARCEL_LI3_TITLE ||
              "Upload parcel photos (optional but recommended):",
            DATA: [
              {
                IMG: "/svg/icon/Camera.svg",
                DATA:
                  i18?.HELP_CONTENT?.SENDING_PARCEL_LI3_D1 ||
                  "Add clear pictures of the parcel packaging and contents.",
              },
              {
                DATA:
                  i18?.HELP_CONTENT?.SENDING_PARCEL_LI3_D2 ||
                  "These images will be stored securely and can help resolve any issues quickly in case of damage, loss, or disputes.",
              },
            ],
          },
          {
            TITLE:
              i18?.HELP_CONTENT?.SENDING_PARCEL_LI4_TITLE ||
              "Match with a trusted Postier:",
            DATA: [
              {
                DATA:
                  i18?.HELP_CONTENT?.SENDING_PARCEL_LI4_D1 ||
                  "Review Postier profiles, ratings, and trips.",
              },
              {
                DATA:
                  i18?.HELP_CONTENT?.SENDING_PARCEL_LI4_D2 ||
                  "Select the Postier that best fits your delivery needs.",
              },
            ],
          },
          {
            TITLE:
              i18?.HELP_CONTENT?.SENDING_PARCEL_LI5_TITLE ||
              "Secure the handover:",
            DATA: [
              {
                DATA:
                  i18?.HELP_CONTENT?.SENDING_PARCEL_LI5_D1 ||
                  "Show your Pickup QR code at the pickup time for the Postier to scan.",
              },
              {
                DATA:
                  i18?.HELP_CONTENT?.SENDING_PARCEL_LI5_D2 ||
                  "Track your parcel until it safely reaches its destination.",
              },
            ],
          },
        ],
        SECURED: {
          TITLE: i18?.HELP_CONTENT?.SENDING_PARCEL_SECURED_TITLE || "Your delivery is protected:",
          DESC: i18?.HELP_CONTENT?.SENDING_PARCEL_SECURED_DESC || "All Postiers are identity-verified, deliveries are traceable, and parcel photos add an extra layer of protection.",
        },
        TIPS: {
          TITLE: i18?.HELP_CONTENT?.SENDING_PARCEL_TIPS_TITLE || "Tip:",
          DESC: i18?.HELP_CONTENT?.SENDING_PARCEL_TIPS_DESC || "Good, clear parcel photos = faster resolution in case of questions or issues during delivery.",
        },
        MAIL: {
          URL: "support@postier.org",
          DESC: i18?.HELP_CONTENT?.SENDING_PARCEL_MAIL_DESC || "Need assistance? Email us anytime at ",
        },
      },
    },
    OFFER_A_PRICE: {
      HEADER: {
        BANNER: "/svg/hlp_guide 3.svg",
        SUB_TITLE: i18?.HELP_CONTENT?.OFFER_A_PRICE_SUB_TITLE || "Counter offer a price",
        ICON: "/svg/icon/counter.svg",
      },
      CONTENT: {
        P: i18?.HELP_CONTENT?.OFFER_A_PRICE_P || "Negotiating the best delivery price is easy and respectful on Postier!",
        LISTS: [
          {
            TITLE: i18?.HELP_CONTENT?.OFFER_A_PRICE_LI1_TITLE || "See a price you want to adjust?",
            DATA: [
              i18?.HELP_CONTENT?.OFFER_A_PRICE_LI1_D1 || "You can propose a counter-offer to the Postier or Sender directly through the app.",
            ],
          },
          {
            TITLE: i18?.HELP_CONTENT?.OFFER_A_PRICE_LI2_TITLE || "How to make a counter-offer:",
            DATA: [
              i18?.HELP_CONTENT?.OFFER_A_PRICE_LI2_D1 || 'Tap "Propose Counter-Offer" next to the delivery offer.',
              i18?.HELP_CONTENT?.OFFER_A_PRICE_LI2_D2 || "Enter your new suggested price.",
              i18?.HELP_CONTENT?.OFFER_A_PRICE_LI2_D3 || "Add an optional message explaining your reason (e.g., heavier parcel, flexible timing).",
            ],
          },
          {
            TITLE: i18?.HELP_CONTENT?.OFFER_A_PRICE_LI3_TITLE || "Be reasonable and fair:",
            DATA: [
              i18?.HELP_CONTENT?.OFFER_A_PRICE_LI3_D1 || "Counter-offers should reflect real conditions (size, weight, urgency).",
              i18?.HELP_CONTENT?.OFFER_A_PRICE_LI3_D2 || "Mutual agreement builds trust and ensures fast delivery.",
            ],
          },
        ],
        TIPS: {
          TITLE: i18?.HELP_CONTENT?.OFFER_A_PRICE_TIPS_TITLE || "Pro Tip:",
          DESC: i18?.HELP_CONTENT?.OFFER_A_PRICE_TIPS_DESC || "Negotiations that stay polite and transparent get accepted faster!",
        },
        MAIL: {
          URL: "support@postier.org",
          DESC: i18?.HELP_CONTENT?.OFFER_A_PRICE_MAIL_DESC || "Need help? Contact ",
        },
      },
    },
    TRACKING_PARCEL: {
      HEADER: {
        BANNER: "/svg/hlp_guide 4.svg",
        SUB_TITLE: i18?.HELP_CONTENT?.TRACKING_PARCEL_SUB_TITLE || "Using QR Codes for Secure Parcel Pickup and Delivery",
        ICON: "/svg/icon/qr_code.svg",
      },
      CONTENT: {
        P: i18?.HELP_CONTENT?.P || "Ensure a safe and verified handover — every time.",
        LISTS: [
          {
            TITLE: i18?.HELP_CONTENT?.TRACKING_PARCEL_LI1_TITLE || "At Pickup (Sender ➔ Postier):",
            ICON: "/svg/icon/pick_truck.svg",
          },
          {
            DESC: i18?.HELP_CONTENT?.TRACKING_PARCEL_LI2_DESC || "The Postier must scan the QR code shown by the Sender using their Postier app.",
          },
          {
            DESC: i18?.HELP_CONTENT?.TRACKING_PARCEL_LI3_DESC || "This confirms that the parcel has been handed over safely and the delivery is now in progress.",
          },
          {
            TITLE: i18?.HELP_CONTENT?.TRACKING_PARCEL_LI4_TITLE || "At Delivery (Postier ➔ Receiver):",
            ICON: "/svg/icon/package.svg",
          },
          {
            DESC: i18?.HELP_CONTENT?.TRACKING_PARCEL_LI4_DESC || "The Postier must scan the QR code shown by the receiver to confirm the parcel was successfully delivered.",
          },
          {
            DESC: i18?.HELP_CONTENT?.TRACKING_PARCEL_LI5_DESC || "This action automatically triggers the release of payment to the Postier.",
          },
        ],
        QR_SCAN: {
          TITLE: i18?.HELP_CONTENT?.TRACKING_PARCEL_QR_TITLE || "If QR scanning is unavailable:",
          DATA: [
            i18?.HELP_CONTENT?.TRACKING_PARCEL_QR_D1 || "The Postier can manually enter the Pickup Code at collection and the Delivery Code at drop-off.",
            i18?.HELP_CONTENT?.TRACKING_PARCEL_QR_D2 || "Ensure that the correct codes are entered to validate the handover.",
          ],
        },
        SECURED: {
          TITLE: i18?.HELP_CONTENT?.TRACKING_PARCEL_SECURED_TITLE || "Why use QR Codes?",
          DATA: [
            i18?.HELP_CONTENT?.TRACKING_PARCEL_SECURED_D1 || "Verifies that the correct parcel is picked up and delivered.",
            i18?.HELP_CONTENT?.TRACKING_PARCEL_SECURED_D2 || "Prevents fraud and unauthorized deliveries.",
            i18?.HELP_CONTENT?.TRACKING_PARCEL_SECURED_D3 || "Ensures the Postier is paid quickly and securely after successful delivery.",
          ],
        },
        TIPS: {
          TITLE: i18?.HELP_CONTENT?.TRACKING_PARCEL_TIPS_TITLE || "Tip: ",
          DESC: i18?.HELP_CONTENT?.TRACKING_PARCEL_TIPS_DESC || "Make sure your smartphone camera is enabled, and that you scan the QR code in a well-lit area for the best results!",
        },
        MAIL: {
          URL: "support@postier.org",
          DESC: i18?.HELP_CONTENT?.TRACKING_PARCEL_MAIL_DESC || "Need help scanning or verifying? Contact our support team at support ",
        },
      },
    },
    WHY_STRIPE: {
      HEADER: {
        BANNER: "/svg/hlp_art 1.svg",
        SUB_TITLE: i18?.HELP_CONTENT?.WHY_STRIPE_SUB_TITLE || "Why We Use Stripe",
        ICON: "",
      },
      CONTENT: {
        LISTS: [
          { DATA: i18?.HELP_CONTENT?.WHY_STRIPE_LI1 || "Trusted globally by millions of platforms." },
          { DATA: i18?.HELP_CONTENT?.WHY_STRIPE_LI2 || "End-to-end encryption and PCI-compliant." },
          {
            DATA: i18?.HELP_CONTENT?.WHY_STRIPE_LI3 || "Real-time integration with Postier for instant updates, receipts, and refunds.",
          },
          {
            DATA: i18?.HELP_CONTENT?.WHY_STRIPE_LI4 || "Enables secure payouts to Postiers with transaction history.",
          },
        ],
        ANY_QUES: {
          DATA: i18?.HELP_CONTENT?.WHY_STRIPE_ANY_QUES1 || "For any questions or support, please visit our [Help Center] or contact our team at",
          URL: "info@postier.org",
          LETS_US: i18?.HELP_CONTENT?.WHY_STRIPE_ANY_QUES2 ||
            "Let us know if you'd like to enable or disable COD/COP in your region.",
        },
      },
    },
    RECOMMENDED_PHOTO: {
      HEADER: {
        BANNER: "/svg/hlp_art 2.svg",
        SUB_TITLE: i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_SUB_TITLE || "Recommended Photo Upload Checklist for Sending Parcels",
        ICON: "",
      },
      CONTENT: {
        P: i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_P || "Help protect your parcel and simplify issue resolution by uploading clear pictures when creating your shipment!",
        PARCEL: i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_PARCEL || "What photos should you upload?",
        LISTS: [
          {
            TITLE: i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_LI1_TITLE || "Front View of the Parcel",
            DATA: [
              i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_LI1_D1 || "Take a clear picture of the entire package from the front.",
            ],
          },
          {
            TITLE: i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_LI2_TITLE || "Address Label (if applied)",
            DATA: [
              i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_LI2_D1 || "Photograph the shipping label showing pickup/delivery addresses (if any).",
            ],
          },
          {
            TITLE: i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_LI3_TITLE || "Contents Before Sealing (optional)",
            DATA: [
              i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_LI3_D1 || "Capture an image of the items inside the box before closing it — especially for high-value or fragile items.",
            ],
          },
          {
            TITLE: i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_LI4_TITLE || "Sealed Package (after packing)",
            DATA: [
              i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_LI4_D1 || "Show the fully packed and sealed parcel — box, envelope, or package wrapping.",
            ],
          },
          {
            TITLE: i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_LI5_TITLE || "Special Markings or Instructions",
            DATA: [
              i18?.HELP_CONTENT?.RECOMMENDED_PHOTO_LI5_D1 || "If your parcel has “Fragile”, “This Side Up”, or other special markings, snap a photo clearly showing them.",
            ],
          },
        ],
      },
    },
    QR_PICK_DELIVERY: {
      HEADER: {
        BANNER: "/svg/hlp_art 3.svg",
        SUB_TITLE: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_SUB_TITLE || " Postier QR Code Pickup & Delivery Flow",
        ICON: "",
      },
      CONTENT: {
        STEPS: [
          {
            TITLE: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S1_TITLE || "Step 1: Parcel Pickup",
            LISTS: [
              {
                DESC: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S1_LI1 || "Sender shows the Pickup QR Code to the Postier.",
                IMG: "",
              },
              {
                DESC: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S1_LI2 || "Postier scans the Pickup QR Code using the Postier app.",
                IMG: "/svg/icon/qr_code.svg",
              },
              {
                DESC: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S1_LI3 || "Pickup is confirmed! The delivery is now officially started.",
                IMG: "/svg/icon/bluetick.svg",
              },
            ],
            NOTE: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S1_NOTE || "(If scanner unavailable → Postier can manually enter Pickup Code.)",
          },
          {
            TITLE: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S2_TITLE || "Step 2: Parcel Delivery",
            LISTS: [
              {
                DESC: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S2_LI1 || "Receiver shows the Delivery QR Code to the Postier.",
                IMG: "",
              },
              {
                DESC: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S2_LI2 || "Postier scans the Delivery QR Code using the Postier app.",
                IMG: "/svg/icon/qr_code.svg",
              },
              {
                DESC: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S2_LI3 || "Delivery is confirmed! The Postier is now eligible for payout.",
                IMG: "/svg/icon/bluetick.svg",
              },
            ],
            NOTE: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S2_NOTE || "(If scanner unavailable → Postier can manually enter Delivery Code.)",
          },
          {
            TITLE: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S3_TITLE || "Step 3: Payout Processing",
            LISTS: [
              {
                DESC: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S3_LI1 || "Upon successful delivery confirmation,",
                IMG: "",
              },
              {
                DESC: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_S3_LI2 || "The payout process is automatically triggered and the Postier receives their earnings securely.",
                IMG: "/svg/icon/costs.svg",
              },
            ],
          },
        ],
        GET_PAID: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_GET_PAID || "Scan. Confirm. Deliver. Get Paid.",
        USES: [
          { USE: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_USE1 || "Secure", IMG: "/svg/icon/shield_duotone.svg" },
          { USE: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_USE2 || "Easy to Use", IMG: "/svg/icon/qr_code.svg" },
          { USE: i18?.HELP_CONTENT?.QR_PICK_DELIVERY_USE3 || "Fully Traceable", IMG: "/svg/icon/list_linear.svg" },
        ],
      },
    },
    PRICE_ESTIMATE: {
      HEADER: {
        BANNER: "/svg/hlp_art 4.svg",
        SUB_TITLE: i18?.HELP_CONTENT?.PRICE_ESTIMATE_SUB_TITLE || "Postier Price Estimator Widget",
        ICON: "",
      },
      CONTENT: {
        NOTE: {
          TITLE: i18?.HELP_CONTENT?.PRICE_ESTIMATE_NOTE_TITLE || "Note:",
          DESC: i18?.HELP_CONTENT?.PRICE_ESTIMATE_NOTE_DESC || "Postier calculates your parcel price based on distance, size, weight, delivery speed, and applies smart discounts for longer trips.",
          USES: i18?.HELP_CONTENT?.PRICE_ESTIMATE_NOTE_USES || "Fast, fair, and affordable delivery — worldwide!",
        },
      },
    },
    ODR: {
      HEADER: {
        BANNER: "/svg/hlp_art 5.svg",
        SUB_TITLE: i18?.HELP_CONTENT?.ODR_SUB_TITLE || "Online Dispute Resolution (ODR) under Art",
        ICON: "",
      },
      CONTENT: {
        TITLE:
          i18?.HELP_CONTENT?.ODR_TITLE || "Online Dispute Resolution (ODR) under Art. 14 of the EU Regulation No. 524/2013",
        POINTS: [
          {
            DATA: i18?.HELP_CONTENT?.ODR_P1 || "The EU Commission provides a user-friendly platform for the online resolution of consumer disputes arising from the online sale of goods or the online provision of services (ODR platform).",
            LINK: "",
          },
          {
            DATA: i18?.HELP_CONTENT?.ODR_P2 || " The ODR platform can be accessed at the following link: ",
            LINK: "https://ec.europa.eu/consumers/odr",
          },
          {
            DATA: i18?.HELP_CONTENT?.ODR_P3 || " We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.",
            LINK: "",
          },
        ],
      },
    },
    PHOTO_TIPS: {
      HEADER: {
        BANNER: "/svg/hlp_art 6.svg",
        SUB_TITLE: i18?.HELP_CONTENT?.PHOTO_TIPS_SUB_TITLE || "Photo Tips",
        ICON: "",
      },
      CONTENT: {
        TITLE: i18?.HELP_CONTENT?.PHOTO_TIPS_TITLE || "Use good lighting (daylight if possible)",
        LISTS: [
          i18?.HELP_CONTENT?.PHOTO_TIPS_LI1 || "Avoid blurry photos — hold your phone steady.",
          i18?.HELP_CONTENT?.PHOTO_TIPS_LI1 || "Make sure important details (labels, fragile stickers) are readable.",
        ],
        SECURED:
          i18?.HELP_CONTENT?.PHOTO_TIPS_SECURED || "All uploaded images are securely stored and only used for delivery verification and dispute resolution if needed.",
        TIPS: {
          TITLE: i18?.HELP_CONTENT?.PHOTO_TIPS_TIPS_TITLE || "Tip:",
          DESC: i18?.HELP_CONTENT?.PHOTO_TIPS_TIPS_DESC || "More clear pictures = faster help if any issue arises during pickup or delivery!",
        },
      },
    },
  };

  const datas =
    params.help == "publish_Your_Trip"
      ? help?.PUBLISH_A_TRIP
      : params.help == "sending_parcel"
      ? help?.SENDING_PARCEL
      : params.help == "offer_a_price"
      ? help?.OFFER_A_PRICE
      : params.help == "tracking_parcel"
      ? help?.TRACKING_PARCEL
      : params.help == "why_stripe"
      ? help?.WHY_STRIPE
      : params.help == "recommended_photo"
      ? help?.RECOMMENDED_PHOTO
      : params.help == "qr_pick_delivery"
      ? help?.QR_PICK_DELIVERY
      : params.help == "price_estimate"
      ? help?.PRICE_ESTIMATE
      : params.help == "odr"
      ? help?.ODR
      : help?.PHOTO_TIPS;

  // fonts:
  const Fonts = {
    subTitleFont: "font-bold md:text-[32px] text-[28px] text-[#004080]",
    pFont: "md:text-[17px] text-[15px] font-normal",
    pBold: "md:text-[17px] text-[16px] font-semibold",
    liTitle: "font-semibold sm:text-[17px] text-[16px] text-[#004080]",
    TitleFont: "font-semibold md:text-[30px] text-[26px] text-[#004080]",
    bFont: "font-bold text-[12px] text-white",
    numFont: "font-bold md:text-[22px] text-[19px] text-[#004080]",
  };

  return (
    <>
      <CmsHeader banner={datas?.HEADER?.BANNER} />
      <div className="max-w-[1440px] w-full mx-auto md:p-5 p-3 mb-10">
        {/* subhead */}
        <div className="relative md:mb-10 mb-5">
          <button
            className={`${Fonts.pFont} md:absolute left-0 block mx-auto md:px-8 px-5 md:py-4 py-3 border rounded-lg bg-btncolor text-[#fff] mb-4 hover:scale-[1.05] duration-150`}
            onClick={() => router.back()}
          >
            {help.RETURNHOME}
          </button>
          <div className="flex items-center justify-center md:mx-[200px] text-center">
            <SubTitle
              title={datas?.HEADER?.SUB_TITLE}
              img={datas?.HEADER?.ICON}
              size="30"
              subTtlFont={Fonts.subTitleFont}
            />
          </div>
        </div>
        {/* content */}
        {params.help == "publish_Your_Trip" ? (
          <PublishATrip data={datas.CONTENT} fonts={Fonts} />
        ) : params.help == "sending_parcel" ? (
          <SendingParcel data={datas.CONTENT} fonts={Fonts} />
        ) : params.help == "offer_a_price" ? (
          <OfferAPrice data={datas.CONTENT} fonts={Fonts} />
        ) : params.help == "tracking_parcel" ? (
          <TrackingParcel data={datas.CONTENT} fonts={Fonts} />
        ) : params.help == "why_stripe" ? (
          <WhyStripe data={datas.CONTENT} fonts={Fonts} />
        ) : params.help == "recommended_photo" ? (
          <RecommendedPhoto data={datas.CONTENT} fonts={Fonts} />
        ) : params.help == "qr_pick_delivery" ? (
          <QrPickDelivery data={datas.CONTENT} fonts={Fonts} />
        ) : params.help == "price_estimate" ? (
          <PriceEstimate data={datas.CONTENT} fonts={Fonts} />
        ) : params.help == "odr" ? (
          <ODR data={datas.CONTENT} fonts={Fonts} />
        ) : params.help == "photo_tips" ? (
          <PhotoTips data={datas.CONTENT} fonts={Fonts} />
        ) : null}
      </div>
    </>
  );
}
