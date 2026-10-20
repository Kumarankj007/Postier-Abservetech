'use client'
import MapComponent from '@/app/component/mapComp'
import ParcelStore from '@/app/store/parcel'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import RouteMap from './routemap'
import LocationStore from '@/app/store/locations'
import { decodePolyline } from '@/utils'
import LoaderScript from '@/app/component/loadingscript'
import TripandParcelRequests from '@/app/store/requests'

function Tracking() {
  const searchParams: any = useSearchParams()
  const currentParams = new URLSearchParams(searchParams);
  const tripId: any = currentParams.get('tripid') ? currentParams.get('tripid') : undefined
  const { MyTripsDetails, MyParcelsDetails }: any = ParcelStore()
  const { FetchSingleRoutes, SingleRoutes }: any = LocationStore()
  const { FetchParcelRequest, ParcelRequest } = TripandParcelRequests()
  const [decodedPolyline, setDecodedPolyline] = useState([]);

  useEffect(() => {

    const checkAndDecodePolyline = () => {
      if (SingleRoutes?.overviewPolyline && window.google?.maps?.geometry) {
        const decoded: any = decodePolyline(SingleRoutes.overviewPolyline);
        setDecodedPolyline(decoded);
      }
    };

    if (window.google?.maps?.geometry) {
      // If Google Maps is already loaded, decode immediately
      checkAndDecodePolyline();
    } else {
      // Add a listener for when the Google Maps library is fully loaded
      const intervalId = setInterval(() => {
        if (window.google?.maps?.geometry) {
          clearInterval(intervalId);
          checkAndDecodePolyline();
        }
      }, 100); // Check every 100ms
    }
  }, [SingleRoutes]);
  useEffect(() => {
    if (MyTripsDetails?.wayPointId) {
      FetchSingleRoutes(MyTripsDetails?.wayPointId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MyTripsDetails])
  useEffect(() => {
    if (tripId) {
      const data = {
        status: 'Accepted'
      }
      FetchParcelRequest(tripId, data, undefined)

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // console.log('MyTripsDetails', MyTripsDetails)
  return (
    <div className='w-full xl:h-full h-[80vh]'>
      <LoaderScript>
        <RouteMap
          startCoords={[parseFloat(MyTripsDetails?.location?.startCoords?.coordinates[0]), parseFloat(MyTripsDetails?.location?.startCoords?.coordinates[1])]}
          endCoords={[parseFloat(MyTripsDetails?.location?.endCoords?.coordinates[0]), parseFloat(MyTripsDetails?.location?.endCoords?.coordinates[1])]}
          // screen={{ width: '1200' }}
          SingleRoutes={decodedPolyline}
          MyParcelsDetails={MyParcelsDetails}
          MyTripsDetails={MyTripsDetails}
          ParcelRequest={ParcelRequest}
        />
        {/* <RouteMap
          startCoords={[12.9716, 77.5946]} // Example: Bangalore
          endCoords={[13.0827, 80.2707]}   // Example: Chennai
          SingleRoutes={[
            [12.9716, 77.5946],
            [13.0000, 78.0000],
            [13.0827, 80.2707]
          ]} // Example decoded polyline as array of coordinates
          MyParcelsDetails={{
            id: 1,
            parcelName: "Demo Parcel",
            weight: "2kg",
            sender: "John Doe",
            receiver: "Jane Doe",
          }}
          MyTripsDetails={{
            id: 101,
            driverName: "Demo Driver",
            vehicleNumber: "TN01AB1234",
            date: "2025-07-28",
            location: {
              startCoords: {
                coordinates: [12.9716, 77.5946],
              },
              endCoords: {
                coordinates: [13.0827, 80.2707],
              }
            }
          }}
          ParcelRequest={{
            requestId: 999,
            status: "pending",
            requestedAt: "2025-07-27T10:00:00Z"
          }}
        /> */}

      </LoaderScript>
    </div>
  )
}

export default Tracking