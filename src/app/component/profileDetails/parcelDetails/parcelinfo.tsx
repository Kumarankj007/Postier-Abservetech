import React, { useContext } from 'react';
import ParcelSwiper from '../../swiper';
import Image from 'next/image';
import PageContext from "@/app/providers/pagecontext";

const ParcelInfo = (parcelData: any) => {
    const { i18 } = useContext(PageContext);
    // console.log('parcelData', parcelData.parcelData)
    const parcelInfo = [
        {
            header: i18?.NEW?.TITLE || 'Title',
            value: parcelData?.parcelData.title
        },
        {
            header: i18?.NEW?.DESCRIPTION || 'Description',
            value: parcelData?.parcelData.description
        },
        {
            header: i18?.NEW?.TYPE || 'Type',
            value: parcelData?.parcelData.type
        },
        {
            header: i18?.NEW?.HEIGHT || 'Height',
            value: `${parcelData?.parcelData.height} ${parcelData?.parcelData.heightType} `
        },
        {
            header: i18?.NEW?.WIDTH || 'Width',
            value: `${parcelData?.parcelData.width} ${parcelData?.parcelData.widthType} `
        },
        
        {
            header: i18?.NEW?.SIZE || 'Size',
            value: parcelData?.parcelData.apprxSize
        },
        {
            header: i18?.NEW?.IMAGE || 'Image',
            value: parcelData?.parcelData.image
        },
        // {
        //     header: 'Deliver By',
        //     value: parcelData?.parcelData.deliverBy ? parcelData?.parcelData.deliverBy : "N/A"
        // },
        // {
        //     header: 'Delivery Date',
        //     value: parcelData?.parcelData.deliveryDate ? parcelData.deliveryDate : "N/A"
        // }
    ];

    return (
        <div className='grid md:grid-cols-2 gap-7'>
            {parcelInfo.map((item: any, index: any) => {
                return (
                    <div key={index} className='flex-wrap md:flex-nowrap flex md:gap-4 '>
                        <p className=' font-bold text-[17px] capitalize  flex flex-nowrap items-center justify-start min-w-[100px]'>
                            {item.header} :
                        </p>
                        {item.header === i18?.NEW?.IMAGE || 'Image' ? (
                            <div className='flex flex-wrap gap-4'>
                                {Array.isArray(item.value) && item.value.map((imgSrc: string, imgIndex: number) => {
                                    return (
                                        <Image
                                        width={20} height={20}
                                            key={imgIndex}
                                            src={process.env.NEXT_PUBLIC_IMAGE_URL + imgSrc}
                                            alt="Parcel"
                                            className='w-[100px] h-[100px] object-fit rounded'
                                        />
                                    )
                                })}
                                {/* <ParcelSwiper data={item.value} props={'parcelInfo'}/> */}
                            </div>
                        ) : (
                            <span className='font-normal text-[17px] capitalize  items-center justify-center  line-clamp-1 w-full md:max-w-[350px]'>{item.value}</span>
                        )}
                    </div>
                );
            })}

        </div>
    );
};


export default ParcelInfo;
