import Image from "next/image";
import React, { useRef } from "react";

export default function GlobalToggle(props: {
  Tbackground?: string;
  shadow?: boolean;
  data: any[];
  fnc: (index: number) => void;
  activeIndex?: number;
  delivery?: Boolean;
}) {
  const {
    Tbackground = "bg-[#fff]",
    shadow = false,
    data,
    fnc,
    activeIndex = false,
    delivery = false,
  } = props;

  // Find the focused item's ref and scroll into view
  const itemRefs = useRef(new Map());
  const handleScroll = (index: number) => {
    const focusedElement = itemRefs.current.get(index);
    if (focusedElement) {
      focusedElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  };
  return (
    <div className="flex justify-center overflow-visible">
      <div
        className={`${Tbackground} flex gap-[15px] p-2 overflow-auto scroll-container mx-auto ${
          delivery
            ? "rounded-3xl gap-[20px]"
            : "max-h-64 rounded-full gap-[15px] "
        } `}
        role="tablist"
        aria-label="Toggle options"
      >
        {Array.isArray(data) &&
          data.map((items: any, index: number) => {
            return (
              <div
                key={index}
                className={`min-h-[45px] flex items-center text-center flex-wrap gap-[15px] px-5 whitespace-nowrap  cursor-pointer duration-200 ${
                  delivery
                    ? "rounded-3xl min-w-[200px] max-w-[250px] flex-1 flex-col md:p-5 p-3 gap-[10px] shadow-[0_0_8px_0.00001px_grey] border border-[#004080] hover:shadow-none"
                    : `rounded-full ${shadow ? "shadow-md" : ""}`
                } ${
                  activeIndex === index
                    ? "font-bold text-md bg-btncolor text-[#fff] shadow-none "
                    : "font-medium text-md text-[#222]"
                }`}
                ref={(el) => {
                  itemRefs.current.set(index, el);
                }}
                onClick={() => {
                  fnc(index);
                  handleScroll(index);
                }}
                role="tab"
                aria-selected={activeIndex === index}
                tabIndex={0}
              >
                {typeof items == "string" && !delivery ? (
                  items
                ) : (
                  <>
                    <Image
                      width={500}
                      height={500}
                      className="md:w-[50px] w-[40px] md:h-[50px] h-[40px] duration-200"
                      src={activeIndex == index ? items.logoHo : items.logo}
                      alt={items.logo}
                    />
                    <h2 className="md:text-[24px] text-[20px] whitespace-break-spaces">{items.name}</h2>
                    <p className="w-full font-normal text-wrap md:text-[16px] text-[14px]">
                      {items.desc}
                    </p>
                  </>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
