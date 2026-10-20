"use client";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import UserStore from "@/app/store/profile";
import RoleStore from "@/app/store/RoleStore";
import TypeStore from "@/app/store/typeStore";
import Image from "next/image";
import Link from "next/link";

import { title } from "process";
import React, { useContext } from "react";

export default function DashboardPage() {
  const { i18 } = useContext(PageContext);
  const { Type } = TypeStore()
  const {RoleSwitch} = RoleStore()
   const  router  = UseLoadingRouter();
  const customer = [
    // {
    //   image: "/png/dollarsign.png",
    //   amount: "$5000",
    //   title: i18?.DASHBOARD?.ADVANCEPAYMENTS || "Advance Payments",
    //   content: i18?.DASHBOARD?.VIEWAP || "View Advance Payments",
    //   url: '/'
    // },
    // {
    //   image: "/png/dollarsign.png",
    //   amount: "$1500",
    //   title: i18?.DASHBOARD?.DUEPAYMENTS || "Due Payments",
    //   content: i18?.DASHBOARD?.VIEWDP || "View Due Payments",
    //   url: '/'
    // },
    // {
    //   image: "/png/vectortick.png",
    //   amount: "No",
    //   title: i18?.DASHBOARD?.PROFILECOMPLETE || "Proscrollbar-hidefile Complete",
    //   content: i18?.DASHBOARD?.COMPLETEDPROFILE || "Complete Your Profile",
    //   url: '/'
    // },
    {
      image: "/svg/icon/user.svg",
      // amount: Type === 'deliverparcel' ? i18?.DASHBOARD?.TRIPS || "Trip" : i18?.DASHBOARD?.POST || 'Post',
      // title: Type === 'deliverparcel' ? i18?.DASHBOARD?.MANAGEYOURTRIPS || "Manage Your Trips" : i18?.DASHBOARD?.MANAGEYOURPOST || "Manage Your Posts",
      // content: Type === 'deliverparcel' ? i18?.DASHBOARD?.MANAGEYOURTRIPS || "Manage Your Trips" : i18?.DASHBOARD?.MANAGEYOURPOST || "Manage Your Posts",
      url: '/accountsettings/profileDetails',
      title: i18?.NEW?.PERSONAL_INFORMATION || 'Personal Information',
      para: i18?.NEW?.INFORMATION || 'Keep your profile up to date for a smoother and safer delivery experience.'
    },
    {
      image: "/svg/icon/file-text.svg",
      // amount: Type === 'deliverparcel' ? i18?.DASHBOARD?.VEHICLE || "Vehicles" : i18?.DASHBOARD?.PROFILE || "Profile",
      // title: Type === 'deliverparcel' ? i18?.DASHBOARD?.MANAGEYOURVEHICLES || "Manage Your Vehicles" : i18?.DASHBOARD?.MANAGEYOURPROFILE || "Manage Your Profile",
      // content: Type === 'deliverparcel' ? i18?.DASHBOARD?.MANAGEYOURVEHICLES || "Manage Your Vehicles" : i18?.DASHBOARD?.MANAGEYOURPROFILE || "Manage Your Profile",
      url: '/accountsettings/documentupload',
      title: i18?.NEW?.VERIFY_DOCUMENTS || 'Verify Documents',
      para:i18?.NEW?.DOCUMENTS || 'To ensure safety and build trust on the platform, we require verified documents from all Postiers.'
    },
    {
      image: "/svg/icon/credit-card.svg",
      // amount: i18?.DASHBOARD?.MESSAGES || "Messages",
      // title: i18?.DASHBOARD?.MESSAGES || "Messages",
      // content: i18?.DASHBOARD?.VIEWMESSAGES || "View Messages",
      url: '/accountsettings/transaction',
      title: i18?.NEW?.PAYMENTS_AND_PAYOUTS || 'Payments & Payouts',
      para: i18?.NEW?.PAYOUTS || 'We make sure your transactions are secure, transparent, and easy to track.'
    },
    // {
    //   image: "/png/vectortick.png",
    //   amount: "$5000",
    //   title: i18?.DASHBOARD?.MYPROFILE || "My Profile",
    //   content: i18?.DASHBOARD?.MANAGEPROFILEINFO || "Manage Your Profile Informations",
    //   url: '/'
    // },
    {
      image: "/svg/icon/bell (1).svg",
      // amount: i18?.HOMEPAGE?.NAVBAR?.ACCSET || "Account Settings",
      // title: i18?.DASHBOARD?.SETTINGS || "Settings",
      // content: i18?.DASHBOARD?.VIEWSETTINGS || "View Settings",
      url: '/notification',
      title: i18?.NEW?.NOTIFICATIONS || 'Notifications',
      para:i18?.NEW?.NEW_NOTIFICATIONS || 'Stay informed every step of the way.'
    },
    {
      image: "/svg/icon/starvaccum.svg",
      // amount: i18?.HOMEPAGE?.NAVBAR?.ACCSET || "Account Settings",
      // title: i18?.DASHBOARD?.SETTINGS || "Settings",
      // content: i18?.DASHBOARD?.VIEWSETTINGS || "View Settings",
      url: '/accountsettings/reviews/',
      title: i18?.NEW?.REVIEW || 'Ratings & Reviews',
      para: i18?.NEW?.REVIEWS || 'Your feedback helps build a safer, more reliable delivery community.'
    },
    // {
    //   image: "/svg/icon/help-circle.svg",
    //   // amount: i18?.HOMEPAGE?.NAVBAR?.ACCSET || "Account Settings",
    //   // title: i18?.DASHBOARD?.SETTINGS || "Settings",
    //   // content: i18?.DASHBOARD?.VIEWSETTINGS || "View Settings",
    //   // url: '/accountsettings'
    //   title: i18?.NEW?.HELP_CENTER || 'Help Center',
    //   para: i18?.NEW?.HELP||'We’re here to support you at every step.'
    // },
    ...(RoleSwitch === 'postier' ? [{
      image: "/svg/icon/globe.svg",
      url: '/accountsettings/manage-vehicles/',
      title: i18?.NEW?.MANAGE_VEHICLE || 'Manage Vehicle',
      para: i18?.NEW?.VEHICLE ||  'Add your vehicle details to get started with your journey.'
    }] : [])
  ];

  return (
    // <div className="p-[80px]">
    //   <div className="bg-[#fff] ">   
    // <h1 className="text-center text-[40px] font-[600] text-[#000]">
    //   {i18?.DASHBOARD?.HEADING || "Dashboard"}
    // </h1>

        // <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-[30px]">
        //   {customer.map((data, index) => (
        //     <div className="border border-1 rounded-[10px] p-5 border-[#737373] mb-[40px]" key={index}>
        //       <div className="flex justify-between items-center flex-wrap">
        //         <p className="text-[#004080] text-[30px] font-[700] mb-3">{data.amount}</p>
        //         <Image src={data.image} alt='img'  width={40} height={40}/>
        //       </div>
        //       <h3 className="text-[#000000] text-[17px] font-[700] mb-3">{data.title}</h3>
        //       <Link href={data.url} className="text-[#004080] decoration-solid text-[17px] font-[400] underline" prefetch>{data.content}</Link>
        //     </div>
        //   ))}
        // </div>
      // </div>
    // </div>
    <div className="max-w-[1400px] mx-auto px-[20px] my-[40px] md:my-[80px]">
      <h1 className="text-start text-[25px] md:text-[40px] font-[600] text-[#000]">
        { i18?.HOMEPAGE?.NAVBAR?.ACCSET || "Account Settings"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-[40px] gap-x-[30px] lg:gap-x-[60px] mt-[30px]">
          {customer.map((data:any, index) => (
            <div className="border border-1 rounded-[30px] p-[20px] lg:p-[30px]  border-btncolor cursor-pointer" 
            key={index}
             onClick={()=>router.push(data?.url)}>
             <div className="flex flex-col gap-4">
             <Image src={data.image} alt='img'  width={40} height={40}/>
             <p className="text-[17px] font-[700] leading-[22px]">{data.title}</p>
             <p className="text-[17px] font-[400] leading-[22px] ">{data.para}</p>
             </div>
            </div>
          ))}
        </div>
    </div>
  );
}
