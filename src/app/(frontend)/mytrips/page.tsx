// 'use client'
// import Button from "@/app/component/button";
// import EmptyPage from "@/app/component/emptydatapage";
// import Pagination from "@/app/component/pagination";
// import SkeletonComponent from "@/app/component/skeleton";
// import TooltipComp from "@/app/component/tooltip";
// import PageContext from "@/app/providers/pagecontext";
// import PostDetailsStore from "@/app/store/parcelDetails";
// import Store from "@/app/store/store";
// import { FormatDate, TimeFormat } from "@/utils";
// import Image from "next/image";
// import UseLoadingRouter from "../hooks/useLoadingRoutes";;
// import { useContext, useEffect, useState } from "react";

// export default function MyTrips() {
//     const { i18 } = useContext(PageContext);
//      const  router  = UseLoadingRouter();
//     const [sort, setSort] = useState('')
//     const { Page, setPage, Limit, setLimit } = Store()
//     const { fetchParcelDetailsPostier, ParcelDetailsPostier }: any = PostDetailsStore()

//     const handleParcel = (id: any) => {
//         router.push(`/deliveryDetails?id=${id}`)
//     }
//     const handlePageChange = (page: any) => {
//         setPage(page)
//     }
//     const handleLimitChange = (limit: any) => {
//         setLimit(limit)
//     }

//     useEffect(() => {
//         fetchParcelDetailsPostier('', sort, Page, Limit)
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [Page, sort, Limit])
//     return (
//         <div>
//             <div className="mb-7 flex flex-wrap gap-4 justify-between">
//                 <h2 className="font-bold text-[50px] leading-[65px]">{i18?.HOMEPAGE?.NAVBAR?.MYTRIPS || 'My Trips'}</h2>
//             </div>
//             {
//                 (Array.isArray(ParcelDetailsPostier?.trip) && ParcelDetailsPostier?.trip?.length === 0)
//                     ?
//                     <EmptyPage
//                         image={'/png/mytrip.png'}
//                         text={i18?.NEW?.TRIPEMT ||'Looks like you haven’t posted your trips!'}
//                         linktext={i18?.NEW?.TLINKEMT ||'Post your first trip now & start earning money'}
//                         link={'/deliverparcel/'}
//                     />
//                     :
//                     <div className="mt-[5px]">
//                         <SkeletonComponent page='Mypost' >
//                             {
//                                 Array.isArray(ParcelDetailsPostier?.trip) && ParcelDetailsPostier?.trip?.map((item: any, index: any) => {
//                                     return (
//                                         <div key={index} className="shadow-shadowbox p-5 border rounded-[17px] mb-6">
//                                             <div className="flex flex-wrap justify-between">
//                                                 <div className="flex flex-col gap-7">
//                                                     <div className="flex  gap-3">
//                                                         <p className="font-bold text-lg capitalize text-center ">{item?.title}</p>
//                                                     </div>
//                                                     <div className="flex  gap-3 max-w-[900px]">
//                                                         <p className="font-normal text-lg capitalize text-start">{item?.description}</p>
//                                                     </div>
//                                                     <div className="flex gap-3">
//                                                         <Image width={15} height={15} src='/svg/icon/locationG.svg' alt="img" />
//                                                         <TooltipComp title={item?.location?.pickUp}>
//                                                             <p className="font-normal text-lg capitalize text-start line-clamp-1">{item?.location?.pickUp}</p>
//                                                         </TooltipComp>
//                                                     </div>
//                                                     <div className="flex  gap-3">
//                                                         <Image width={15} height={15} src='/svg/icon/locationR.svg' alt="img" />
//                                                         <TooltipComp title={item?.location?.drop}>
//                                                             <p className="font-normal text-lg capitalize text-start line-clamp-1">{item?.location?.drop}</p>
//                                                         </TooltipComp>
//                                                     </div>
//                                                     <div className="flex gap-5 flex-wrap items-center">
//                                                         <div className="flex gap-2">
//                                                             <Image width={15} height={15} src='/svg/icon/calendar.svg' alt='Calendar' />
//                                                             <p>{FormatDate(item.startDate)}</p>
//                                                         </div>
//                                                         <div className="flex gap-2">
//                                                             <Image width={15} height={15} src='/svg/icon/clock.svg' alt='Clock' />
//                                                             <p>{TimeFormat(item?.startDate)}</p>
//                                                         </div>
//                                                         <div className="flex gap-2">
//                                                             <Image width={10} height={10} src='/svg/icon/dollar.svg' alt='Dollar' />
//                                                             <p>{item.avgPrice}</p>
//                                                         </div>
//                                                         <div className="flex gap-2">
//                                                             <Image width={15} height={15} src='/svg/icon/kilo.svg' alt='Kilo' />
//                                                             <p>{item.capacity}kgs</p>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex flex-wrap md:flex-col justify-between viewpost">
//                                                     <div className="flex justify-end">
//                                                         <Button className="px-[41px] py-[15px] bg-btncolor rounded-[7px] text-[#fff] cursor-pointer h-[50px]" onClick={() => handleParcel(item._id)}>
//                                                             {i18.MYPOST.VIEWTRIP || 'View Trip'}
//                                                         </Button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )
//                                 })
//                             }
//                         </SkeletonComponent>
//                         <Pagination
//                             totalItems={ParcelDetailsPostier?.total || 0}
//                             // itemsPerPage={limit}
//                             onPageChange={handlePageChange}
//                             onLimitChange={handleLimitChange}
//                         />
//                     </div>
//             }
//         </div>

