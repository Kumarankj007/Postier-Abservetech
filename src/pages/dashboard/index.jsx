import React, { useState } from "react";
import Card from "@/components/ui/Card";
import useReactQuery from "@/hooks/useReactQuery";
import { APICONSTANT } from "@/components/services/config";
import { useQuery } from "@tanstack/react-query";
import { getApiMethos } from "@/components/services/gobal";
import { icon } from "leaflet";
import AppWebsiteVisits from "@/components/services/appwebsitevisite";
import adminuser from "../../assets/images/svg/adminuser.svg";
import adminparcel from "../../assets/images/svg/adminparcel.svg";
import admincar from "../../assets/images/svg/admincar.svg";
import adminvehicle from "../../assets/images/svg/adminvehicle.svg";
import adminservice from "../../assets/images/svg/adminservice.svg";
import adminearnings from "../../assets/images/svg/adminearnings.svg";

const Dashboard = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["dashboard", APICONSTANT.dashboard],
    queryFn: getApiMethos,
    retry: 0,
  });

  const cardvalue = [
    {
      icon: adminuser,
      title: "Users",
      value: data ? data?.data?.totalRecord?.users : "--",
    },
    {
      icon: adminparcel,
      title: "Parcels",
      value: data ? data?.data?.totalRecord?.parcels : "--",
    },
    {
      icon: admincar,
      title: "Trips",
      value: data ? data?.data?.totalRecord?.trips : "--",
    },
    {
      icon: adminvehicle,
      title: "Vehicle",
      value: data ? data?.data?.totalRecord?.vehicles : "--",
    },
    {
      icon: adminservice,
      title: "Service",
      value: data ? data?.data?.totalRecord?.services : "--",
    },
    {
      icon: adminearnings,
      title: "Admin Earnings",
      value: data ? data?.data?.tripEarning?.admin : "--",
    },
    {
      icon: adminearnings,
      title: "Partner Earnings",
      value: data ? data?.data?.tripEarning?.partner : "--",
    },
    {
      icon: adminearnings,
      title: "Trip Earnings",
      value: data ? data?.data?.tripEarning?.trip : "--",
    },
  ];
  console.log("dashboard", data);
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {cardvalue.map((items, index) => {
          return (
            <div className="flex gap-4 shadow items-center p-4 rounded-[7px]">
              <div className="p-3 bg-[#004080] rounded-full">
                <img
                  src={items.icon}
                  alt="icon"
                  className="w-[30px] h-[30px]"
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[#000] font-[600]">{items?.title}</p>
                <p className="text-[#000] font-[400]">{items?.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      {/* <AppWebsiteVisits
        title="Trips Statistics"
        subheader="CHECKOUT/BOOKED"
        chartLabels={[

        ]}
        chartData={[
          {

          },
        ]}
      /> */}
    </>
  );
};

export default Dashboard;
