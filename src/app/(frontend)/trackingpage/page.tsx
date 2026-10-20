"use client";
import React, { useState, useEffect } from "react";
// @ts-ignore
import { LoadCanvasTemplate, loadCaptchaEnginge, validateCaptcha} from "react-simple-captcha";
import Track from "../../../../public/png/tracking.png";
import Trackimage from "../../../../public/png/trackingicon.png";
import Image from "next/image";
import { fetchTracking } from "@/app/tools/queryfn/fetch";
import { useMutation } from "@tanstack/react-query";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import useTrackingStore from "@/app/store/tracking";
import { setCookie } from "@/utils";
import useSnackbarStore from "@/app/store/toaster";
// If you want a separate store for captcha, you can create/use it here
function TrackingPage() {
  const router = UseLoadingRouter();
  const { showSnackbar } = useSnackbarStore((state) => state);

  const [consignment, setConsignment] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const setTrackingData = useTrackingStore((state) => state.setTrackingData);

  useEffect(() => {
    loadCaptchaEnginge(6); // 6-character CAPTCHA
  }, []);

  const handleTrack = () => {
    if (validateCaptcha(userCaptcha) && consignment.trim() != "") {
      post.mutateAsync({ queryKey: ["tracking", { TrackingId: consignment }] });
    } else if (consignment.trim() == "") {
      showSnackbar("Invalid consignment", "error");
    } else {
      showSnackbar("Invalid CAPTCHA", "error");
    }
  };

//  api function:
  const post = useMutation({
    mutationFn: fetchTracking,
    onSuccess: (data) => {
      // showSnackbar("Captcha Verified", "success");
      // console.log(data, "data")
      setCookie("captcha", "true", 60, true);
      setTrackingData(data);
      router.push("/trackingpage/trackingstepper");
    },
    onError: (err) => {
      // console.log(err, "err")
      showSnackbar(err.message, "error");
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F7FA] p-4">
      <form className="w-[60%] max-w-xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          Track Shipment
          <Image
            src={Trackimage}
            alt="Tracking Icon"
            className="w-[100px] h-[40px] object-contain"
          />
        </h1>
        <div className="border-b-4 border-[#0A3576] w-32 mb-6" />
        <p className="text-[18px] pt-4 mb-5">
          To track your consignment please enter postier tracking number
        </p>

        <label className="mb-4 text-lg pt-5 uppercase">
          Consignment Number
        </label>
        <input
          type="text"
          required
          placeholder="Enter Consignment Number"
          className="w-full border rounded px-3 py-5 mb-6 text-xl mt-4"
          value={consignment}
          onChange={(e) => setConsignment(e.target.value)}
        />

        <div className="mt-3 flex">
          {/* <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-refresh-cw"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.36 5.36A9 9 0 0 0 20.49 15" /></svg> */}
          <LoadCanvasTemplate className="flex" />
          <input
            type="text"
            required
            placeholder="Enter CAPTCHA"
            className="border rounded px-3 py-3 text-xl w-48"
            value={userCaptcha}
            onChange={(e) => setUserCaptcha(e.target.value)}
          />
          <div
            className="bg-[#0A3576] text-white rounded px-8 py-3 text-lg font-bold ml-2"
            onClick={handleTrack}
          >
            TRACK
          </div>
        </div>
      </form>
      <div className="w-[40%]">
        <Image
          src={Track}
          alt="Tracking Image"
          className="w-full h-auto object-cover mt-8"
        />
      </div>
    </div>
  );
}
export default TrackingPage;
