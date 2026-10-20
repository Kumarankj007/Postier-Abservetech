"use client";
import { setCookie } from "@/utils";
import { Package1, Package2, Package3 } from "./public/svg/svgcomponent";
import { useContext } from "react";
import PageContext from "@/app/providers/pagecontext";

export const carouselData = [
  {
    image1: "/png/carouselimg1.png",
    personName: "Merlin Joti",
    svg: "/svg/icon/car12.svg",
    locationSvg1: "/svg/icon/locationG.svg",
    locationSvg2: "/svg/icon/locationR.svg",
    from: "Los Angeles",
    to: "Los Angeles Airport",
    calendarSvg: "/svg/icon/calendar.svg",
    date: "05th April to 07th April",
    Capacity: "20%",
    Price: "$200",
  },
  {
    image1: "/png/carouselimg2.png",
    personName: "Andrew",
    svg: "/svg/icon/car12.svg",
    locationSvg1: "/svg/icon/locationG.svg",
    locationSvg2: "/svg/icon/locationR.svg",
    from: "Los Angeles",
    to: "Los Angeles Airport",
    calendarSvg: "/svg/icon/calendar.svg",
    date: "05th April to 07th April",
    Capacity: "20%",
    Price: "$200",
  },
  {
    image1: "/png/carouselimg3.png",
    personName: "Clary",
    svg: "/svg/icon/car12.svg",
    locationSvg1: "/svg/icon/locationG.svg",
    locationSvg2: "/svg/icon/locationR.svg",
    from: "Los Angeles",
    to: "Los Angeles Airport",
    calendarSvg: "/svg/icon/calendar.svg",
    date: "05th April to 07th April",
    Capacity: "20%",
    Price: "$200",
  },
  {
    image1: "/png/carouselimg2.png",
    personName: "Andrew",
    svg: "/svg/icon/car12.svg",
    locationSvg1: "/svg/icon/locationG.svg",
    locationSvg2: "/svg/icon/locationR.svg",
    from: "Los Angeles",
    to: "Los Angeles Airport",
    calendarSvg: "/svg/icon/calendar.svg",
    date: "05th April to 07th April",
    Capacity: "20%",
    Price: "$200",
  },
  {
    image1: "/png/carouselimg1.png",
    personName: "Merlin Joti",
    svg: "/svg/icon/car12.svg",
    locationSvg1: "/svg/icon/locationG.svg",
    locationSvg2: "/svg/icon/locationR.svg",
    from: "Los Angeles",
    to: "Los Angeles Airport",
    calendarSvg: "/svg/icon/calendar.svg",
    date: "05th April to 07th April",
    Capacity: "20%",
    Price: "$200",
  },
  {
    image1: "/png/carouselimg3.png",
    personName: "Clary",
    svg: "/svg/icon/car12.svg",
    locationSvg1: "/svg/icon/locationG.svg",
    locationSvg2: "/svg/icon/locationR.svg",
    from: "Los Angeles",
    to: "Los Angeles Airport",
    calendarSvg: "/svg/icon/calendar.svg",
    date: "05th April to 07th April",
    Capacity: "20%",
    Price: "$200",
  },
  {
    image1: "/png/carouselimg2.png",
    personName: "Andrew",
    svg: "/svg/icon/car12.svg",
    locationSvg1: "/svg/icon/locationG.svg",
    locationSvg2: "/svg/icon/locationR.svg",
    from: "Los Angeles",
    to: "Los Angeles Airport",
    calendarSvg: "/svg/icon/calendar.svg",
    date: "05th April to 07th April",
    Capacity: "20%",
    Price: "$200",
  },
];

export const packagecontent = [
  {
    img: <Package1 stroke="#000" />,
    text: "< 1kg",
    value: "< 1kg",
  },
  {
    img: <Package2 stroke="#000" />,
    text: "3 KG - 10 KG",
    value: "3 KG - 10 KG",
  },
  {
    img: <Package3 stroke="#000" />,
    text: "> 10 KG",
    value: "> 10 KG",
  },
];

export const senderinfo = [
  {
    header: "Name",
    value: "Postier",
  },
  {
    header: "Phone Number",
    value: "+91 9876543210",
  },
  {
    header: "Full Address",
    value: "Vakil New Street, Simmakkal, Madurai",
  },
  {
    header: "Email ID",
    value: "sender@gmail.com",
  },
  {
    header: "Parcel Pickup Location",
    value: "Simmakkal, Madurai",
  },
  {
    header: "Parcel Destination Location",
    value: "Kalavasal, GG Complex, Madurai, India",
  },
  {
    header: "Delivery by",
    value: "Just-In Delivery",
  },
  {
    header: "Parcel Delivery Date",
    value: "17/04/2024",
  },
  {
    header: "Country Name",
    value: "India",
  },
  {
    header: "City Name",
    value: "Madurai",
  },
  {
    header: "Pincode",
    value: "625018",
  },
];

