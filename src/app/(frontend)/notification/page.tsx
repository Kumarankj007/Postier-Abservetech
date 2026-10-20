'use client'
import Button from "@/app/component/button";
import DropDown from "@/app/component/dropdown";
import Select from "@/app/component/select";
import { notifyContent } from "../../../../content";
import { Avatar } from "@mui/material";
import PageContext from "@/app/providers/pagecontext";
import { useContext, useEffect } from "react";
import ReviewData from "@/app/store/reviews";
import EmptyPage from "@/app/component/emptydatapage";
import ContentTooptip from "@/app/component/contentTooptip";
import { NotificationPreferences } from "@/app/(profileDetails)/accountsettings/content";
import CustomBreadCrumb from "@/app/component/breadcrumbs";

export default function Notification() {
    const { i18 } = useContext(PageContext);
    const { FetchNotifications, Notifications } = ReviewData()
    useEffect(() => {
        FetchNotifications()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className="max-w-[1450px] mx-auto px-[20px]">
            {/* <DropDown
                width='400px'
                text={i18?.DROPDOWN?.DATERANGE || 'Date Range'}
                img2='/svg/icon/dropdownicon.svg'
                className='flex gap-3 justify-center items-center border border-btncolor w-[165px] h-[60px] rounded-[17px] text-btncolor my-[30px]'
            >
                <div className="p-5">
                    <div className="flex flex-col gap-3">
                        <p className="font-semibold text-[17px]">Date Range</p>
                        <Select placeholder="Select a month">
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="flex flex-col gap-3">
                            <p className="font-semibold text-[17px]">From</p>
                            <Select placeholder="Date">
                            </Select>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="font-semibold text-[17px]">To</p>
                            <Select placeholder="Date">
                            </Select>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button className="py-[10px] px-[20px] bg-btncolor text-[#fff] rounded-[7px]">
                            Apply
                        </Button>
                    </div>
                </div>
            </DropDown> */}
            <div className="mt-8">
                <CustomBreadCrumb
                    pathSegments={i18?.HOMEPAGE?.NAVBAR?.NONTIFICATIONS || "Notification"}
                />
                <div className="flex items-center my-8">
                    <p className="text-[34px] font-[700] leading-[44px]">
                        Notification
                    </p>
                    <ContentTooptip value={NotificationPreferences()} />
                </div>
            </div>

            {
                Array.isArray(Notifications) && Notifications.length > 0 ?
                    Array.isArray(Notifications) && Notifications.map((item: any, index: any) => {
                        return (
                            <div
                                key={index}
                                className="p-5 border-b border-[#D9D9D9] cursor-pointer flex gap-4 items-center"
                            >
                                <Avatar
                                    key={index}
                                    alt={`Avatar ${index + 1}`}
                                    src={process.env.NEXT_PUBLIC_IMAGE_URL + item.image}
                                    className="avathar"
                                />
                                <p className="font-normal text-[13px] leading-[16px] ">
                                    {item.body}
                                </p>
                            </div>
                        );
                    })
                    :
                    <div className="h-screen">
                        <EmptyPage image='/png/tableEmpty.png' text={i18?.NEW?.NONOTIFICATIONFOUND || 'No notification found'} />
                    </div>
            }
        </div>
    )
}