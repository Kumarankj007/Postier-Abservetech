"use client";

import Image from "next/image";
import Input from "@/app/component/input";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

export default function CmsHeader(props: {
  title?: any;
  subtitle?: string;
  search?: string;
  banner?: string;
}) {
  const {
    title = "How We Calculate Delivery Prices on Postier",
    subtitle = "",
    search = "",
    banner = "",
  } = props;
  const [srch, setSrch] = useState("");
  return (
    <>
      <div className=" bg-[#EFEFEF] mb-[10px]">
        <div className="max-w-[1440px] w-full mx-auto p-4 md:h-[500px] h-[300px] flex flex-col justify-center items-center size-full">
          {banner == "" ? (
            <>
              <p className="font-bold text-[20px] sm:text-[30px] md:text-[50px] text-center">
                {title}
              </p>

              {search != "" && (
                <div className="flex items-center justify-between bg-white rounded-full max-w-[605px] w-full mx-10 xl:px-9 lg:px-6 pl-3 xl:py-7 lg:py-5 py-3 lg:mt-8 mt-6  focus-within:shadow-lg duration-200">
                  <Input
                    value={srch}
                    placeholder={search || "Search"}
                    borderStyle={{borderColor :"transparent !important"}}
                    inputStyle={{padding: "10px", color: "#222"}}
                    className={"text-[17px] font-normal text-[#222]"}
                    onChange={(e) => setSrch(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <IconButton aria-label="Search help" edge="end">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={0.8}
                              stroke="#004080"
                              className="lg:size-[50px] size-[35px]"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                              />
                            </svg>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <Image
              height={300}
              width={300}
              alt="img"
              src={banner}
              className="object-contain size-full mx-auto"
            />
          )}
        </div>
      </div>
      <p
        className="text-center text-[#004080] px-2 md:px-3 md:text-[20px] text-[17px] font-bold"
      >
        {subtitle}
      </p>
    </>
  );
}
