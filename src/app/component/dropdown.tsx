import React, { useRef, useState } from "react";
import PopoverComponent from "./popover";
import Button from "./button";
import { useSearchParams } from "next/navigation";
import { convertFileToBase64 } from "@/utils";
import Store from "../store/store";
import Image from "next/image";

export default function DropDown(props: any) {
  const { setCON64File, CON64File } = Store();
  const fileInputRef: any = useRef(null);
  const searchParams = useSearchParams();
  const {
    img,
    data,
    text,
    className,
    Width,
    ImgHeight,
    ImgWidth,
    img2,
    children,
  } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const base64String = await convertFileToBase64(file);
        // console.log("Base64 String:", base64String);
        setCON64File(base64String);
      } catch (error) {
        console.error("Error converting file:", error);
      }
    }
  };
  // console.log("CON64File", CON64File);
  const triggerFileInputClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <div className={className} onClick={handleClick}>
        {img && (
          <Image
            width={ImgWidth || 15}
            height={ImgWidth || 15}
            src={img}
            alt="Filter"
          />
        )}
        {text}
        {img2 && (
          <Image
            width={ImgHeight || 15}
            height={ImgHeight || 15}
            src={img2}
            alt="Filter"
          />
        )}
      </div>
{data.length > 0 && (

      <PopoverComponent
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        width={Width ? Width : "200px"}
      >
        {!children
          ? Array.isArray(data) &&
            data.map((item: any, index: any) => (
              <div
                key={index}
                className={
                  searchParams.get("mode") === item?.mode
                    ? "p-2 border-b border-[#B7B7B7] bg-btncolor text-center cursor-pointer text-[#fff]"
                    : "p-2 border-b border-[#B7B7B7] text-center cursor-pointer"
                }
              >
                <p
                  className="p-3 font-normal text-[15px] leading-[16px]"
                  onClick={async () => {
                    if (item.text === "Send a file") {
                      triggerFileInputClick();
                    } else {
                      await item.fnc();
                    }
                    setAnchorEl(null);
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))
          : children}
      </PopoverComponent>
)}
      <input
        type="file"
        aria-label="Upload file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}
