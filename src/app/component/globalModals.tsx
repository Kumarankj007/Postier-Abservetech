import dynamic from "next/dynamic";
import Store from "../store/store";
import CustomModal from "./modal";
import Width from "../(create)/components/parcel/width";
import { useEffect } from "react";
import { getCookie } from "@/utils";

const DynamicTrackingModal: any = dynamic(
  () => import("./modals/trackingmodal")
);
const DynamicIncreaseFarePrice: any = dynamic(
  () => import("./modals/IncreaseFarePrice")
);
const DynamicRequestModal: any = dynamic(() => import("./modals/requestmodal"));
const DynamicVerificationModal: any = dynamic(
  () => import("./modals/verificationModal")
);
const DynamicPhoneverify: any = dynamic(
  () => import("./modals/phoneverifymodal")
);
const DynamicDocument: any = dynamic(() => import("./modals/documentmodal"));
const DynamicRequest: any = dynamic(() => import("./modals/requestfromhome"));
const DynamicPublish: any = dynamic(() => import("./modals/publishmodal"));
const DynamicTripPublish: any = dynamic(() => import("./modals/publishTrip"));
const DynamicSchedule: any = dynamic(() => import("./modals/schedule"));
const DynamicAddVehicleModel: any = dynamic(
  () => import("./modals/addvehicle")
);
const DynamicRulesModel: any = dynamic(() => import("./modals/rules"));
const DynamicCounterModel: any = dynamic(() => import("./modals/counteroffer"));
const DynamicMapModal: any = dynamic(() => import("./modals/map"));
const DynamicBiddinginchat: any = dynamic(
  () => import("./modals/biddinginchat")
);
const DynamicAddressconfirm: any = dynamic(
  () => import("./modals/addressconfirm")
);
const DynamicGenerateOTP: any = dynamic(() => import("./modals/generateotp"));
const DynamicSendOtp: any = dynamic(() => import("./modals/sendOtp"));
const DynamicReviewandRatings: any = dynamic(
  () => import("./modals/reviewandratings")
);
const ConfirmDelete: any = dynamic(() => import("./modals/confirmDelete"));
const CookieModal: any = dynamic(() => import("./modals/cookieModal"));
const CalcModal: any = dynamic(() => import("./modals/calcModal"));

export default function GlobalModals() {
  const { modal, setModal }: any = Store();

  useEffect(() => {
    const isCookie = getCookie("userSelection");
    if (isCookie == "") setModal("cookieModal", { heading: "cookie modal" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <CustomModal
        open={modal.str === "TrackingModal"}
        onClose={() => setModal(false, { findPost: {} })}
        title="Order Tracking"
      >
        <DynamicTrackingModal data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "IncreaseFarePrice"}
        onClose={() =>
          setModal(false, {
            tripId: null,
            distance: null,
            postId: null,
            amount: null,
          })
        }
        title=""
      >
        <DynamicIncreaseFarePrice data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "RequestModal"}
        onClose={() =>
          setModal(false, { tripId: null, distance: null, postId: null })
        }
        title=""
      >
        <DynamicRequestModal data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "VerificationModal"}
        onClose={() => setModal(false)}
        title=""
      >
        <DynamicVerificationModal data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "PhoneverifyModal"}
        onClose={() => setModal(false)}
        title=""
      >
        <DynamicPhoneverify data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "DocumentModal"}
        onClose={() => setModal(false)}
        title=""
      >
        <DynamicDocument data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "requestfromhome"}
        onClose={() => setModal(false, { tripId: null })}
        title=""
      >
        <DynamicRequest data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "publishmodal"}
        onClose={() => setModal(false)}
        title=""
      >
        <DynamicPublish data={modal?.data} />
      </CustomModal>
      <CustomModal
        open={modal.str === "publishTripmodal"}
        onClose={() => setModal(false)}
        title=""
      >
        <DynamicTripPublish data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "schedulemodal"}
        onClose={() => setModal(false)}
        title=""
      >
        <DynamicSchedule data={modal?.data} />
      </CustomModal>

      <CustomModal
        dontClose={true}
        open={modal.str === "AddVehicleModel"}
        // onClose={() => setModal(false)}
        title="Upload Your Vehicle Images"
      >
        <DynamicAddVehicleModel data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "Rules"}
        onClose={() => modal?.data?.onClose ? setModal('Rules' as any, {head: modal?.data?.onClose}) : setModal(false)}
        title={modal?.data?.head || "Code Of Conduct Rules"}
        icon={modal?.data?.img || ""}
      >
        <DynamicRulesModel data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "CounterOffer"}
        onClose={() =>
          setModal(false, { fare: null, Parcel_id: null, Trip_id: null })
        }
        title=""
      >
        <DynamicCounterModel data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "Mapmodal"}
        onClose={() =>
          setModal(false, { fare: null, Parcel_id: null, Trip_id: null })
        }
        title=""
      >
        <DynamicMapModal data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "biddinginchat"}
        onClose={() =>
          setModal(false, { fare: null, Parcel_id: null, Trip_id: null })
        }
        title=""
      >
        <DynamicBiddinginchat data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "Addressconfirm"}
        onClose={() =>
          setModal(false, { fare: null, Parcel_id: null, Trip_id: null })
        }
        title=""
      >
        <DynamicAddressconfirm data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "GenerateOTP"}
        onClose={() => setModal(false)}
        title=""
      >
        <DynamicGenerateOTP data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "SendOTP"}
        onClose={() => setModal(false)}
        title=""
      >
        <DynamicSendOtp data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "reviewandrating"}
        onClose={() => setModal(false)}
        title=""
      >
        <DynamicReviewandRatings data={modal?.data} />
      </CustomModal>

      <CustomModal
        open={modal.str === "confirmDelete"}
        onClose={() => setModal(false)}
        title=""
      >
        <ConfirmDelete data={modal?.data} />
      </CustomModal>

      <CustomModal
        dontClose={true}
        open={modal.str === "cookieModal"}
        cookie={true}
      >
        <CookieModal data={modal?.data} />
      </CustomModal>

      <CustomModal
        dontClose={true}
        open={modal.str === "calcModal"}
        cookie={true}
        maxWidth={"md"}
        onClose={() => setModal(false)}
      >
        <CalcModal data={modal?.data} />
      </CustomModal>
    </>
  );
}
