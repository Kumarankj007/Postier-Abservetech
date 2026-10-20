'use client'
import CustomBreadCrumb from '@/app/component/breadcrumbs';
import DropDown from '@/app/component/dropdown';
import EmptyPage from '@/app/component/emptydatapage';
import Pagination from '@/app/component/pagination';
import SkeletonComponent from '@/app/component/skeleton';
import PageContext from '@/app/providers/pagecontext';
import TripandParcelRequests from '@/app/store/requests';
import Store from '@/app/store/store';
import { FormatDateTime } from '@/utils';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import React, { useContext, useEffect } from 'react'

function Request() {
  const { i18 } = useContext(PageContext);
  const router = UseLoadingRouter();
  const param = useSearchParams()
  const { Page, setPage, Limit, setLimit } = Store()
  const id = param.get('id') ? param.get('id') : null
  const Status = param.get('status') ? param.get('status') : null
  const { FetchParcelRequest, ParcelRequest, Parceltotal }: any = TripandParcelRequests()
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
    FetchParcelRequest(id, data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param])
  return (
    <div className='m-[20px] md:m-[40px] lg:m-[70px]'>
      <div className='my-[40px]'>
        <CustomBreadCrumb pathSegments={Status} pathSegments2={`${ParcelRequest && (
          ParcelRequest[0]?.location?.pickUpCity !== ''
            ? ParcelRequest[0]?.location?.pickUpCity
            : ParcelRequest[0]?.location?.pickUp
        )} to ${ParcelRequest && (ParcelRequest[0]?.location?.dropCity !== ''
          ? ParcelRequest[0]?.location?.dropCity
          : ParcelRequest[0]?.location?.drop)
          }`} type='My Parcel' typeLink={`/mypost/?status=${Status}`} pathSegments3='Postier Requests' />
      </div>
      <div className='mb-[40px] flex justify-between'>
        <p className='text-[34px] font-[700] '>{i18?.NEW?.PARCEL_REQUESTS || "Parcel Requests"}</p>
        <DropDown
          img2="/svg/icon/dropdownicon.svg"
          text={status ? status : (i18?.NEW?.REQUESTED || 'Requested')}
          className='flex gap-3 justify-center items-center border border-btncolor  rounded-[17px] text-btncolor p-2 whitespace-nowrap'
          data={[
            {
              text: i18?.NEW?.ALL || 'All',
              fnc: () => handleDropdownClick('All'),
            },
            {
              text: i18?.NEW?.REQUESTED || 'Requested',
              fnc: () => handleDropdownClick('Requested'),
            },
            {
              text: i18?.NEW?.DECLINED || 'Declined',
              fnc: () => handleDropdownClick('Declined'),
            },
            {
              text: i18?.NEW?.ACCEPTED || 'Accepted',
              fnc: () => handleDropdownClick('Accepted'),
            },
          ]
          }
        />
      </div>
      {
        ParcelRequest && ParcelRequest.length > 0 ?
          <SkeletonComponent page='Mypost' >
            <div className='flex items-center justify-center mx-[20px] md:mx-[40px] lg:mx-[70px] '>
              <div className='flex flex-col gap-12 '>
                {
                  Array.isArray(ParcelRequest) && ParcelRequest?.map((items: any, index) => {
                    const pickup = items?.parcel?.pickupDate && FormatDateTime(items?.parcel?.pickupDate);
                    const drop = items?.parcel?.deliveryDate && FormatDateTime(items?.parcel?.deliveryDate);
                    return (
                      <div key={index} className='border border-1 border-btncolor rounded-[21px] py-[40px] px-[20px] relative'>
                        <p className="text-sm md:text-base mb-[20px]">
                        {i18?.NEW?.TRIPNO || "Trip No"}: {items?.referenceNo}
                      </p>
                      <div  className='flex flex-col md:flex-row items-center gap-[40px] '
                      >
                         
                        <div className='flex flex-col gap-4 items-center'>
                          <Image width={800} height={800} src={items?.consignor?.profile?.startsWith("http") ? items?.consignor?.profile : (process.env.NEXT_PUBLIC_IMAGE_URL + items?.consignor?.profile)} alt='imahe' className='w-[150px] h-[150px] rounded-full ' />
                          <p className='text-[20px] font-[700] leading-[22px]'>{items?.consignor?.firstName} {items?.consignor?.lastName}</p>
                        </div>


                        <div className="flex items-center justify-center gap-[30px]">
                          <div className="flex flex-col gap-2  truncate">
                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">{i18?.NEW?.PICKUP || 'Pick-up'}</p>
                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">
                              {pickup?.date ? `${pickup?.date} , ${pickup?.time}` : (i18?.NEW?.NODATETIMEAVAILABLE || "No date/time available")}
                            </p>
                            <div>
                              <p className="text-[20px] md:text-[34px] font-[600] leading-[44px] max-w-[200px] md:max-w-[300px] truncate">
                                {(items?.location?.pickUpCity || items?.location?.pickUp) || (i18?.NEW?.DEFAULT_PICKUP_LOCATION || "Default Pickup Location")}
                              </p>
                              <p className="text-[12px] md:text-[17px] font-[400] leading-[44px] w-[100px] md:w-[150px] lg:w-[350px] truncate">
                                {items?.location?.pickUp || (i18?.NEW?.DEFAULT_PICKUP_LOCATION || "Default Pickup Location")}
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

                          <div className="flex flex-col gap-2 truncate">
                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">{i18?.NEW?.DROP_OFF || "Drop-off"}</p>
                            <p className="text-[12px] md:text-[17px] font-[400] leading-[22px]">
                              {drop?.date ? `${drop?.date} , ${drop?.time}` : (i18?.NEW?.NODATETIMEAVAILABLE || "No date/time available")}
                            </p>
                            <div className=''>
                              <p className="text-[20px] md:text-[34px] font-[600] leading-[44px] max-w-[200px] md:max-w-[300px] truncate">
                                {(items?.location?.dropCity || items?.location?.drop) || (i18?.NEW?.DEFAULTDROPOFFLOCATION || "Default Drop-off Location")}
                              </p>
                              <p className="text-[12px] md:text-[17px] font-[400] leading-[44px] w-[100px] md:w-[150px] lg:w-[350px] truncate ">
                                {items?.location?.drop || (i18?.NEW?.DEFAULTDROPOFFLOCATION || "Default Drop-off Location")}
                              </p>
                            </div>
                            {/* <p className="text-[17px] font-[400] leading-[22px] w-full lg:max-w-[450px]">
                                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
                                                        </p> */}
                          </div>
                        </div>

                        <p className='text-[17px] font-[700] leading-[22px] underline text-btncolor cursor-pointer'
                          onClick={() => router.push(`/senderDetails/?type=request&id=${items?._id}&trip_id=${id}${items?.request?.status === 'Accepted' ? '&apistatus=Accepted' : ''}`)}>
                          {i18?.NEW?.SEEPARCEL || 'View This Parcel'}
                        </p>
                        {
                          items?.request?.status && items?.request?.status &&
                          <div className='absolute bg-[#00D566] text-[#fff] top-4 right-4 p-4 rounded-[11px]'>
                            <p>{items?.request?.status}</p>
                          </div>
                        }
                      </div>
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
            text={i18?.NEW?.TRIPEMT || 'Looks like you haven’t posted any Trips'}
          // linktext={i18?.NEW?.LINKMT || 'Send your first parcel now'}
          // link={'/sendparcel/'}
          />

      }
      <div className='mt-[40px]'>
        <Pagination totalItems={Parceltotal || 0} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
      </div>
    </div>
  )
}

export default Request