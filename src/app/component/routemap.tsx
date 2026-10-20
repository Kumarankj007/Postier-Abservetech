'use client';
import React, { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import LoaderScript from "./loadingscript";
import Store from "../store/store";
import { decodePolyline, hasTollGates } from "@/utils";
import LocationStore from "../store/locations";
import Customepolyline from "../(create)/components/trip/customepolyline";
import PageContext from "@/app/providers/pagecontext";


type Coordinates = [number, number];

interface RouteMapProps {
  startCoords: Coordinates;
  endCoords: Coordinates;
  handleReult?: (combinedRoutes: any) => void;
  screen:any
}

let geometryTimer;

export default function RouteMap({ startCoords, endCoords,screen, handleReult}: RouteMapProps) {
  const { i18 } = useContext(PageContext);
  const containerStyle:any = {
    width: '100%',
    height: '100%',
    position: screen.width && screen.width < 1098 ? 'absolute' : 'relative'
  };
  const { FetchRoutes, Routes } = LocationStore()
  const [loader,setLoder] = useState(false)
  // const [routePoints, setRoutePoints] = useState<any>([]);
  const { RouteIndex } = Store()
  
  const center = useMemo(() => ({
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
    map.setZoom(8); 
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



  const points = useMemo(() => {
    return Routes.map(({ route }: any) => {

      if (Array.isArray(route?.coordinates)) {
        return route?.coordinates.map((coordinate: any) => ({
          lat: coordinate[1],
          lng: coordinate[0]
        }))
      }
      else {
        return [];
      }

    })

  }, [Routes])

  // console.log('points', points)

  if (loadError) return <div>{i18?.NEW?.ERROR_LOADING_GOOGLE_MAPS || "Error loading Google Maps"}</div>;
  if (!isLoaded) return <div>{i18?.NEW?.LOADING || "Loading"}...</div>;

  return (
    // <LoaderScript>
      <GoogleMap
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
        center={center} 
      >
        <Marker position={{ lat: startCoords[1], lng: startCoords[0] }} />
        <Marker position={{ lat: endCoords[1], lng: endCoords[0] }} />


        {Routes.length > 0 && loader && (
          Routes.map((items: any, index: any) => {
            return (
              <Customepolyline
                data={items?.overviewPolyline}
                key={index}
                options={{
                  strokeColor: "#004080",
                  strokeOpacity: RouteIndex === items?._id ? 1.0 : 0.5,
                  strokeWeight: RouteIndex === items?._id ? 6 : 5,
                }}
              />
            )
          })
        )}
      </GoogleMap>
    // </LoaderScript>
  );
}
