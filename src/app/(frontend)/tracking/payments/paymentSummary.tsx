'use client'
import Button from "@/app/component/button";
import PaymentDetail from "@/app/component/payment/paymentDetail";
import PageContext from "@/app/providers/pagecontext";
import { priceFormat } from "@/utils";
import Image from "next/image";
import { useContext } from "react";

export default function PaymentSummary({ onClick = () => {} }) {
  const { i18 } = useContext(PageContext);
  const i18Payment = i18?.PAYMENT_SUMMARY;
  const summary = {
    payment: 25,
    invoiceNo: "000-253-357-231",
    paymentDate: "29-04-2025",
    gst: 7,
    gst_percent: 18,
    sgst: 3,
    sgst_percent: 18,
    total: 35,
    descList: [
      {
        title: i18Payment?.CANCELLATION_POLICY || "Cancellation policy",
        desc: i18Payment?.CANCELLATION_POLICY_DESC || "Free cancellation before 12 hours before the start of the parcel distribution time. After that the booking is no longer refundable. These deadlines always refer to the local time of the advert",
      },
      {
        title: i18Payment?.POSTIER_SERVICE_FEE || "Postier service fee",
        desc: i18Payment?.POSTIER_SERVICE_FEE_DESC || "Includes the applicable value added tax. To the VAT invoice.",
      },
      {
        title: i18Payment?.HAVE_A_QUESTION || "Do you have a question?",
        desc: i18Payment?.HAVE_A_QUESTION_DESC || "You can find details about payments and refunds in the section with your payments. Alternatively you can contact us in the help center.",
      },
      {
        title: i18Payment?.POSTIER_PAYMENTS || "Postier Payments ",
        desc: i18Payment?.POSTIER_PAYMENTS_DESC || "Postier Payments is a limited payment processor of your host. This means that your payment obligation to the host is fulfilled by your payment of the total amount to Postier Payments. Refund requests will be processed in accordance with: (i) the Postier’s cancellation policy or (ii) the Rebooking and Refunds Policy, available at www.postier.org/terms.",
      },
    ],
  };
  const fonts = {
    pFont: "sm:text-[17px] text-[15px] font-normal",
    pBold: "sm:text-[17px] text-[15px] font-black",
  };
  return (
    <div>
      <PaymentDetail />
      {/* list of description */}
      <section className="md:mt-16 mt-5">
        <div className="flex items-start flex-wrap gap-4 mb-4">
          {summary?.descList?.map((item: any, ind: number) => (
            <div
              key={ind}
              className="flex items-start border border-[#004080] rounded-3xl md:w-[47%] gap-3 p-3 "
            >
              <Image
                height={30}
                width={30}
                src={"/svg/icon/book.svg"}
                alt="book"
                className="object-contain h-8 w-8 "
              />
              <div>
                <b className={fonts.pBold}>{item?.title}</b>
                <p className={fonts.pFont}>{item?.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {/* continue */}
        <Button
          onClick={onClick}
          className={`${fonts.pFont} block md:px-8 px-5 md:py-4 py-3 border rounded-full bg-btncolor text-[#fff]  hover:scale-[1.05] duration-150`}
        >
          {i18?.NEW?.CONTINUE || "Continue"}
        </Button>
      </section>
    </div>
  );
}
