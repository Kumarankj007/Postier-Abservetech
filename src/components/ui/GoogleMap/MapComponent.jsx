// components/ui/MapComponent.js
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import LoaderScript from '@/components/GoogleLoader';

// Replace with your Google Maps API key


const containerStyle = {
    width: '100%',
    height: '400px',
};

const MapComponent = ({ pickupLat, pickupLng, dropLat, dropLng }) => {
    const [center, setCenter] = useState({ lat: pickupLat, lng: pickupLng });

    useEffect(() => {
        if (pickupLat && pickupLng) {
            setCenter({ lat: pickupLat, lng: pickupLng });
        }
    }, [pickupLat, pickupLng]);

    return (
        <LoaderScript>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
            >
                {pickupLat && pickupLng && (
                    <Marker position={{ lat: pickupLat, lng: pickupLng }} label="Pickup" />
                )}
                {dropLat && dropLng && (
                    <Marker position={{ lat: dropLat, lng: dropLng }} label="Drop" />
                )}
            </GoogleMap>
        </LoaderScript>

    );
};

export default MapComponent;
