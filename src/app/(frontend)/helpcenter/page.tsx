
'use client'
import CustomTabComponent from '@/app/component/tabComp'
import Image from 'next/image'
import React, { useContext } from 'react'
import Datacomp from './datacomp';
import PageContext from "@/app/providers/pagecontext";


function HelpCenter() {
    const { i18 } = useContext(PageContext);
    const tabs = [
        {
            label: i18?.NEW?.CUSTOMER || 'Customer',
            content: <Datacomp />
        },
        {
            label: i18?.NEW?.POSTIER || 'Postier',
            content: <Datacomp />
        }
    ]
    return (
        <div>
            <div className='bg-[#EFEFEF] flex flex-col gap-[60px] justify-center items-center p-[60px]'>
                <p className='text-[17x] sm:text-[30px] md:text-[50px] font-[700] leading-[65px]'>{i18?.NEW?.HELP_CENTER || "Help Center"}</p>
                <div className='bg-[#fff] p-[20px] sm:p-[30px] rounded-full flex items-center justify-center w-full md:w-[700px]'>
                    <input
                        // value={value.pickupAddress}
                        placeholder={i18?.NEW?.SEARCH || "Seach"}
                        className="outline-none text-[14px] text-[#000000] placeholder-black w-[90%] ml-[40px] md:ml-0"
                    // onChange={(e) => updateValue('pickupAddress', e.target.value)}
                    />
                    <Image src='/svg/icon/search.svg' alt='img' width={800} height={800} className='w-[20px] h-[20px]' />
                </div>
            </div>
            <div className='m-[20px] md:m-[40px] lg:m-[70px]'>
                <CustomTabComponent tabs={tabs} />
            </div>
        </div>
    )
}

export default HelpCenter