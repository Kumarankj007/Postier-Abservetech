'use client';
import DropDown from '@/app/component/dropdown';
import EmptyPage from '@/app/component/emptydatapage';
import Pagination from '@/app/component/pagination';
import SkeletonComponent from '@/app/component/skeleton';
import UseLoadingRouter from '@/app/hooks/useLoadingRoutes';
import PageContext from '@/app/providers/pagecontext';
import TripandParcelRequests from '@/app/store/requests';
import RoleStore from '@/app/store/RoleStore';
import Store from '@/app/store/store';
import { FormatDateTime } from '@/utils';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { useContext, useEffect } from 'react'
import VehicleImgCarousel from '../mypost/carousel';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

function MyRequest() {
    const { i18 } = useContext(PageContext);
    const router = UseLoadingRouter();
    const param = useSearchParams()
    const { RoleSwitch } = RoleStore()
    const UserID = typeof window !== undefined && localStorage.getItem('appUserId')
    const { Page, setPage, Limit, setLimit } = Store()
    const id = param.get('id') ? param.get('id') : null
    const Status = param.get('status') ? param.get('status') : null
    const { FetchMyRequest, myrequest, myrequestTotal }: any = TripandParcelRequests()
    const status = (param.size > 0 && param.get('status')) && param.get('status')

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
        const data: any = {}

        if (status) {
            data.status = status
        }
        if (Page) {
            data.page = Page
        }
        if (Limit) {
            data.limit = Limit
        }
        FetchMyRequest({ type: RoleSwitch })
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // console.log('myrequest', myrequest)
    return (
        <div className='px-[20px] max-w-[1400px] mx-auto'>
            <div className='my-[40px]'>
                {/* <CustomBreadCrumb pathSegments={Status} pathSegments2={`${ParcelRequest && (
            ParcelRequest[0]?.location?.pickUpCity !== ''
              ? ParcelRequest[0]?.location?.pickUpCity
              : ParcelRequest[0]?.location?.pickUp
          )} to ${ParcelRequest && (ParcelRequest[0]?.location?.dropCity !== ''
            ? ParcelRequest[0]?.location?.dropCity
            : ParcelRequest[0]?.location?.drop)
            }`} type='My Parcel' typeLink={`/mypost/?status=${Status}`} pathSegments3='Postier Requests' /> */}
            </div>
            <div className='mb-[40px] flex justify-center items-center'>
                <p className='text-[34px] font-[700] '>{i18?.NEW?.REQUESTS || "Requests"}</p>
            </div>
            {
                myrequest && myrequest.length > 0 ?
                    <SkeletonComponent page='Mypost' >
                        <div className='flex items-center justify-center'>
                            <div className='flex flex-col gap-12'>
                                {
                                    Array.isArray(myrequest) && myrequest?.map((items: any, index) => {
                                        const pickup = RoleSwitch === 'user' ? items?.parcel?.pickupDate && FormatDateTime(items?.parcel?.pickupDate) : items?.pickupDate && FormatDateTime(items?.pickupDate);
                                        const drop = RoleSwitch === 'user' ? items?.parcel?.deliveryDate && FormatDateTime(items?.parcel?.deliveryDate) : items?.deliveryDate && FormatDateTime(items?.deliveryDate);
                                        const orgImg = items?.postier?.vehicleDetails?.vehicleFrontImage;
                                        const vehicleImg = orgImg?.startsWith("http") ? orgImg : process.env.NEXT_PUBLIC_IMAGE_URL + orgImg;
                                        return (
                                            <div key={index} className='flex flex-col md:flex-row items-center gap-[40px] border border-1 border-btncolor rounded-[21px] py-[40px] px-[20px] relative'>
                                                {
                                                    RoleSwitch === 'user' ?
                                                        <div className="border border-1 border-btncolor  rounded-[21px] p-4 h-[200px] w-[200px]">
                                                            <VehicleImgCarousel VehicleDoc={items?.parcel?.image} />
                                                        </div>
                                                        :

                                                        <div className="flex items-center border border-1 border-btncolor  rounded-[21px] p-4 h-[200px] max-w-[200px]">
                                                            <Image width={800} height={800} src={vehicleImg} alt='imahe' className='w-[150px] h-[150px]' />
                                                        </div>
                                                }



                                                <div className="flex flex-col sm:flex-row items-center justify-center gap-[30px]">
                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-[17px] font-[400] leading-[22px]">{i18?.NEW?.PICKUP || 'Pick-up'}</p>
                                                        <p className="text-[17px] font-[400] leading-[22px]">
                                                            {pickup?.date ? `${pickup?.date} , ${pickup?.time}` : (i18?.NEW?.NODATETIMEAVAILABLE || "No date/time available")}
                                                        </p>
                                                        <div>
                                                            <p className="text-[34px] font-[600] leading-[40px] max-w-[500px]">
                                                                {(items?.location?.pickUpCity || items?.location?.pickUp) || (i18?.NEW?.DEFAULTPICKUPLOCATION || "Default Pickup Location")}
                                                            </p>
                                                            <p className="text-[17px] font-[400] leading-[27px] max-w-[300px]">
                                                                {items?.location?.pickUp || (i18?.NEW?.DEFAULTPICKUPLOCATION || "Default Pickup Location")}
                                                            </p>
                                                        </div>
                                                        {/* <p className="text-[17px] font-[400] leading-[22px] w-full lg:max-w-[450px]">
                                                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
                                                          </p> */}
                                                    </div>

                                                    <Image
                                                        width={800}
                                                        height={800}
                                                        src="/svg/icon/Arrow back.svg"
                                                        alt="img"
                                                        className="w-[30px] h-[30px]"
                                                    />

                                                    <div className="flex flex-col gap-2">
                                                        <p className="text-[17px] font-[400] leading-[22px]">{i18?.NEW?.DROP_OFF || "Drop-off"}</p>
                                                        <p className="text-[17px] font-[400] leading-[22px]">
                                                            {drop?.date ? `${drop?.date} , ${drop?.time}` : (i18?.NEW?.NODATETIMEAVAILABLE || "No date/time available")}
                                                        </p>
                                                        <div className=''>
                                                            <p className="text-[34px] font-[600] leading-[40px] max-w-[400px]">
                                                                {(items?.location?.dropCity || items?.location?.drop) || (i18?.NEW?.DEFAULTDROPOFFLOCATION || "Default Drop-off Location")}
                                                            </p>
                                                            <p className="text-[17px] font-[400] leading-[27px] max-w-[350px]">
                                                                {items?.location?.drop || (i18?.NEW?.DEFAULTDROPOFFLOCATION || "Default Drop-off Location")}
                                                            </p>
                                                        </div>
                                                        {/* <p className="text-[17px] font-[400] leading-[22px] w-full lg:max-w-[450px]">
                                                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
                                                          </p> */}
                                                    </div>
                                                </div>
                                                {
                                                    items?.requestDetails.length > 0 &&(
                                                    <>
                                                        <p className='text-[17px] font-[700] leading-[22px] underline text-btncolor cursor-pointer'
                                                            onClick={() =>  RoleSwitch === 'user' ? router.push(`/request?id=${items?._id}&status=All`) : router.push(`/triprequest?id=${items?._id}&status=All`)}>
                                                            {/* {i18?.NEW?.SEEPARCEL || 'View Requests'} */}
                                                            {i18?.NEW?.VIEWREQUESTS || 'View Requests'}
                                                        </p>
                                                        <div className='absolute bottom-4 right-4'>
                                                            <AvatarGroup spacing="small">
                                                                {
                                                                    Array.isArray(items?.requestDetails) && items?.requestDetails.map((items: any, index: any) => {
                                                                        const indx = items?.userInfo?.findIndex((item: any) => UserID !== item?._id);
                                                                        return (
                                                                            <div key={index}>
                                                                                <Avatar alt='' src={process.env.NEXT_PUBLIC_IMAGE_URL + items?.userInfo[indx]?.profile} />
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </AvatarGroup>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })
                                }
                            </div>

                        </div>
                    </SkeletonComponent>
                    :
                    <EmptyPage
                        image={'/png/mytrip.png'}
                        //   text={i18?.NEW?.TRIPEMT || 'Looks like you haven’t posted any Trips'}
                        // linktext={i18?.NEW?.LINKMT || 'Send your first parcel now'}
                        // link={'/sendparcel/'}
                        text= {i18?.NEW?.LOOKSLIKEYOUHAVENTANYREQUEST || 'Looks like you haven’t any request'}
                    />
            }
            <div className='mt-[40px]'>
                <Pagination totalItems={myrequestTotal || 0} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
            </div>
        </div>
    )
}

export default MyRequest