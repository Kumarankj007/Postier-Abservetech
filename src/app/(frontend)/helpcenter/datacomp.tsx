import CarouselDummy from '@/app/component/carouselDummy';
import PageContext from '@/app/providers/pagecontext';
import Image from 'next/image';
import React, { useContext } from 'react'

function Datacomp() {
    const { i18 } = useContext(PageContext);
    const data = [
        {
            img:'/svg/icon/Mask group.svg',
            text: i18?.NEW?.PUBLISH_A_TRIP || 'Publish a trip'
        },
        {
            img:'/svg/icon/Mask group (1).svg',
            text: i18?.NEW?.SEND_A_PARCEL || 'Send a parcel'
        },
        {
            img:'/svg/icon/Mask group (2).svg',
            text: i18?.NEW?.COUNTER_OFFER_A_PRICE || 'Counter offer a price'
        },
        {
            img:'/svg/icon/Mask group.svg',
            text: i18?.NEW?.TRACKING_PARCELS || 'Tracking parcels'
        },
        {
            img:'/svg/icon/Mask group (1).svg',
            text: i18?.NEW?.SEND_A_PARCEL || 'Send a parcel'
        },
        {
            img:'/svg/icon/Mask group (2).svg',
            text: i18?.NEW?.COUNTER_OFFER_A_PRICE || 'Counter offer a price'
        },
       
    ]

    const Article = [
        {
            img:'/svg/icon/jess-bailey-f94JPVrDbnY-unsplash (1) 2.svg',
            heading:'Lorem Ipsum',
            para:'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        {
            img:'/svg/icon/jess-bailey-f94JPVrDbnY-unsplash (1) 2.svg',
            heading:'Lorem Ipsum',
            para:'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        {
            img:'/svg/icon/jess-bailey-f94JPVrDbnY-unsplash (1) 2.svg',
            heading:'Lorem Ipsum',
            para:'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        {
            img:'/svg/icon/jess-bailey-f94JPVrDbnY-unsplash (1) 2.svg',
            heading:'Lorem Ipsum',
            para:'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        {
            img:'/svg/icon/jess-bailey-f94JPVrDbnY-unsplash (1) 2.svg',
            heading:'Lorem Ipsum',
            para:'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        {
            img:'/svg/icon/jess-bailey-f94JPVrDbnY-unsplash (1) 2.svg',
            heading:'Lorem Ipsum',
            para:'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
        },
        
    ]
  return (
    <>
    <div className='flex flex-col gap-12'>
        <p className='text-[34px] font-[700] leading-[44px]'>{ i18?.NEW?.HELPHEADING || 'Quick Guide to get started with us'}</p>
        <CarouselDummy data={data}/>
    </div>

    <div className='flex flex-col gap-12'>
    <p className='text-[34px] font-[700] leading-[44px]'>{ i18?.NEW?.TOPARTICLE || 'Top Articles'}</p>  
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {
            Article.map((items:any,index:any)=>{
                return(
                    <div key={index} className='p-6 gap-6 border border-1 border-btncolor rounded-[31px] flex flex-wrap lg:flex-nowrap items-center justify-center '>
                        <Image src={items?.img} alt='img' width={800} height={800} className='w-[100px] h-[100px] rounded-full'/>  
                        <div className='flex flex-col gap-4  justify-between'>
                            <p className='text-[20px] font-[700]'>{items?.heading}</p>
                            <p>{items?.para}</p>
                        </div>
                    </div>
                )
            })
        }
      </div>
    </div>
    </>
  )
}

export default Datacomp