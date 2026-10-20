import GlobalToggle from "@/app/component/globaltoggle";
import {
  ContentData,
  ContentDataReceiver,
  ContentDataSender,
} from "../../../../content";
import { useContext, useState } from "react";
import PageContext from "@/app/providers/pagecontext";
import Image from "next/image";

export default function Section5() {
  const { i18 } = useContext(PageContext);

  const data = [
    i18?.SENDPARCEL?.SENDER || "Sender",
    i18?.POSTIER?.HEADING || "Postier",
    i18?.NEW?.RECEIVER || "Receiver",
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [toggle, setToggle] = useState(0);
  const [activeIndexAcc, setActiveIndexAcc] = useState<any>(null);

  const handleButtonClick = (index: number) => {
    setActiveIndex(index);
  };

  const content =
    toggle === 0
      ? ContentDataSender()
      : toggle === 1
      ? ContentData()
      : ContentDataReceiver();

  const toggleAccordion = (index: number) => {
    setActiveIndexAcc((prev: any) => (prev === index ? null : index));
  };

  const HtmlView = ({ item, screen = "desktop" }: any) => {
    return (
      <div
        className={`${screen == "desktop" ? "scroll-container" : ""} text-sm`}
      >
        {typeof item == "string" ? (
          <p>{item}</p>
        ) : (
          typeof item == "object" &&
          Object.keys(item).length > 0 && (
            <>
              {Object.keys(item).map((key: string, i: number) => (
                <div key={i}>
                  {key == "p" &&
                    item[key].map((data: any, ind: number) => (
                      <div
                        dangerouslySetInnerHTML={{ __html: data }}
                        className="flex gap-2 items-start lg:mb-7 mb-5"
                        key={ind}
                      ></div>
                    ))}
                  {key == "li" && (
                    <ul>
                      {item[key].map((data: any, ind: number) => (
                        <li key={ind} className="flex gap-3 mb-5 items-start">
                          {data?.img && data?.img != "" && (
                            <Image
                              height={24}
                              width={24}
                              src={data?.img}
                              alt={"tick"}
                              className="object-contain bg-[#004080] rounded-full"
                            />
                          )}
                          <div
                            dangerouslySetInnerHTML={{ __html: data?.label }}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                  {key == "list" && (
                    <ul className="list-disc ml-5">
                      {item[key]?.length > 0 &&
                        item[key].map((data: any, ind: number) => (
                          <li key={ind} className="mb-5 ">
                            <div className="flex gap-1 items-start">
                              {data?.img && data?.img != "" && (
                                <Image
                                  height={20}
                                  width={20}
                                  src={data?.img}
                                  alt={"tick"}
                                  className="object-contain rounded-full"
                                />
                              )}
                              <span>{data?.label}</span>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                  {key == "desc" && (
                    <div
                      dangerouslySetInnerHTML={{ __html: item[key] }}
                      className="flex gap-2 items-start lg:mb-7 mb-5"
                    ></div>
                  )}
                </div>
              ))}
            </>
          )
        )}
      </div>
    );
  };

  return (
    <section
      className="sixthsec flex flex-col gap-[30px] bg-white md:py-[60px] md:px-[40px]"
      aria-labelledby="faq-heading"
    >
      <div className="px-6">
        <h2
          id="faq-heading"
          className="text-center text-[40px] font-bold text-black mt-5"
        >
          {i18?.NEW?.FAQ || "Frequently Asked Questions"}
        </h2>
        <p className="text-[17px] text-center mt-[25px] text-black">
          {i18?.NEW?.FAQ_INTRO ||
            "Here are the most frequently asked questions about Postier"}
        </p>
      </div>

      <GlobalToggle
        Tbackground="bg-[#F1F1F1]"
        data={data}
        activeIndex={toggle}
        fnc={(index: number) => {
          setToggle(index);
          setActiveIndex(0);
        }}
      />

      {/* Desktop tab-style layout */}
      <div className="gap-[30px]  justify-center bg-gray-custom p-[30px] rounded-[35px] hidden md:flex">
        <div
          className="p-4 h-[550px] overflow-y-auto md:w-[550px]"
          role="tablist"
          aria-label="FAQ tab switch"
        >
          {content.map((item: any, index: number) => (
            <button
              key={index}
              id={`faq-tab-${index}`}
              role="tab"
              tabIndex={index === activeIndex ? 0 : -1}
              aria-selected={index === activeIndex}
              aria-controls={`faq-panel-${index}`}
              className={`text-start w-full mb-2 p-[30px] rounded-[10px] ${
                index === activeIndex
                  ? "bg-[#004080] text-white font-bold"
                  : "bg-white text-black"
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
              onClick={() => handleButtonClick(index)}
              onKeyDown={(e) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                ) {
                  e.preventDefault();
                  const max = content.length - 1;

                  let newIndex = activeIndex;

                  if (e.key === "ArrowRight") {
                    newIndex = activeIndex === max ? 0 : activeIndex + 1;
                  } else if (e.key === "ArrowLeft") {
                    newIndex = activeIndex === 0 ? max : activeIndex - 1;
                  } else if (e.key === "Home") {
                    newIndex = 0;
                  } else if (e.key === "End") {
                    newIndex = max;
                  }

                  setActiveIndex(newIndex);

                  // Move focus manually
                  setTimeout(() => {
                    const nextTab = document.getElementById(
                      `faq-tab-${newIndex}`
                    );
                    nextTab?.focus();
                  }, 0);
                }
              }}
            >
              {item.title}
            </button>
          ))}
        </div>

        <div
          id={`faq-panel-${activeIndex}`}
          role="tabpanel"
          aria-labelledby={`faq-tab-${activeIndex}`}
          className="flex flex-col gap-5 p-6 border md:w-[550px] md:max-h-[550px] bg-[#004080] rounded-[20px] font-normal text-[#fff] leading-[30px]"
          tabIndex={0}
        >
          {/* <h3 className="text-xl font-bold">{content[activeIndex].title}</h3> */}
          <HtmlView item={content[activeIndex]?.description} />
        </div>
      </div>

      {/* Mobile accordion-style layout */}
      <div className="gap-[30px] justify-center bg-white p-[30px] rounded-[35px] md:hidden">
        <div className="w-full">
          {content.map((item: any, index: number) => (
            <div key={index} className="border-b mb-4">
              <button
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none bg-[#004080] text-[#fff] rounded-[10px] py-[25px]"
                aria-expanded={activeIndexAcc === index}
                aria-controls={`accordion-panel-${index}`}
                id={`accordion-header-${index}`}
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-lg font-semibold flex-1">
                  {item.title}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 transition-transform transform ${
                    activeIndexAcc === index ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {activeIndexAcc === index && (
                <div
                  id={`accordion-panel-${index}`}
                  role="region"
                  aria-labelledby={`accordion-header-${index}`}
                  className="p-4 bg-gray-100 text-gray-800"
                >
                  {/* <h3 className="text-xl font-bold">{item.title}</h3> */}
                  {/* <p className="text-sm">{item.description}</p> */}
                  <HtmlView item={item.description} screen={"mobile"} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
