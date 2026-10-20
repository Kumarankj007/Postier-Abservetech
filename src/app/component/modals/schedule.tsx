import React, { useContext } from "react";
import DateTimePickers from "@/app/(create)/components/datetimepicker";
import Button from "../button";
import Store from "@/app/store/store";
import PageContext from "@/app/providers/pagecontext";

export default function Schedule() {
    const { i18 } = useContext(PageContext);
    const { setModal } = Store()
    return (
        <div className="flex flex-col gap-6 justify-center">
            <p className="text-[34px] leading-[31px] font-[700] text-center">{i18?.NEW?.SCHEDULE || "Schedule"}</p>
            <p className="text-[20px] leading-[31px] font-[500] text-center w-full ">{i18?.NEW?.SELECT_PARCEL_DATE_TIME || "Select your preferred date & time for your parcel to publish"}</p>
            <DateTimePickers />
            <div className="flex justify-center gap-6">
                <Button className="bg-btncolor text-[#fff] py-[15px] px-[25px] rounded-full">
                    {i18?.NEW?.SCHEDULE || "Schedule"}
                </Button>
                <Button onClick={() => setModal('')} className="border boder-1 border-btncolor text-btncolor py-[15px] px-[25px] rounded-full">
                    {i18?.NEW?.CANCEL || "Cancel"}
                </Button>
            </div>
        </div>
    )
}