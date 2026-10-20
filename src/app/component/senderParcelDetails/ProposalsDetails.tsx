'use client'

import React, { useContext, useEffect, useState } from "react";
import Button from "../button";
import ParcelStore from "@/app/store/parcel";
import Image from "next/image";
import dynamic from "next/dynamic";
import PageContext from "@/app/providers/pagecontext";

const Suggestion = dynamic(() => import('./suggestion'), { ssr: false });
const Request = dynamic(() => import('./request'), { ssr: false });
const Accepted = dynamic(() => import('./accepted'), { ssr: false });

const ProposalsDetails = () => {
  const { i18 } = useContext(PageContext);
  const { NearestMatches }: any = ParcelStore()

  // const handlePageChange = (page: any) => {
  //   setPage(page)
  // }
  // const handleLimitChange = (limit: any) => {
  //   setLimit(limit)
  // }
 
  // console.log('NearestMatches', NearestMatches)

  return (
    <>
        <>
          <div className="mb-12">
            <Button className="flex justify-center border leading-tight p-3 md:p-5 w-32 md:w-48 rounded-xl" style={{ borderRadius: '17px', borderColor: '#004080', color: "#004080" }}>
              <Image width={20} height={20} src="/svg/icon/proposalsFilter.svg" alt="Filter" className="mr-2" style={{ width: '25.5px', height: '17px', marginTop: "3px", color: '#004080' }} />
              {i18?.NEW?.SORT_BY || "Sort By"}
            </Button>
          </div>
          <div>
            {
              NearestMatches.accepted?.length > 0 &&
              <div>
                <h1 className="font-bold text-[25px]  mb-8">{i18?.NEW?.AWARDED || "Awarded"}</h1>
                <Accepted/>
              </div>
            }
            {
              NearestMatches?.requestList?.length > 0 &&
              <div>
                <h1 className="font-bold text-[25px] mb-8">{i18?.NEW?.REQUESTS || "Requests"}</h1>
                <Request/>
              </div>
            }
            {
              NearestMatches?.suggestions?.length > 0 &&
              <div>
                <h1 className="font-bold text-[25px] mb-8">{i18?.NEW?.SUGGESTIONS || "Suggestion"}</h1>
                <Suggestion/>
              </div>
            }

            {/* <Pagination
              totalItems={NearestMatches?.length || 0}
              // itemsPerPage={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            /> */}
          </div>
        </>
    
    </>
  );
};

export default ProposalsDetails;
