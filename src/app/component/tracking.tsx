import { Avatar, Rating } from "@mui/material";
import { trackingstep } from "../../../content";
import StepperComponent from "./stepper";
import Button from "./button";
import MapComponent from "./mapComp";
import { useContext, useEffect, useState } from "react";
import LabeledInput from "./input";
import { useMutation } from "@tanstack/react-query";
import { Review } from "../tools/mutatefn/tripReq";
import useSnackbarStore from "../store/toaster";
import ReviewData from "../store/reviews";
import EmptyPage from "./emptydatapage";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./payment/cardelement";
import GetPaymentMethods from "../store/payments";
import BpCheckbox from "./checkbox";
import { useSearchParams } from "next/navigation";
import { MakePayment } from "../tools/mutatefn/payment";
import Store from "../store/store";
import ParcelStore from "../store/parcel";
import PostDetailsStore from "../store/parcelDetails";
import Image from "next/image";
import LoderComp from "./loader";
import PageContext from "../providers/pagecontext";

export default function Tracking() {
  const { i18 } = useContext(PageContext);
  const stripekey: any = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || null;
  const stripePromise = loadStripe(stripekey);
  const { FetchReviews, Reviews } = ReviewData();
  const { postDetails, fetchPostDetails }: any = PostDetailsStore();
  const { NearestMatches, FetchNearestMatches }: any = ParcelStore();
  const {
    TrackingStep,
    setTrackingStep,
    Trackingstepper,
    TrackingsetStepper,
  }: any = Store();
  const { FetchPaymentsMethods, PaymentsMethods }: any = GetPaymentMethods();
  const [value, setValue] = useState<number | null>(0);
  const [payment, setpayment] = useState(false);
  const [check, setCheck] = useState(false);
  const [review, setReview] = useState("");
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const tripId = NearestMatches?.accepted[0]?._id
    ? NearestMatches?.accepted[0]?._id
    : null;
  const searchParams: any = useSearchParams();
  const currentParams = new URLSearchParams(searchParams);
  const postId: any = currentParams.get("id");
  const PostId: any = postId ? postId : null;
  const trackingstep = [
    { label: i18?.TRACKING?.POSTIERACCEPT || "Postier Accepted" },
    { label: i18?.TRACKING?.INITIALPAY || "Initial Payment" },
    { label: i18?.TRACKING?.PARCELPICK || "Parcel Pickup" },
    { label: i18?.TRACKING?.PARCELDES || "Parcel Destination" },
    { label: i18?.TRACKING?.RATING || "Rating & Review" },
  ];
  const ReviewPost = useMutation({
    mutationFn: Review,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      FetchReviews({ moduleId: tripId, moduleType: "Trip" });
      setTrackingStep(6);
      TrackingsetStepper(5);
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });

  const handleReview = () => {
    ReviewPost.mutateAsync({ value, review, id: tripId, module: "Trip" });
  };

  const handleText = (event: any) => {
    setReview(event.target.value);
  };
  const Post = useMutation({
    mutationFn: MakePayment,
    onSuccess: (data) => {
      showSnackbar(data.message, "success");
      // fetchPostDetails(PostId)
      setpayment(true);
      setTrackingStep(2);
      TrackingsetStepper(2);
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const handlepayments = (id: any) => {
    Post.mutateAsync({
      tripId: NearestMatches?.accepted[0]?._id,
      postId: PostId,
      paymentMethodId: id,
      paymentMethod: "STRIPE",
    });
  };
  useEffect(() => {
    if (Reviews?.total !== 0 && Reviews?.total !== undefined) {
      setTrackingStep(6);
      TrackingsetStepper(5);
    } else if (postDetails?.status === "Delivered") {
      setTrackingStep(5);
      TrackingsetStepper(4);
    } else if (postDetails?.status === "Transit") {
      setTrackingStep(4);
      TrackingsetStepper(3);
    } else if (postDetails?.status === "Pickedup") {
      setTrackingStep(4);
      TrackingsetStepper(3);
    } else if (postDetails?.status === "Received") {
      setTrackingStep(3);
      TrackingsetStepper(2);
    } else if (postDetails?.paymentStatus === "PAID") {
      setTrackingStep(2);
      TrackingsetStepper(2);
    } else if (postDetails?.paymentStatus === "UNPAID") {
      setTrackingStep(2);
      TrackingsetStepper(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postDetails, Reviews]);

  useEffect(() => {
    if (TrackingStep === 0 || TrackingStep === 1 || TrackingStep === 2) {
      FetchPaymentsMethods();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [TrackingStep]);
  useEffect(() => {
    fetchPostDetails(postId);
    FetchNearestMatches(PostId);
    FetchReviews({ moduleId: tripId, moduleType: "Trip" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log("TrackingStep", TrackingStep);
  return (
    <div className="  flex-col md:flex md:flex-row justify-between ">
      <div className=" w-full md:w-[70%]  ">
        <StepperComponent
          stepperState={Trackingstepper}
          steps={trackingstep}
          type="tracking"
        />
        <LoderComp page="Tracking">
          {TrackingStep === 6 && (
            <div>
              <EmptyPage
                image="/svg/icon/success.svg"
                text="Parcel Delivered"
              />
            </div>
          )}
          {TrackingStep === 5 && (
            <>
              {Reviews && Reviews?.total > 0 ? (
                <div>
                  <EmptyPage
                    image="/svg/icon/success.svg"
                    text="Parcel Delivered"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-5 mt-[40px] md:mt-[80px] w-full md:w-[50%]">
                  <h1 className="text-[24px] font-bold">
                    Add Ratings and Reviews
                  </h1>
                  <Rating
                    onClick={(e: any) => setValue(e.target.value)}
                    defaultValue={value ? value : 0}
                  />
                  <LabeledInput
                    // className='border border-[#004080] w-[50%] p-5 rounded-[7px] placeholder-black outline-none'
                    placeholder="Enter your review"
                    onChange={handleText}
                    value={review}
                    id="review-input"
                    labelId="review-input"
                  />
                  <div className="flex ">
                    <Button
                      onClick={handleReview}
                      className="bg-btncolor py-2 px-4 text-[#fff] rounded"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
          {(TrackingStep === 3 || TrackingStep === 4) && (
            <MapComponent
              startCoords={
                postDetails
                  ? postDetails?.location?.startCoords?.coordinates
                  : []
              }
              endCoords={
                postDetails ? postDetails?.location?.endCoords?.coordinates : []
              }
            />
          )}
          {(TrackingStep === 0 || TrackingStep === 1 || TrackingStep === 2) &&
            (payment || postDetails?.paymentStatus === "PAID" ? (
              <div>
                <EmptyPage
                  image="/svg/icon/success.svg"
                  text="Payment Successfull"
                />
              </div>
            ) : PaymentsMethods &&
              PaymentsMethods?.merchant?.paymentMethods.length > 0 ? (
              <>
                <div
                  className={`flex justify-between gap-4 ${
                    !check ? "border" : "border-2"
                  }  border-btncolor rounded-[12px] p-4 w-[50%]`}
                >
                  <div className="flex gap-3">
                    <div className="w-[50px] h-[50px ]">
                      <Image
                        width={20}
                        height={20}
                        src="/svg/icon/card.svg"
                        alt="Image"
                      />
                    </div>
                    <div>
                      <p className="font-bold">Card Details</p>
                      <p>
                        {PaymentsMethods?.merchant?.paymentMethods[0]?.details?.card.padStart(
                          12,
                          "*"
                        )}
                      </p>
                    </div>
                  </div>
                  <div>
                    <BpCheckbox onChange={() => setCheck(!check)} />
                  </div>
                </div>
                {check && (
                  <Button
                    className="bg-btncolor text-[#fff] border rounded-[8px] py-2 px-3 mt-[30px]"
                    onClick={() =>
                      handlepayments(
                        PaymentsMethods?.merchant?.paymentMethods[0]?._id
                      )
                    }
                  >
                    Pay Now
                  </Button>
                )}
              </>
            ) : (
              <Elements stripe={stripePromise}>
                <CheckoutForm
                // val={{ tripId: NearestMatches?.accepted[0]?._id, postId: PostId, paymentMethod: 'STRIPE' }}
                />
              </Elements>
            ))}
        </LoderComp>
      </div>
      <div className=" w-full md:w-[30%]">
        <div className="border border-[#fff] rounded-[11px] p-6">
          <div className="flex gap-5">
            <Avatar
              src={
                process.env.NEXT_PUBLIC_IMAGE_URL +
                (NearestMatches?.accepted[0]?.postier?.profile || "")
              }
              sx={{ width: "80px", height: "80px" }}
            />
            <div className="flex flex-col gap-2">
              <p className="font-bold text-[17px] capitalize">
                {NearestMatches?.accepted[0]?.postier?.fname}{" "}
                {NearestMatches?.accepted[0]?.postier?.lname}
              </p>
              <div className="flex gap-2">
                <Rating
                  name="read-only"
                  value={
                    NearestMatches?.accepted[0]?.postier?.ratings?.totalValue
                  }
                  readOnly
                />
                <p>
                  {NearestMatches?.accepted[0]?.postier?.ratings?.totalValue}{" "}
                </p>
                <p>{`(${
                  NearestMatches?.accepted[0]?.postier?.ratings?.totalCount || 0
                } Ratings)`}</p>
              </div>
              <Button className="bg-btncolor text-[#fff] border rounded-[11px] py-2 px-3">
                Postier
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-5 mt-8">
            <div className="flex gap-3">
              <Image
                width={20}
                height={20}
                src="/svg/icon/telephone.svg"
                alt="svg"
              />
              <p>
                +{NearestMatches?.accepted[0]?.postier?.phoneCode}{" "}
                {NearestMatches?.accepted[0]?.postier?.phone}{" "}
              </p>
            </div>
            <div className="flex gap-3">
              <Image
                width={20}
                height={20}
                src="/svg/icon/locationB.svg"
                alt="svg"
              />
              <p>
                {NearestMatches?.accepted[0]?.location?.pickUp} -{" "}
                {NearestMatches?.accepted[0]?.location?.drop}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-5 mt-8">
            <p className="font-bold text-[17px]">Note</p>
            <p>{NearestMatches?.accepted[0]?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
