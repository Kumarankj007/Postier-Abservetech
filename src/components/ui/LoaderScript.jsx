import React, { ReactNode } from "react";
import { LoadScript } from "@react-google-maps/api";


const LoaderScript = ({ children }) => {
    const key = process.env.NEXT_PUBLIC_MAP_ID
    return (
        <LoadScript
            id="script-loader"
            googleMapsApiKey={key}
            libraries={['places']}
            language="en"
            region="EN"
        >
            <div className="w-full h-full">
                {children}
            </div>
        </LoadScript>
    );
};

export default LoaderScript;