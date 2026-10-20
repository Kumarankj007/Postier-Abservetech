"use client";
import Button from "@/app/component/button";
import EmptyPage from "@/app/component/emptydatapage";
import CheckoutForm from "@/app/component/payment/cardelement";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import ParcelStore from "@/app/store/parcel";
import GetPaymentMethods from "@/app/store/payments";
import useSnackbarStore from "@/app/store/toaster";
import { DeleteCard, MakePayment } from "@/app/tools/mutatefn/payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import PaymentSummary from "./paymentSummary";

function ChoosePayment() {
  const { i18 } = useContext(PageContext);
  const router = UseLoadingRouter();
  const searchParams: any = useSearchParams();
  const { MyParcelsDetails, FetchMyparcelsDetails }: any = ParcelStore();
  const currentParams = new URLSearchParams(searchParams);
  const postId: any = currentParams.get("parcelid");
  const tripId: any = currentParams.get("tripid");
  const PostId: any = postId ? postId : null;
  const stripekey: any = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || null;
  const [clickedIndex, setClikedIndex] = useState<any>(null);
  const [card, setCard] = useState(false);
  const [index, setIndex] = useState<any>(false);
  const stripePromise = loadStripe(stripekey);
  const [payment, setpayment] = useState(false);
  const [step, setStep] = useState<number>(0);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  // const tripId = NearestMatches?.accepted[0]?._id ? NearestMatches?.accepted[0]?._id : null
  const { FetchPaymentsMethods, PaymentsMethods }: any = GetPaymentMethods();

  const Post = useMutation({
    mutationFn: MakePayment,
    onSuccess: (data) => {
      // console.log(data, 'payment')
      showSnackbar(data.message, "success");
      const Type = "payment";
      // console.log(postId, "postI");
      FetchMyparcelsDetails(postId, Type);
      router.push(`/tracking?${currentParams}`);
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const handlepayments = (id: any, method: any) => {
    Post.mutateAsync({
      tripId: tripId,
      postId: postId,
      ...(method === "STRIPE" && { paymentMethodId: id }),
      paymentMethod: method,
    });
  };

  const Payment = [
    ...[
      PaymentsMethods &&
      PaymentsMethods?.merchant?.paymentMethods.length > 0 &&
      PaymentsMethods?.merchant?.paymentMethods[0]?.deletedAt === null
        ? {
            img: "/svg/icon/credit-card.svg",
            img2: "/svg/icon/trash-2.svg",
            text: PaymentsMethods?.merchant?.paymentMethods[0]?.details?.card.padStart(
              12,
              "*"
            ),
            button: "Pay",
            fnc: () =>
              handlepayments(
                PaymentsMethods?.merchant?.paymentMethods[0]?._id,
                "STRIPE"
              ), // Wrap in a function
          }
        : {
            img: "/svg/icon/plus-circle (2).svg",
            text: i18?.NEW?.ADD_A_CARD || "Add a card",
            button: "Confirm",
            fnc: () => setCard(true), // Wrap in a function
          },
    ],
    {
      img: "/svg/icon/dollar-sign.svg",
      text: i18?.NEW?.CASH_ON_DELIVERY || "Cash on Delivery",
      button: "Confirm",
      fnc: () =>
        handlepayments(
          PaymentsMethods?.merchant?.paymentMethods[0]?._id,
          "CASH"
        ),
    },
    // {
    //   img:'/svg/icon/Icon (1) 1.svg',
    //   text:'Pay With Klarna'
    // },
    // {
    //   img:'/svg/icon/32px-PayPal_Logo_Icon_2014.svg 1.svg',
    //   text:'Pay With PayPal'
    // }
  ];

  const Delete = useMutation({
    mutationFn: DeleteCard,
    onSuccess: (data) => {
      showSnackbar(data.message, "success");
      FetchPaymentsMethods();
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const handleDelete = (e: any) => {
    e.stopPropagation();
    Delete.mutateAsync({
      paymentMethodId:
        PaymentsMethods?.merchant?.paymentMethods[0]?._id &&
        PaymentsMethods?.merchant?.paymentMethods[0]?._id,
    });
  };

  useEffect(() => {
    FetchPaymentsMethods();
    if (
      PaymentsMethods &&
      PaymentsMethods?.merchant?.paymentMethods.length > 0
    ) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [FetchPaymentsMethods]);

  const handleCard = () => {
    setCard(false);
  };
  // console.log('MyParcelsDetails', MyParcelsDetails)

  return (
    <>
      <div className="p-[30px]">
        <div className="flex md:flex-row flex-col justify-between gap-3 p-[20px]">
          <p className="text-[34px] font-[700] leading-[44px] text-center">
            {step === 0
              ? i18?.PAYMENT_SUMMARY?.TITLE || "Payment Summary"
              : card
              ? "Add a card"
              : i18?.NEW?.CHOOSEPAY || "Choose Payment Method"}
          </p>
          <Link
            href={"/cms/help_center"}
            className="p-4 bg-btncolor rounded-[31px] text-[#fff] flex gap-4 justify-center items-center"
          >
            {i18?.NEW?.GETHELP || "Get Help"}
            <Image
              src="/svg/icon/headphones.svg"
              alt="image"
              width={800}
              height={800}
              className="w-[20px] h-[20px]"
            />
          </Link>
        </div>
        {step === 0 ? (
          <PaymentSummary onClick={() => setStep(1)} />
        ) : MyParcelsDetails && MyParcelsDetails?.paymentStatus === "PAID" ? (
          <EmptyPage image="/svg/icon/success.svg" text="Payment Successfull" />
        ) : (
          <div className="flex flex-col gap-8">
            {!card ? (
              Payment.map((items, index) => {
                return (
                  <div
                    key={index}
                    // Ensure each item has a unique key (you might want to use a unique identifier if available)
                    onClick={() => setClikedIndex(index)}
                    className={`flex justify-between cursor-pointer border border-btncolor ${
                      index === clickedIndex ? "border-[2px]" : "border-1"
                    } flex gap-4 p-5 rounded-[7px] w-full md:w-[70%]`}
                  >
                    <div className="flex gap-4">
                      <Image
                        src={items?.img}
                        alt="image"
                        width={800}
                        height={800}
                        className="w-[20px] h-[20px]"
                      />
                      <p className="text-[#222222] text-[17px] font-[700] leading-[22px]">
                        {items?.text}
                      </p>
                    </div>
                    {items?.img2 && (
                      <Image
                        src={items?.img2}
                        alt="image"
                        width={800}
                        height={800}
                        className="w-[25px] h-[25px]"
                        onClick={(e) => {
                          handleDelete(e);
                        }}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="mt-10">
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    val={{
                      tripId: tripId,
                      postId: PostId,
                      paymentMethod: "STRIPE",
                    }}
                    handleCard={handleCard}
                  />
                </Elements>
              </div>
            )}

            {clickedIndex !== null && !card && (
              <div className="flex mt-6">
                <Button
                  className="text-[#fff] py-5 px-8 rounded-full bg-btncolor text-[17px] font-[500]"
                  onClick={Payment[clickedIndex]?.fnc} // Make sure fnc is a function
                >
                  {Payment[clickedIndex]?.button}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
export default ChoosePayment;
