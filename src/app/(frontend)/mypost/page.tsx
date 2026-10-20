// 'use client'

// import { mypostcontent } from "../../../../content";
// import Button from "@/app/component/button";
// import Avatar from '@mui/material/Avatar';
// import AvatarGroup from '@mui/material/AvatarGroup';
// import DropDown from "@/app/component/dropdown";
// import TypeStore from "@/app/store/typeStore";
// import { useContext, useEffect, useState } from "react";
// import PostDetailsStore from "@/app/store/parcelDetails";
// import UseLoadingRouter from "../hooks/useLoadingRoutes";;
// import Store from "@/app/store/store";
// import { FormatDate, TimeFormat } from "@/utils";
// import EmptyPage from "@/app/component/emptydatapage";
// import Pagination from "@/app/component/pagination";
// import { Tooltip } from "@mui/material";
// import TooltipComp from "@/app/component/tooltip";
// import PageContext from "@/app/providers/pagecontext";
// import SkeletonComponent from "@/app/component/skeleton";
// import Image from "next/image";

// export default function Mypost() {
//     // const [page, setPage] = useState(1)
//     // const [limit, setLimit] = useState(5)
//     const { i18 } = useContext(PageContext);
//     const [sort, setSort] = useState('')
//     const { setStep, setStepper, Page, setPage, Limit, setLimit } = Store()
//     const { Type } = TypeStore()
//      const  router  = UseLoadingRouter();
//     const { fetchParcelDetails, ParcelDetails, fetchParcelDetailsPostier, ParcelDetailsPostier }: any = PostDetailsStore()
//     const [btn, setbtn] = useState('Published')
//     const Dropdrown = [{ text: i18?.DROPDOWN?.OLDEST || 'Oldest', fnc: () => setSort('asc') }, { text: i18?.DROPDOWN?.NEWEST || 'Newest', fnc: () => setSort('desc') }]

//     const handleContinue = (id: any) => {
//         const ParcelData = ParcelDetails ? ParcelDetails?.posts[0] : {}
//         if (btn === 'Pending') {
//             if (ParcelData?.receiver?.firstName) {
//                 setStep(3)
//                 setStepper(2)
//             } else if (ParcelData?.parcel?.title) {
//                 setStep(2)
//                 setStepper(1)
//             } else if (ParcelData?.sender?.email) {
//                 setStep(1)
//                 setStepper(0)
//             }
//             else {
//                 setStep(4)
//                 setStepper(3)
//             }
//             router.push(`/sendparcel?id=${id}`)
//         }
//         else {
//             router.push(`/senderDetails?id=${id}`)
//         }
//     }


//     const handlePageChange = (page: any) => {
//         setPage(page)
//     }
//     const handleLimitChange = (limit: any) => {
//         setLimit(limit)
//     }
//     useEffect(() => {

//             fetchParcelDetails(btn, sort, Page, Limit)
//       // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [btn, Type, Page, sort, Limit])
//     console.log('ParcelDetails', ParcelDetails?.posts)
//     return (
//         <>
//             <div className="mb-7 flex flex-wrap gap-4 justify-between m-[20px] md:m-[40px] lg:m-[70px]">
//                 <div className='flex flex-row md:flex-row'>
//                     <Button onClick={() => setbtn('Published')} className={btn === 'Published' ? "border border-btncolor rounded-l-[17px] font-medium text-sm leading-5 bg-btncolor px-7 py-5 text-[#fff] cursor-pointer  w-[130px] md:w-[175px]" : " w-[130px] md:w-[175px] border border-btncolor rounded-l-[17px] font-medium text-sm leading-5 px-7 py-5   cursor-pointer"} >
//                         {i18.MYPOST.PUBLISH || 'Published'}
//                     </Button>
//                     <Button onClick={() => setbtn('Pending')} className={btn === 'Pending' ? "border border-btncolor font-medium text-sm leading-5 bg-btncolor px-7 py-5  text-[#fff] cursor-pointer rounded-r-[17px]  w-[130px] md:w-[175px]" : " w-[130px] md:w-[175px] border border-btncolor font-medium text-sm leading-5 px-7 py-5   cursor-pointer rounded-r-[17px]"} >
//                         {i18.MYPOST.SAVED || 'Saved'}
//                     </Button>
//                 </div>

//                 <DropDown
//                     img='/svg/icon/proposalsFilter.svg'
//                     data={Dropdrown}
//                     text={i18?.DROPDOWN?.SORTBY || 'Sort by'}
//                     className='flex gap-3 justify-center items-center border border-btncolor w-[120px] md:w-[165px] h-[60px] rounded-[17px] text-btncolor'
//                 />
//             </div>
//             {
//                     (Type === 'sendparcel' && Array.isArray(ParcelDetails?.posts) && ParcelDetails?.posts?.length === 0)

