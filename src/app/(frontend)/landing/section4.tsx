import GlobalToggle from "@/app/component/globaltoggle";
import { Box } from "@mui/material";
import Image from "next/image";
import PageContext from "@/app/providers/pagecontext";
import { useContext, useState } from "react";
import { Images } from "../../../../content";

export default function Section4() {
  const { i18 } = useContext(PageContext);
  const forSender = i18?.POSTIER_SYSTEM?.FOR_SENDER;
  const forPostier = i18?.POSTIER_SYSTEM?.FOR_POSTIER;
  const forReceiver = i18?.POSTIER_SYSTEM?.FOR_RECEIVER;
  const [customervalue, setCustomervalue] = useState(0);

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const initialIndex = 0;

  const handleMouseEnter = (index: any) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  const handleChangeCustomer = (newValue: any) => {
    setCustomervalue(newValue);
  };
  type StepData = {
    image: string;
    content: any;
    subcon?: any;
  };

  const sender: StepData[] = [
    {
      image: "/png/sendicon.png",
      content: forSender?.SENDER_1?.CONTENT || "For Senders (Booking a Parcel)",
    },
    {
      image: "/png/login_ico.png",
      content:
        forSender?.SENDER_2?.CONTENT || "Sign up & verify your email/phone",
    },
    {
      image: "/png/package-wt.png",
      content: forSender?.SENDER_3?.CONTENT || "Enter parcel details",
      subcon:
        forSender?.SENDER_3?.SUB_CONTENT ||
        "(size, weight, special handling if needed)",
    },
    {
      image: "/png/mapicon.png",
      content:
        forSender?.SENDER_4?.CONTENT || "Choose pickup & delivery addresses",
    },
    {
      image: "/png/money-bag.png",
      content: forSender?.SENDER_5?.CONTENT || "See instant price estimate",
      subcon:
        forSender?.SENDER_5?.SUB_CONTENT ||
        "(calculated at €0.08-€0.12/km + options)",
    },
    {
      image: "/png/user-info-fill.png",
      content:
        forSender?.SENDER_6?.CONTENT || "Pick a Postier traveler from the list",
      subcon: forSender?.SENDER_6?.SUB_CONTENT || "(see ratings & reviews!)",
    },
    {
      image: "/png/money-bag.png",
      content:
        forSender?.SENDER_7?.CONTENT ||
        "Confirm booking, pay securely, track your parcel",
    },
    {
      image: "/png/staricon.png",
      content: forSender?.SENDER_8?.CONTENT || "Rate and review the delivery",
    },
  ];
  const Postier: StepData[] = [
    {
      image: "/png/van.png",
      content:
        forPostier?.POSTIER_1?.CONTENT || "For Postiers (Publishing a Trip)",
    },
    {
      image: "/png/user_i.png",
      content:
        forPostier?.POSTIER_2?.CONTENT ||
        "Sign up & complete your traveler profile",
      subcon:
        forPostier?.POSTIER_2?.SUB_CONTENT ||
        "(Photo, ID verification, vehicle info)",
    },
    {
      image: "/png/track_map.png",
      content: forPostier?.POSTIER_3?.CONTENT || "Post your travel route",
      subcon: forPostier?.POSTIER_3?.SUB_CONTENT || "(From-To)",
    },
    {
      image: "/png/package-wt.png",
      content:
        forPostier?.POSTIER_4?.CONTENT || "Set your available parcel capacity",
      subcon: forPostier?.POSTIER_4?.SUB_CONTENT || "(Weight, Volume)",
    },
    {
      image: "/png/handicon.png",
      content:
        forPostier?.POSTIER_5?.CONTENT ||
        "Accept delivery offers along your trip",
      subcon: forPostier?.POSTIER_5?.SUB_CONTENT || "(earn per km!)",
    },
    {
      image: "/png/tick_bl.png",
      content: forPostier?.POSTIER_6?.CONTENT || "Pickup and drop-off parcels",
      subcon:
        forPostier?.POSTIER_6?.SUB_CONTENT || "(scan QR codes at both points)",
    },
    {
      image: "/png/package-wt.png",
      content:
        forPostier?.POSTIER_7?.CONTENT ||
        "Receive payout automatically after confirmed delivery!",
    },
    {
      image: "/png/staricon.png",
      content: forPostier?.POSTIER_8?.CONTENT || "Rate and review the delivery",
    },
  ];
  const receiver: StepData[] = [
    {
      image: "/png/sendicon.png",
      content:
        forReceiver?.RECEIVER_1?.CONTENT || "For Receiver (Receiving parcel)",
    },
    {
      image: "/png/package-wt.png",
      content:
        forReceiver?.RECEIVER_2?.CONTENT ||
        "Wait for a Parcel delivery Notification",
    },
    {
      image: "/png/login_ico.png",
      content:
        forReceiver?.RECEIVER_3?.CONTENT || "Sign Up or Log In (optional)",
    },
    {
      image: "/png/compass.png",
      content: forReceiver?.RECEIVER_4?.CONTENT || "Track Your Parcel",
    },
    {
      image: "/png/mapicon.png",
      content: forReceiver?.RECEIVER_5?.CONTENT || "Get Ready for Delivery",
    },
    {
      image: "/png/mail_receive.png",
      content: forReceiver?.RECEIVER_6?.CONTENT || "Receive & Confirm",
    },
    {
      image: "/png/staricon.png",
      content:
        forReceiver?.RECEIVER_7?.CONTENT || "Rate & Review your delivery",
      subcon: forReceiver?.RECEIVER_7?.SUB_CONTENT || "(optinal)",
    },
  ];
  const images = [
    {
      img: "/png/forSender.png",
    },
    {
      img: "/png/forPostier.png",
    },
    {
      img: "/png/forReceiver.png",
    },
  ];
  return (
    <section
      className="fifthsec bg-[#222222] md:py-16 lg:px-16 p-4 pb-10"
      aria-labelledby="fifthsec-heading"
    >
      <h2
        id="fifthsec-heading"
        className="text-center text-[40px] sm:text-[30px] md:text-[40px] font-bold text-white pt-8 mb-10"
      >
        {i18?.NEW?.SYSTEM_WORKS || "How Our Postier System Works for"}
        <br className="hidden md:block" />
        {i18?.NEW?.SYSTEM_WORKS2 || "All Stakeholders?"}
      </h2>

      <p className="text-[17px] text-center mt-[15px] text-white font-normal mb-10">
        {i18?.NEW?.LEARN_HOW ||
          "Learn how the Postier app works for both customers and Postiers"}
      </p>

      <div className="relative m-auto mt-[20px] md:mt-[50px]">
        <Box>
          <GlobalToggle
            data={[
              i18?.NEW?.SENDERS || "Senders",
              i18?.NEW?.POSTIER || "Postier",
              i18?.NEW?.RECEIVER || "Receiver",
            ]}
            fnc={handleChangeCustomer}
            activeIndex={customervalue}
          />

          <div
            className="flex justify-center"
            role="region"
            aria-label="System steps content"
          >
            <Box sx={{ p: 3 }} className="mt-5 w-full max-w-[1131px]">
              <div className="flex flex-col md:flex-row justify-center gap-[20px]">
                <div
                  className="text-black md:bg-white w-full rounded-[30px] md:p-[30px] flex flex-col justify-center"
                  role="tabpanel"
                  aria-labelledby="fifthsec-heading"
                >
                  {(customervalue === 0
                    ? sender
                    : customervalue === 1
                    ? Postier
                    : receiver
                  ).map((data, index) => (
                    <div
                      key={index}
                      className={`flex items-center ${
                        index ===
                        (customervalue === 0
                          ? sender
                          : customervalue === 1
                          ? Postier
                          : receiver
                        ).length -
                          1
                          ? "mb-0"
                          : "xs:pb-[40px] pb-9"
                      } addborder relative`}
                    >
                      <Image
                        width={500}
                        height={500}
                        src={data.image}
                        className="mr-5 w-[50px] h-[50px] z-10"
                        alt=""
                        aria-hidden="true"
                      />
                      <div>
                        <span
                          className={
                            (index == 0
                              ? "font-bold text-[24px]"
                              : "font-semibold text-[20px]") +
                            "  text-white md:text-black"
                          }
                        >
                          {data.content}
                        </span>
                        {data?.subcon && (
                          <p className="font-light text-[15px] text-white md:text-black">
                            {data.subcon}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="bg-white w-full rounded-[30px] p-[20px] md:flex hidden justify-center items-center flex-wrap md:mt-0 mt-[20px]"
                  aria-hidden="true"
                >
                  {images[customervalue] && (
                    <Image
                      width={700}
                      height={700}
                      src={images[customervalue].img}
                      alt="Example visual representation"
                      className="rounded-[30px] w-auto h-4/5 object-contain"
                    />
                  )}
                </div>
              </div>
            </Box>
          </div>
        </Box>
      </div>
    </section>
  );
}
