'use client'

import Image from "next/image";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import ParcelStore from "@/app/store/parcel";
import { useSearchParams } from "next/navigation";
import StoreParcel from "@/app/store/store-parcel";
import PageContext from "@/app/providers/pagecontext";
import { useFormContext } from "../FormCotext";
import RoleStore from "@/app/store/RoleStore";
import { fetchAddress, GetAddressFromLatLng } from "@/utils";
import Store from "@/app/store/store";
import { debug } from "console";

export default function Instructions({ type }: any) {
    const { setDisable }: any = useFormContext()
    const { setPacelData, Parceldata, clearAllParcelData } = StoreParcel()
    const { GooglemapLoader } = Store()
    const { i18 } = useContext(PageContext);
    const { RoleSwitch } = RoleStore()
    const [city, setCity] = useState<any>({
        pickup: '',
        drop: ''
    })
    const { FetchMyparcelsDetails, FetchMyTripsDetails, MyTripsDetails, MyParcelsDetails }: any = ParcelStore()
    const params = useSearchParams()
    const Suggestion_id = params.get('id')
    const pickup_lat:any = params.get('pickupLat')
    const pickup_lng:any = params.get('pickupLng')
    const drop_lat:any = params.get('dropLat')
    const drop_lng:any = params.get('dropLng')
    const pickup_address = params.get('pickupAddress')
    const drop_address = params.get('dropAddress')
    const droplat = params.get('droplat') ? params.get('droplat') : null
    const droplng = params.get('droplng') ? params.get('droplng') : null
    const Type = params.get('type') ? params.get('type') : null

    const Cities = async (lat: any, lng: any, type: string) => {
        try {
          const address: any = await GetAddressFromLatLng(lat, lng);
          if (GooglemapLoader && address?.place_id) {
            const City: any = await fetchAddress(address.place_id);
            setCity((prev:any) => ({
              ...prev,
              [type]: City?.City || "Unknown City",
            }));
          }
        } catch (error) {
          console.error("Error fetching city data:", error);
        } 
      };

    useEffect(() => {
        if (pickup_lat && pickup_lng) {
            Cities(pickup_lat, pickup_lng, 'pickup')
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ pickup_lng,pickup_lat])
    useEffect(() => {
        if (drop_lat && drop_lng) {
            Cities(drop_lat, drop_lng, 'drop')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ drop_lng,drop_lat])
    // console.log('cityy', city?.pickup)
    const data = [
        {
            header: i18?.NEW?.ENTER_PICKUP_DESTINATION || 'Fill in Your Details:',
            content: i18?.NEW?.ACCURATE_ADDRESSES_INFO || 'Simply provide the pickup and destination locations, parcel description, and preferred pickup time.',
            icon: '/svg/icon/map.svg'
        },
        // {
        //     header: i18?.NEW?.ENTER_PICKUP_DESTINATION || 'Enter the pickup & destination points',
        //     content: i18?.NEW?.ACCURATE_ADDRESSES_INFO || 'Provide the pickup location and the delivery destination for your parcel. Ensure the addresses are accurate to avoid delays',
        //     icon: '/svg/icon/map.svg'
        // },
        {
            header: i18?.NEW?.PARCEL_DETAILS_INFO || 'Select Your Postier:',
            content: i18?.NEW?.PARCEL_DESCRIPTION || 'Choose from available Postiers or get matched with one heading your way.',
            icon: '/svg/icon/parcelCreate.svg'
        },
        // {
        //     header: i18?.NEW?.PARCEL_DETAILS_INFO || 'Provide detailed information about Parcel ',
        //     content: i18?.NEW?.PARCEL_DESCRIPTION || 'Describe your parcel, including its size, weight, type (fragile, perishable, etc.), and any special handling instructions.',
        //     icon: '/svg/icon/parcelCreate.svg'
        // },
        {
            header: i18?.NEW?.SENDER_RECEIVER_INFO || 'Confirm and Ship:',
            content: i18?.NEW?.SENDER_RECEIVER_DETAILS || `Review your parcel details, complete payment, and your parcel will be on its way!`,
            icon: '/svg/icon/files.svg'
        },
        {
            header: i18?.NEW?.TRACK_THE_JOURNEY || 'Track the Journey:',
            content: i18?.NEW?.TRACK_THE_JOURNEY_DETAILS || `You can follow your parcel in real-time, ensuring peace of mind with every step.`,
            icon: '/png/cashDL.png'
        }
    ]

    const data2 = [
        {
            header: i18?.NEW?.ENTER_JOURNEY_POINTS || 'Enter the start & end points',
            content: i18?.NEW?.JOURNEY_DETAILS_INFO || 'Easily specify your journey by entering your starting location and destination. Plan your trip with precision using our intuitive interface.',
            icon: '/svg/icon/map.svg'
        },
        {
            header: i18?.NEW?.TRIP_DETAILS_INFO || 'Provide detailed information about trips',
            content: i18?.NEW?.TRIP_DESCRIPTION || 'Add trip details such as travel dates, preferred stops, and special requirements to ensure a smooth experience. Get all the essential information at your fingertips.',
            icon: '/svg/icon/bag.svg'
        },
        {
            header: i18?.NEW?.VEHICLE_PRICING_BOOKING || 'Provide vehicle details, Pricing, Instant booking',
            content: i18?.NEW?.VEHICLE_BOOKING_DESCRIPTION || 'Choose from a wide range of vehicles, view transparent pricing, and confirm your booking instantly. Enjoy a hassle-free experience tailored to your needs.',
            icon: '/svg/icon/dollarsymbol.svg'
        }
    ]

    useLayoutEffect(() => {
        setDisable(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        clearAllParcelData();
        if (RoleSwitch === 'user') {
            FetchMyTripsDetails(Suggestion_id, Type, droplat, droplng)
        } else if (RoleSwitch === 'postier') {
            FetchMyparcelsDetails(Suggestion_id,Type)
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
// console.log('MyTripsDetails',MyTripsDetails?.dimensionType)
    useEffect(() => {
        if (RoleSwitch === 'user') {
            if (MyTripsDetails) {
                const transformData: any = (MyTripsDetails: any) => {

                    return {
                        pickupAddress: {primaryAddress:pickup_address || 'Unknown Pickup Location'},
                        pickup: pickup_address,
                        pickupLat: pickup_lat || 0,
                        pickupLng: pickup_lng || 0,
                        pickUpCity: city?.pickup,
                        dropLng: drop_lng || 0,
                        dropLat: drop_lat || 0,
                        dropCity: city?.drop,
                        dropAddress: {primaryAddress:drop_address || 'Unknown Drop Address'},
                        drop: drop_address,
                        deliveryType: MyTripsDetails?.deliveryType,
                        pickupDate: MyTripsDetails?.pickupDate,
                        deliveryDate: MyTripsDetails?.deliveryDate,
                        category: '',
                        width: '',
                        dimensionType: MyTripsDetails?.dimensionType,
                        height: '',
                        length: '',
                        weight: '',
                        fare: MyTripsDetails?.avgPrice,
                        isPrivateImage: '',
                        primaryImage:'',
                        frontviewImage: '',
                        topviewImage:'',
                        sideviewImage: '',
                        desc: '',
                    };
                };

                const transformedData = transformData(MyTripsDetails);
                //  debugger   
                Object.keys(transformedData).forEach(key => {
                    setPacelData(key, transformedData[key]);
                });
            }
        }
        else if (RoleSwitch === 'postier') {
            const Trip: any = (MyParcelsDetails: any) => {
                const parcelTypes = MyParcelsDetails?.type
                    ?.split(',')
                    .map((type: string) => {
                        return { name: type.trim() };
                    });
                const StopPoint = MyParcelsDetails?.stopPoints && MyParcelsDetails?.stopPoints.map((items: any) => {
                    return (
                        {
                            name: items?.name,
                            city: items?.city,
                            lng: items?.coords?.coordinates[0],
                            lat: items?.coords?.coordinates[1]
                        }
                    )
                })
                return {
                    pickupAddress: {primaryAddress:pickup_address || 'Unknown Pickup Location'},
                    pickup: pickup_address,
                    pickupLat: parseFloat(pickup_lat) || 0,
                    pickupLng: parseFloat(pickup_lng) || 0,
                    pickUpCity: city?.pickup,
                    dropLng: parseFloat(drop_lng) || 0,
                    dropLat: parseFloat(drop_lat) || 0,
                    dropCity: city?.drop,
                    dropAddress: {primaryAddress:drop_address || 'Unknown Drop Address'},
                    drop: drop_address,
                    wayPointId: '',
                    stopPointsArr: [],
                    deliveryType: MyParcelsDetails?.parcel?.deliveryType,
                    pickupDate: MyParcelsDetails?.parcel?.pickupDate,
                    deliveryDate: MyParcelsDetails?.parcel?.deliveryDate,
                    category: '',
                    width: '',
                    dimensionType: MyParcelsDetails?.parcel?.dimensionType,
                    height: '',
                    length: '',
                    weight: '',
                    VehicleCapacity: '',
                    instantBooking: '',
                    desc: '',
                    vehicleId: '',
                    routeObject: {}
                }

            }
            const transformedData = Trip(MyParcelsDetails);
            // console.log('transformedData',transformedData)
            Object.keys(transformedData).forEach(key => {
                setPacelData(key, transformedData[key]);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MyParcelsDetails, MyTripsDetails, setPacelData,city]);

    const mapData = type ? data2 : data
    return (
        <div className="flex h-full">
            <div className="w-1/2 flex  justify-center items-center ">
                {
                    type ?
                        <h3 className="text-[50px] font-bold">{i18?.NEW?.PUBLISHTRIPDELIVERPARCELS || 'Publish a trip, Deliver'}<br />
                            {i18?.NEW?.PUBLISHTRIPDELIVERPARCELS2 || 'parcels & earn money'}</h3>
                        :
                        <h3 className="text-[50px] font-bold">{i18?.NEW?.SENDPARCELANYWHERE || 'Send a Parcel From'}<br />
                            {i18?.NEW?.SENDPARCELANYWHERE2 || 'Anywhere to Anyplace'}</h3>
                }
            </div>
            <div className="w-1/2  flex  justify-center items-center">
                <div className="flex flex-col  gap-4">
                    {!type && (
                        <div className="p-4">
                            <strong className="text-[20px] mb-3 lg:w-3/5 mx-auto font-bold leading-[27px] block lg:text-center">{i18?.NEW?.SEND_YOUR_PARCEL ||"Send Your Parcel with Postier A Global Delivery Service You Can Trust!"}</strong>
                            <p className="text-[17px] font-[400] leading-[31px] lg:text-center">{i18?.NEW?.SEND_YOUR_PARCEL_CONTENT || "At Postier, our mission is to make parcel delivery fast, affordable, and reliable, no matter where you're sending it. Whether it's across the street or across the globe, we connect you with trusted Postiers who travel along your desired route."}</p>
                        </div>
                    )}
                    {
                        mapData.map((items: any, index: any) => {
                            return (
                                <div key={index} className="flex justify-between p-4 border-b gap-6">
                                    <div className="flex flex-col gap-3">
                                        <p className="text-[20px] font-bold leading-[27px] ">{items.header}</p>
                                        <p className="text-[17px] font-[400] leading-[31px] w-full md:max-w-[500px]">{items.content}</p>
                                    </div>
                                    <Image src={items.icon} alt="img" className="w-[100px] h-[100px]" width={800} height={800} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}