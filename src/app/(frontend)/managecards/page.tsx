"use client";
import CustomBreadCrumb from "@/app/component/breadcrumbs";
import CheckoutForm from "@/app/component/payment/cardelement";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import useScreenDetector from "@/app/hooks/useresize";
import PageContext from "@/app/providers/pagecontext";
import GetPaymentMethods from "@/app/store/payments";
import useSnackbarStore from "@/app/store/toaster";
import { DeleteCard, MakePayment } from "@/app/tools/mutatefn/payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

function ChoosePayment() {
  const { i18 } = useContext(PageContext);
  const router = UseLoadingRouter();
  const searchParams: any = useSearchParams();
  const currentParams = new URLSearchParams(searchParams);
  const postId: any = currentParams.get("parcelid");
  const tripId: any = currentParams.get("tripid");
  const PostId: any = postId ? postId : null;
  const stripekey: any = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || null;
  const [clickedIndex, setClikedIndex] = useState<any>(null);
  const [card, setCard] = useState(false);
  const stripePromise = loadStripe(stripekey);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const [showCardForm, setShowCardForm] = useState(false);
  const screen = useScreenDetector();

  const { FetchPaymentsMethods, PaymentsMethods }: any = GetPaymentMethods();

  const rightSection = [
    {
      img: "/svg/icon/card.svg",
      head: "Your Transactions Are Safe",
      para: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
    {
      img: "/svg/icon/dollar.svg",
      head: "Your Payments Are Safe",
      para: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    },
  ];

  const Post = useMutation({
    mutationFn: MakePayment,
    onSuccess: (data) => {
      showSnackbar(data.message, "success");
      router.push(`/tracking/details?${currentParams}`);
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });

  const Payment = [
    PaymentsMethods &&
    PaymentsMethods?.merchant?.paymentMethods.length > 0 &&
    PaymentsMethods?.merchant?.paymentMethods[0]?.deletedAt === null
      ? {
          img: "/svg/icon/credit-card.svg",
          img2: "/svg/icon/trash-2.svg",
          text: PaymentsMethods?.merchant?.paymentMethods[0]?.details?.card.padStart(
            12,
            "X"
          ),
        }
      : {
          img: "/svg/icon/plus-circle (2).svg",
          text: i18?.NEW?.ADD_A_CARD || "Add a card",
          fnc: () => router.push("/card"),
        },
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

  return (
    <div className="p-6 m-5 md:m-10 lg:m-16">
    <div>
      <div className="mb-6">
        <CustomBreadCrumb
          pathSegments="Transaction"
          link="/accountsettings/transaction/"
          pathSegments2={i18?.NEW?.CARD || "Manage Card"}
        />
      </div>
      <div className="flex justify-start space-x-4 mb-6">
        <p className="text-2xl md:text-3xl lg:text-[34px] font-bold">
          {i18?.NEW?.CARD || "Manage Cards"}
        </p>
      </div>
    </div>
  
    <div className="flex flex-col lg:flex-row  gap-10 w-full">
      {/* Left Section */}
      <div className="w-full  flex justify-center">
        <div className="w-full flex flex-col gap-8">
          <div className="flex flex-col gap-8 w-full md:w-3/4">
            {!card ? (
              Payment.map((items, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (items.fnc) {
                      items.fnc();
                    } else {
                      setClikedIndex(index);
                    }
                  }}
                  className={`flex justify-between border border-btncolor ${
                    index === clickedIndex ? "border-[2px]" : "border"
                  } gap-4 p-5 rounded-md w-full md:w-[80%]`}
                >
                  <div className="flex gap-4">
                    <Image
                      src={items?.img}
                      alt="image"
                      width={800}
                      height={800}
                      className="w-5 h-5"
                    />
                    <p className="text-gray-900 text-lg font-bold leading-6">
                      {items?.text}
                    </p>
                  </div>
                  {items?.img2 && (
                    <Image
                      src={items?.img2}
                      alt="image"
                      width={800}
                      height={800}
                      className="w-6 h-6 cursor-pointer"
                      onClick={(e) => handleDelete(e)}
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="w-full md:w-3/5 mt-10">
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
          </div>
  
          {showCardForm && (
            <div className="w-full md:w-3/4 mt-10">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  val={{ paymentMethod: "STRIPE" }}
                  handleCard={() => setShowCardForm(false)}
                />
              </Elements>
            </div>
          )}
        </div>
      </div>
  
      {/* Right Section */}
        {screen === "desktop" && (
               <div className="w-full flex justify-center">
                 <div className="flex  flex-col gap-6">
                   {rightSection.map((items, index) => (
                     <div
                       key={index}
                       className="border border-btncolor flex flex-col gap-6 p-5 rounded-[31px] w-full md:w-[350px]"
                     >
                       <Image width={50} height={50} src={items.img} alt="svg" />
                       <p className="text-[17px] font-bold">{items.head}</p>
                       <p className="text-[17px]">{items.para}</p>
                     </div>
                   ))}
                 </div>
               </div>
             )}
    </div>
  </div>
  
  );
}

export default ChoosePayment;