export const receiverInfo = [
  {
    header: "Name",
    value: "Postier Name",
  },
  {
    header: "Mobile Number",
    value: "+91 9876543210",
  },
  {
    header: "Full Address",
    value: "Simmakkal, Madurai, 625018",
  },
  {
    header: "Email ID",
    value: "receiver@gmail.com",
  },
  {
    header: "Country Name",
    value: "India",
  },
  {
    header: "City Name",
    value: "Madurai",
  },
  {
    header: "Pincode",
    value: "625011",
  },
];

export const parcelInfo = [
  {
    title: "Post Title",
    description: "Lorem Ipsum",
  },
  {
    title: "Parcel Description",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    title: "Parcel Height",
    description: "10 Inches",
  },
  {
    title: "Parcel Width",
    description: "50 Inches",
  },
  {
    title: "Parcel Size",
    description: "3 Kg to 10 kg",
  },
  {
    title: "Parcel Images",
    description: "",
  },
];

// SENDER DETAILS PROPOSAL COMPONENT
export const proposalsCardData = [
  {
    name: "Marco",
    rating: 4,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    imgUrl: "/svg/icon/proCard1.svg",
  },
  {
    name: "Hugo",
    rating: 3,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    imgUrl: "/svg/icon/proCard2.svg",
  },
  {
    name: "Brayden",
    rating: 4,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    imgUrl: "/svg/icon/proCard3.svg",
  },
  {
    name: "Carlos",
    rating: 5,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    imgUrl: "/svg/icon/proCard4.svg",
  },
];

// SENDER DETAILS TRACKING COMPONENT
export const trackingCardData2 = [
  {
    name: "Marco",
    rating: 4,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    btnLabel: "$25",
    imgUrl: "/svg/icon/proCard1.svg",
  },
  {
    name: "Hugo",
    rating: 4.5,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    btnLabel: "$23",
    imgUrl: "/svg/icon/proCard2.svg",
  },
  {
    name: "Brayden",
    rating: 3.5,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    btnLabel: "$27",
    imgUrl: "/svg/icon/proCard3.svg",
  },
  {
    name: "Carlos",
    rating: 5,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    btnLabel: "$22",
    imgUrl: "/svg/icon/proCard4.svg",
  },
  {
    name: "Henry",
    rating: 3,
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    btnLabel: "$23",
    imgUrl: "/svg/icon/Henry.svg",
  },
];

export const trackingCardData = [
  {
    postTitle: "Lorem Ipsum",
    parcelDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    imageUrl: "/svg/icon/iPhone.svg",
    imageUrl2: "/svg/icon/iPhone2.svg",
    parcelPickUpLocation: "Simmakkal, Madurai",
    parcelDestinationLocation: "Kalavasal, GG Complex, Madurai, India",
  },
  {
    postTitle: "Lorem Ipsum",
    parcelDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    imageUrl: "/svg/icon/iPhone.svg",
    imageUrl2: "/svg/icon/iPhone2.svg",
    parcelPickUpLocation: "Simmakkal, Madurai",
    parcelDestinationLocation: "Kalavasal, GG Complex, Madurai, India",
  },
  {
    postTitle: "Lorem Ipsum",
    parcelDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    imageUrl: "/svg/icon/iPhone.svg",
    imageUrl2: "/svg/icon/iPhone2.svg",
    parcelPickUpLocation: "Simmakkal, Madurai",
    parcelDestinationLocation: "Kalavasal, GG Complex, Madurai, India",
  },
  {
    postTitle: "Lorem Ipsum",
    parcelDescription:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    imageUrl: "/svg/icon/iPhone.svg",
    imageUrl2: "/svg/icon/iPhone2.svg",
    parcelPickUpLocation: "Simmakkal, Madurai",
    parcelDestinationLocation: "Kalavasal, GG Complex, Madurai, India",
  },
];

// export const senderCardData = [
//     {
//         name: "Marco",
//         rating: 4,
//         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//         imgUrl: "/svg/icon/proCard1.svg",
//     },
//     {
//         name: "Hugo",
//         rating: 3,
//         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//         imgUrl: "/svg/icon/proCard2.svg",
//     },
//     {
//         name: "Brayden",
//         rating: 4,
//         description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
//         imgUrl: "/svg/icon/proCard3.svg",
//     },
// ];