//                     ?
//                     <EmptyPage
//                         image={ '/svg/icon/mypostsvg.svg' }
//                         text={i18?.NEW?.POSTMT || 'Looks like you haven’t posted any parcel posts!' }
//                         linktext={ i18?.NEW?.LINKMT || 'Send your first parcel now' }
//                         link={'/sendparcel/' }
//                     />
//                     :
//                     <div className="mt-[5px] m-[20px] md:m-[40px] lg:m-[70px]">

//                         <SkeletonComponent page='Mypost' >
//                             {


//                                 Array.isArray(ParcelDetails?.posts) && ParcelDetails?.posts?.map((item: any, index: any) => {
//                                     return (
//                                         <div key={index} className="shadow-shadowbox p-5 border rounded-[17px] mb-6">
//                                             <div className="flex flex-wrap justify-between">
//                                                 <div className="flex flex-col gap-7">
//                                                     <div className="flex-wrap md:flex  gap-7">
//                                                         <p className="font-bold	text-lg	">{i18.MYPOST.POSTTITLE || 'Post Title:'}</p>
//                                                         <p className="font-normaltext-lg capitalize text-start">{item?.parcel?.title}</p>
//                                                     </div>
//                                                     <div className="flex-wrap md:flex gap-7">
//                                                         <p className="font-bold	text-lg	">{i18.MYPOST.PARCELDESCRIBTION || 'Parcel Description:'}</p>
//                                                         <p className="font-normaltext-lg capitalize text-start max-w-[800px]">{item?.parcel?.description}</p>
//                                                     </div>
//                                                     <div>
//                                                         <p className="font-bold	text-lg	mb-4">{i18.MYPOST.PARCELIMAGES || 'Parcel Images:'}</p>
//                                                         <div className="flex flex-wrap gap-4 ">
//                                                             {
//                                                                 Array.isArray(item?.parcel?.image) && item?.parcel?.image.map((img: any, ind: any) => {
//                                                                     return (
//                                                                         <div key={ind} className="w-[100px] h-[100px]" >
//                                                                             <Image width={500} height={500} src={process.env.NEXT_PUBLIC_IMAGE_URL + img} alt='img' className="w-[100px] h-[100px] rounded object-fit" />
//                                                                         </div>
//                                                                     )
//                                                                 })
//                                                             }
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex-wrap md:flex gap-7 ">
//                                                         <p className="font-bold	text-lg">{i18.MYPOST.PICKUPLOCATION || 'Pickup Location:'}</p>
//                                                         <TooltipComp title={item?.location?.pickUp}>
//                                                             <p className="font-normal text-lg capitalize text-start line-clamp-1 max-w-[700px]">{item?.location?.pickUp}</p>
//                                                         </TooltipComp>
//                                                     </div>
//                                                     <div className="flex-wrap md:flex gap-7">
//                                                         <p className="font-bold	text-lg	">{i18.MYPOST.DESTINATIONLOCATION || 'Destination Location:'}</p>
//                                                         <TooltipComp title={item?.location?.drop}>
//                                                             <p className="font-normal text-lg capitalize text-start line-clamp-1">{item?.location?.drop}</p>
//                                                         </TooltipComp>
//                                                     </div>
//                                                 </div>

//                                                 <div className="flex flex-wrap md:flex-col justify-between viewpost">
//                                                     <div className="flex justify-end">
//                                                         <Button className="px-[41px] py-[15px] bg-btncolor rounded-[7px] text-[#fff] cursor-pointer h-[50px]" onClick={() => handleContinue(item._id)}>
//                                                             {
//                                                                 btn === 'Pending' ? `${i18.MYPOST.CONTINUE || 'Continue'}` : `${i18.MYPOST.VIEWPOST || 'View Post'}`
//                                                             }
//                                                         </Button>
//                                                     </div>
//                                                     {/* {
//                                         Type !== 'sendparcel' &&
//                                         <div>
//                                             {item?.avatars?.length === 0 ? (
//                                                 <></>
//                                             ) : (
//                                                 <AvatarGroup>
//                                                     {Array.isArray(item.avatars) && item.avatars.map((avatar: any, idx: any) => (
//                                                         <Avatar
//                                                             key={idx}
//                                                             alt={`Avatar ${idx + 1}`} src={avatar}
//                                                             className="avathar"
//                                                             sx={{
//                                                                 '&.MuiAvatar-root': {
//                                                                     border: '4px solid #004080'
//                                                                 },
//                                                                 '&.MuiAvatar-img': {
//                                                                     objectFit: 'contain'
//                                                                 }
//                                                             }}
//                                                         />
//                                                     ))}
//                                                 </AvatarGroup>
//                                             )}
//                                         </div>
//                                     } */}

//                                                 </div>
//                                             </div>

