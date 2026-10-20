'use client';
import React, { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader, InfoWindow, MarkerF } from "@react-google-maps/api";
import Customepolyline from "@/app/(create)/components/trip/customepolyline";
import Store from "@/app/store/store";
import RoleStore from "@/app/store/RoleStore";
import PageContext from "@/app/providers/pagecontext";
import { createCustomIcon } from "@/utils";



type Coordinates = [number, number];

interface RouteMapProps {
    startCoords: Coordinates;
    endCoords: Coordinates;
    SingleRoutes: any;
    // handleReult: (combinedRoutes: any) => void;
    MyParcelsDetails: any
    screen?: any;
    MyTripsDetails: any;
    ParcelRequest: any
}

let geometryTimer;

export default function RouteMap({ startCoords, endCoords, SingleRoutes, MyParcelsDetails, MyTripsDetails, ParcelRequest }: RouteMapProps) {

    //   console.log('SingleRoutes', SingleRoutes)
    const containerStyle: any = {
        width: '100%',
        height: '100%',
        position: 'block'
    };
    const { RoleSwitch } = RoleStore()
    const { i18 } = useContext(PageContext);
    const [loader, setLoder] = useState(false)
    const { setModal } = Store()
    const center: any = useMemo(() => ({
        lat: (startCoords[1] + endCoords[1]) / 2,
        lng: (startCoords[0] + endCoords[0]) / 2,
      }), [startCoords, endCoords]);
      

    const apiKey = process.env.NEXT_PUBLIC_MAP_ID as string;

    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: apiKey,
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);

    const onLoad = useCallback((map: google.maps.Map) => {
        const bounds = new google.maps.LatLngBounds(center);
        // map.fitBounds(bounds);
        setMap(map);
        map.setZoom(12);
        setLoder(true)
        // geometryTimer = setInterval(()=>{
        //   console.log('working');
        //   if(window?.google?.maps?.geometry?.encoding?.decodePath) {
        //     console.log('working2');
        //     clearInterval(geometryTimer);
        //     setLoder(true)
        //   }
        // },300);
        // return ()=>{
        //   clearInterval(geometryTimer);
        // }
    }, [center]);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    if (loadError) return <div>{i18?.NEW?.ERROR_LOADING_GOOGLE_MAPS || "Error loading Google Maps"}</div>;
    if (!isLoaded) return <div>{i18?.NEW?.LOADING || "Loading"}...</div>;

    // console.log('MyTripsDetails', MyTripsDetails)
    //   console.log("ParcelRequest",ParcelRequest)
    return (
        // <LoaderScript>
        <GoogleMap
            mapContainerStyle={containerStyle}
            onLoad={onLoad}
            onUnmount={onUnmount}
            center={center}
        >
            {
                Array.isArray(MyTripsDetails?.stopPoints) && MyTripsDetails?.stopPoints.length > 0 &&
                Array.isArray(MyTripsDetails?.stopPoints) && MyTripsDetails?.stopPoints.map((items: any, index: any) => {
                    return (
                        <Marker icon={{
                            url: '/svg/icon/share_location.svg', scaledSize: new window.google.maps.Size(35, 35),
                        }} key={index} position={{ lat: items?.coords?.coordinates[1], lng: items?.coords?.coordinates[0] }} />
                    )
                })
            }
            {
                ( Array.isArray(ParcelRequest)) &&
                ParcelRequest.map((items: any, index: any) => {
                    return (
                        <>
                            {
                                <MarkerF
                                    icon={{
                                        url: '/svg/icon/share_location.svg',
                                        scaledSize: new window.google.maps.Size(35, 35)
                                    }}
                                    position={{ lat: items?.location?.startCoords?.coordinates[1], lng: items?.location?.startCoords?.coordinates[0] }}>
                                    {
                                        (RoleSwitch === 'postier' && items.paymentStatus === 'PAID' && (items.status === 'Accepted' || items.status === 'Pickedup')) &&
                                        <InfoWindow
                                        >
                                            <div className="p-4 flex flex-col gap-1 ">
                                                <p className="text-[12px] font-[700] leading-[15px] capitalize">{items?.consignor?.firstName} {items?.consignor?.lastName}</p>
                                                <p onClick={() => setModal('SendOTP', ({ type: 'pickup', parcelid: items?._id }))} className="text-[12px] font-[400] leading-[15px] underline capitalize cursor-pointer">Enter Pickup Code</p>
                                            </div>
                                        </InfoWindow>
                                    }

                                </MarkerF>}
                            {
                                <MarkerF
                                    icon={{
                                        url: '/svg/icon/share_location (1).svg',
                                        scaledSize: new window.google.maps.Size(35, 35)
                                    }}
                                    position={{ lat: items?.location?.endCoords?.coordinates[1], lng: items?.location?.endCoords?.coordinates[0] }}>
                                    {(RoleSwitch === 'postier' && items.status === 'Transit') &&
                                        <InfoWindow
                                        >
                                            <div className="p-4 flex flex-col gap-1">
                                                <p className="text-[12px] font-[700] leading-[15px] capitalize">{items?.consignee?.firstName} {items?.consignee?.lastName}</p>
                                                <p onClick={() => setModal('SendOTP', ({ type: 'drop', parcelid: items?._id }))} className="text-[12px] font-[400] leading-[15px] underline capitalize cursor-pointer">Enter Delivery Code</p>
                                            </div>
                                        </InfoWindow>}
                                </MarkerF>
                            }
                        </>
                    )
                })
            }
            {/* <Marker position={{ lat: endCoords[1], lng: endCoords[0] }} /> */}
            {/* <MarkerF position={{ lat: startCoords[1], lng: startCoords[0] }}> */}
                {/* {
                    ((MyParcelsDetails.paymentStatus === 'PAID' && MyParcelsDetails.status === 'Accepted') && RoleSwitch === 'postier') &&
                    <InfoWindow
                    >
                        <div className="p-4 flex flex-col gap-1 ">
                            <p className="text-[12px] font-[700] leading-[15px] capitalize">{MyParcelsDetails?.consignor?.firstName} {MyParcelsDetails?.consignor?.lastName}</p>
                            <p onClick={() => setModal('SendOTP', ({ type: 'pickup' }))} className="text-[12px] font-[400] leading-[15px] underline capitalize cursor-pointer">Enter Pickup Code</p>
                        </div>
                    </InfoWindow>
                } */}

            {/* </MarkerF> */}
            {/* <MarkerF position={{ lat: endCoords[1], lng: endCoords[0] }}> */}
                {/* {
                    ((MyParcelsDetails.status === 'Transit') && RoleSwitch === 'postier') &&
                    <InfoWindow
                    >
                        <div className="p-4 flex flex-col gap-1">
                            <p className="text-[12px] font-[700] leading-[15px] capitalize">{MyParcelsDetails?.consignee?.firstName} {MyParcelsDetails?.consignee?.lastName}</p>
                            <p onClick={() => setModal('SendOTP', ({ type: 'drop' }))} className="text-[12px] font-[400] leading-[15px] underline capitalize cursor-pointer">Enter Delivery Code</p>
                        </div>
                    </InfoWindow>} */}
            {/* </MarkerF> */}
            <Polyline
                path={SingleRoutes}
                options={{
                    strokeColor: "#004080",
                    strokeOpacity: 1.0,
                    strokeWeight: 6,
                }}
            />
        </GoogleMap>
        // </LoaderScript>
    );
}
