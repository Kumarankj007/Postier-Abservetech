/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import React, { useContext, useEffect, useMemo } from "react";
import PageContext from "../providers/pagecontext";
import Image from "next/image";
import DropDown from "./dropdown";
import { getCookie, setCookie } from "@/utils";
import LangStore from "../store/language";
import { getDictionary } from "./dictionaries";
import Store from "../store/store";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { i18, setI18 } = useContext(PageContext);
  const { Languages, FetchLanguages } = LangStore();
  const {setModal} = Store()
  const language = getCookie("NEXT_LOCALE");
  const lang = getCookie("NEXT_LANG") || "English";
  const handleTranslate = async (lang: any, text: any) => {
    setCookie("NEXT_LOCALE", lang, 60);
    setCookie("NEXT_LANG", text, 60);
    const dict = await getDictionary(lang)
    setI18(dict);
    // window.scrollTo({ top: 0, behavior: "smooth" });
    // window.location.reload();
  };
  // console.log(lang, 'lang')
  const LanguageData = useMemo(() => {
    const data =
      Array.isArray(Languages) &&
      Languages.map((items: any, index: any) => {
        return {
          text: items?.name,
          fnc: () => handleTranslate(items?.indexName, items?.name),
        };
      });
    return data;
  }, [Languages]);
  useEffect(() => {
    FetchLanguages();
  }, [FetchLanguages]);
  // console.log("lang", LanguageData);
  return (
    <footer className="bg-gray-200 text-gray-800 p-6 mt-6 py-10 md:py-5">
      {/* <div className="container md:mx-auto md:flex md:justify-between md:items-start md:flex-wrap"> */}
      <div className="container mx-auto md:flex md:justify-between md:items-start md:flex-wrap text-center md:text-left">
        <div className="mb-6">
          <nav aria-label="Quick Links" className="mb-6">
            <h2 className="text-lg font-bold  mb-6">
              {i18?.FOOTER?.QUICKLINKS?.HEADING || "Quick Links"}
            </h2>
            <ul className="text-sm font-normal ">
              {/* <li className="mb-3">
                                <Link href="#">
                                    {i18?.FOOTER?.QUICKLINKS?.TRACKYOURPACKAGE ||
                                    "Track Your Package"}
                                    </Link>
                                    </li> */}
              <li className="mb-3">
                <Link href="/trackingpage">
                  {i18?.FOOTER?.QUICKLINKS?.TRACKYOURPACKAGE ||
                                        "Track Your Package"}
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/createparcel">
                  {i18?.FOOTER?.QUICKLINKS?.SENDAPARCEL || "Send a parcel"}
                </Link>
              </li>
              <li className="mb-3">
                <Link href="/createtrip">
                  {i18?.FOOTER?.QUICKLINKS?.DELIVERAPARCEL ||
                    "Deliver a parcel"}
                </Link>
              </li>



              {/* <li className="mb-3">
                                <Link href="#">
                                    {i18?.FOOTER?.QUICKLINKS?.NEARBYPOSTIER ||
                                        "Nearby Postier"}
                                </Link>
                            </li> */}
              <li className="mb-3">
                <Link href="/myrequest">
                  {i18?.FOOTER?.QUICKLINKS?.SHIPMENTREQUESTS ||
                    "Shipment Requests"}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold  mb-6">
            {i18?.FOOTER?.LEGAL?.HEADING || "Legal"}
          </h3>
          <ul className="text-sm font-normal ">
            <li className="mb-3">
              <Link href="/cms/privacy_policy">
                {i18?.FOOTER?.LEGAL?.PRIVACYPOLICY || "Privacy Policy"}
              </Link>
            </li>
            {/* <li className="mb-3">
                            <Link href="#">
                                {i18?.FOOTER?.LEGAL?.REFUNDPOLICY || "Refund Policy"}
                            </Link>
                        </li> */}
            <li className="mb-3">
              <Link href="/cms/terms_condition">
                {i18?.FOOTER?.LEGAL?.TERMSCONDITIONS || "Terms & Conditions"}
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/cms/dispute_resolution">
                {i18?.FOOTER?.LEGAL?.DISPUTE_RESOLUTION || "Dispute Resolution"}
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/cms/imprint">
                {i18?.FOOTER?.LEGAL?.IMPRINT || "Imprint"}
              </Link>
            </li>
          </ul>
        </div>

                <div className="mb-6">
                    <h3 className="text-lg font-bold  mb-6">
                        {i18?.FOOTER?.CONTACTSUPPORT?.HEADING || "Contact Support"}
                    </h3>
                    <ul className="text-sm font-normal  ">
                        <li className="mb-3">
                            <Link href="/cms/help_center">
                                {i18?.FOOTER?.CONTACTSUPPORT?.HELPCENTER || "Help Center"}
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/cms/contact_us">
                                {i18?.FOOTER?.CONTACTSUPPORT?.CONTACTUS || "Contact Us"}
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/cancelationPolicy">
                                {i18?.FOOTER?.CONTACTSUPPORT?.CANCELLATIONPOL || "Cancellation Policy"}
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/deliveryCancellation">
                                {i18?.FOOTER?.CONTACTSUPPORT?.DELIVERY_CANCELLATION_FOOTER || "How We Calculate Delivery Prices on Postier"}
                            </Link>
                        </li>
                        <li className="mb-3">
                            <Link href="/dynamicCalculation">
                                {i18?.FOOTER?.CONTACTSUPPORT?.DYNAMIC_CALCULATION_FOOTER || "Dynamic Calculation"}
                            </Link>
                        </li>
                        {/* <li className="mb-3">
                            <Link href="#">
                                {i18?.FOOTER?.CONTACTSUPPORT?.CANCELLATIONPOL || "Cancellation Policy"}
                            </Link>
                        </li> */}
            {/* <li className="mb-3">
                            <Link href="#">
                                {i18?.FOOTER?.CONTACTSUPPORT?.SAFETYPOL || "Safety Policy"}
                            </Link>
                        </li> */}
          </ul>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-bold  mb-6">
            {i18?.FOOTER?.POSTIER?.HEADING || "Postier"}
          </h3>
          <ul className="text-sm font-normal ">
            {/* <li className="mb-3">
                            <Link href="#">
                                {i18?.FOOTER?.POSTIER?.CAREERS || "Careers"}
                            </Link>
                        </li> */}
            <li className="mb-3">
              <Link href="/cms/payments_payouts">
                {i18?.FOOTER?.POSTIER?.PAYMENTS_AND_PAYOUTS || "Payments and Payouts"}
              </Link>
            </li>
            <li className="mb-3">
              <Link href="/cms/about_us">
                {i18?.FOOTER?.POSTIER?.ABOUTUS || "About Us"}
              </Link>
            </li>
            {/* <li className="mb-3">
                            <Link href="#">
                                {i18?.FOOTER?.POSTIER?.HOWOURWORKS || "How Our Business Works?"}
                            </Link>
                        </li> */}
          </ul>
          <div className="p-3 bg-[#fff] rounded-full mt-[50px]">
            <DropDown
              img="/svg/icon/globe.svg"
              text={lang ? `Language - ${lang}` : "Language"}
              data={LanguageData}
              className="flex items-center gap-2 w-full h-full "
              ImgWidth={25}
              ImgHeight={25}
            />
          </div>
        </div>
      </div>
      {/* </div> */}
      <div className="mx-auto border-[#D6D6D6] border-b mb-6"></div>
      <div className="mx-auto flex flex-wrap md:justify-between justify-center md:items-start items-center gap-4">
        <p className="text-sm font-normal ">
          &copy; {currentYear}
          {i18?.FOOTER?.POSTIERINC || "Postier, Inc."}
        </p>
        <p className="text-sm font-normal cursor-pointer hover:underline underline-offset-2 " onClick={() => setModal('cookieModal')}>
          {"See Cookie Preferences."}
        </p>
        <ul className="flex space-x-2 items-center">
          <li>
            <Link
              target="_blank"
              href="https://www.facebook.com/"
              className="hover:text-gray-400 text-blue-600"
            >
              <Image
                src="/svg/icon/facebook.svg"
                alt="Facebook"
                width={20}
                height={20}
                className="w-[15px] h-[15px]"
              />
            </Link>
          </li>
          <li className="">
            <Link
              target="_blank"
              href="https://x.com/"
              className="hover:text-gray-400 text-blue-600"
            >
              <Image
                src="/svg/icon/x.svg"
                alt="Twitter"
                width={800}
                height={800}
                className="w-[15px] h-[15px]"
              />
            </Link>
          </li>
          <li>
            <Link
              target="_blank"
              href="https://www.linkedin.com/"
              className="hover:text-gray-400 text-blue-600"
            >
              <Image
                src="/svg/icon/instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
                className="w-[15px] h-[15px]"
              />
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
