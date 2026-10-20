/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import React, { useContext, useEffect } from 'react'
import { useSearchParams } from 'next/navigation';
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";

import Store from '@/app/store/store';
import TypeStore from '@/app/store/typeStore';
import PageContext from '@/app/providers/pagecontext';
import Button from '../button';
import RoleStore from '@/app/store/RoleStore';
import Image from 'next/image';
import ParcelStore from '@/app/store/parcel';
import useLoaderStore from '@/app/hooks/loader';
import ThreeDotLoader from '../threedotloader';
type Inputs = {
    updatePrice: string
}
const RequestModal = (data: any) => {
    const Details = data?.data?.value
    const { i18 } = useContext(PageContext);
    const { loading } = useLoaderStore()
    const searchParams: any = useSearchParams()
    const { FetchMyparcels, FetchMyTrips, total, Triptotal } = ParcelStore()
    const id = searchParams.get('id')
    const router = UseLoadingRouter();
    const { setModal } = Store()
    const { Type } = TypeStore()
    const { RoleSwitch } = RoleStore()
    const currentParams = new URLSearchParams(searchParams.entries());
    // const paramsObject = Object.fromEntries(searchParams.entries());

    const handleNewParcel = () => {
        if (RoleSwitch === 'user') {
            router.replace(`/chooseparcel?${currentParams}`, { scroll: false })
        } else {
            router.replace(`/choosetrip?${currentParams}`, { scroll: false })
        }
        setModal('')
    }
    const handleExistingParcel = () => {
        if (RoleSwitch === 'user') {
            currentParams.set('suggestionId', id)
            currentParams.set('status', 'Published')

            if (Details?.pickupDate) {
                currentParams.set('pickupDate', Details?.pickupDate)
            }
            if (Details?.deliveryDate) {
                currentParams.set('deliveryDate', Details?.deliveryDate)
            }

            router.push(`/mypost?${currentParams}`, { scroll: false })
        } else {
            currentParams.set('suggestionId', id)
            currentParams.set('status', 'Published')

            if (Details?.parcel?.pickupDate) {
                currentParams.set('pickupDate', Details?.parcel?.pickupDate)
            }
            if (Details?.parcel?.deliveryDate) {
                currentParams.set('deliveryDate', Details?.parcel?.deliveryDate)
            }
            
            router.push(`/mytrips?${currentParams}`, { scroll: false })
        }
        setModal('')
    }
    // console.log('datareq', Details)

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


        data.page = 1
        data.limit = 5
        data.status = 'Published'
        if (pickupDate) {
            data.pickupDate = pickupDate
        }
        if (deliveryDate) {
            data.page = deliveryDate
        }
        if (RoleSwitch === 'user') {
            FetchMyparcels(data)
        } else {
            FetchMyTrips(data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])
    return (
        <>
            {
                <div className='flex flex-col gap-6 mt-2'>
                    <p className='font-normal'>{RoleSwitch === 'user' ? i18?.NEW?.MODALTITLE23 || 'Select the parcel you want to use ship (or) you can create a new parcel to ship with this postier' : i18?.NEW?.MODALTITLE1 || 'Select the parcel you want to use ship (or) you can create a new parcel to ship with this postier'}</p>
                    {
                        loading ?
                            <ThreeDotLoader />
                            :
                            <div className='flex items-center justify-center gap-[30px] mt-8'>
                                {
                                    (RoleSwitch === 'user' ? total : Triptotal) > 0
                                    &&
                                    <div className='flex flex-col gap-4 items-center justify-center p-3 md:p-4 border border-1 border-btncolor rounded-[21px] w-[250px] h-[250px]  cursor-pointer' onClick={handleExistingParcel}>
                                        {/* {RoleSwitch === 'user' ? i18?.NEW?.EXISTINGPARCEL || 'Existing Parcel' : 'Existing Trip'} */}
                                        <Image src='/svg/icon/Package2.svg' width={800} height={800} alt='img' className='w-[30px] h-[30px]' />
                                        <p className='w-[180px] text-center'>{RoleSwitch === 'user' ? i18?.NEW?.CHOOSE_EXISTING_PARCEL || "Choose one from the existing parcels" : i18?.NEW?.CHOOSE_EXISTING_TRIP || "Choose one from the existing trips"}</p>
                                    </div>
                                }

                                <div className='flex flex-col gap-4 items-center justify-center p-3 md:p-4 border border-1 border-btncolor rounded-[21px] w-[250px] h-[250px]  cursor-pointer' onClick={handleNewParcel}>
                                    {/* {RoleSwitch === 'user' ? i18?.NEW?.EXISTINGPARCEL || 'Existing Parcel' : 'Existing Trip'} */}
                                    <Image src='/svg/icon/folder-plus.svg' width={800} height={800} alt='img' className='w-[30px] h-[30px]' />
                                    <p className='w-[180px] text-center'>{RoleSwitch === 'user' ? i18?.NEW?.CREATE_NEW_PARCEL || "Create a new parcel to ship" : i18?.NEW?.CREATE_NEW_TRIP || "Create a new trip"}</p>
                                </div>
                                {/* <Button className='p-3 md:p-4 w-full md:w-52 bg-btncolor rounded-[7px] text-[#fff] cursor-pointer' onClick={handleNewParcel}>{RoleSwitch === 'user' ? i18?.NEW?.NEWPARCEL || 'New Parcel' : i18?.NEW?.NEWTRIP || 'New Trip'}</Button> */}
                            </div>
                    }

                </div>
            }

        </>
    )
}

export default RequestModal
