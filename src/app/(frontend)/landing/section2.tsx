import PageContext from "@/app/providers/pagecontext";
import Image from "next/image";
import { useContext, useRef, useState } from "react";

export default function Section2() {
  const { i18 } = useContext(PageContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef: any = useRef(null);

  const handleClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true); // Set to true when playing
      } else {
        videoRef.current.pause();
        setIsPlaying(false); // Set to false when paused
      }
    }
  };
  return (
    <section
      className="thirdsec mt-[30px] px-5 py-10"
      aria-labelledby="thirdsec-heading"
    >
      <h2
        id="thirdsec-heading"
        className="text-center text-[40px] sm:text-[30px] md:text-[40px] font-bold"
      >
        {i18?.NEW?.BUILDINGIMPRESSIVEPOSTALDELIVERY ||
          "Building A Impressive Postal Delivery"}
        <br className="xs:hidden sm:block" />
        {i18?.NEW?.SYSTEMFORTHEWORLD || "System For The World"}
      </h2>
      <p className="text-[17px] md:text-[17px] text-center mt-[15px] font-normal	leading-[30px]">
        {i18?.NEW?.POWERFULSYSTEM ||
          "A powerful system designed to help customers around world-wide"}{" "}
        <br></br>
        {i18?.NEW?.SENDANDDELIVERPARCELS || "To send and deliver parcels"}
      </p>
      <div className="flex justify-center mt-[50px] relative">
        <video
          ref={videoRef}
          poster="/png/thumbnail.png"
          className="border border-1 shadow rounded-[11px] w-full h-full md:w-[1300px] md:h-[600px] object-cover"
          onClick={handleClick}
        >
          <source src="/videos/merlinjoli.mp4" type="video/mp4" />
        </video>

        {!isPlaying && (
          <Image
            src="/svg/icon/pause.svg"
            width={100}
            height={100}
            alt="Play icon"
            className="absolute top-[45%] left-[48%] cursor-pointer w-[20px] h-[20px] sm:w-[60px] sm:h-[60px]"
            onClick={handleClick}
          />
        )}
      </div>
    </section>
  );
}