export const mypostcontent = [
  {
    location1: "Simmakkal, Madurai",
    location2: "Kalavasal, GG Complex, Madurai, India",
    date: "06/05/2024",
    time: "12:00 AM",
    amount: "200",
    weight: "50kgs",
    avatars: [
      "/png/avatar1.png",
      "/png/avatar2.png",
      "/png/avatar3.png",
      "/png/avatar4.png",
      "/png/avatar5.png",
    ],
  },
  {
    location1: "Simmakkal, Madurai",
    location2: "Kalavasal, GG Complex, Madurai, India",
    date: "06/05/2024",
    time: "12:00 AM",
    amount: "200",
    weight: "50kgs",
    avatars: [],
  },
  {
    location1: "Simmakkal, Madurai",
    location2: "Kalavasal, GG Complex, Madurai, India",
    date: "06/05/2024",
    time: "12:00 AM",
    amount: "200",
    weight: "50kgs",
    avatars: [],
  },
  {
    location1: "Simmakkal, Madurai",
    location2: "Kalavasal, GG Complex, Madurai, India",
    date: "06/05/2024",
    time: "12:00 AM",
    amount: "200",
    weight: "50kgs",
    avatars: [],
  },
];

export const messagecontent = [
  {
    img: "/png/carouselimg1.png",
    name: "Marco",
    msg: "Are you there?",
  },
  {
    img: "/png/carouselimg2.png",
    name: "Hugo",
    msg: "Hi, How are you?",
  },
  {
    img: "/png/carouselimg3.png",
    name: "Braydon",
    msg: "Hello!",
  },
  {
    img: "/png/carouselimg4.png",
    name: "Carlos",
    msg: "Where?",
  },
  {
    img: "/png/carouselimg5.png",
    name: "Henry",
    msg: "Is this good!?",
  },
  {
    img: "/png/carouselimg5.png",
    name: "Henry",
    msg: "Is this good!?",
  },
];

export const payment = [
  { label: "Initiate Payments", sub: "Initiate payment to Postier" },
  { label: "Payment Stored", sub: "Payment Stored" },
  { label: "Order Completed", sub: "Parcel Sent to the customer" },
  {
    label: "Payment Sent to Postier",
    sub: "Payment Sent to the corresponding postier",
  },
];

export const trackingstep = [
  { label: "Postier Accepted" },
  { label: "Initial Payment" },
  { label: "Parcel Pickup" },
  { label: "Parcel Destination" },
  { label: "Rating & Review" },
];

export const payments = [
  {
    label1: "Postier Payment",
    label2: "$25",
  },
  {
    label1: "Invoice Number",
    label2: "000-253-357-231",
  },
  {
    label1: "Payment Date",
    label2: "29-04-2024",
  },
];

export const tax = [
  {
    label1: "GST (18% Tax)",
    label2: "$7",
  },
  {
    label1: "SGST (18% Tax)",
    label2: "$3",
  },
];

export const notifyContent = [
  {
    img: "/png/avatar1.png",
    text: "Marco has sent you a offer",
  },
  {
    img: "/png/avatar1.png",
    text: "Marco has sent you a message",
  },
  {
    img: "/png/avatar1.png",
    text: "Marco has picked your parcel",
  },
];

// export const parceltype = ['Food Items', 'Fragile', 'Electronics', 'Kitchen Appliances', 'Wooden Furnitures']

export const Customer = [
  {
    image: "/png/sendicon.png",
    content: "Post a Parcel Send Request",
    subcon: "Fill the form to get started",
  },
  {
    image: "/png/tagicon.png",
    content: "Postier will send the offers to you",
  },
  {
    image: "/png/handicon.png",
    content: "Accept a offer from a postier",
  },
  {
    image: "/png/mapicon.png",
    content: "Postier pick up & drop your parcel",
  },
  {
    image: "/png/staricon.png",
    content: "Review & Rate the Postier",
  },
];
export const Images = [
  {
    img: "/png/splash.png",
  },
  {
    img: "/png/icon1.png",
  },
  {
    img: "/png/splash.png",
  },
  {
    img: "/png/splash.png",
  },
];

