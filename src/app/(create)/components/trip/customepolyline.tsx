import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Polyline, PolylineProps } from "@react-google-maps/api";

interface MyProps extends PolylineProps {
    data: any
}

function Customepolyline(props: MyProps) {
    const [loader, setLoader] = useState(false);
    const geometryTimer = useRef<any>();    

    useEffect(()=>{
        geometryTimer.current = setInterval(()=>{
        // @ts-ignore
      if(window.google?.maps?.geometry?.encoding?.decodePath) { // check if library is loaded
        clearInterval(geometryTimer.current);
        setLoader(true)
      }
    },300); // works for every 300 millisecond
    return ()=>{
      clearInterval(geometryTimer.current);
    }
    },[])

    const points = useMemo(()=>{
        if(loader) {
        // if (!window.google || !window.google.maps || !window.google.maps.geometry) return [];
        const decodedPath = window.google.maps.geometry.encoding.decodePath(props.data);
  return decodedPath.map((point) => ({
    lat: point.lat(),
    lng: point.lng(),
  }));
    }
    return [];
    },[loader, props.data])

    // console.log('my points ', points, loader)

  return (
    <Polyline {...props} path={points} />
  )
}

export default Customepolyline