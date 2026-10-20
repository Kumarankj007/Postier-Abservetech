import Button from "@/app/component/button";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import useSnackbarStore from "@/app/store/toaster";
import { CreateChannel } from "@/app/tools/mutatefn/chat";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useContext } from "react";
import PageContext from "@/app/providers/pagecontext";

function Details({ MyParcelsDetails }: any) {
  const { i18 } = useContext(PageContext);
  const router = UseLoadingRouter();
  const params = useSearchParams();
  const Parcel_id: any = params ? params.get("id") : "";
  const Trip_id: any = params ? params.get("trip_id") : "";
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const TypeArray =
    MyParcelsDetails && MyParcelsDetails?.parcel?.type?.split(",");
  const Type = params.get("type") ? params.get("type") : null;

  const Channel = useMutation({
    mutationFn: CreateChannel,
    onSuccess: (data) => {
      router.push(`/message/${data?.data?.channel?._id}`);
    },
    onError: (data) => {
      showSnackbar(data.message, "error");
    },
  });
  const handleChannel = () => {
    const data: any = {};
    if (Trip_id) {
      data.tripId = Trip_id;
    }
    if (Parcel_id) {
      data.postId = Parcel_id;
    }
    Channel.mutateAsync(data);
  };
  return (
    <div>
      <div>
        <p className="font-[700] text-[17px] sm:text-[30px] leading-[39px]">
          {i18?.NEW?.ABOUT_CUSTOMER || "About Customer"}
        </p>
        <hr className="border-[rgba(0, 64, 128, 1)]  my-[35px]" />
        <div className="flex  gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <Image
            src={
                MyParcelsDetails?.consignor?.profile?.startsWith("http")
                  ? MyParcelsDetails?.consignor?.profile
                  : process.env.NEXT_PUBLIC_IMAGE_URL +
                    MyParcelsDetails?.consignor?.profile
              }
              alt="img"
              width={800}
              height={800}
              className="w-[60px] sm:w-[90px] h-[60px] sm:h-[90px] rounded-full"
            />
            <div className="flex flex-col gap-4">
              <p className="text-[14px] sm:text-[20px] font-[600] leading-[26px]  w-[80px] sm:w-full truncate">
                {MyParcelsDetails?.consignor?.firstName}{" "}
                {MyParcelsDetails?.consignor?.lastName}
              </p>
              <div className="flex gap-2 items-center">
                <Image
                  src="/svg/icon/star.svg"
                  alt="img"
                  width={800}
                  height={800}
                  className="w-[15px] sm:w-[20px] h-[15px] sm:h-[20px]"
                />
                <p className="text-[12px] sm:text-[15px] w-[80px] sm:w-full truncate">
                  {MyParcelsDetails?.consignor?.ratings?.totalValue}{" "}
                  {i18?.NEW?.OUT_OF_5_STARS || "Out of 5 Stars"}
                </p>
              </div>
            </div>
          </div>
          {Type !== "search" && (
            <Button
              onClick={handleChannel}
              className="p-2 h-[40px] sm:h-[60px] w-[90px] sm:w-[130px] border border-1 border-btncolor rounded-full"
            >
              {i18?.NEW?.MESSAGE || "Message"}
            </Button>
          )}
        </div>
        <hr className="border-[rgba(0, 64, 128, 1)]  my-[35px]" />
        <div className="flex flex-col gap-[35px]">
          <p className="text-[17px] font-[700] leading-[22px] text-[#222222]">
            {MyParcelsDetails?.consignor?.firstName}{" "}
            {i18?.NEW?.WANT_TO_SEND_THIS_PARCEL_CATEGORY ||
              "want to send this parcel category"}
          </p>
          <div className="flex gap-4 flex-wrap">
            {Array.isArray(TypeArray) &&
              TypeArray.map((items: any, index: any) => (
                <div
                  key={index}
                  className="border border-1 border-btncolor px-5 py-3 rounded-full"
                >
                  {items}
                </div>
              ))}
          </div>
        </div>
        <hr className="border-[rgba(0, 64, 128, 1)]  my-[35px]" />
      </div>
    </div>
  );
}

export default Details;
