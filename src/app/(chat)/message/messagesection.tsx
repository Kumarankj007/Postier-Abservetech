'use client'
import DropDown from "@/app/component/dropdown"
import Input from "@/app/component/input"
import useSocketStore from "@/app/hooks/socket";
import ChatData from "@/app/store/chat";
import TypeStore from "@/app/store/typeStore";
import { Avatar } from "@mui/material"
import { useContext, useEffect, useState, Fragment, useRef } from "react";
import PopoverComponent from "@/app/component/popover";
import { Controller, useForm } from "react-hook-form";
import Store from "@/app/store/store";
import Button from "@/app/component/button";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { DoubleTick } from "../../../../public/svg/svgcomponent";
import { TimeFormat } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { DeleteChannel } from "@/app/tools/mutatefn/chat";
import useSnackbarStore from "@/app/store/toaster";
import SkeletonComponent from "@/app/component/skeleton";
import LoderComp from "@/app/component/loader";
import EmptyPage from "@/app/component/emptydatapage";
import PageContext from "@/app/providers/pagecontext";

export default function MessageSection({ handleCloseDrawer }: any) {
    const { i18 } = useContext(PageContext);
    const { CON64File, setCON64File } = Store()
    const UserID = typeof window !== undefined && localStorage.getItem('appUserId')
    const lastMessageRef: any = useRef(null);
    const searchParams: any = useSearchParams()
    const params = new URLSearchParams(searchParams)
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
    const channelId = searchParams.get('id') ? searchParams.get('id') : null
    const { sendMessage, messages, setChat, onlineStatus, typing, lastMessageTime,TriggerScrollBottom} = useSocketStore()
    const fileInputRef: any = useRef(null);
    const { control, handleSubmit, formState: { errors }, reset } = useForm()
    const { DeleteChat, onlineId, Chat, SingleChat, FetchChat, FetchSingleChat, clickedchat,ChatModal,setChatModal } = ChatData()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [msgLimit, setMsgLimit] = useState(10)
    const [msgPage, setMsgPage] = useState(1)
    const [messageTy, setMessage] = useState('');
    const [imgContainer, SetImgContainer] = useState(false)
    const [isTyping, setIsTyping] = useState(false);
    const socketRef: any = useRef();
    const typingTimeoutRef: any = useRef();
    const loadingMessages: any = useRef(false);
    const PrevMessageRef: any = useRef(null)
    const endedMessage: any = useRef(false);
    const scrollRef: any = useRef();
    const userId = window.localStorage.getItem('appUserId')
    // const channelId = Chat._id ? Chat._id : ''
    const sendMessageAck = (data: any) => {
        // FetchChat({page:1,limit:100,channeId:null})
        // FetchSingleChat(channeId)
    }
    const handleMessage = (data: any) => {
        const value: any = {}
        if (data.message) {
            value.content = data.message
            value.type = 'text'
        }
        if (CON64File) {
            value.content = CON64File
            value.type = 'file'
        }
        if (userId) {
            value.senderId = userId
        }
        if (channelId) {
            value.channelId = channelId
        }
        sendMessage(value)
        setMessage('');
        reset()
        if (CON64File) {
            setCON64File(null)
        }
    };

    const DeleteFun = (id: any) => {
        DeleteChat(id,channelId)
    }
    const DeleteChannelFun = useMutation({
        mutationFn:DeleteChannel,
        onSuccess:() => {
           if(ChatModal){
            setChatModal(false)
            params.delete('id')
            window.history.replaceState({ path: params.toString() }, '', '?' + params.toString());
           }
        },
        onError:(err)=>{
            showSnackbar(err.message,'error')
        }
    })
    const ChannelDeleteFnc = (ChannelId:any) => {
        DeleteChannelFun.mutateAsync(ChannelId)
    }
    // useEffect(() => {
    //     if (messageTy) {
    //         if (!isTyping) {
    //             setIsTyping(true);
    //             Typing(onlineId)
    //         }

    //         clearTimeout(typingTimeoutRef.current);
    //         typingTimeoutRef.current = setTimeout(() => {
    //             setIsTyping(false);
    //             stopTyping(onlineId)
    //         }, 2000);
    //     }
    //     else {
    //         setIsTyping(false);
    //         stopTyping(onlineId)
    //     }
    // }, [messageTy]);
    useEffect(() => {
        if(channelId !== null && channelId !== undefined  ){
            FetchChat({ channelId: channelId })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channelId])

    useEffect(() => {
        if (lastMessageRef.current && !loadingMessages.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [lastMessageTime]);

    useEffect(() => {
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (!endedMessage.current) {
                    loadingMessages.current = true;
                    setMsgPage((prev) => prev + 1)
                }
                // setMsgLimit((prev)=>prev + 10)
            }
        });
        if (PrevMessageRef.current) {
            observer.observe(PrevMessageRef.current);
        }

        // Cleanup the observer when the component unmounts or the ref changes
        return () => {
            if (PrevMessageRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(PrevMessageRef.current);
            }
        };
    }, [PrevMessageRef]);

    // useEffect(()=>{
    //     FetchSingleChat({channelId:channelId,page:msgPage,limit:msgLimit,})
    // },[msgPage])
    const fetchMessages = async () => {
        try {
            const res: any = await FetchSingleChat({ channelId: channelId, page: msgPage })
            // console.log('new response', res);
            if (res?.length === 0) {
                endedMessage.current = true;
            }
            loadingMessages.current = false;
        } catch (err) {
            console.log('err', err);
            loadingMessages.current = false;
        }
    }
    useEffect(() => {
        if (msgPage > 1) {
            fetchMessages();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [msgPage])
    // console.log('messages', messages)
    // console.group('Chat', SingleChat)
    const DeleteFnc = (obj: any) => {
        if (obj > -1 && obj < messages.length) {
            const updatedMessages = [
                ...messages.slice(0, obj),
                ...messages.slice(obj + 1, messages.length),
               ]
             useSocketStore.setState({ messages: updatedMessages })
          }
          return null
    }
    // console.log('param',params.get('id'))
    return (
        <LoderComp page ='SingleChat'>
            <div className="px-6 py-[14px] border-b border-[rgba(183, 183, 183, 0.7)] flex justify-between font-bold text-[20px] media">
                <div className="flex items-center text-center gap-5">
                    <div className="block md:hidden " onClick={() => handleCloseDrawer()}>
                        <Image src='/svg/icon/leftarow.svg' alt='svg' width={20} height={20} />
                    </div>
                    <Avatar
                        src={process.env.NEXT_PUBLIC_IMAGE_URL + clickedchat?.receiverData[0]?.profile}
                        sx={{ width: '50px', height: '50px' }}
                    />
                    <div>
                       <div className="flex items-center gap-2">
                       <p className="font-semibold text-[17px] leading-[22px]">{clickedchat?.receiverData[0]?.fname || 'postier'} {clickedchat?.receiverData[0]?.lname || ''}</p> 
                        -
                       <p className="font-semibold text-[17px] text-[#5a5a5a] leading-[22px]">{UserID === clickedchat?.postInfo[0]?.userId ? clickedchat?.tripInfo[0]?.title : clickedchat?.postInfo[0]?.title}</p>
                       </div>
                        {
                            typing ?
                                <p className="text-[14px] text-start font-normal text-[#004080]">{i18?.NEW?.TYPING || "Typing"}...</p>
                                :
                                onlineStatus && <p className="text-[14px] text-start font-normal text-[#0EAC50]">{i18?.NEW?.ONLINE || "online"}</p>

                        }

                    </div>
                </div>
                <DropDown
                 img="/svg/icon/threedot.svg"
                 data={[{ text: 'Delete', fnc: () => ChannelDeleteFnc(channelId)}]}
                 className=""
                 width="100px"
                />
            </div>
            <div className="msg-sec2" ref={scrollRef}>
                <div ref={PrevMessageRef} />
                {
                    messages.length > 0 ?
                    
                        Array.isArray(messages) && messages.map((item: any, index: any) => {
                            const messageInfo = item?.messageInfo || {};
                            return (
                                <Fragment key={item?._id}>
    
                                    {
                                        item?.senderId !== userId ?
    
                                            (item?.deletedAt === null ?
                                                messageInfo?.type === 'text' ?
                                                    <div className="m-[20px] flex justify-start" ref={index === messages.length - 1 ? lastMessageRef : null}>
                                                        <div
                                                            className="bg-[#FAFAFB] border-[1px] border-[rgba(183, 183, 183, 0.7)] rounded-[11px] py-3 px-6 max-w-[380px] flex justify-between gap-4 items-center"
                                                        // ref={index === messages.length - 1 ? lastMessageRef : null}
                                                        >
                                                            {messageInfo?.content || "Deleted"}
                                                            <p className="font-[rgba(183, 183, 183, 0.7)] text-[10px] ">{TimeFormat(item?.createdAt, 'msg')}</p>
                                                        </div>
    
                                                    </div>
                                                    :
                                                    <div className="w-[30%] h-[60%] bg-[#FAFAFB] p-1 rounded-[7px] boxShadow-shadowbox">
                                                        {item?.type === 'file' &&
                                                            <>
                                                                <Image src={item.content} alt="msg" width={20} height={20} className="w-full h-full" />
                                                                {/* <DoubleTick fill='#fff'/> */}
                                                            </>
                                                        }
    
                                                    </div>
                                                     
                                                :
                                                // <div className="m-[20px] flex justify-start" >
                                                //     <div className="flex gap-2 items-center bg-[#FAFAFB] border border-[rgba(183, 183, 183, 0.7)] rounded-[11px] py-3 px-6 max-w-[380px]">
                                                //         <Image src='/svg/icon/message-deleted-blue.svg' alt='img' width={20} height={20} className="w-[20px] h-[20px]" />
                                                //         <em>This message was deleted</em>
                                                //     </div>
                                                // </div>
                                                DeleteFnc(index)
                                            )
    
                                            :
                                            (<div
                                                className="m-[20px] flex justify-end relative "
                                            // onMouseEnter={() => setIsHovered(item._id)}
                                            // onMouseLeave={() => setIsHovered('')}
                                            >
    
                                                {
                                                    item.deletedAt === null ? (
                                                        messageInfo?.type === 'text' ? (
                                                            <div className="bg-btncolor border border-btncolor text-[#fff] rounded-[11px] p-3 max-w-[380px] group flex justify-between gap-4" ref={index === messages.length - 1 ? lastMessageRef : null}>
                                                                {messageInfo?.content || 'Deleted'}
                                                                <div className="absolute top-0 right-0 cursor-pointer z-[999] group-hover:block hidden p-2 rounded-[11px] bg-btncolor w-[40px] h-[40px]">
                                                                    <DropDown
                                                                        img="/svg/icon/whitedownarrow.svg"
                                                                        data={[{ text: 'Delete', fnc: () => DeleteFun(messageInfo._id) }]}
                                                                        className="flex justify-end w-[20px] h-[20px]"
                                                                        width="100px"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <p className="font-[rgba(183, 183, 183, 0.7)] text-[10px]">{TimeFormat(item?.createdAt, 'msg')}</p>
                                                                    <DoubleTick fill={messageInfo?.seen ? '#3ABEF9' : '#fff'} />
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="w-[60%] h-[90%] md:w-[30%] md:h-[60%] bg-btncolor p-1 rounded-[7px] boxShadow-shadowbox">
                                                                {messageInfo?.type === 'file' && (
                                                                    <div className="relative group">
                                                                        <Image
                                                                            src={item.content}
                                                                            alt="msg"
                                                                            className="w-full h-full bg-[#fff] rounded-[7px]"
                                                                            width={500}
                                                                            height={500}
                                                                        />
                                                                        <div className="absolute top-0 right-0 group-hover:block hidden p-2 imageShadow w-[50%] h-[40px] overflow-hidden">
                                                                            <DropDown
                                                                                img="/svg/icon/whitedownarrow.svg"
                                                                                data={[{ text: 'Delete', fnc: () => DeleteFun(messageInfo._id) }]}
                                                                                className="flex justify-end w-[10px] h-[10px]"
                                                                                width="100px"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    ) : (
                                                          // <div className="bg-btncolor flex gap-2 items-center border border-btncolor text-[#fff] rounded-[11px] py-3 px-6  max-w-[380px]">
                                                        //     <Image src='/svg/icon/message-deleted.svg' alt='img' className="w-[20px] h-[20px] " width={20} height={20} />
                                                        //     <em>This message was deleted</em>
                                                        // </div>
                                                        DeleteFnc(index)
                                                    )
                                                }
    
                                            </div>)
                                    }
                                  
                                </Fragment>
    
                            )
                        })
                    
                    :
                    <EmptyPage image='/svg/icon/nomsg.svg' text={i18?.NEW?.NO_CHAT_HISTORY_FOUND || 'No Chat History Found!'}/>
                }
               

            </div>

            <div className={` ${CON64File ? 'h-[90%] flex items-center' : ''} border-y border-[rgba(183, 183, 183, 0.7)] p-3 w-[100%]  absolute bottom-0  justify-between bg-[#fff] z-[99]`}>
                {/* <div className="flex gap-3 items-center w-full">
                    <DropDown
                        img='/svg/icon/adddoc.svg'
                        data={['Send a file', 'Open Camera']}
                        className='flex justify-center items-center border'
                    />
                    <form onSubmit={handleSubmit(handleMessage)}>
                        <div className="flex">
                        <Controller
                            name="message"
                            control={control}
                            defaultValue=""
                            rules={{ required: "This field is required", maxLength: { value: 100, message: "Max length is 100 characters" } }}
                            render={({ field }: any) => (
                                <Input
                                    {...field}
                                    className="w-[100%] outline-none"
                                    placeholder="type...."
                                />
                            )}
                        />
                         <div className="" onClick={handleMessage}>
                            <img src='/svg/icon/send.svg' alt='svg' />
                        </div>
                        </div>
                    </form>
                   
                </div> */}
                <div className="flex w-full">
                    {
                        !CON64File &&
                        <>

                            <div className="flex justify-center items-center">
                                <DropDown
                                    img='/svg/icon/adddoc.svg'
                                    data={[{
                                        text: 'Send a file',
                                        fnc: () => SetImgContainer(true),
                                    },
                                        // {
                                        //     text: 'Open Camera',
                                        //     fnc: ''
                                        // }
                                    ]}
                                    className='flex justify-center items-center mr-[10px]'
                                />
                            </div>
                        </>
                    }
                    {
                        CON64File ?
                            <div className="flex flex-col w-full">
                                <div className="flex items-center justify-start mb-[30px]" onClick={() => setCON64File(null)}>
                                    <Image src='/svg/icon/close.svg' alt="" width={20} height={20} />
                                </div>
                                <div className="flex  flex-col justify-center items-center">
                                    <div className="w-[40%] h-[50%] flex ">
                                        <Image src={CON64File ? CON64File : ''} alt="img" className="shadow-lg" width={20} height={20} />
                                    </div>
                                    <div className="flex justify-end w-full mt-[40px] ">
                                        <Button onClick={handleMessage} className="w-[50px] h-[50px] rounded-full shadow-lg bg-btncolor flex items-center justify-center">
                                            <Image src='/svg/icon/sendimh.svg' alt="img" className="w-[30px] h-[30px]" width={20} height={20} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="flex-auto">
                                <form onSubmit={handleSubmit(handleMessage)}>
                                    <div className="flex w-full">
                                        <Controller
                                            name="message"
                                            control={control}
                                            defaultValue=""
                                            rules={{ required: "This field is required", maxLength: { value: 100, message: "Max length is 100 characters" } }}
                                            render={({ field }: any) => (
                                                <>
                                                    <input
                                                        {...field}
                                                        className="w-[100%] outline-none"
                                                        placeholder="type...."
                                                        onChange={(e: any) => {
                                                            field.onChange(e);
                                                            setMessage(e.target.value)
                                                        }}
                                                    />
                                                </>

                                            )}
                                        />
                                        <button type="submit">
                                            <Image width={20} height={20} src='/svg/icon/send.svg' alt='svg' />
                                        </button>
                                    </div>
                                </form>
                            </div>

                    }

                </div>

            </div>
        </LoderComp>
    )
}