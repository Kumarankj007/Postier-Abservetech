"use client";
import { FetchCms } from "@/app/tools/queryfn/fetch";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SkeletonComponent from "@/app/component/skeleton";
import "@/app/(frontend)/cms/[id]/cms.css";
import CmsHeader from "../../../component/cmsHeader";
import Quickguide from "./quickGuide";

export default function CMSpage() {
  const [content, setContent] = useState<any>({});
  const params = useParams();

  useEffect(() => {
    const data = async () => {
      const data = await FetchCms(params?.id);
      setContent(data?.content);
    };
    data();
    //    setContent(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return params?.id === "help_center" && "Help Center" ? (
    <Quickguide />
  ) : (
    <>
      <CmsHeader
        title={
          (params?.id === "terms_condition" && "Terms & Condition") ||
          (params?.id === "help_center" && "Help Center") ||
          (params?.id === "about_us" && "About Us") ||
          (params?.id === "privacy_policy" && "Privacy Policy") ||
          (params?.id === "contact_us" && "Contact Us") ||
          (params?.id === "dispute_resolution" && "Dispute Resolution") ||
          (params?.id === "imprint" && "Imprint") ||
          (params?.id === "payments_payouts" && "Payments and Payouts ")
        }
      />
      <div className="mx-[30px] md:mx-[80px] cmspage">
        <SkeletonComponent page="staticpage">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </SkeletonComponent>
      </div>
    </>
  );
}
