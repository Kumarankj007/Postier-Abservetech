"use client";
import React from "react";
import Image from "next/image";
import UseLoadingRouter from "../hooks/useLoadingRoutes";

export default function Header() {
  const router = UseLoadingRouter();
  return (
    <div>
      <div className="w-full sticky top-0 bg-[#fff] z-[999] shadow-md">
        {
          <div className="px-10  flex justify-between w-full shadow-shadowbox ">
            <Image
              width={100}
              height={100}
              src="/svg/postier.svg"
              alt=""
              priority
              aria-hidden="true"
              onClick={() => router.push("/")}
              className="cursor-pointer"
            />
          </div>
        }
      </div>
    </div>
  );
}
