import React, { useCallback, useEffect, useMemo } from 'react'
import LoaderScript from '../loadingscript'
import { GoogleMap, Marker } from '@react-google-maps/api'

function MapModal(data: any) {
    const lat = data && data?.data?.lat
    const lng = data && data?.data?.lng

    const containerStyle = {
        width: '100%',
        height: '400px',
    }
    const center = useMemo(() => {
        if (Array.isArray(data?.data)) {
            return data.data.map((item: any) => ({
                lat: item?.lat,
                lng: item?.lng,
            }));
        } else if (data?.data && typeof data.data === "object") {
            return {
                lat: data.data.lat,
                lng: data.data.lng,
            };
        }
        return null;
    }, [data]);


    const [map, setMap] = React.useState<any>(null)

    // console.log('center', center)

    const onLoad = useCallback((map: any) => {
        setMap(map);
        if (Array.isArray(center)) {
            map.panTo(center[0]);
        } else if (center) {
            map.panTo(center);
        }
    }, [center]);

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null)
    }, [])
    // console.log('data', data?.data)
    return (
        <div>
            <LoaderScript>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    // center={center}
                    zoom={5}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                >
                    {
                        Array.isArray(center) ? (
                            center.map((item: any, index: number) => (
                                <Marker key={index} position={item} />
                            ))
                        ) : (
                            center && <Marker position={center} />
                        )
                    }


                </GoogleMap>
            </LoaderScript>
        </div>
    )
}

export default MapModal