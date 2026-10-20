import LocationStore from '@/app/store/locations';
import { FormatDate, LocationFromApi } from '@/utils';
import React, { useContext, useEffect } from 'react';
import PageContext from "@/app/providers/pagecontext";




const Senderinfo = (senderData: any,parcel:any) => {
    const { i18 } = useContext(PageContext);
 
    const senderinfo = [
        {
            header: i18?.NEW?.FIRST_NAME || 'First Name' + ':',
            value: `${senderData?.senderinfo?.sender?.firstName} `
        },
        {
            header: i18?.NEW?.LAST_NAME || 'Last Name' + ':',
            value: ` ${senderData?.senderinfo?.sender?.lastName}`
        },
        {
            header: i18?.NEW?.FULL_ADDRESS || 'Full Address' + ':',
            value: ` ${senderData?.senderinfo?.sender?.address}`
        },
        {
            header: i18?.NEW?.PHONE_NUMBER || 'Phone Number' + ':',
            value: `${senderData?.senderinfo?.sender?.phoneCode} ${senderData?.senderinfo?.sender?.phone}`
        },
        {
            header: i18?.NEW?.PICKUP_LOCATION || 'Pickup Location' + ':',
            value: senderData?.senderinfo?.location?.pickUp
        },
        
        {
            header: i18?.NEW?.DESTINATION_LOCATION || 'Destination Location :',
            value: senderData?.senderinfo?.location?.drop
        },
        // {
        //     header: 'Full Address',
        //     value: senderData.senderinfo.address ? senderData?.senderinfo.address : 'Vakil New Street, Simmakkal, Madurai'
        // },
        {
            header: i18?.NEW?.EMAIL_ID || 'Email ID :',
            value: senderData?.senderinfo?.sender?.email
        },
        
        
        {
            header: i18?.NEW?.DELIVERY_BY || 'Delivery by :',
            value: senderData?.senderinfo?.parcel?.deliverBy
        },
        {
            header: i18?.NEW?.DELIVERY_DATE || 'Delivery Date :',
            value:  FormatDate(senderData?.senderinfo?.parcel?.deliveryDate) 
        },
        {
            header: i18?.NEW?.COUNTRY_NAME || 'Country Name :',
            value: senderData?.senderinfo?.sender?.country?.name
        },
        {
            header: i18?.NEW?.STATE_NAME || 'State Name :',
            value:senderData?.senderinfo?.sender?.state?.name
        },
        {
            header: i18?.NEW?.CITY_NAME || 'City Name :',
            value: senderData?.senderinfo?.sender?.city?.name
        },
        {
            header: i18?.NEW?.PINCODE || 'Pincode :',
            value: senderData?.senderinfo?.sender?.pinCode?.toString()
        }
    ];
    return (
        <div className='grid md:grid-cols-2 gap-7'>
            {senderinfo.map((item: any, index: any) => {
                return (
                   <div key={index}  className='flex-wrap md:flex-nowrap flex md:gap-4 '>
                    <p className=' font-bold text-[17px] capitalize  flex flex-nowrap items-center justify-start min-w-[100px]'>{item.header}  </p>
                    <p className=' font-normal text-[17px] capitalize  items-center justify-center  line-clamp-1 w-full md:max-w-[350px]'>{item.value}</p>
                   </div>
                );
            })}

        </div>
    );
};

export default Senderinfo;
