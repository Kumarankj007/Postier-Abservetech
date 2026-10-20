'use client';
import SearchBar from "@/app/component/searchbar";
import ToggleButton from "@/app/component/togglebtn";
import ParcelStore from "@/app/store/parcel";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo } from "react";
import Datacomp from "./datacomp";
import PageContext from "@/app/providers/pagecontext";

export default function Search() {
  const {i18} = useContext(PageContext);
  const searchParams = useSearchParams();

  return (
    <div className="">
      <div className="bg-[#EFEFEF] ">
        <div className="">
          <div className="m-auto p-[20px] sm:p-[40px] md:p-[60px] ">
            <div className="flex flex-col align-center justify-center gap-10 flex-wrap">
              {
                searchParams.size === 0 &&
                <p className="font-bold text-2xl sm:text-3xl md:text-5xl  text-center leading-[30px] sm:leading-[45px] md:leading-[65px] text-[#000]">
                  {i18?.NEW?.SEARCH_DELIVER || "Search Postier and Deliver"} <br />
                  {i18?.NEW?.PARCELS_EASE || "Parcels with Ease"}
                </p>
              }
              {/* <ToggleButton /> */}
              <div className="sticky top-0">
              <SearchBar toggle={false}/>
              </div>
            </div>
          </div>
        </div>

      </div>
{
      searchParams.size > 0 && <Datacomp />
}
    </div>

  )
}