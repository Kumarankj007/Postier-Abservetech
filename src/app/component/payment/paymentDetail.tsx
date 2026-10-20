"use client";
import PageContext from "@/app/providers/pagecontext";
import ParcelStore from "@/app/store/parcel";
import { priceFormat } from "@/utils";
import React, { useContext } from "react";

export default function PaymentDetail({ title = "" }: any) {
  const { MyParcelsDetails }: any = ParcelStore();
  const { i18 } = useContext(PageContext);
  const i18Payment = i18?.PAYMENT_SUMMARY;

  // date format:
  const formatDate = (date: string) => {
    const newDate = new Date(date)
      .toLocaleDateString()
      .split("/")
      .map((data) => data.padStart(2, "0"))
      .join("-");
    return newDate;
  };

  // destructure the detail:
  const summary = {
    payment: MyParcelsDetails?.parcel?.fare,
    invoiceNo: MyParcelsDetails?.invoiceNo,
    paymentDate: formatDate(MyParcelsDetails?.createdAt),
    vat: MyParcelsDetails?.parcel?.taxAmount,
    vat_percent: 0,
    total: MyParcelsDetails?.parcel?.fare + MyParcelsDetails?.parcel?.taxAmount,
  };
  // console.log(MyParcelsDetails, "MyParcelsDetails");
  const fonts = {
    pFont: "sm:text-[17px] text-[15px] font-normal",
    pBold: "sm:text-[17px] text-[15px] font-black",
  };

  const DetailCard = ({
    title = "",
    value = "",
    tBold = false,
    altstyle = "",
  }: any) => {
    return (
      value && (
        <div className={altstyle + " flex items-center justify-between my-9"}>
          {title && (
            <p className={tBold ? fonts.pBold : fonts.pFont}>{title}</p>
          )}
          {value && <p className={fonts.pFont}>{value}</p>}
        </div>
      )
    );
  };

  return (
    <section className="max-w-[570px] w-full ">
      {title != "" && <h4 className="text-[24px] font-[700] ">{title}</h4>}
      <div className="px-8 border-b-2">
        <DetailCard
          title={i18Payment?.POSTIER_PAYMENT || "Postier Payment"}
          value={priceFormat(Number(summary.payment))}
        />
        <DetailCard
          title={i18Payment?.INVOICE_NUMBER || "Invoice Number"}
          value={summary.invoiceNo}
        />
        <DetailCard
          title={i18Payment?.PAYMENT_DATE || "Payment Date"}
          value={summary.paymentDate}
        />
      </div>
      <div className="px-8 my-4">
        <b className={fonts.pBold}>
          {i18Payment?.TAX_DETAILS || "Tax Details"}
        </b>
        <DetailCard
          title={`${i18Payment?.VAT || "VAT"} (${summary.vat_percent}% ${
            i18Payment?.TAX || "Tax"
          })`}
          value={priceFormat(Number(summary.vat))}
        />
        <DetailCard
          altstyle={"mt-12"}
          title={i18Payment?.TOTAL || `Total`}
          value={priceFormat(Number(summary.total))}
          tBold={true}
        />
      </div>
    </section>
  );
}