//     )
// }

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
"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import DropDown from "@/app/component/dropdown";
import ParcelStore from "@/app/store/parcel";
import Image from "next/image";
import { FormatDateTime } from "@/utils";
import { useSearchParams } from "next/navigation";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import Pagination from "@/app/component/pagination";
import Store from "@/app/store/store";
import VehicleImgCarousel from "../mypost/carousel";
import SearchBar from "../mypost/searchBar";
import PageContext from "@/app/providers/pagecontext";
import Utils from "@/app/store/utils";
import UserStore from "@/app/store/profile";
import SkeletonComponent from "@/app/component/skeleton";
import EmptyPage from "@/app/component/emptydatapage";

function MyTrips() {
  const router = UseLoadingRouter();
  const { i18 } = useContext(PageContext);
  const searchParams = useSearchParams();
  const { Page, setPage, Limit, setLimit } = Store();
  const { FetchMyTrips, MyTrips, Triptotal } = ParcelStore();
  const [dropdown, setDropDown] = useState("All");

  const status =
    searchParams.size > 0 &&
    searchParams.get("status") &&
    searchParams.get("status");

  const Params = useMemo(() => {
    return searchParams.size > 0 && searchParams.get("suggestionId");
  }, [searchParams]);

  const Amount = useMemo(() => {
    return searchParams.size > 0 && searchParams.get("amount");
  }, [searchParams]);

  const handlePageChange = (page: any) => {
    setPage(page);
  };
  const handleLimitChange = (limit: any) => {
    setLimit(limit);
  };
  const handleDropdownClick = (value: any) => {
    const params = new URLSearchParams(window.location.search);
    params.set("status", value); // Set the search param key to the value
    router.push(`${window.location.pathname}?${params.toString()}`);
  };
  useEffect(() => {
    const PickUplat =
      searchParams.size > 0 &&
      searchParams.get("pickupLat") &&
      searchParams.get("pickupLat");
    const PickUplng =
      searchParams.size > 0 &&
      searchParams.get("pickupLng") &&
      searchParams.get("pickupLng");
    const droplng =
      searchParams.size > 0 &&
      searchParams.get("dropLng") &&
      searchParams.get("dropLng");
    const droplat =
      searchParams.size > 0 &&
      searchParams.get("dropLat") &&
      searchParams.get("dropLat");
    const pickupDate =
      searchParams.size > 0 &&
      searchParams.get("pickupDate") &&
      searchParams.get("pickupDate");
    const deliveryDate =
      searchParams.size > 0 &&
      searchParams.get("deliveryDate") &&
      searchParams.get("deliveryDate");
    const data: any = {};
    if (PickUplat) {
      data.startLat = PickUplat;
    }
    if (PickUplng) {
      data.startLng = PickUplng;
    }
    if (droplat) {
      data.endLat = droplat;
    }
    if (droplng) {
      data.endLng = droplng;
    }
    if (Page) {
      data.page = Page;
    }
    if (Limit) {
      data.limit = Limit;
    }
    if (status !== "All") {
      data.status = status;
    }
    if (pickupDate) {
      data.pickupDate = pickupDate;
    }
    if (deliveryDate) {
      data.page = deliveryDate;
    }
    FetchMyTrips(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  return (
    <div className="flex flex-col gap-[40px]">
      <div className="bg-[#EFEFEF] py-[40px] w-full flex flex-col gap-8 items-center justify-center">
        <p className="text-[50px] leading-[65px] font-[700]">
          {i18?.NEW?.MYTRIPS || "My Trips"}
        </p>
        <SearchBar Params={Params} />
      </div>
      <div className="flex items-center justify-end max-w-[1400px] px-[20px]">
        <div className="flex gap-6">
          <DropDown
            img2="/svg/icon/dropdownicon.svg"
            text={status || (i18?.NEW?.ALL || "All")}
            className="flex gap-3 justify-center items-center border border-btncolor rounded-[17px] text-btncolor p-2 whitespace-nowrap"
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
          {/* Uncomment this DropDown if needed */}
          {/* <DropDown
                text="Filters"
                img2="/svg/icon/filter.svg"
                data={[]}
                className="flex gap-3 justify-center items-center border border-btncolor rounded-[17px] text-btncolor p-2 whitespace-nowrap"
              /> */}
        </div>
      </div>

      {MyTrips && MyTrips.length > 0 ? (
        <SkeletonComponent page="Mypost">
          <div className="flex items-center justify-center px-[20px]">
            <div className="flex flex-col gap-12">
              {Array.isArray(MyTrips) &&
                MyTrips.map((items: any, index) => {
                  const pickup =
                    items?.pickupDate && FormatDateTime(items?.pickupDate);
                  const drop =
                    items?.deliveryDate && FormatDateTime(items?.deliveryDate);
                  return (
                    <div
                      key={index}
                      className="border border-1 border-btncolor rounded-[21px] py-[40px] px-[20px]"
                      onClick={() =>
                        router.push(
                          `/deliveryDetails?id=${items?._id}&status=${status || (i18?.NEW?.ALL || "All")
                          }${Params ? `&suggestionid=${Params}` : ""}${Amount ? `&amount=${Amount}` : ""
                          }`
                        )
                      }
                    >
                      <p className="text-sm md:text-base mb-[20px]">
                        {i18?.NEW?.TRIPNO || "Trip No"}: {items?.uniCode}
                      </p>
                      <div className="flex flex-col lg:flex-row sm:items-center gap-8 md:gap-12">
                        <div className="flex items-center border border-1 border-btncolor rounded-[21px] p-4 h-[200px] w-[200px]">
                          <Image
                            width={800}
                            height={800}
                            src={
                              process.env.NEXT_PUBLIC_IMAGE_URL +
                              items?.postier?.vehicleDetails?.vehicleFrontImage
                            }
                            alt="image"
                            className="w-full h-[150px] object-fit"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-[30px] md:gap-[60px]">
                          <div className="flex flex-col gap-2">
                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">
                              {i18?.NEW?.PICKUP || 'Pick-up'}
                            </p>
                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">
                              {pickup?.date
                                ? `${pickup.date} , ${pickup.time}`
                                : (i18?.NEW?.NODATETIMEAVAILABLE || "No date/time available")}
                            </p>
                            <div>
                              <p className="text-[20px] md:text-[34px] font-[600] leading-[40px] max-w-[200px] md:max-w-[500px]">
                                {items?.location?.pickUpCity ||
                                  items?.location?.pickUp ||
                                  (i18?.NEW?.DEFAULTPICKUPLOCATION || "Default Pickup Location")}
                              </p>
                              <p className="text-[12px] md:text-[17px] font-[400] leading-[27px] max-w-[350px]">
                                {items?.location?.pickUp ||
                                  (i18?.NEW?.DEFAULTPICKUPLOCATION || "Default Pickup Location")}
                              </p>
                            </div>
                          </div>
                          <Image
                            width={800}
                            height={800}
                            src="/svg/icon/Arrow back.svg"
                            alt="img"
                            className="w-[30px] h-[30px]"
                          />
                          <div className="flex flex-col gap-2">
                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">
                              {i18?.NEW?.DROP_OFF || "Drop-off"}
                            </p>
                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">
                              {drop?.date
                                ? `${drop.date} , ${drop.time}`
                                : (i18?.NEW?.NODATETIMEAVAILABLE || "No date/time available")}
                            </p>
                            <div>
                              <p className="text-[20px] md:text-[34px] font-[600] leading-[40px] max-w-[200px] md:max-w-[400px]">
                                {items?.location?.dropCity ||
                                  items?.location?.drop ||
                                  (i18?.NEW?.DEFAULTDROPOFFLOCATION || "Default Drop-off Location")}
                              </p>
                              <p className="text-[12px] md:text-[17px] font-[400] leading-[27px] max-w-[350px]">
                                {items?.location?.drop ||
                                  (i18?.NEW?.DEFAULTDROPOFFLOCATION || "Default Drop-off Location")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </SkeletonComponent>
      ) : (
        <EmptyPage
          image={"/png/mytrip.png"}
          text={i18?.NEW?.TRIPEMT || "Looks like you haven’t posted any Trips"}
        // linktext={i18?.NEW?.LINKMT || 'Send your first parcel now'}
        // link={'/sendparcel/'}
        />
      )}

      <Pagination
        totalItems={Triptotal || 0}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </div>
  );
}

export default MyTrips;