export const ContentData = () => {
  const { i18 } = useContext(PageContext);
  return [
    {
      title: i18?.NEW?.WHAT_IS_POSTIER || "How do I send a parcel?",
      description: i18?.NEW?.WHAT_IS_POSTIER_CONTENT
        ? i18?.NEW?.WHAT_IS_POSTIER_CONTENT
        : {
            p: [
              i18?.NEW?.WHAT_IS_POSTIER_CONTENT_P1 ||
                "Postier is a smart delivery platform that connects senders, receivers, and travelers (Postiers) who are already on the move.",
              i18?.NEW?.WHAT_IS_POSTIER_CONTENT_P2 ||
                "Instead of relying on traditional couriers, Postier helps people send parcels affordably and securely by leveraging unused luggage space and planned trips.",
            ],
            li: [
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI1 ||
                  "<b>Lower Costs</b> than standard couriers",
              },
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI2 ||
                  "<b>Faster Deliveries</b> with flexible, real-time matching",
              },
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI3 ||
                  "<b>Earn on the Go</b> for travelers by delivering packages",
              },
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI4 ||
                  "<b>Track & Rate</b> every step for trust and safety Postier – Connecting the world, one parcel at a time.",
              },
            ],
          },
    },
    {
      title: i18?.NEW?.HOW_DO_I_EARN || "How do I earn with Postier?",
      description:
        i18?.NEW?.HOW_DO_I_EARN_CONTENT ||
        "You earn by delivering parcels during your planned trips. Senders pay securely through Postier, and your payout is released once the parcel is delivered and confirmed.",
    },
    {
      title: i18?.NEW?.I_GET_PAID || "How do I get paid?",
      description: {
        p: [
          i18?.NEW?.I_GET_PAID_CONTENT_P1 ||
            "Postier offers flexible payout options:",
        ],
        list: [
          {
            img: "/png/card.png",
            label:
              i18?.NEW?.I_GET_PAID_CONTENT_LI1 ||
              "Direct deposit to your credit/debit card via Stripe",
          },
          {
            img: "/png/place.png",
            label:
              i18?.NEW?.I_GET_PAID_CONTENT_LI2 ||
              "Bank transfer through Stripe payout system",
          },
          {
            img: "/png/card.png",
            label:
              i18?.NEW?.I_GET_PAID_CONTENT_LI3 || "Klarna (where supported)",
          },
          {
            img: "/png/mdi_cash.png",
            label:
              i18?.NEW?.I_GET_PAID_CONTENT_LI4 ||
              "Cash on Delivery (COD) or Cash on Pickup (COP) (optional, if the sender selected this method)",
          },
        ],
        desc:
          i18?.NEW?.I_GET_PAID_CONTENT_P2 ||
          "You’ll receive a confirmation email with payment details each time a payout is made.",
      },
    },

    {
      title:
        i18?.NEW?.WHAT_KIND_OF_PARCEL || "What kind of parcels can I carry?",
      description:
        i18?.NEW?.WHAT_KIND_OF_PARCEL_CONTENT ||
        "You can carry standard, fragile, oversized, or temperature-sensitive parcels, depending on your preferences. You can also set a maximum weight per parcel to fit your safety and comfort.",
    },
    {
      title: i18?.NEW?.DO_I_NEED || "Do I need to change my travel plans?",
      description:
        i18?.NEW?.DO_I_NEED_CONTENT ||
        "No. Postier is built for you to earn extra money on trips you’re already making. You just add your route and available space.",
    },
    {
      title: i18?.NEW?.CAN_I_DECLINE || "Can I decline a request?",
      description:
        i18?.NEW?.CAN_I_DECLINE_CONTENT ||
        "Yes. You are free to accept or decline parcel requests. However, frequent cancellations or declines without valid reasons may affect your reliability score.",
    },
    {
      title: i18?.NEW?.IS_INSURANCE || "Is insurance required?",
      description:
        i18?.NEW?.IS_INSURANCE_CONTENT ||
        "Currently, no insurance is required. Senders should ensure parcels are packaged securely. Insurance options will be added in the future.",
    },
    {
      title:
        i18?.NEW?.SUSPICIOUS_CONTENT || "What if I suspect suspicious content?",
      description:
        i18?.NEW?.SUSPICIOUS_CONTENT_CONTENT ||
        "Do not accept or transport suspicious parcels. Immediately report them using Postier’s support system. Your safety comes first.",
    },
    {
      title: i18?.NEW?.DELIVERY_IS_DELAYED || "What if my delivery is delayed?",
      description:
        i18?.NEW?.DELIVERY_IS_DELAYED_CONTENT ||
        "You must inform the sender and receiver right away using Postier’s in-app messaging. Transparency builds trust and helps prevent disputes.",
    },
    {
      title: i18?.NEW?.REVIEW_A_POSTIER || "Can I get reviews as a Postier?",
      description:
        i18?.NEW?.REVIEW_A_POSTIER_CONTENT ||
        "Yes. After successful deliveries, senders and receivers can rate you. A good rating means more trust and visibility on the platform.",
    },
    {
      title: i18?.NEW?.DELETE_TRIP || "Can I delete a trip after posting it?",
      description:
        i18?.NEW?.DELETE_TRIP_CONTENT ||
        "Yes. Trips can be deleted if they have not yet started.  However, frequent deletions or cancellations without valid reasons may affect your reliability score and visibility on the platform.",
    },
    {
      title: i18?.NEW?.HOW_CAN_POSTIER || "How can I be an Postier?",
      description:
        i18?.NEW?.HOW_CAN_POSTIER_CONTENT ||
        "After pickup and delivery QR code confirmation, payouts are processed within 24–48 hours.",
    },
    {
      title: i18?.NEW?.VIEW_MY_EARNINGS || "How Can I View My Earnings?",
      description:
        i18?.NEW?.VIEW_MY_EARNINGS_CONTENT ||
        "Choose 'Express' or 'Same-Day' delivery options when creating your parcel request.",
    },
    {
      title:
        i18?.NEW?.SWITCH_TO_CUSTOMER ||
        "How to switch from Postier to Customer?",
      description:
        i18?.NEW?.SWITCH_TO_CUSTOMER_CONTENT ||
        "Choose 'Express' or 'Same-Day' delivery options when creating your parcel request.",
    },
  ];
};

