"use client";
import Image from "next/image";
import CmsHeader from "../../component/cmsHeader";
import { SubTitle } from "@/app/component/subTtlFont";
import { useContext } from "react";
import PageContext from "@/app/providers/pagecontext";

export default function CancellationPolicy() {
  const { i18 } = useContext(PageContext);
  const cancellationPolicy = i18?.CANCELLATION_POLICY;
  const CancellationContent = {
    policy:
      cancellationPolicy?.DESC ||
      "At Postier, we strive to offer a flexible and reliable delivery experience for senders, postiers, and receivers. We understand that plans may change, and cancellations might be necessary. This policy outlines the terms under which cancellations are allowed and how they are managed.",
    sender: [
      cancellationPolicy?.SENDER_1 ||
        "You may cancel your delivery at any time before pickup.",
      cancellationPolicy?.SENDER_2 ||
        "If a payment has already been processed, a partial refund may be applied based on the cancellation timing and delivery status.",
      cancellationPolicy?.SENDER_3 ||
        "If the Postier has already picked up the parcel, cancellation is no longer possible. Please contact our support team for help.",
    ],
    postier: [
      cancellationPolicy?.POSTIER_1 ||
        "You may cancel a trip prior to accepting any delivery requests without penalties.",
      cancellationPolicy?.POSTIER_2 ||
        "Once a parcel is accepted and scheduled for pickup, cancelling a trip may affect your reliability rating and ability to receive future requests.",
      cancellationPolicy?.POSTIER_3 ||
        "If unavoidable, please notify the sender as early as possible and contact support if assistance is needed.",
    ],
    refundAndFees: {
      tHeads: [
        cancellationPolicy?.CANCELLATION_TIMING || "Cancellation Timing",
        cancellationPolicy?.SENDER_REFUND || "Sender Refund",
        cancellationPolicy?.POSTIER_IMPACT || "Postier Impact",
      ],
      tRows: [
        [
          cancellationPolicy?.CANCELLATION_TIMING_1 ||
            "More than 24 hours before scheduled pickup",
          cancellationPolicy?.SENDER_REFUND_1 ||
            "Full refund (based on status)",
          cancellationPolicy?.POSTIER_IMPACT_1 || "No impact",
        ],
        [
          cancellationPolicy?.CANCELLATION_TIMING_2 ||
            "Less than 24 hours before pickup",
          cancellationPolicy?.SENDER_REFUND_2 || "Partial refund",
          cancellationPolicy?.POSTIER_IMPACT_2 ||
            "May affect reliability  rating",
        ],
        [
          cancellationPolicy?.CANCELLATION_TIMING_3 ||
            "After Postier has arrived at pickup point or started delivery",
          cancellationPolicy?.SENDER_REFUND_3 || "No refund",
          cancellationPolicy?.POSTIER_IMPACT_3 ||
            "Possible account review for repeated cases",
        ],
      ],
    },
    notes: [
      cancellationPolicy?.NOTE_1 ||
        "Note: All refunds are processed to the original payment method within 5–7 business days. The exact refund amount will depend on whether the parcel has been accepted, picked up, or is already in transit.",
      cancellationPolicy?.NOTE_2 ||
        "All refunds are processed within 5–7 business days to your original payment method.",
    ],
    cancel: [
      cancellationPolicy?.HOW_TO_CANCEL_1 || "Log into your Postier account.",
      cancellationPolicy?.HOW_TO_CANCEL_2 || "Go to My Trips or My Parcels.",
      cancellationPolicy?.HOW_TO_CANCEL_3 || "Click on the specific item.",
      cancellationPolicy?.HOW_TO_CANCEL_4 || "Select Cancel and confirm your reason.",
    ],
    impNotes: [
      cancellationPolicy?.IMP_NOTES_1 ||
        "Frequent or last-minute cancellations may lead to temporary suspension or account review.",
      cancellationPolicy?.IMP_NOTES_2 ||
        "If you feel your cancellation was unavoidable (e.g., emergency or fraud suspicion), please contact our support with relevant details.",
      cancellationPolicy?.IMP_NOTES_3 ||
        "In case of disputes, Postier may hold funds until the case is reviewed and resolved.",
    ],
    commitment:
      cancellationPolicy?.OUR_COMMITMENT_DESC ||
      "Postier is committed to fairness and transparency. We aim to balance the flexibility users need with the reliability and trust required by our community. Thank you for helping us make Postier a secure and efficient platform.",
  };

  // fonts:
  const subTitleFont = "font-normal sm:text-[17px] text-[16px] text-[#004080]";
  const pFont =
    "font-normal sm:text-[17px] text-[15px] sm:leading-loose leading-relaxed text-[#000]";
  const h2Font =
    "font-semibold lg:text-[36px] sm:text-[30px] text-[25px] text-[#004080]";
  const tHeadFont =
    "font-semibold lg:text-[24px] sm:text-[21px] text-[18px] text-[#fff]";

  return (
    <>
      <CmsHeader
        title={cancellationPolicy?.TITLE || "Postier Cancellation Policy"}
        subtitle={cancellationPolicy?.TITLE || "Postier Cancellation Policy"}
      />
      <div className="max-w-[1440px] mx-auto xl:px-[60px] lg:px-[40px] sm:px-[20px] px-[15px] my-16">
        {/* cancellation policy */}
        <SubTitle
          title={cancellationPolicy?.TITLE || "Postier Cancellation Policy"}
          img="/svg/icon/cancellation.svg"
          subTtlFont={subTitleFont}
        />
        <p className={`${pFont} mb-4`}>{CancellationContent.policy}</p>
        {/* guidlines */}
        <SubTitle
          title={
            cancellationPolicy?.GENERAL_GUIDELINES ||
            "General Cancellation Guidelines"
          }
          img="/svg/icon/gendrel.svg"
          subTtlFont={subTitleFont}
        />
        {/* sender */}
        {CancellationContent.sender.length > 0 && (
          <>
            <SubTitle
              title={cancellationPolicy?.FOR_SENDERS || "For Senders:"}
            />
            <ul className="list-disc ml-7">
              {CancellationContent.sender.map((item, i) => (
                <li key={i} className={`${pFont} sm:mb-5 mb-3`}>
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}
        {/* postier */}
        {CancellationContent.postier.length > 0 && (
          <>
            <SubTitle
              title={cancellationPolicy?.FOR_POSTIERS || "For Postiers:"}
            />
            <ul className="list-disc ml-7">
              {CancellationContent.postier.map((item, i) => (
                <li key={i} className={`${pFont} sm:mb-5 mb-3`}>
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}
        {/* refunds */}
        <div className="lg:mx-[100px] md:mx-[50px] sm:mx-[20px] my-10">
          <h2 className={`${h2Font} mb-8`}>
            <Image
              height={22}
              width={22}
              src={"/svg/icon/refund.svg"}
              alt={"refund.svg"}
              className="inline object-contain mr-1 w-[60px] h-[45px]"
            />
            {cancellationPolicy?.REFUNDS_AND_FEES || "Refunds and Fees"}
          </h2>
          <div className="overflow-auto scroll-container bg-white rounded-2xl shadow-lg border border-[#000]">
            <table className="w-full min-w-[600px] bg-[#004080] table-fixed">
              <thead className={`bg-[#004080] text-white ${h2Font}`}>
                <tr>
                  {CancellationContent.refundAndFees.tHeads.map((item, i) => (
                    <th
                      key={i}
                      className={`sm:px-6 px-3 sm:py-3 py-2 text-center ${tHeadFont} text-white`}
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`bg-[#fff] ${pFont} `}>
                {CancellationContent.refundAndFees.tRows.map((item, i) => (
                  <tr key={i}>
                    {item.map((data, ind) => (
                      <td
                        key={ind}
                        className={`lg:px-8 px-3 sm:py-6 py-3 border-[#000] ${
                          CancellationContent.refundAndFees.tRows.length - 1 >
                            i && "border-b"
                        } ${ind != 0 && "border-l"} `}
                      >
                        {ind == 1 && (
                          <Image
                            height={22}
                            width={22}
                            src={`/svg/icon/${
                              i == 0 ? "delivered" : i == 1 ? "warnblue" : "err"
                            }.svg`}
                            alt={"icon"}
                            className="inline object-contain mr-1 w-[25px] h-[25px]"
                          />
                        )}
                        {data}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* notes */}
        {CancellationContent.notes.map((item, i) => (
          <p key={i} className={`${pFont} mb-4`}>
            <Image
              height={22}
              width={22}
              src={"/svg/icon/notes.svg"}
              alt={"notes"}
              className="object-contain inline mr-1 h-[24px] w-[24px]"
            />
            {item}
          </p>
        ))}
        {/* cancel block */}
        <SubTitle
          title={cancellationPolicy?.HOW_TO_CANCEL || "How to Cancel"}
          img="/svg/icon/mailbox.svg"
        />
        <p className={`${pFont} mb-4`}>
          {cancellationPolicy?.HOW_TO_CANCEL_DESC1 ||
            "To cancel your trip or delivery request:"}
        </p>
        <ol className="list-decimal ml-5">
          {CancellationContent.cancel.map((item, i) => (
            <li key={i} className={`${pFont} mb-4`}>
              {item}
            </li>
          ))}
        </ol>
        <p className={`${pFont} mb-4`}>
          {cancellationPolicy?.HOW_TO_CANCEL_DESC2 ||
            "If you experience any issues during this process, our support team is always ready to help you via"}{" "}
          support@postier.org.
        </p>
        {/* important notes */}
        {CancellationContent.impNotes.length > 0 && (
          <div className="mb-5">
            <SubTitle title={cancellationPolicy?.IMP_NOTES || "Important Notes"} img="/svg/icon/warnblue.svg" />
            <ul className="list-disc ml-7">
              {CancellationContent.impNotes.map((item, i) => (
                <li key={i} className={`${pFont} mb-5`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* commitment */}
        <div className="mb-5">
          <SubTitle title={cancellationPolicy?.OUR_COMMITMENT || "Our Commitment"} img="/svg/icon/commit.svg" />
          <p className={`${pFont} mb-4`}>{CancellationContent.commitment}</p>
        </div>
      </div>
    </>
  );
}
