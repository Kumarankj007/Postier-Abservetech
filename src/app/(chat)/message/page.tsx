"use client";
import PageContext from "@/app/providers/pagecontext";
import ChatData from "@/app/store/chat";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import useSocketStore from '@/app/hooks/socket';
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";

function Inbox() {
    const { FetchChat, Chat } = ChatData();
    const {connect,disconnect} = useSocketStore()
    const { i18 } = useContext(PageContext);
    const pathname = usePathname()
    const Router = UseLoadingRouter()
     const SocketUrl: string | any = process.env.NEXT_PUBLIC_BASE_URL  + '/chatRequest'
     const token = typeof window !== "undefined" && 
     window.localStorage.getItem('appToken') !== null ? window.localStorage.getItem('appToken') : ''
     const param = useSearchParams();
    // const Id: any = param ? param.get("channelid") : null;
    // const [channelId, setChannelid] = useState(null);
    useEffect(() => {
        FetchChat({ page: 1, limit: 100, channelId: null });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSingleChat = (channelid: any) => {
        Router.push(`${pathname}${channelid}`)
    };

    // useEffect(() => {
    //     setChannelid(Id);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [param]);

    // useEffect(() => {
    //     if(token){
    //         connect(SocketUrl,token);
    //     }

    //     return () => {
    //         disconnect();
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [connect, disconnect,token]);
    return (
        <div className={`flex flex-col gap-6 items-center mt-[40px] ${Chat?.length > 0 ? "" : 'justify-center h-full'}`}>
           
                <>
                    <div>
                        <p className="text-[30px] sm:text-[50px] font-[700] leading-[65px]">{i18?.NEW?.INBOX || "Inbox"}</p>
                    </div>

                    <div className="flex flex-col gap-8 max-w-[600px] px-[20px]">
                        {Array.isArray(Chat) && Chat?.length > 0 ? (
                            Array.isArray(Chat) &&
                            Chat.map((item: any, index: any) => (
                                <div
                                    key={index}
                                    className="p-5 border border-1 border-btncolor flex justify-between gap-4 items-center rounded-[21px] w-full cursor-pointer"
                                    onClick={() => handleSingleChat(item?._id)}
                                >
                                    <div className="flex flex-col gap-4">
                                        <p className="text-[17px] font-[700] leading-[22px]">
                                            {item?.receiverData[0]?.fname &&
                                                item?.receiverData[0]?.fname}{" "}
                                            {item?.receiverData[0]?.lname &&
                                                item?.receiverData[0]?.lname}
                                        </p>

                                        <div className="flex gap-2 items-center">
                                            <p className="text-[17px] font-[500] leading-[22px]">
                                                {item?.tripInfo[0]?.location?.pickUpCity}{" "}
                                            </p>
                                            <Image
                                                width={800}
                                                height={800}
                                                src="/svg/icon/Arrow back.svg"
                                                alt="img"
                                                className="w-[20px] h-[20px]"
                                            />
                                            <p className="text-[17px] font-[500] leading-[22px]">
                                                {item?.tripInfo[0]?.location?.dropCity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Image
                                            width={100}
                                            height={100}
                                            src={
                                                process.env.NEXT_PUBLIC_IMAGE_URL +
                                                item?.receiverData[0]?.profile
                                            }
                                            alt="img"
                                            className="w-[50px] h-[50px] sm:w-[100px] sm:h-[100px] object-cover rounded-full drop-shadow-md"
                                        />
                                        <Image
                                            width={800}
                                            height={800}
                                            src="/svg/icon/chevron-right.svg"
                                            alt="img"
                                            className="w-[20px] h-[20px] rounded-full"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-5 w-full flex flex-col gap-3 justify-center items-center text-center">
                                <Image
                                    src="/svg/icon/msg.svg"
                                    alt="img"
                                    className="w-10 h-10"
                                    width={20}
                                    height={20}
                                />
                                <p className="font-[700] text-[17px]">
                                    {i18?.NEW?.EMTMESS || "You don’t have any messages"}
                                </p>
                                <p className="text-[#6A6A6A] max-w-[350px]">
                                    {i18?.NEW?.EMTMESS2 ||
                                        "When you receive a new message, it will appear here."}
                                </p>
                            </div>
                        )}
                    </div>
                </>
        </div>
    );
}

export default Inbox;