export const ContentDataSender = () => {
  const { i18 } = useContext(PageContext);
  return [
    {
      title: i18?.NEW?.WHAT_IS_POSTIER || "How do I send a parcel?",
      description: i18?.NEW?.WHAT_IS_POSTIER_CONTENT
        ? i18?.NEW?.WHAT_IS_POSTIER_CONTENT
        : {
            p: [
              i18?.NEW?.WHAT_IS_POSTIER_CONTENT_P1 ||
                "Postier is a smart delivery platform that connects senders, receivers, and travelers (Postiers) who are already on the move.",
              i18?.NEW?.WHAT_IS_POSTIER_CONTENT_P2 ||
                "Instead of relying on traditional couriers, Postier helps people send parcels affordably and securely by leveraging unused luggage space and planned trips.",
            ],
            li: [
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI1 ||
                  "<b>Lower Costs</b> than standard couriers",
              },
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI2 ||
                  "<b>Faster Deliveries</b> with flexible, real-time matching",
              },
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI3 ||
                  "<b>Earn on the Go</b> for travelers by delivering packages",
              },
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI4 ||
                  "<b>Track & Rate</b> every step for trust and safety Postier – Connecting the world, one parcel at a time.",
              },
            ],
          },
    },
    {
      title: i18?.NEW?.CAN_I_TRACK || "Can I track my parcel?",
      description:
        i18?.NEW?.CAN_I_TRACK_CONTENT ||
        "Absolutely! Once you complete the payment for your order, the postier will pick up your parcel. After the pickup is confirmed, you will receive tracking information that will allow you to monitor the status of your shipment in real-time until it reaches its destination.",
    },
    {
      title:
        i18?.NEW?.IS_MY_PARCEL || "What items are prohibited for shipping?",
      description:
        i18?.NEW?.IS_MY_PARCEL_CONTENT ||
        "Prohibited items include, but are not limited to: hazardous materials (e.g., explosives, flammable liquids), perishable goods (without proper packaging), animals, illegal substances, and currency or valuable items such as gold.",
    },
    {
      title: i18?.NEW?.HOW_DO_I_SEND || "How do I send a parcel with Postier?",
      description:
        i18?.NEW?.HOW_DO_I_SEND_CONTENT ||
        "You can send a parcel by creating a shipment request on our platform. Simply enter pickup and drop-off details, parcel size/weight, choose a Postier traveler, and confirm your booking.",
    },
    {
      title:
        i18?.NEW?.WHAT_KIND_OF_PARCELS || "What kind of parcels can I send?",
      description:
        i18?.NEW?.WHAT_KIND_OF_PARCELS_CONTENT ||
        "You can send standard parcels, fragile items, oversized packages, and temperature-sensitive goods, as long as they comply with legal and safety regulations. Hazardous or prohibited items are not allowed.",
    },
    {
      title:
        i18?.NEW?.HOW_IS_THE_DELIVERY ||
        "How is the delivery price calculated?",
      description: {
        p: [
          i18?.NEW?.HOW_IS_THE_DELIVERY_CONTENT ||
            "Prices are calculated based on:",
        ],
        list: [
          {
            label:
              i18?.NEW?.HOW_IS_THE_DELIVERY_CONTENT_LI1 ||
              "Parcel size/weight (volumetric or actual)",
          },
          {
            label:
              i18?.NEW?.HOW_IS_THE_DELIVERY_CONTENT_LI2 ||
              "Distance between pickup and delivery",
          },
          {
            label:
              i18?.NEW?.HOW_IS_THE_DELIVERY_CONTENT_LI3 ||
              "Urgency level (Standard, Express, Same-Day)",
          },
          {
            label:
              i18?.NEW?.HOW_IS_THE_DELIVERY_CONTENT_LI4 ||
              "Delivery type (fragile, oversized, etc.)",
          },
          {
            label:
              i18?.NEW?.HOW_IS_THE_DELIVERY_CONTENT_LI5 ||
              "Discounts for long-distance or heavy parcels",
          },
        ],
      },
    },
    {
      title: i18?.NEW?.HOW_DO_I_PAY || "How do I pay for my delivery?",
      description:
        i18?.NEW?.HOW_DO_I_PAY_CONTENT ||
        "Payments are processed securely via Stripe. You can pay with credit/debit cards, Klarna, or optionally Cash on Delivery (COD) or Cash on Pickup (COP) if available.",
    },
    {
      title: i18?.NEW?.IS_MY_PARCEL_INSURED || "Is my parcel insured?",
      description:
        i18?.NEW?.IS_MY_PARCEL_INSURED_CONTENT ||
        "Currently, insurance cannot be booked directly on the platform. We are working on making insurance options available in the future to provide senders with additional peace of mind.",
    },
    {
      title: i18?.NEW?.HOW_DO_I_TRACK || "How do I track my parcel?",
      description:
        i18?.NEW?.HOW_DO_I_TRACK_CONTENT ||
        "Once your booking is confirmed, you’ll receive a tracking ID. You can follow your parcel in real-time through the Postier platform.",
    },
    {
      title: i18?.NEW?.CAN_I_CANCEL || "How is the delivery price calculated?",
      description: {
        list: [
          {
            label:
              i18?.NEW?.CAN_I_CANCEL_LI1 || "Yes. Cancellation policies apply:",
          },
          {
            img: "/svg/icon/tick.svg",
            label:
              i18?.NEW?.CAN_I_CANCEL_LI2 ||
              "Full refund if cancelled more than 24h before pickup",
          },
          {
            img: "/png/excliam.png",
            label:
              i18?.NEW?.CAN_I_CANCEL_LI3 ||
              "Partial refund if cancelled less than 24h before pickup",
          },
          {
            img: "/svg/icon/err.svg",
            label:
              i18?.NEW?.CAN_I_CANCEL_LI4 ||
              "No refund if delivery has already started or the Postier has arrived at pickup",
          },
        ],
      },
    },
    {
      title:
        i18?.NEW?.MY_POSTIER_CANCLES || "What happens if my Postier cancels?",
      description:
        i18?.NEW?.MY_POSTIER_CANCLES_CONTENT ||
        "If a Postier cancels, you will be fully refunded and can rebook with another traveler.",
    },
    {
      title:
        i18?.NEW?.HOW_DO_I_COMMUNICATE ||
        "How do I communicate with my Postier?",
      description:
        i18?.NEW?.HOW_DO_I_COMMUNICATE_CONTENT ||
        "You can chat directly with your Postier through the secure messaging system in your account dashboard.",
    },
    {
      title:
        i18?.NEW?.CAN_I_LEAVE_A_REVIEW ||
        "Can I leave a review after delivery?",
      description:
        i18?.NEW?.CAN_I_LEAVE_A_REVIEW_CONTENT ||
        "Yes, after your parcel is delivered, you can rate and review the Postier. Reviews help build trust and ensure high-quality deliveries.",
    },
    // {
    //   title:
    //     i18?.NEW?.POSTIERS_GET_PAID ||
    //     "Can I schedule a specific pickup time for my parcel?",
    //   description:
    //     i18?.NEW?.POSTIERS_GET_PAID_CONTENT ||
    //     "Yes, you can schedule a pickup at your convenience when creating a parcel. Enter your preferred date and time, and our postier will collect your parcel.",
    // },
    // {
    //   title:
    //     i18?.NEW?.URGENT_DELIVERY ||
    //     "What packaging should I use for my parcel?",
    //   description:
    //     i18?.NEW?.URGENT_DELIVERY_CONTENT ||
    //     "Use strong and appropriately sized packaging to protect your item during transit. Securely seal the package and add cushioning materials for fragile items.",
    // },
    // {
    //   title: i18?.NEW?.SWITCH_ROLE || "How I can contact Postier?",
    //   description: {
    //     p: [
    //       i18?.NEW?.SWITCH_ROLE_CONTENT_P1 ||
    //         "It's simple! Your price is based on distance (€0.10/km), parcel size/weight, urgency, and you even get discounts for longer trips and larger parcels.",
    //       i18?.NEW?.SWITCH_ROLE_CONTENT_P2 ||
    //         "No hidden fees — just safe, secure, smart delivery.",
    //       `<Image height={22} width={22} src='/svg/icon/frek_icon.svg' alt={'frek_icon'} className='object-contain bg-[#004080] rounded-full' /> ${i18?.NEW?.SWITCH_ROLE_CONTENT_P3}` ||
    //         "<Image height={22} width={22} src='/svg/icon/frek_icon.svg' alt={'frek_icon'} className='object-contain bg-[#004080] rounded-full' /> Estimate your price now on Postier!",
    //     ],
    //   },
    // },
  ];
};

