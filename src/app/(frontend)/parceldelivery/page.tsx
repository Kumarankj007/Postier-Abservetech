"use client";
/* eslint-disable react/no-unescaped-entities */

import React, { useState } from "react";
import Button from "@/app/component/button";
import Input from "@/app/component/input";
import Select from "@/app/component/select";
import Carousel from "@/app/component/carousel";
import { carouselData } from "../../../../content";
import Image from "next/image";

export default function HomePage() {
  const [clickdata, setClickData] = useState("sendparcel");
  return (
    <div className="">
      <div className=" bg-center h-screen background-image">
        <div className="m-auto p-5">
          <div className=" mt-[5%] flex flex-col align-center justify-center gap-10 ">
            <p className="font-bold text-xl sm:text-3xl md:text-5xl  text-center leading-[30px] sm:leading-[45px] md:leading-[65px]">
              Send, Deliver a Parcel
              <br /> From Anywhere to Anyplace
            </p>
            <p className="text-center font-normal text-xs md:text-base	leading-8">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has
              <br />
              been the industry's standard dummy text ever since the 1500s.
            </p>
            <div className="flex justify-center">
              <div className="bg-togglebg rounded-full flex  shadow ">
                <div
                  className={
                    clickdata === "sendparcel"
                      ? "font-medium text-sm leading-5 bg-btncolor px-7 py-5 rounded-full text-[#fff] cursor-pointer"
                      : "font-medium text-sm leading-5 px-7 py-5 rounded-full pr-3 cursor-pointer"
                  }
                  onClick={() => setClickData("sendparcel")}
                >
                  Send a Parcel
                </div>
                <div
                  className={
                    clickdata === "deliverparcel"
                      ? "font-medium text-sm leading-5 bg-btncolor px-7 py-5 rounded-full text-[#fff] cursor-pointer"
                      : "font-medium text-sm leading-5 px-7 py-5 rounded-full pl-3 cursor-pointer"
                  }
                  onClick={() => setClickData("deliverparcel")}
                >
                  Deliver a Parcel
                </div>
              </div>
            </div>
            <div className="flex  justify-center">
              <div className=" flex flex-col md:flex md:flex-row bg-togglebg rounded-[31px] gap-7 md:gap-5 shadow px-8 py-4 ">
                <div className="flex flex-col justify-start  gap-2">
                  <label htmlFor="pickup-location" className="font-medium">
                    Where do you send parcel from?
                  </label>
                  <Input
                    id="pickup-location"
                    placeholder="Pickup Location"
                    className="outline-none text-[14px] text-[#000000] placeholder-black"
                  />
                </div>
                <hr className="border-l  border-[#999999] h-full" />
                <div className="flex flex-col justify-start  md:gap-2 border-y-[#fff]">
                  <label htmlFor="destination-location" className="font-medium">
                    Choose your parcel destination
                  </label>
                  <Input
                    id="destination-location"
                    placeholder="Destination Location"
                    className="outline-none text-[14px] text-[#000000] placeholder-black"
                  />
                </div>
                <hr className="border-l border-[#999999] h-full" />
                <div className="flex flex-col justify-start gap-2">
                  <label htmlFor="delivery-by" className="font-medium">
                    Delivery Parcel By
                  </label>
                  <Select
                    id="delivery-by"
                    className="outline-none flex justify-start bg-transparent text-[14px] text-[#000000] w-[70%]"
                  >
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </Select>
                </div>
                <div>
                  <Button className="bg-btncolor border px-8 py-4 text-[#fff] rounded-full">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-[30px] flex flex-col gap-5">
        <h2 className="font-bold text-[40px] leading-10	mt-[50px]">
          Trips in the city
        </h2>
        <p className="font-normal text-base	">
          Here is the list of postiers traveling within your current location
        </p>
        <Carousel data={carouselData} />
      </div>

      <div className="p-[30px] flex flex-col gap-5">
        <h2 className="font-bold text-[40px] leading-10">
          Trips outside the city
        </h2>
        <p className="font-normal text-base	">
          Here is the list of postiers traveling within your current location
        </p>
        <Carousel data={carouselData} />
      </div>
    </div>
  );
}
