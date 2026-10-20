import Image from "next/image";
import React, { useState } from "react";
import TooltipComp from "./tooltip";
import PopoverComponent from "./popover";

function ContentTooptip({ value }: any) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  // console.log(value?.heading, "value?.heading");
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <div className="pl-[10px]">
        <Image
          onClick={handleClick}
          width={1000}
          height={1000}
          className="w-[20px] h-[20px] cursor-pointer object-contain"
          src="/svg/icon/information_icon.svg"
          alt="img"
        />
      </div>
      <PopoverComponent
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        width="600px"
      >
        <div className={(value?.sm ? "gap-2" : "gap-4") + " p-5 flex flex-col"}>
          <div className={"flex gap-2"}>
            {value?.headImg && value?.headImg != "" && (
              <Image
                width={1000}
                height={1000}
                className="w-[20px] h-[20px] cursor-pointer object-contain"
                src={value?.headImg}
                alt="img"
              />
            )}
            {value?.heading && (
              <h3 className="text-[18px] font-bold">{value?.heading}</h3>
            )}
          </div>
          {value?.para && (
            <div className="flex flex-col gap-4">
              <p className="">{value?.para}</p>
            </div>
          )}
          {value?.fname && (
            <div className="flex flex-col gap-4">
              <p className="">{value?.fname}</p>
            </div>
          )}
          {value?.lname && (
            <div className="flex flex-col gap-4">
              <p className="">{value?.lname}</p>
            </div>
          )}
          {value?.list?.map((item: any) => {
            return (
              <div key={item} className="flex flex-col gap-4">
                <li
                  className={(value?.sm ? "mb-1" : "mb-4") + " leading-[20px] "}
                >
                  {item}
                </li>
              </div>
            );
          })}
          {value?.footer1 && <p className="mb-4">{value?.footer1}</p>}

          <div className={"flex gap-2"}>
            {value?.footer2Img && value?.footer2Img != "" && (
              <Image
                width={1000}
                height={1000}
                className="w-[20px] h-[20px] cursor-pointer object-contain"
                src={value?.footer2Img}
                alt="img"
              />
            )}
            {value?.footer2 && <p>{value?.footer2}</p>}
          </div>
        </div>
      </PopoverComponent>
    </div>
  );
}

export default ContentTooptip;
