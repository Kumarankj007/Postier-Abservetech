import React, { useContext, useState, useEffect } from "react";
import Store from "@/app/store/store";
import Button from "../button";
import PageContext from "@/app/providers/pagecontext";
import fallback from "../dictionaries/fallback_translate.json";
import Image from "next/image";
import BpCheckbox from "../checkbox";
import { getCookie, setCookie } from "@/utils";
import { SubTitle } from "../subTtlFont";

function CookieModal() {
  const { setModal } = Store();
  const { i18 } = useContext(PageContext);
  const cookie = {
    TITLE: i18?.COOKIE?.TITLE || "Postier Uses Cookies",
    PRIVACY: i18?.COOKIE?.PRIVACY || "We Respect Your Privacy",
    DESC:
      i18?.COOKIE?.DESC ||
      "At Postier, we do not use any third-party cookies. We only use a strictly necessary authentication cookie to keep you securely logged in while using our platform. This cookie ensures your session is safe and private.",
    TERMS: [
      i18?.COOKIE?.TERMS_1 || "No tracking",
      i18?.COOKIE?.TERMS_2 || "No marketing cookies",
      i18?.COOKIE?.TERMS_3 || "No third-party sharing",
    ],
    OK: i18?.COOKIE?.OK ||  "OK",
    HIDDEN: i18?.COOKIE?.HIDDEN ||  "Hidden",
    ALL_COOKIES: i18?.COOKIE?.ALL_COOKIES ||  "Accept All Cookies",
    SELECTED_COOKIES: i18?.COOKIE?.SELECTED_COOKIES ||  "Accept Selected Cookies",
    STAYYOURS: i18?.COOKIE?.STAYYOURS ||  "You’re always in control — and your data stays yours.",
    COOKIE_SETTINGS: {
      TITLE: i18?.COOKIE?.COOKIE_SETTINGS_TITLE ||  "Change Cookie Settings",
      TYPES: [
        {
          ID: 1,
          TYPE: i18?.COOKIE?.COOKIE_SETTINGS_TYPE_1 ||  "Functional & Analytical Cookies",
          DESC: i18?.COOKIE?.COOKIE_SETTINGS_TYPE_1_DESC ||  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
        },
        {
          ID: 2,
          TYPE: i18?.COOKIE?.COOKIE_SETTINGS_TYPE_2 ||  "Marketing Cookie For Performance",
          DESC: i18?.COOKIE?.COOKIE_SETTINGS_TYPE_2_DESC ||  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
        },
        {
          ID: 3,
          TYPE: i18?.COOKIE?.COOKIE_SETTINGS_TYPE_3 ||  "Marketing cookies for performance, advertisements, and social media",
          DESC: i18?.COOKIE?.COOKIE_SETTINGS_TYPE_3_DESC ||  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
        },
      ],
    },
  };

  // state:
  const [step, setStep] = useState<number>(1);
  const [activeIndexAcc, setActiveIndexAcc] = useState<any>(0);
  const [selectedTypes, setSelectedTypes] = useState([
    cookie?.COOKIE_SETTINGS?.TYPES[0].ID || 1,
  ]);

  useEffect(() => {
    const saved = getCookie("userSelection");
    if (saved) {
      const ids = saved
        .split("-")
        .map((d: string) => Number(d))
        .filter((n) => !isNaN(n));
      if (ids.length > 0) setSelectedTypes(ids);
    }
  }, []);


  // fonts:
  const pFont =
    "font-normal sm:text-[17px] text-[15px] sm:leading-loose leading-relaxed text-[#000]";
  const HeadFont = "font-bold md:text-[20px] text-[18px] text-[#222222]";

  const toggleAccordion = (index: number) => {
    setActiveIndexAcc((prev: any) => (prev === index ? null : index));
  };

  const handleCheckboxChange = (ind: number) => {
    setSelectedTypes((pre) =>
      selectedTypes.includes(ind)
        ? selectedTypes.filter((t) => t !== ind)
        : [...pre, ind]
    );
  };

  const handleCookie = (type?: string) => {
    const id: number[] = cookie?.COOKIE_SETTINGS?.TYPES.map((data: any) => {
      return data.ID;
    });
    if (type == "all") {
      setCookie("userSelection", id.join("-"), 365);
    } else {
      setCookie("userSelection", selectedTypes.join("-"), 365);
    }
    // console.log(
    //   getCookie("userSelection")
    //     ?.split("-")
    //     .map((data: any) => Number(data)),
    //   "userSelection"
    // );
    setModal("");
  };

  return (
    <div className="flex flex-col gap-6 justify-center">
      {/* title */}
      <div className="flex gap-5 items-center sm:p-8 p-5 shadow-md">
        {step == 2 && (
          <div onClick={() => setStep(1)} className="p-2">
            <div className="p-[6px] border-b-2 border-l-2 rotate-45 border-[#000]" />
          </div>
        )}
        <p className={`${HeadFont} `}>
          {step == 1
            ? cookie?.TITLE
            : cookie?.COOKIE_SETTINGS?.TITLE || "Postier Uses Cookies"}
        </p>
      </div>
      {/* content */}
      <div className="sm:px-8 px-5">
        {step == 1 ? (
          <>
            <SubTitle
              title={cookie?.PRIVACY}
              img="/svg/icon/cookie.svg"
              subTtlFont={pFont}
            />
            <p className={`${pFont} sm:-mt-4 sm:mb-0 mb-3`}>{cookie?.DESC}</p>
            {cookie?.TERMS.length > 0 && (
              <ul>
                {cookie?.TERMS.map((item: string, i: number) => (
                  <li key={i}>
                    <SubTitle
                      title={item}
                      img="/svg/icon/bluetick.svg"
                      subTtlFont={pFont}
                    />
                  </li>
                ))}
              </ul>
            )}
            <p className={`${pFont} sm:-mt-4`}>{cookie?.STAYYOURS}</p>
          </>
        ) : (
          cookie?.COOKIE_SETTINGS?.TYPES?.length > 0 &&
          cookie?.COOKIE_SETTINGS?.TYPES?.map((item: any, i: number) => (
            <div
              key={i}
              className={`${
                i != cookie?.COOKIE_SETTINGS?.TYPES.length - 1 && "border-b"
              } border-black`}
            >
              <div className={`flex gap-3 ${i == 0 && "opacity-55"}`}>
                <BpCheckbox
                  checked={selectedTypes.includes(item?.ID)}
                  onChange={() =>
                    i != 0
                      ? handleCheckboxChange(item?.ID)
                      : alert(
                          "Mandatory - can not be deselected. " + item?.DESC
                        )
                  }
                />
                <button
                  className="w-full flex justify-between items-center text-left focus:outline-none text-[#000] rounded-[10px] md:py-[25px] py-5"
                  aria-expanded={activeIndexAcc === i}
                  aria-controls={`accordion-panel-${i}`}
                  id={`accordion-header-${i}`}
                  onClick={() => toggleAccordion(i)}
                >
                  <span className={`${pFont}`}>{item.TYPE}</span>
                  <div
                    className={`p-1 border-b-2 border-l-2 duration-300 ${
                      activeIndexAcc === i ? "rotate-[135deg]" : "-rotate-45"
                    } border-[#000]`}
                  />
                </button>
              </div>
              {activeIndexAcc === i && (
                <p className={`${pFont} mb-5`}>{item?.DESC}</p>
              )}
            </div>
          ))
        )}
      </div>
      {/* button */}
      <div className="flex flex-wrap sm:justify-start justify-center gap-3 sm:p-8 p-5 shadow ">
        <Button
          className={`${
            step == 1 ? "px-12" : "px-6"
          } py-3 sm:w-auto w-full rounded-full bg-btncolor text-[#fff] ${pFont}`}
          // onClick={() => (step == 1 ? setStep(2) : handleCookie("all"))}
          onClick={() => handleCookie("all")}
        >
          {step == 1 ? cookie?.OK : cookie?.ALL_COOKIES || "OK"}
        </Button>
        {step == 2 && (

        <Button
          onClick={() => handleCookie()}
          className={`border border-btncolor px-6 py-3 sm:w-auto w-full rounded-full text-btncolor ${pFont}`}
        >
          {cookie?.SELECTED_COOKIES || "Accept Selected Cookies"}
          {/* {step == 1 ? cookie?.HIDDEN : cookie?.SELECTED_COOKIES || "Accept Selected Cookies"} */}
        </Button>
        )}
      </div>
    </div>
  );
}

export default CookieModal;
