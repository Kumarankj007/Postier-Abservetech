"use client";
import React, { useContext, useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { DM_Sans } from "next/font/google";
import Button from "../button";
import useSnackbarStore from "@/app/store/toaster";
import { useMutation } from "@tanstack/react-query";
import { AddCard, MakePayment } from "@/app/tools/mutatefn/payment";
import GetPaymentMethods from "@/app/store/payments";
import Store from "@/app/store/store";
import PostDetailsStore from "@/app/store/parcelDetails";
import { useSearchParams } from "next/navigation";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import Image from "next/image";
import PaymentDetail from "./paymentDetail";

const inter = DM_Sans({ subsets: ["latin"], variable: "--base-font" });
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      height: "30px",
      color: "#000",
      fontFamily: inter?.style?.fontFamily,
      fontSmoothing: "antialiased",
      fontSize: "17px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = ({ val, handleCard }: any) => {
  const { i18 } = useContext(PageContext);
  const i18Payment = i18?.PAYMENT_SUMMARY;
  const stripe = useStripe();
  const elements = useElements();
  const router = UseLoadingRouter();
  const showSnackbar: any = useSnackbarStore((state) => state.showSnackbar);
  const { FetchPaymentsMethods } = GetPaymentMethods();
  const searchParams: any = useSearchParams();
  const currentParams = new URLSearchParams(searchParams);
  const postId: any = currentParams.get("id");
  const PostId: any = postId ? postId : null;
  const [nickname, setName] = useState("");
  const { handleSubmit } = useForm<any>();
  const Payment = useMutation({
    mutationFn: MakePayment,
    onSuccess: (data) => {
      showSnackbar(data.message, "success");
      router.push(`/tracking/details?${currentParams}`);
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const Post = useMutation({
    mutationFn: AddCard,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      if (val) {
        const value = {
          ...val,
          paymentMethodId: data.data.merchant?.paymentMethods[0]?._id,
        };
        // Payment.mutateAsync(value)
      }
      FetchPaymentsMethods();
      handleCard();
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const Submit = async (data: any) => {
    if (!stripe || !elements) {
      return; // Stripe.js has not loaded yet
    }

    const cardElement: any = elements.getElement(CardNumberElement);

    const { token, error } = await stripe.createToken(cardElement);
    if (error || nickname == "") {
      if (nickname == "") {
        showSnackbar("name is incomplete", "error");
      } else if (error) {
        showSnackbar(error.message, "error");
      }
    } else {
      // console.log("PaymentMethod created:", token);
      if (token?.id && token?.card?.last4) {
        Post.mutateAsync({ cardNumber: token?.card?.last4, token: token?.id });
      }
    }
  };

  return (
    <div className="flex md:flex-row flex-col-reverse gap-10">
      <form onSubmit={handleSubmit(Submit)} className="max-w-[584px] w-full">
        {/* <div className='h-[200px] w-[100%] rounded-lg border-2 p-[20px]'>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
            {errorMessage && <div>{errorMessage}</div>}
            <Button type="submit" className='bg-[#1363c9] p-[10px] mt-[10px] rounded-lg text-[white]' disabled={!stripe}>
              {i18?.NEW?.ADD || "Add"}
            </Button> */}
        <p className="font-bold mb-4 text-[#222] lg:text-[17px] text-[15px] ">
          {i18Payment?.PAY_USING_CARDS || "Pay Using Cards"}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: 20,
          }}
        >
          <Image
            src="/png/Mastercard_logo.png"
            width={130}
            height={90}
            alt="Mastercard_logo"
          />
          <Image
            src="/png/visa-card-png.png"
            width={130}
            height={90}
            alt="visa"
          />
        </div>

        <div className="input-box">
          <CardNumberElement
            options={{
              ...CARD_ELEMENT_OPTIONS,
              placeholder: i18Payment?.ENTER_YOUR_CARD_NUMBER || "Enter your card number",
            }}
          />
        </div>

        <input
          type="text"
          className="input-box"
          value={nickname}
          onChange={(e) => setName(e.target.value)}
          placeholder= {i18Payment?.ENTER_YOUR_NAME ||  "Enter your name"}
        />

        <div className="input-box">
          <CardExpiryElement
            options={{
              ...CARD_ELEMENT_OPTIONS,
              placeholder: i18Payment?.CARD_EXPIRATION_DATE ||  "Card Expiration Date",
            }}
          />
        </div>

        <div className="input-box">
          <CardCvcElement
            options={{ ...CARD_ELEMENT_OPTIONS, placeholder: i18Payment?.ENTER_YOUR_CVV ||  "Enter your CVV" }}
          />
        </div>

        <Button
          type="submit"
          className="md:text-[17px] text-[15px] font-normal mx-auto md:px-8 px-5 md:py-4 py-3 border rounded-full bg-btncolor text-[#fff] mb-4 hover:scale-[1.05] duration-150 w-auto"
          disabled={!stripe}
        >
          {i18?.NEW?.CONFIRM || "Confirm"}
        </Button>

        <style>{`
            .StripeElement{
            height: unset;
            }
              .input-box {
                border: 1px solid #ccc;
                padding: 15px;
                border-radius: 6px;
                margin-bottom: 40px;
              }
      
              input {
                width: 100%;
                outline: none;
              }
      
              button:disabled {
                background: #999;
              }
            `}</style>
      </form>
      <PaymentDetail title={"Payment Summary"} />
    </div>
  );
};

export default CheckoutForm;
