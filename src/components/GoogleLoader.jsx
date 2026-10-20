import React, { ReactNode } from "react";
import { LoadScript } from "@react-google-maps/api";

const LoaderScript = ({ children }) => {
    const key = import.meta.env.VITE_API__MAP_ID
    console.log('key', key)
    return (
        <LoadScript
            id="script-loader"
            googleMapsApiKey={key}
            libraries={['places']}
            language="en"
            region="EN"
        >
            {children}
        </LoadScript>
    );
};

export default LoaderScript;