export const ContentDataReceiver = () => {
  const { i18 } = useContext(PageContext);
  return [
    {
      title: i18?.NEW?.WHAT_IS_POSTIER || "How do I send a parcel?",
      description: i18?.NEW?.WHAT_IS_POSTIER_CONTENT
        ? i18?.NEW?.WHAT_IS_POSTIER_CONTENT
        : {
            p: [
              i18?.NEW?.WHAT_IS_POSTIER_CONTENT_P1 ||
                "Postier is a smart delivery platform that connects senders, receivers, and travelers (Postiers) who are already on the move.",
              i18?.NEW?.WHAT_IS_POSTIER_CONTENT_P2 ||
                "Instead of relying on traditional couriers, Postier helps people send parcels affordably and securely by leveraging unused luggage space and planned trips.",
            ],
            li: [
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI1 ||
                  "<b>Lower Costs</b> than standard couriers",
              },
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI2 ||
                  "<b>Faster Deliveries</b> with flexible, real-time matching",
              },
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI3 ||
                  "<b>Earn on the Go</b> for travelers by delivering packages",
              },
              {
                img: "/svg/icon/tick.svg",
                label:
                  i18?.NEW?.WHAT_IS_POSTIER_CONTENT_LI4 ||
                  "<b>Track & Rate</b> every step for trust and safety Postier – Connecting the world, one parcel at a time.",
              },
            ],
          },
    },
    {
      title:
        i18?.NEW?.HOW_WILL_I_KNOW ||
        "How will I know when my parcel is arriving?",
      description:
        i18?.NEW?.HOW_WILL_I_KNOW_CONTENT ||
        "You’ll receive notifications and tracking updates as soon as the parcel is on its way. You can track it in real-time with the provided tracking ID.",
    },
    {
      title: i18?.NEW?.WHAT_DO_I_NEED || "What do I need to do at drop-off?",
      description:
        i18?.NEW?.WHAT_DO_I_NEED_CONTENT ||
        "At delivery, you must present and confirm the QR code or delivery code provided by Postier application. This ensures secure handover and triggers Postier’s payment release.",
    },
    {
      title:
        i18?.NEW?.CAN_I_PARCEL ||
        "Can I inspect the parcel before accepting it?",
      description:
        i18?.NEW?.CAN_I_PARCEL_CONTENT ||
        "Yes. Please inspect your parcel at delivery. If there are issues, contact customer support immediately before confirming receipt.",
    },
    {
      title: i18?.NEW?.DO_I_PAY || "Do I pay anything at delivery?",
      description:
        i18?.NEW?.DO_I_PAY_CONTENT ||
        "No extra payments are required unless you booked Cash on Delivery (COD) or Cash on Pickup (COP). Otherwise, all payments are processed securely upfront.",
    },
    {
      title: i18?.NEW?.PARCEL_IS_DAMAGED || "What if my parcel is damaged?",
      description:
        i18?.NEW?.PARCEL_IS_DAMAGED_CONTENT ||
        "Currently, Postier does not provide built-in insurance. We are working to offer this in the future. For now, please ensure the sender provides secure packaging and photos before shipping. If issues arise, dispute resolution is available.",
    },
    {
      title:
        i18?.NEW?.CANCEL_DELIVERY_RECEIVER ||
        "Can I cancel a delivery as a receiver?",
      description:
        i18?.NEW?.CANCEL_DELIVERY_RECEIVER_CONTENT ||
        "You cannot cancel a delivery directly, but you can coordinate with the sender. Cancellation rules and refunds depend on the sender’s booking.",
    },
    {
      title: i18?.NEW?.LEAVE_FEEDBACK || "Can I leave feedback?",
      description:
        i18?.NEW?.LEAVE_FEEDBACK_CONTENT ||
        "Yes, you can rate and review your delivery experience. Feedback helps ensure trust and quality on Postier.",
    },
  ];
};