//                                         </div>
//                                     )
//                                 })
//                             }
//                         </SkeletonComponent>

//                         <Pagination
//                             totalItems={Type === 'sendparcel' ? ParcelDetails?.total || 0 : ParcelDetailsPostier?.total || 0}
//                             // itemsPerPage={limit}
//                             onPageChange={handlePageChange}
//                             onLimitChange={handleLimitChange}
//                         />
//                     </div>
//             }
//         </>
//     );
// }
'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react'
import SearchBar from './searchBar';
import DropDown from '@/app/component/dropdown';
import ParcelStore from '@/app/store/parcel';
import Image from 'next/image';
import { FormatDateTime } from '@/utils';
import VehicleImgCarousel from './carousel';
import { useSearchParams } from 'next/navigation';
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import Pagination from '@/app/component/pagination';
import Store from '@/app/store/store';
import PageContext from '@/app/providers/pagecontext';
import SkeletonComponent from '@/app/component/skeleton';
import EmptyPage from '@/app/component/emptydatapage';

const Dropdown = ['All', 'Pending', 'Published',]
function MyPost() {
    const router = UseLoadingRouter();
    const { i18 } = useContext(PageContext);
    const searchParams = useSearchParams()
    const { Page, setPage, Limit, setLimit } = Store()
    const { FetchMyparcels, MyParcels, total } = ParcelStore()
    const status = (searchParams.size > 0 && searchParams.get('status')) && searchParams.get('status')
    const Params = useMemo(() => {
        return (
            searchParams.size > 0 && searchParams.get('suggestionId')
        )
    }, [searchParams])
    const handlePageChange = (page: any) => {
        setPage(page)
    }
    const handleLimitChange = (limit: any) => {
        setLimit(limit)
    }

    const handleDropdownClick = (value: any) => {
        const params = new URLSearchParams(window.location.search);
        params.set('status', value); // Set the search param key to the value
        router.push(`${window.location.pathname}?${params.toString()}`);
    };

    useEffect(() => {

        const PickUplat = (searchParams.size > 0 && searchParams.get('pickupLat')) && searchParams.get('pickupLat')
        const PickUplng = (searchParams.size > 0 && searchParams.get('pickupLng')) && searchParams.get('pickupLng')
        const droplng = (searchParams.size > 0 && searchParams.get('dropLng')) && searchParams.get('dropLng')
        const droplat = (searchParams.size > 0 && searchParams.get('dropLat')) && searchParams.get('dropLat')
        const status = (searchParams.size > 0 && searchParams.get('status')) && searchParams.get('status')
        const pickupDate = (searchParams.size > 0 && searchParams.get('pickupDate')) && searchParams.get('pickupDate')
        const deliveryDate = (searchParams.size > 0 && searchParams.get('deliveryDate')) && searchParams.get('deliveryDate')
        const data: any = {}
        if (PickUplat) {
            data.startLat = PickUplat
        }
        if (PickUplng) {
            data.startLng = PickUplng
        }
        if (droplat) {
            data.endLat = droplat
        }
        if (droplng) {
            data.endLng = droplng
        }
        if (Page) {
            data.page = Page
        }
        if (Limit) {
            data.limit = Limit
        }
        if (pickupDate) {
            data.pickupDate = pickupDate
        }
        if (deliveryDate) {
            data.page = deliveryDate
        }
        if (status !== 'All') {
            if (status === 'Saved') {
                data.status = 'Pending'
            } else {
                data.status = status
            }
        }
        FetchMyparcels(data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])


    // console.log('MyParcels', Params)
    return (
        <div className='flex flex-col gap-[40px]'>
            <div className='bg-[#EFEFEF]  py-[40px] w-full flex flex-col  gap-8 items-center justify-center '>
                <p className='text-[50px] leaing-[65px] font-[700] '>{i18?.NEW?.MYPARCEL || 'My Parcels'}</p>
                <div className='w-[70%]'>
                    <SearchBar Params={Params} />
                </div>
            </div>
            <div className=' flex items-center justify-end md:mx-[40px] lg:mx-[70px]'>
                <div className='flex gap-6 pr-[20px]'>
                    <DropDown
                        img2="/svg/icon/dropdownicon.svg"
                        text={status ? status : 'All'}
                        className='flex gap-3 justify-center items-center border border-btncolor  rounded-[17px] text-btncolor p-2 whitespace-nowrap'
                        data={Params === null ? [
                            {
                                text: i18?.NEW?.ALL || 'All',
                                fnc: () => handleDropdownClick('All'),
                            },
                            {
                                text: i18?.NEW?.SAVED || 'Saved',
                                fnc: () => handleDropdownClick('Saved'),
                            },
                            {
                                text: i18?.NEW?.PUBLISHED || 'Published',
                                fnc: () => handleDropdownClick('Published'),
                            },
                            {
                                text: i18?.NEW?.IN_PROGRESS || 'In Progress',
                                fnc: () => handleDropdownClick('Transit'),
                            },
                            {
                                text: i18?.NEW?.DELIVERED || 'Delivered',
                                fnc: () => handleDropdownClick('Delivered'),
                            },
                            {
                                text: i18?.NEW?.CANCELED || 'Cancelled',
                                fnc: () => handleDropdownClick('Cancelled'),
                            },

                        ]
                            :
                            [
                                {
                                    text: i18?.NEW?.PUBLISHED || 'Published',
                                },
                            ]
                        }
                    />

                    {/* <DropDown
                        text='Filters'
                        img2="/svg/icon/filter.svg"
                        data={[]}
                        className='flex gap-3 justify-center items-center border border-btncolor  rounded-[17px] text-btncolor p-2 whitespace-nowrap	'
                    /> */}
                </div>
            </div>
            {
                MyParcels && MyParcels.length > 0 ?
                    <SkeletonComponent page='Mypost' >
                        <div className="flex items-center justify-center px-5 md:px-16">
                            <div className="flex flex-col gap-12 w-full max-w-[1200px]">
                                {Array.isArray(MyParcels) &&
                                    MyParcels?.map((items: any, index) => {
                                        const pickup =
                                            items?.parcel?.pickupDate &&
                                            FormatDateTime(items?.parcel?.pickupDate);
                                        const drop =
                                            items?.parcel?.deliveryDate &&
                                            FormatDateTime(items?.parcel?.deliveryDate);

                                        return (
                                            <div
                                                key={index}
                                                className="flex flex-col cursor-pointer gap-6 border border-btncolor rounded-[20px] p-5 md:p-10"
                                            >
                                                <p className="text-sm md:text-base">{i18?.NEW?.PARCELNO || "Parcel No"}: {items?.referenceNo}</p>
                                                <div
                                                    className="flex flex-col lg:flex-row  items-center gap-8 md:gap-12"
                                                    onClick={() =>
                                                        router.push(
                                                            `/senderDetails?id=${items?._id}&status=${status || 'All'}${Params ? `&suggestionid=${Params}` : ''
                                                            }`
                                                        )
                                                    }
                                                >
                                                    <div className="border border-btncolor rounded-[20px] p-4 h-[200px] w-[200px]">
                                                        <VehicleImgCarousel VehicleDoc={items?.parcel?.image} />
                                                    </div>
                                                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-6 w-full">
                                                        <div className="flex flex-col gap-2">
                                                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">{i18?.NEW?.PICKUP || 'Pick-up'}</p>
                                                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">
                                                                {pickup?.date
                                                                    ? `${pickup?.date}, ${pickup?.time}`
                                                                    : 'No date/time available'}
                                                            </p>
                                                            <p className="text-[20px] md:text-[34px] font-[600] leading-[44px]  max-w-[200px] lg:max-w-[300px] truncate">
                                                                {(items?.location?.pickUpCity || items?.location?.pickUp) ||
                                                                    'Default Pickup Location'}
                                                            </p>
                                                            <p className="text-[12px] md:text-[17px] font-[400] leading-[44px] w-[100px] md:w-[150px] lg:w-[250px] truncate">
                                                                {items?.location?.pickUp || 'Default Pickup Location'}
                                                            </p>
                                                        </div>
                                                        <Image
                                                            width={30}
                                                            height={30}
                                                            src="/svg/icon/Arrow back.svg"
                                                            alt="Arrow icon"
                                                            className="hidden md:block w-6 h-6"
                                                        />
                                                        <div className="flex flex-col gap-2">
                                                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">{i18?.NEW?.DROP_OFF || "Drop-off"}</p>
                                                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">
                                                                {drop?.date
                                                                    ? `${drop?.date}, ${drop?.time}`
                                                                    : 'No date/time available'}
                                                            </p>
                                                            <p className="text-[20px] md:text-[34px] font-[600] leading-[44px]  max-w-[200px] md:max-w-[300px] truncate">
                                                                {(items?.location?.dropCity || items?.location?.drop) ||
                                                                    'Default Drop-off Location'}
                                                            </p>
                                                            <p className="text-[12px] md:text-[17px] font-[400] leading-[44px] w-[100px] md:w-[150px] lg:w-[250px] truncate">
                                                                {items?.location?.drop || 'Default Drop-off Location'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                    </SkeletonComponent>
                    :
                    <EmptyPage
                        image={'/svg/icon/mypostsvg.svg'}
                        text={i18?.NEW?.POSTMT || 'Looks like you haven’t posted any parcel posts!'}
                    // linktext={i18?.NEW?.LINKMT || 'Send your first parcel now'}
                    // link={'/sendparcel/'}
                    />
            }

            <Pagination totalItems={total || 0} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
        </div>
    )
}

export default MyPost