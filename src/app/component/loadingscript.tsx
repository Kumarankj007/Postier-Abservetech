import React, { ReactNode } from "react";
import { LoadScript } from "@react-google-maps/api";
import Store from "../store/store";

interface LoaderScriptProps {
  children: ReactNode;
}
const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [
  "places",
];

const LoaderScript: React.FC<LoaderScriptProps> = ({ children }) => {
  const key: any = process.env.NEXT_PUBLIC_MAP_ID;
  const { setGooglemapLoader } = Store();
  return (
    <LoadScript
      id="script-loader"
      googleMapsApiKey={key}
      libraries={libraries}
      language="en"
      region="EN"
      onLoad={() => {
        setGooglemapLoader(true);
      }}
    >
      <div className="w-full h-full">{children}</div>
    </LoadScript>
  );
};

export default LoaderScript;
