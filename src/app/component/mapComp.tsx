import React, { useCallback, useEffect, useState } from 'react'
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import { color } from 'framer-motion';
import LoaderScript from './loadingscript';
import { fetchAddress, GetAddressFromLatLng } from '@/utils';



// const center = {
//     lat: -3.745,
//     lng: -38.523
// };
// const points = [
//     { lat: -3.745, lng: -38.523 },
//     { lat: -3.745, lng: -38.500 },
//     { lat: -3.740, lng: -38.490 },
//     // Add more points as needed
// ];
export default function MapComponent({ startCoords, endCoords,latlng,onLocationChange,screen }: any) {
  const containerStyle:any = {
    width: '100%',
    height: '100%',
    position: screen.width && screen.width < 1098 ? 'absolute' : 'relative'
  };
  const [routePoints, setRoutePoints] = useState<{ lat: number, lng: number }[]>([]);
  const [zoomLevel, setZoomLevel] = useState(15)

  const [center,setCenter] = useState(
    {
      lat: startCoords? (startCoords[1] ) : latlng[0],
      lng: startCoords ? (startCoords[0] ) : latlng[1]
    }
  );

  const onMarkerDragEnd = async(event:any) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setCenter({ lat: newLat, lng: newLng });
    const address:any = await GetAddressFromLatLng(newLat, newLng);
    const data:any = await fetchAddress(address?.place_id)
    onLocationChange({ lat: newLat, lng: newLng , address:address, city : data?.City });
  };
// console.log('center',center)
  const key: any = process.env.NEXT_PUBLIC_MAP_ID
  // const { isLoaded } = useJsApiLoader({
  //     id: 'google-map-script',
  //     googleMapsApiKey: key
  // })
  

  const [map, setMap] = React.useState<any>(null)

  // console.log('center',center)

  const onLoad = useCallback((map:any) => {
    setMap(map);
    map.panTo(center);
  }, [center]);

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null)
  }, [])
  useEffect(()=>{
    setCenter({
      lat:latlng[0],
      lng:latlng[1],
    })
  },[latlng])
  
  // useEffect(() => {
  //   const fetchRoute = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoords[1]},${startCoords[0]}&destination=${endCoords[1]},${endCoords[0]}&key=${key}`
  //       );

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch directions');
  //       }

  //       const data = await response.json();

  //       const { routes } = data;
  //       if (routes && routes.length > 0) {
  //         const { legs } = routes[0];
  //         if (legs && legs.length > 0) {
  //           const steps = legs[0].steps;
  //           const points = steps.map((step: any) => ({
  //             lat: step.end_location.lat,
  //             lng: step.end_location.lng
  //           }));
  //           setRoutePoints(points);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching route:', error);
  //     }
  //   };

  //   fetchRoute();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [startCoords, endCoords]);

  const animateMapMove = (newPosition:any) => {
    // Step 1: Zoom out a little
    map.setZoom(10);

    // Step 2: After a short delay, pan to the new position and zoom in
    setTimeout(() => {
      map.panTo(newPosition);
      setZoomLevel(10); 
      map.setZoom(10); 
    }, 500);
  };

  useEffect(() => {
    if (map) {
      animateMapMove(center);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center]);
  return (
    // <LoaderScript>
      <GoogleMap
        mapContainerStyle={containerStyle}
        // center={center}
       zoom={zoomLevel}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker
          position={center}
          draggable={true}
          onDragEnd={onMarkerDragEnd}
        />
      </GoogleMap>
    // </LoaderScript>

  )
}