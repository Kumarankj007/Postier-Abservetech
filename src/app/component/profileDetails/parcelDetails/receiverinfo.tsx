import LocationStore from '@/app/store/locations';
import { ReceiverLocationFromApi } from '@/utils';
import React, { useContext, useEffect, useMemo } from 'react';
import PageContext from "@/app/providers/pagecontext";

const Receiverinfo = (receiverData: any) => {
    const { i18 } = useContext(PageContext);
    // console.log('receiverData', receiverData)
    const { FavLocation, FetchFavLocation} = LocationStore()
    const memorizedArray: any = useMemo(() => {
        if (receiverData?.receiverData.favAddress !== '') {
            const foundLocation: any = Array.isArray(FavLocation) && FavLocation.find((item: any) => item?._id === receiverData?.receiverData.favAddressId);
            return foundLocation ? foundLocation : [];
        }
        return [];
    }, [receiverData,FavLocation]);
    useEffect(() => {
        FetchFavLocation()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receiverData])
    const receiverInfo = [
        {
            header: i18?.NEW?.NAME || 'Name',
            value: `${receiverData?.receiverData.firstName} ${receiverData?.receiverData.lastName}`
        },
        {
            header: i18?.NEW?.MOBILE_NUMBER || 'Mobile Number',
            value: `+${receiverData?.receiverData.phoneCode} ${receiverData?.receiverData.phone}`
        },
        {
            header: i18?.NEW?.EMAIL_ID || 'Email ID',
            value: receiverData?.receiverData.email
        },
        {
            header: i18?.NEW?.FULL_ADDRESS || 'Full Address',
            value: receiverData?.receiverData.favAddressId === null ?  `${receiverData?.receiverData?.address}` : memorizedArray.address 
        },
        {
            header: i18?.NEW?.COUNTRY_NAME || 'Country Name',
            value:  receiverData?.receiverData?.country?.name
        },
        {
            header: i18?.NEW?.STATE_NAME || 'State Name',
            value: receiverData?.receiverData?.state?.name
        },
        {
            header: i18?.NEW?.CITY_NAME || 'City Name',
            value:  receiverData?.receiverData?.city?.name
        },

    ];
    return (
        <div className='grid md:grid-cols-2 gap-7' >
            {receiverInfo.map((item: any, index: any) => {
                return (
                    <div key={index} className='flex-wrap md:flex-nowrap flex md:gap-4'>
                        <p key={index} className=' font-bold text-[17px] capitalize  flex flex-nowra items-center justify-start min-w-[100px]'>{item.header} : </p>
                        <span className=' font-normal text-[17px] capitalize felx items-center justify-center  line-clamp-1 w-full md:max-w-[350px]'>{item.value}</span>
                    </div>
                );
            })}

        </div>

    );
};


export default Receiverinfo;
