'use client'
import { useState, useEffect } from 'react';

type ScreenSize = {
  width: number | null;
  height: number | null;
};

const useScreenWidth = ():ScreenSize => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !=='undefined' ? window.innerWidth : null,
    height: typeof window !== "undefined" ? window.innerHeight : null ,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return screenSize;
};

export default useScreenWidth;
