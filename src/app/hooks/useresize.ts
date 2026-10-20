import { useEffect, useState } from "react";

const useScreenDetector = () => {
    const [screenType, setScreenType] = useState(getScreenType());

    function getScreenType() {
        if(typeof window !== "undefined"){
            const width = window.innerWidth;
            if (width <= 460) {
                return "mobile";
            } else if (width <= 768) {
                return "tablet";
            } else {
                return "desktop";
            }
        }
       
    }

    const handleWindowSizeChange = () => {
        setScreenType(getScreenType());
    };

    useEffect(() => {
        if(typeof window!=='undefined') {
        window.addEventListener("resize", handleWindowSizeChange);

        return () => {
            window.removeEventListener("resize", handleWindowSizeChange);
        };}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return screenType;
};

export default useScreenDetector;
