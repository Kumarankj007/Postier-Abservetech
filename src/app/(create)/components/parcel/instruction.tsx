'use client'

import MapComponent from "@/app/component/mapComp";
import Image from "next/image";
import { useContext, useEffect, useLayoutEffect } from "react";
import { useFormContext } from "../../FormCotext";
import ParcelStore from "@/app/store/parcel";
import { useSearchParams } from "next/navigation";
import StoreParcel from "@/app/store/store-parcel";
import PageContext from "@/app/providers/pagecontext";
import LinearProgressBar from "../trip/linearprogress";
import UserStore from "@/app/store/profile";

export default function Instructions({ type }: any) {
    const { setDisable }: any = useFormContext()
    const { setPacelData, Parceldata, clearAllParcelData } = StoreParcel()
    const { i18 } = useContext(PageContext);
    const { FetchMyparcelsDetails, FetchMyTripsDetails, MyTripsDetails, MyParcelsDetails }: any = ParcelStore()
  const { user, fetchProfile } = UserStore();
    const params = useSearchParams()
    const parcel_Id = params.get('parcel_id')
    const trip_Id = params.get('trip_id')

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
        clearAllParcelData()
        fetchProfile()
        if (parcel_Id) {
            FetchMyparcelsDetails(parcel_Id)
        } else if (trip_Id) {
            FetchMyTripsDetails(trip_Id)
        }
        setDisable(user?.profilePercentage == 0 || (user?.profilePercentage &&  user?.profilePercentage < 100) ? true : false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // console.log('MyParcelsDetails', MyParcelsDetails)

    useEffect(() => {
        if (parcel_Id) {
            if (MyParcelsDetails) {
                // debugger
                const transformData: any = (MyParcelsDetails: any) => {
                    const parcelTypes = MyParcelsDetails?.parcel?.type
                        ?.split(',')
                        .map((type: string) => {
                            return { name: type.trim() };
                        });


                    return {
                        pickup: MyParcelsDetails?.location?.pickUp,
                        pickupAddress: {
                            primaryAddress: MyParcelsDetails?.location?.pickUp,
                            secondaryAddress: `${MyParcelsDetails?.location?.pickUpCity}, Tamil Nadu, India`,
                            latLng: [...(MyParcelsDetails?.location?.startCoords?.coordinates || [])].reverse(), // Reverse for [lat, lng]
                            city: MyParcelsDetails?.location?.pickUpCity,
                        },
                        pickupLat: MyParcelsDetails?.location?.startCoords?.coordinates?.[1], // After reverse, [lat, lng]
                        pickupLng: MyParcelsDetails?.location?.startCoords?.coordinates?.[0],
                        pickUpCity: MyParcelsDetails?.location?.pickUpCity,
                        drop: MyParcelsDetails?.location?.drop,
                        dropAddress: {
                            primaryAddress: MyParcelsDetails?.location?.drop,
                            latLng: [...(MyParcelsDetails?.location?.endCoords?.coordinates || [])].reverse(), // Reverse for [lat, lng]
                            city: MyParcelsDetails?.location?.dropCity,
                        },
                        dropLat: MyParcelsDetails?.location?.endCoords?.coordinates?.[1],
                        dropLng: MyParcelsDetails?.location?.endCoords?.coordinates?.[0],
                        dropCity: MyParcelsDetails?.location?.dropCity,
                        deliveryType: MyParcelsDetails?.parcel?.deliveryType,
                        pickupDate: MyParcelsDetails?.parcel?.pickupDate,
                        deliveryDate: MyParcelsDetails?.parcel?.deliveryDate,
                        category: parcelTypes,
                        width: MyParcelsDetails?.parcel?.width,
                        dimensionType: MyParcelsDetails?.parcel?.dimensionType,
                        height: MyParcelsDetails?.parcel?.height,
                        length: MyParcelsDetails?.parcel?.length,
                        weight: MyParcelsDetails?.parcel?.weight,
                        fare: MyParcelsDetails?.parcel?.fare,
                        isPrivateImage: MyParcelsDetails?.parcel?.isPrivateImage,
                        primaryImage: MyParcelsDetails?.parcel?.image?.map((img: any) => img?.primaryImage),
                        frontviewImage: MyParcelsDetails?.parcel?.image?.map((img: any) => img?.frontviewImage),
                        topviewImage: MyParcelsDetails?.parcel?.image?.map((img: any) => img?.topviewImage),
                        sideviewImage: MyParcelsDetails?.parcel?.image?.map((img: any) => img?.sideviewImage),
                        desc: MyParcelsDetails?.parcel?.desc,
                    };
                };

                const transformedData = transformData(MyParcelsDetails);

                Object.keys(transformedData).forEach(key => {
                    setPacelData(key, transformedData[key]);
                });
            }
        }
        else if (trip_Id) {
            const Trip: any = (MyTripsDetails: any) => {
                const parcelTypes = MyTripsDetails?.type
                    ?.split(',')
                    .map((type: string) => {
                        return { name: type.trim() };
                    });
                const StopPoint = MyTripsDetails?.stopPoints && MyTripsDetails?.stopPoints.map((items: any) => {
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
                    pickup: MyTripsDetails?.location?.pickUp || 'Unknown Pickup Location',
                    pickupAddress: {
                        primaryAddress: MyTripsDetails?.location?.pickUp || 'Unknown Pickup Location',
                        secondaryAddress: `${MyTripsDetails?.location?.pickUpCity || 'Unknown City'}, ${MyTripsDetails?.location?.dropCity || 'Unknown Drop City'}, India`,
                        latLng: MyTripsDetails?.location?.startCoords?.coordinates || [0, 0],
                        place_id: 'some_place_id',
                        city: MyTripsDetails?.location?.pickUpCity || 'Unknown City'
                    },
                    pickupLat: MyTripsDetails?.location?.startCoords?.coordinates?.[1] || 0,
                    pickupLng: MyTripsDetails?.location?.startCoords?.coordinates?.[0] || 0,
                    pickUpCity: MyTripsDetails?.location?.pickUpCity || MyTripsDetails?.location?.pickUp,
                    dropLng: MyTripsDetails?.location?.endCoords?.coordinates?.[0] || 0,
                    dropLat: MyTripsDetails?.location?.endCoords?.coordinates?.[1] || 0,
                    dropAddress: {
                        primaryAddress: MyTripsDetails?.location?.drop || 'Unknown Drop Address',
                        secondaryAddress: MyTripsDetails?.location?.drop || 'Unknown Drop Address',
                        latLng: 'GhIJehfvx-3nJ0AR0xHAzeLXUkA',
                        place_id: 'some_place_id'
                    },
                    dropCity: MyTripsDetails?.location?.dropCity || MyTripsDetails?.location?.drop,
                    drop: MyTripsDetails?.location?.drop || 'Unknown Drop Address',
                    wayPointId: MyTripsDetails?.wayPointId || 'Unknown',
                    stopPointsArr: StopPoint,
                    deliveryType: MyTripsDetails?.deliveryType,
                    pickupDate: MyTripsDetails?.pickupDate,
                    deliveryDate: MyTripsDetails?.deliveryDate,
                    category: parcelTypes,
                    width: MyTripsDetails?.maxWidth,
                    dimensionType: MyTripsDetails?.dimensionType,
                    height: MyTripsDetails?.maxHeight,
                    length: MyTripsDetails?.maxLength,
                    weight: MyTripsDetails?.maxWeight,
                    VehicleCapacity: MyTripsDetails?.capacity,
                    instantBooking: MyTripsDetails?.instantBooking,
                    desc: MyTripsDetails?.description,
                    vehicleId: MyTripsDetails?.postier?.vehicleDetails?._id,
                    routeObject: {}
                }

            }
            const transformedData = Trip(MyTripsDetails);

            Object.keys(transformedData).forEach(key => {
                setPacelData(key, transformedData[key]);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MyParcelsDetails, MyTripsDetails, setPacelData]);


    // console.log('MyTripsDetails', Parceldata)
    // console.log(user?.profilePercentage, 'user?.profilePercentage')
    const mapData = type ? data2 : data
    return (
        <div className="flex items-center my-5">
            <section className="max-w-[1450px] mx-auto lg:mt-0 mt-30">
                <LinearProgressBar Price={user?.profilePercentage} instruction={true} />
                <div className="px-[20px] grid grid-cols-1 lg:grid-cols-2 lg:gap-0 gap-6">
                    <div className="w-full m-auto pr-[20px]">
                        {
                            type ?
                                <h3 className="text-[20px] md:text-[50px] font-bold ">{i18?.NEW?.PUBLISHTRIPDELIVERPARCELS || 'Publish a trip, Deliver'}<br />
                                    {i18?.NEW?.PUBLISHTRIPDELIVERPARCELS2 || 'parcels & earn money'}</h3>
                                :
                                <h3 className="text-[25px] md:text-[50px] font-bold md:pl-0 pl-4 my-4 md:my-0">{i18?.NEW?.SENDPARCELANYWHERE || 'Send a Parcel From'}<br />
                                    {i18?.NEW?.SENDPARCELANYWHERE2 || 'Anywhere to Anyplace'}</h3>
                        }

                    </div>
                    <div className="w-full">
                        <div className="flex flex-col gap-4 ">
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
            </section>
        </div>

    )
}