export const ProfileAvatar = [
  {
    img: "/png/pavatar1.jpeg",
  },
  {
    img: "/png/pavatar2.jpeg",
  },
  {
    img: "/png/pavatar3.jpeg",
  },
  {
    img: "/png/pavatar4.jpeg",
  },
  {
    img: "/png/pavatar5.jpeg",
  },
  {
    img: "/png/pavatar6.jpeg",
  },
  {
    img: "/png/pavatar7.jpeg",
  },
];

export const Lists = () => {
  const { i18 } = useContext(PageContext);
  const delivery_Cancellation = i18?.DELIVERY_CANCELLATION;
  return [
    {
      logo: "/svg/icon/del01.svg",
      logoHo: "/svg/icon/delHov01.svg",
      name: delivery_Cancellation?.PARCEL_TITLE || "Parcel size",
      desc:
        delivery_Cancellation?.PARCEL_DESC || "(volumetric or actual weight)",
    },
    {
      logo: "/svg/icon/del02.svg",
      logoHo: "/svg/icon/delHov02.svg",
      name: delivery_Cancellation?.DISTANCE_TITLE || "Distance",
      desc:
        delivery_Cancellation?.DISTANCE_DESC ||
        "Distance between pickup and delivery",
    },
    {
      logo: "/svg/icon/del03.svg",
      logoHo: "/svg/icon/delHov03.svg",
      name: delivery_Cancellation?.URGENCY_TITLE || "Urgency",
      desc:
        delivery_Cancellation?.URGENCY_DESC || "(Standard, Express, Same-Day)",
    },
    {
      logo: "/svg/icon/del04.svg",
      logoHo: "/svg/icon/delHov04.svg",
      name: delivery_Cancellation?.DELIVERY_TITLE || "Delivery type ",
      desc:
        delivery_Cancellation?.DELIVERY_DESC ||
        "(fragile, oversized, temperature-sensitive)",
    },
    {
      logo: "/svg/icon/del05.svg",
      logoHo: "/svg/icon/delHov05.svg",
      name: delivery_Cancellation?.FLAT_TITLE || "Flat Price",
      desc:
        delivery_Cancellation?.FLAT_DESC ||
        "Discounts for long distances, heavier parcels, and larger dimensions!",
    },
  ];
};

