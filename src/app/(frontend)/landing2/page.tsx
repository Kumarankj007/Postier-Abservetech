"use client";

import Image from "next/image";
import React, { useState } from "react";

const customer = [
  {
    number: "1",
    content: "Become a member",
    subcon: "Use your email and password to sign in or sign up.",
  },
  {
    number: "2",
    content: "Verify your account",
    subcon:
      "Before shipments can be delivered to or collected from your pickup relay, your identity must be verified. After registration, go to verify my account, enter your contact details and your primary address and start the verification process.",
  },
  {
    number: "3",
    content: "Accept shipment",
    subcon:
      "After your account has been successfully verified, you can enter your opening hours in your personal area. Your address will then appear in the search. Afterwards, you can drop off shipments during the opening hours.",
  },
  {
    number: "4",
    content: "Shipment delivery",
    subcon:
      "As soon as shipments are delivered to your pickup relay, the addressee will be informed. The addressee can either be the recipient or one of our posties. The item can be delivered on presentation of the tracking number after verification of the person's identity.",
  },
];

export default function LandingPage2() {
  return (
    <div className="">
      <div className="bg-center h-screen background-image-landingnew flex flex-wrap">
        <div className="m-auto p-5">
          <div className="flex flex-col align-center justify-center gap-10 flex-wrap items-center">
            <p className="font-bold text-xl sm:text-3xl md:text-5xl  text-center leading-[30px] sm:leading-[45px] md:leading-[65px] text-white">
              Postier for Business
            </p>
            <p className="font-[500] text-xl sm:text-3xl md:text-[17px]  text-center leading-[30px] sm:leading-[45px] md:leading-[25px] text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore<br></br> et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut<br></br> aliquip ex ea commodo consequat.
            </p>

            <button className="bg-[#004080] w-[180px] text-[#fff] p-5 rounded-[5px]">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <div className="secondsec md:my-[80px] md:mx-[40px] my-[20px] mx-[20px]">
        <h1 className="text-center text-[40px] font-[600]">
          Collect and deliver consignments as traders <br></br>
          or register and operate a pickup relay
        </h1>
        <p className="text-[17px] text-center mt-[15px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod <br></br>
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="flex justify-between items-center flex-wrap md:px-[160px] mt-[60px]">
          <Image
            width={20}
            height={20}
            src="/png/marketing.png"
            className=""
            alt="img"
          />
          <div className="p-5">
            <h1 className="text-[30px] font-[600] mb-4">
              You want to register a <br></br>
              pickup relay as a trader?
            </h1>
            <p className="leading-[30px] md:w-[500px]">
              Become a member and verify your account. Enter your main address,
              which will serve as a collection point or pickup-relay, and define
              your opening hours. For a fee, shipments will be delivered or
              collected at your pickup relay.
            </p>
          </div>
        </div>
      </div>

      <section className="thirdsec md:py-[50px] py-[60px] bg-[#000]">
        <h1 className="text-center text-[40px] font-[600] text-[#fff]">
          How to register for Postier <br></br>
          for business?
        </h1>
        <p className="text-[17px] text-center mt-[15px] text-[#fff]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod <br></br>
          tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="md:px-[160px] mt-[60px] md:pb-[80px] mx-5">
          {customer.map((data, index) => (
            <div
              className={`${
                index === 1 || index === 3
                  ? "md:items-end md:justify-end"
                  : "md:items-start md:justify-start"
              } justify-center flowsec relative flex`}
              key={index}
            >
              <div className="md:w-[320px] flex justify-center items-center flex-wrap flex-col">
                <p className="w-[100px] h-[100px] rounded-[50%] text-[#000] bg-[#fff] flex items-center justify-center text-[30px] font-[600]">
                  {data.number}
                </p>
                <h2 className="text-[#fff] text-[30px] font-[700] mt-4">
                  {data.content}
                </h2>
                <p className="text-[#fff] text-center text-[17px] font-[400] mt-4 leading-[35px]">
                  {data.subcon}
                </p>
              </div>
              <div className={`${index === 1 ? "flow2" : "flow"}`}></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
