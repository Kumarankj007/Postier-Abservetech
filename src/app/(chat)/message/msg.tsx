'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Input from "@/app/component/input";
import { Avatar, Drawer } from "@mui/material";
import MessageSection from './messagesection';
import { messagecontent } from '../../../../content';
import useScreenWidth from '@/app/hooks/usescreenwidth';
import PageContext from '@/app/providers/pagecontext';
import useSocketStore from '@/app/hooks/socket';
import ChatData from '@/app/store/chat';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { MessageCount, OnlineFunction } from '@/utils';
import { useSearchParams } from 'next/navigation';
import EmptyPage from '@/app/component/emptydatapage';
import SkeletonComponent from '@/app/component/skeleton';
import Image from 'next/image';
import Store from '@/app/store/store';
import DropDown from '@/app/component/dropdown';
import { useMutation } from '@tanstack/react-query';
import { DeleteChannel } from '@/app/tools/mutatefn/chat';
import useSnackbarStore from '@/app/store/toaster';
import LoderComp from '@/app/component/loader';
dayjs.extend(relativeTime);

export default function Messages() {
    // const screen = useScreenDetector();
    const UserID = typeof window !== undefined && localStorage.getItem('appUserId')
    const SocketUrl: string | any = process.env.NEXT_PUBLIC_BASE_URL  + '/chatRequest'
    // console.log('SocketUrl', SocketUrl)
    const searchParams: any = useSearchParams()
    const channelId = searchParams.get('id') ? searchParams.get('id') : null
    const { Page } = Store()
    const [value, setValue] = useState<any>('')
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const [receiverId, setreceiverId] = useState<any>('')
    const { setRoom, connect, disconnect, onlineUser,SeenMessage,TriggerScrollBottom } = useSocketStore()
    const { FetchChat, Chat, FetchSingleChat, SingleChat, ResetMsg, setOnlineId, onlineId, ChatModal, setChatModal } = ChatData()
    const { i18 } = useContext(PageContext);
    // const screen: any = useScreenWidth()
    const screen: any = useScreenWidth()
    const [chat, setChat] = useState<any>({});
    const [openChat, setOpenChat] = useState(false);
    const handleCloseDrawer = () => {
        setChatModal(false)
    }
    const handleUrl = (data: any) => {
        const val: any = {}
        if (data) {
            val.id = data
        }
        const queryString = Object.keys(val).map((key) => `${key}=${encodeURIComponent(val[key])}`).join('&');
        window.history.replaceState({ path: '?' + queryString }, '', '?' + queryString);
    }
    const DeleteChannelFun = useMutation({
        mutationFn: DeleteChannel,
        onSuccess: () => {
            if (ChatModal) {
                setChatModal(false)
            }
        },
        onError: (err) => {
            showSnackbar(err.message, 'error')
        }
    })
    const ChannelDeleteFnc = (ChannelId: any) => {
        DeleteChannelFun.mutateAsync(ChannelId)
    }

    useEffect(() => {
        FetchChat({ page: 1, limit: 100, channelId: null,search:value })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

   const FetchSigngleChat = async ()=>{
      const res:any = await  FetchSingleChat({ channelId: channelId, page: 1 })
      if(res){
        TriggerScrollBottom()
      }
   }
    useEffect(() => {
        if (channelId !== null && channelId !== undefined) {
            FetchSigngleChat()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    // useEffect(() => {
    //     connect(SocketUrl);

    //     return () => {
    //         disconnect();
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [connect, disconnect]);

    useEffect(() => {
        if (receiverId) {
            ResetMsg(receiverId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [SingleChat, onlineId])

    useEffect(() => {
        OnlineFunction()
    }, [onlineUser, onlineId])
    // console.log('Chat', Chat)
    // const DeleteFnc = useMemo(() => (obj: any) => {
    //     if (obj > -1 && obj < Chat.length) {
    //         Chat.splice(obj, 1);
    //     }
    //     return null
    // }, [Chat])
    const seenEvent = (index: any) => {
        if (index > -1 && index < Chat.length) {
          const updatedMessages = Chat.map((message:any, i:any) => 
            i === index ? { ...message, unseen: 0 } : message
          );
          
          ChatData.setState({ Chat: updatedMessages }); 
        }
      };
      
    return (
        <><div className="flex flex-wrap border border-[#fff] rounded-[21px] relative">
            <div className="border-r border-[rgba(183, 183, 183, 0.7)] overflow-y-auto w-[100%] md:w-[50%] lg:w-[30%]">
                <div className="p-6 border-b border-[rgba(183, 183, 183, 0.7)] font-bold text-[20px]">
                    {i18?.MESSAGES?.HEADING || "Message"}
                </div>

                <div className="px-4 py-6  font-bold text-[20px]">
                    <div className='relative'>
                        <input
                            className='border border-[rgba(183, 183, 183, 0.7)] w-[100%] p-3 rounded-[11px] placeholder-black text-[14px] font-normal outline-none'
                            placeholder={i18?.MESSAGES?.SEARCH || "Search Postier"}
                            type="text"
                            onChange={(e) => setValue(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none">
                            <Image src='/svg/icon/search.svg' alt='svg' width={25} height={25} />
                        </div>
                    </div>
                </div>

                <div className="msg-sec1">
                    <LoderComp page='Message'>
                        {
                            Array.isArray(Chat) && Chat?.length > 0 ?
                                Array.isArray(Chat) && Chat.map((item: any, index: any) => (
                                    <div key={index} className="p-4 border-b border-[rgba(183, 183, 183, 0.7)] font-bold text-[20px] cursor-pointer flex justify-between" >
                                        <div className="flex justify-between w-[80%]" onClick={() => {
                                            setChat(item);
                                            // setOpenChat(true);
                                            // setRoom(item?._id)
                                            handleUrl(item?._id)
                                            seenEvent(index)
                                            SeenMessage(item?._id)
                                            // ResetMsg(item._id)
                                            // MessageCount(item._id)
                                            // if (onlineId) {
                                            //     InActiveUser(UserID, onlineId)
                                            // }
                                            // ActiveUser(UserID, item._id)
                                            // setOnlineId(item._id)
                                        }}>
                                            <div className="flex gap-4">
                                                <Avatar
                                                    src={process.env.NEXT_PUBLIC_IMAGE_URL + item?.receiverData[0]?.profile}
                                                    sx={{ width: '50px', height: '50px' }} />
                                                <div className='flex flex-col gap-2'>
                                                    <p className="font-semibold	text-[17px] leading-[22px] capitalize">{UserID === item?.postInfo[0]?.userId ? item?.tripInfo[0]?.title : item?.postInfo[0]?.title}</p>
                                                    <p className="font-semibold	text-[13px] leading-[22px] text-[#5a5a5a]">{item?.receiverData[0]?.fname || 'Postier'} {item?.receiverData[0]?.lname || ''}</p>
                                                    <p className={item?.unseen && item?.unseen !== 0 && item?.unseen !== null ? "font-font-semibold text-[17px] leading-[22px]" : "font-normal text-[17px] leading-[22px]"}>{item?.messages[0]?.message[0]?.content}</p>
                                                    {/* {
                                                        item?.lastMessage?.type !== 'file' ?
                                                            <p className={item?._id !== onlineId ? (item?.unreadCount !== 0 && item?.unreadCount !== null) ? "font-font-semibold	 text-[17px] leading-[22px]" : "font-normal text-[17px] leading-[22px]" : "font-normal text-[17px] leading-[22px]"}>{item?.lastMessage?.content}</p>
                                                            :
                                                            <div className='flex items-center'>
                                                                <Image src='/svg/icon/camera-svgrepo-com.svg' alt='img' className='w-[30px] h-[30px]' width={20} height={20} /> <span className='text-[14px] text-center font-medium	'>Photo</span>
                                                            </div>

                                                    } */}
                                                </div>
                                            </div>


                                            {/* <div className="">
                                                <p className="font-normal text-[#4F4F4F] text-[17px] leading-[22px]">{dayjs(item?.createdAt).fromNow(true)}</p>
                                                {item._id !== onlineId && <div className="mt-2 flex justify-end">
                                                    {
                                                        (item?.unreadCount !== 0 && item?.unreadCount !== null) &&
                                                        <div className='flex items-center justify-center bg-[#FF6F4E] w-[25px] h-[25px] rounded-full'>
                                                            <p className='text-[#fff] text-[11px]'> {item?.unreadCount} </p>
                                                        </div>
                                                    }

                                                </div>}
                                            </div> */}
                                        </div>
                                        {
                                            item?.unseen > 0 ?
                                                <div className='flex justify-end items-center'>
                                                    {
                                                        (item?.unseen !== 0 && item?.unseen !== null) &&
                                                        <div className='flex items-center justify-center bg-[#FF6F4E] w-[25px] h-[25px] rounded-full'>
                                                            <p className='text-[#fff] text-[11px]'> {item?.unseen} </p>
                                                        </div>
                                                    }
                                                </div>
                                                :
                                                <div className='w-[20%] flex justify-end items-center'>
                                                    {
                                                        !ChatModal &&
                                                        <DropDown
                                                            img="/svg/icon/threedot.svg"
                                                            data={[{
                                                                text: 'Delete', fnc: () =>
                                                                    ChannelDeleteFnc(item?._id)

                                                            }]}
                                                            className=""
                                                            width="100px"
                                                        />
                                                    }
                                                </div>
                                        }

                                    </div>

                                ))
                                :
                                <div className='p-5 w-full flex flex-col gap-3 justify-center items-center text-center'>
                                    <Image src='/svg/icon/msg.svg' alt='img' className='w-10 h-10' width={20} height={20} />
                                    <p className='font-[700] text-[17px]'>{i18?.NEW?.EMTMESS||"You don’t have any messages"}</p>
                                    <p className='text-[#6A6A6A] max-w-[350px]'>{i18?.NEW?.EMTMESS2 ||"When you receive a new message, it will appear here."}</p>
                                </div>
                        }
                    </LoderComp>
                </div>
            </div>

            <div className="cols-span-3 w-[50%] lg:w-[70%] relative">
                {ChatModal && chat ?
                    <>
                        {
                            (screen.width > 768) && <MessageSection />
                        }

                        {
                            screen.width < 768 &&
                            <Drawer
                                anchor="right"
                                open={ChatModal}
                                onClose={handleCloseDrawer}
                                PaperProps={{
                                    style: {
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "#fff",
                                    },
                                }}
                            >
                                <MessageSection handleCloseDrawer={handleCloseDrawer} />
                            </Drawer>
                        }
                    </>
                    :
                    <EmptyPage image='/png/nomessage.png' text={i18?.MESSAGES?.NOMSG || 'No Messages Found!'} />
                }
            </div>
        </div>
        </>
    );
}
