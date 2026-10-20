import { useContext, useState } from "react";
import Button from "../button";
import LabeledInput from "../input";
import { useMutation } from "@tanstack/react-query";
import { RequestFor, RequestForUpdate } from "@/app/tools/mutatefn/request";
import useSnackbarStore from "@/app/store/toaster";
import Store from "@/app/store/store";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import TripandParcelRequests from "@/app/store/requests";
import useSocketStore from "@/app/hooks/socket";
import PageContext from "@/app/providers/pagecontext";
import ContentTooptip from "../contentTooptip";
import { CounterOfferContent } from "@/app/(profileDetails)/accountsettings/content";

export default function CounterOffer({ data }: any) {
  const { i18 } = useContext(PageContext);
  const param = useParams();
  const Parcel_id = data?.Parcel_id ? data?.Parcel_id : "";
  const Trip_id = data?.Trip_id ? data?.Trip_id : "";
  const Type = data?.Type ? data?.Type : "";
  const Flow = data?.flow ? data?.flow : false;
  const UserID =
    typeof window !== undefined && localStorage.getItem("appUserId");
  const channelId: any = param?.id;
  const [amount, setAmount] = useState(data?.fare);
  const { setModal } = Store();
  const path = usePathname();
  const { FetchRequest, FetchParcelRequest }: any = TripandParcelRequests();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { sendMessage } = useSocketStore();

  const REQUpdate = useMutation({
    mutationFn: RequestForUpdate,
    onSuccess: (data: any) => {
      showSnackbar(data.message, "success");
      const val: any = {};
      if (path === "/senderDetails/") {
        FetchParcelRequest(Trip_id, val, Parcel_id);
      } else if (!Flow) {
        FetchRequest(Parcel_id, val, Trip_id);
      } else if (Flow) {
        const value: any = {};
        if (data.message) {
          value.content = amount;
          value.type = "text";
          value.status = "Bidded";
        }
        if (data?.data?.request?._id || data?.data?.data?.request?._id) {
          value.contextid =
            data?.data?.request?._id || data?.data?.data?.request?._id;
        }
        if (UserID) {
          value.senderId = UserID;
        }
        if (channelId) {
          value.channelId = channelId;
        }
        sendMessage(value);
      }
      setModal("");
    },
    onError: (err: any) => {
      showSnackbar(err, "error");
    },
  });

  const REQ = useMutation({
    mutationFn: RequestFor,
    onSuccess: (data: any) => {
      showSnackbar(data.message, "success");
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });

  const handleRequest = () => {
    // if(!Api){
    //     searchParams.set('amount',amount)
    //     window.history.replaceState(
    //         { path: `${path}?${searchParams}` },
    //         '',
    //         `${path}?${searchParams}`
    //     )
    //     setModal('')
    // }else{

    // }
    if (Type === "initial") {
      REQ.mutateAsync({
        Trip_id: Trip_id,
        Parcel_id: Parcel_id,
        data: { amount: amount, status: "request" },
      });
    } else {
      REQUpdate.mutateAsync({
        Parcel_id: Parcel_id,
        Trip_id: Trip_id,
        data: {
          amount: amount,
          status: Type === "initial" ? "request" : "Bidded",
        },
      });
    }
  };
  // console.log("data", data);
  return (
    <div className="flex flex-col gap-6 justify-center items-center">
      <p className="text-[34px] font-[700] leading-[31px]">
        {i18?.NEW?.COUNTER_OFFER || "Counter Offer"}
      </p>
      <p className="text-[20px] font-[500] leading-[31px] text-center">
        {i18?.NEW?.COUNTER_PRICE_INFO ||
          "You can counter this price, If Postier accepts this offer you’ll receive a notification"}
        <span className="inline-flex">
          <ContentTooptip value={CounterOfferContent()} />
        </span>
      </p>
      <label id="counter-offer-label" className="sr-only">
        {i18?.NEW?.ENTER_PRICE || "Enter price"}
      </label>
      <LabeledInput
        placeholder={i18?.NEW?.ENTER_PRICE || "Enter price"}
        value={amount}
        labelId="counter-offer-label"
        id="counter-offer-label"
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button
        className="p-[20px] bg-btncolor rounded-full text-[#fff]"
        onClick={handleRequest}
      >
        {i18?.NEW?.COUNTER_OFFER || "Counter Offer"}
      </Button>
    </div>
  );
}