export const UrgeryMultiplier = () => {
  const { i18 } = useContext(PageContext);
  const delivery_Cancellation = i18?.DELIVERY_CANCELLATION;
  return [
    {
      title: delivery_Cancellation?.STANDARD || "Standard or Schedule",
      img: "/svg/urg02.svg",
      range: "1.0",
      value: delivery_Cancellation?.STANDARD_DESC || "Flexible delivery time",
    },
    {
      title: delivery_Cancellation?.EXPRESS || "Express",
      img: "/svg/urg03.svg",
      range: "1.5",
      value:
        delivery_Cancellation?.EXPRESS_DESC || "Faster than standard, next-day",
    },
    {
      title: delivery_Cancellation?.SAME_DAY || "Same-Day",
      img: "/svg/urg04.svg",
      range: "2",
      value:
        delivery_Cancellation?.SAME_DAY_DESC ||
        "Delivery required within 24 hours",
    },
  ];
};

export const DelType = () => {
  const { i18 } = useContext(PageContext);
  const delivery_Cancellation = i18?.DELIVERY_CANCELLATION;
  return [
    {
      title: delivery_Cancellation?.STANDARD_PARCEL || "Standard Parcel",
      img: "/svg/delType02.svg",
      range: "1.0",
      value:
        delivery_Cancellation?.STANDARD_PARCEL_DESC1 ||
        "Books, Clothes, Electronics",
      desc:
        delivery_Cancellation?.STANDARD_PARCEL_DESC2 ||
        "Regular items that don’t need special care or handling",
    },
    {
      title: delivery_Cancellation?.FRAGILE_ITEMS || "Fragile Items",
      img: "/svg/delType03.svg",
      range: "1.2",
      value:
        delivery_Cancellation?.FRAGILE_ITEMS_DESC1 ||
        "glassware, electronics, Artwork)",
      desc:
        delivery_Cancellation?.FRAGILE_ITEMS_DESC2 ||
        "Items that require careful handling",
    },
    {
      title: delivery_Cancellation?.OVERSIZED_PACKAGES || "Oversized Packages",
      img: "/svg/delType02.svg",
      range: "1.3",
      value:
        delivery_Cancellation?.OVERSIZED_PACKAGES_DESC1 ||
        "Baby strollers, posters",
      desc:
        delivery_Cancellation?.OVERSIZED_PACKAGES_DESC2 ||
        "Bulky items that take up extra space or require effort to move",
    },
    {
      title:
        delivery_Cancellation?.TEMPERATURE_SENSITIVE ||
        "Temperature Sensitive Goods",
      img: "/svg/delType04.svg",
      range: "1.5",
      value:
        delivery_Cancellation?.TEMPERATURE_SENSITIVE_DESC1 || "Food ,medicine ",
      desc:
        delivery_Cancellation?.TEMPERATURE_SENSITIVE_DESC2 ||
        "Items that must be kept within a certain temperature",
    },
  ];
};
