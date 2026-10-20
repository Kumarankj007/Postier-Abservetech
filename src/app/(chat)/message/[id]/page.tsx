"use client";
import ChatData from "@/app/store/chat";
import Image from "next/image";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import React, {
  useContext,
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import useSocketStore from "@/app/hooks/socket";
import EmptyPage from "@/app/component/emptydatapage";
import DropDown from "@/app/component/dropdown";

import { TimeFormat } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { DeleteChannel } from "@/app/tools/mutatefn/chat";
import useSnackbarStore from "@/app/store/toaster";
import Button from "@/app/component/button";
import Store from "@/app/store/store";
import { RequestForUpdate } from "@/app/tools/mutatefn/request";
import RoleStore from "@/app/store/RoleStore";
import PageContext from "@/app/providers/pagecontext";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import { DoubleTick } from "../../../../../public/svg/svgcomponent";

function Singlemessage() {
  const { i18 } = useContext(PageContext);
  const Router = UseLoadingRouter();
  const { connect, disconnect } = useSocketStore();
  const lastMessageRef: any = useRef(null);
  const loadingMessages: any = useRef(false);
  const PrevMessageRef: any = useRef(null);
  const endedMessage: any = useRef(false);
  const scrollRef: any = useRef();
  const param = useParams();
  const Params = useSearchParams()
  const RedirectUrl = Params.get('redirectUrl')
  const pathname = usePathname();
  const SocketUrl: string | any =
    process.env.NEXT_PUBLIC_BASE_URL + "/chatRequest";
  const token =
    typeof window !== "undefined" &&
    window.localStorage.getItem("appToken") !== null
      ? window.localStorage.getItem("appToken")
      : "";
  const { setModal } = Store();
  const { RoleSwitch } = RoleStore();
  const {
    sendMessage,
    messages,
    socket,
    lastBidding,
    setlastBidding,
    setChat,
    Accepted,
    Declined,
  } = useSocketStore();
  const UserID =
    typeof window !== undefined && localStorage.getItem("appUserId");
  const channelId: any = param?.id;
  const { FetchChat, clickedchat, DeleteChat, FetchSingleChat, Chat } =
    ChatData();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  const [messageTy, setMessage] = useState("");
  const [msgPage, setMsgPage] = useState(1);
  const [chatId, setChatId] = useState("");

  // const pickup = MyParcelsDetails?.parcel?.pickupDate && FormatDateTime(MyParcelsDetails?.parcel?.pickupDate);
  // const drop = MyParcelsDetails?.parcel?.deliveryDate && FormatDateTime(MyParcelsDetails?.parcel?.deliveryDate);
  const handleback = () => {
    if (RedirectUrl) {
        let redirectParams:any = {};
        if (RedirectUrl) {
            const urlParams:any = new URLSearchParams(RedirectUrl.split("?")[1]);
            for (const [key, value] of urlParams.entries()) {
                redirectParams[key] = value;
            }
        }
        Router.push(RedirectUrl)
        // setStep(9)
    }else{
      Router.push("/message");
    }
  };
  const handleMessage = (data: any) => {
    const value: any = {};
    if (data.message) {
      value.content = data.message;
      value.type = "text";
    }
    // if (CON64File) {
    //     value.content = CON64File
    //     value.type = 'file'
    // }
    if (UserID) {
      value.senderId = UserID;
    }
    if (channelId) {
      value.channelId = channelId;
    }
    sendMessage(value);
    setMessage("");
    reset();
    // if (CON64File) {
    //     setCON64File(null)
    // }
  };
  const DeleteFun = (id: any) => {
    DeleteChat(id, channelId);
  };
  const DeleteChannelFun = useMutation({
    mutationFn: DeleteChannel,
    onSuccess: () => {},
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  const ChannelDeleteFnc = (ChannelId: any) => {
    DeleteChannelFun.mutateAsync(ChannelId);
  };

  const DeleteFnc = (obj: any) => {
    if (obj > -1 && obj < messages.length) {
      const updatedMessages = [
        ...messages.slice(0, obj),
        ...messages.slice(obj + 1, messages.length),
      ];
      useSocketStore.setState({ messages: updatedMessages });
    }
    return null;
  };
  const fetchMessages = async () => {
    if (channelId)
      try {
        const res: any = await FetchSingleChat({
          channelId: channelId,
          page: 1,
        });
        // console.log("new response", res);
        if (res?.length === 0) {
          endedMessage.current = true;
        }
        loadingMessages.current = false;
      } catch (err) {
        console.log("err", err);
        loadingMessages.current = false;
      }
  };
  useEffect(() => {
    // if (msgPage > 1) {
    //     fetchMessages();
    // }
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msgPage]);
  useEffect(() => {
    if (channelId !== null && channelId !== undefined) {
      FetchChat({ channelId: channelId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!endedMessage.current) {
          loadingMessages.current = true;
          setMsgPage((prev) => prev + 1);
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
  const REQ = useMutation({
    mutationFn: RequestForUpdate,
    onSuccess: (data: any) => {
      setlastBidding("");
      showSnackbar(data.message, "success");
      if (
        data?.data?.status === "Accepted" ||
        data?.data?.data?.status === "Accepted"
      ) {
        Router.push("/myrequest");
      }
      if (chatId) {
        const findIndex = messages.findIndex(
          (val: any) => val?.messageInfo?._id === chatId
        );
        if (findIndex !== -1) {
          const newMsgArr = messages.map((msg: any, index: any) =>
            index === findIndex
              ? {
                  ...msg,
                  messageInfo: {
                    ...msg.messageInfo,
                    status: data?.data?.status || data?.data?.data?.status,
                  },
                }
              : msg
          );
          setChat(newMsgArr);
        }
      }
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });

  const handleRequest = (status: any, id: any) => {
    setChatId(id);
    REQ.mutateAsync({
      Parcel_id: clickedchat?.postId,
      Trip_id: clickedchat?.tripId,
      data: { status: status },
    });
  };
  // console.log("messages", messages);
  useEffect(() => {
    if (token) {
      connect(SocketUrl, token);
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connect, disconnect, token]);

  return (
    <div className="flex justify-center h-full">
      <div className=" w-full md:w-[680px] px-[20px]">
        <div className="sticky top-0">
          <div className=" p-5 border-b flex justify-between items-center bg-[#fff]">
            <div className="flex justify-between items-center gap-6">
              <Image
                src="/svg/icon/arrow-left.svg"
                width={800}
                height={800}
                alt="img"
                className="w-[20px] h-[20px] cursor-pointer"
                onClick={handleback}
              />
              <Image
                width={800}
                height={800}
                src={
                  process.env.NEXT_PUBLIC_IMAGE_URL +
                  clickedchat?.receiverData[0]?.profile
                }
                alt="img"
                className="w-[70px] h-[70px] rounded-full"
              />
              <div className="flex flex-col gap-4">
                <p className="text-[17px] font-[700] leading-[22px]">
                  {clickedchat?.receiverData[0]?.fname &&
                    clickedchat?.receiverData[0]?.fname}{" "}
                  {clickedchat?.receiverData[0]?.lname &&
                    clickedchat?.receiverData[0]?.lname}
                </p>
                <div className="flex items-center gap-2">
                  <Image
                    width={800}
                    height={800}
                    src="/svg/icon/star.svg"
                    alt="img"
                    className="w-[20px] h-[20px] rounded-full"
                  />
                  <p className="text-[17px] font-[400] leading-[22px]">
                    {clickedchat?.receiverData[0]?.ratings?.totalValue}{" "}
                    {i18?.NEW?.OUT_OF_5_STARS || "Out of 5 Stars"}
                  </p>
                </div>
              </div>
            </div>
            {/* <div>
                            <Image
                                width={800}
                                height={800}
                                src='/svg/icon/Group 1000005275.svg'
                                alt="img"
                                className="w-[20px] h-[20px] rounded-full"
                            />
                        </div> */}
          </div>

          <div
            onClick={() =>
              setModal(
                "Mapmodal",
                RoleSwitch === "user"
                  ? [
                      {
                        lng: clickedchat?.tripInfo[0]?.location?.startCoords
                          ?.coordinates[0],
                        lat: clickedchat?.tripInfo[0]?.location?.startCoords
                          ?.coordinates[1],
                      },

                      {
                        lng: clickedchat?.tripInfo[0]?.location?.endCoords
                          ?.coordinates[0],
                        lat: clickedchat?.tripInfo[0]?.location?.endCoords
                          ?.coordinates[1],
                      },
                    ]
                  : [
                      {
                        lng: clickedchat?.postInfo[0]?.location?.startCoords
                          ?.coordinates[0],
                        lat: clickedchat?.postInfo[0]?.location?.startCoords
                          ?.coordinates[1],
                      },

                      {
                        lng: clickedchat?.postInfo[0]?.location?.endCoords
                          ?.coordinates[0],
                        lat: clickedchat?.postInfo[0]?.location?.endCoords
                          ?.coordinates[1],
                      },
                    ]
              )
            }
            className="p-5 border-b flex justify-between items-center bg-[#fff] cursor-pointer"
          >
            <div className="flex gap-4 items-center">
              <div className="flex gap-2 items-center">
                <p className="text-[17px]  font-[700] leading-[44px]  truncate">
                  {RoleSwitch === "user"
                    ? clickedchat?.tripInfo[0]?.location?.pickUpCity ||
                      "Default Pickup Location"
                    : clickedchat?.postInfo[0]?.location?.pickUpCity ||
                      "Default Pickup Location"}
                </p>
              </div>

              <Image
                width={800}
                height={800}
                src="/svg/icon/Arrow back.svg"
                alt="img"
                className="w-[20px] h-[20px]"
              />

              <div className="flex gap-2 items-center">
                <p className="text-[17px] font-[700] leading-[44px]  truncate">
                  {RoleSwitch === "user"
                    ? clickedchat?.tripInfo[0]?.location?.dropCity ||
                      "Default Drop-off Location"
                    : clickedchat?.postInfo[0]?.location?.dropCity ||
                      "Default Drop-off Location"}
                </p>
              </div>
            </div>

            <Image
              width={800}
              height={800}
              src="/svg/icon/chevron-right.svg"
              alt="img"
              className="w-[20px] h-[20px] rounded-full"
            />
          </div>
        </div>
        <div
          className="h-screen overflow-auto scrollbar-hide msg"
          ref={scrollRef}
        >
          <div ref={PrevMessageRef} />
          {messages.length > 0 ? (
            Array.isArray(messages) &&
            messages.map((item: any, index: any) => {
              const messageInfo = item?.messageInfo || {};
              return (
                <Fragment key={item?._id}>
                  {item?.senderId !== UserID ? (
                    item?.deletedAt === null ? (
                      !messageInfo?.status ? (
                        <div
                          className="m-[20px] flex justify-start"
                          ref={
                            index === messages.length - 1
                              ? lastMessageRef
                              : null
                          }
                        >
                          <div
                            className="bg-[#EFEFEF] border-[1px] border-[#EFEFEF] rounded-tl-[21px] rounded-tr-[21px] rounded-br-[21px] py-3 px-6 max-w-[380px] flex flex-col "
                            // ref={index === messages.length - 1 ? lastMessageRef : null}
                          >
                            <p className="flex justify-start">
                              {" "}
                              {messageInfo?.content || "Deleted"}
                            </p>
                            <p className="font-[rgba(183, 183, 183, 0.7)] text-[10px] flex justify-end ">
                              {TimeFormat(item?.createdAt, "msg")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="m-[20px] flex justify-start">
                          {(messageInfo?.status === "Bidded" ||
                            messageInfo?.status === "Accepted" ||
                            messageInfo?.status === "Declined") && (
                            <div
                              className={`flex flex-col bg-[#EFEFEF] border-[#EFEFEF] border-[1px]  rounded-[21px]  p-5 max-w-[380px] justify-between gap-4 items-center`}
                            >
                              <div className="flex gap-2 items-center justify-center">
                                <p className="text-[15px] font-[700] leading-[22px] text-[#222]">
                                  {" "}
                                  {messageInfo?.status === "Bidded"
                                    ? "Custom Price Offer"
                                    : messageInfo?.status}
                                </p>
                                {messageInfo?.status === "Accepted" && (
                                  <Image
                                    alt="img"
                                    src="/svg/icon/verified.svg"
                                    width={800}
                                    height={800}
                                    className="w-[20px] h-[20px]"
                                  />
                                )}
                                {messageInfo?.status === "Declined" && (
                                  <Image
                                    alt="img"
                                    src="/svg/icon/decline.svg"
                                    width={800}
                                    height={800}
                                    className="w-[20px] h-[20px]"
                                  />
                                )}
                              </div>
                              <p className="text-[30px] font-[700] leading-[22px] text-[#222]">
                                € {messageInfo?.content || "Deleted"}
                              </p>
                              {/* <p className='text-[15px] font-[700] leading-[22px] text-[#222]'>{messageInfo?.status === 'Bidded' ? "Custom Price Offer" : messageInfo?.status}</p>
                                                                    <p className='text-[30px] font-[700] leading-[22px] text-[#222]'>$ {messageInfo?.content || 'Deleted'}</p> */}
                              {lastBidding === messageInfo._id &&
                                messageInfo?.status !== "Accepted" && (
                                  <div className="flex gap-4">
                                    <Button
                                      className="p-3 border border-1 border-btncolor text-btncolor rounded-full"
                                      onClick={() =>
                                        handleRequest(
                                          "Accepted",
                                          messageInfo._id
                                        )
                                      }
                                    >
                                      {i18?.NEW?.ACCEPT || "Accept"}
                                    </Button>
                                    <Button
                                      className="p-3 border border-1 border-btncolor text-btncolor rounded-full"
                                      onClick={() =>
                                        handleRequest(
                                          "Declined",
                                          messageInfo._id
                                        )
                                      }
                                    >
                                      {i18?.NEW?.DECLINE || "Decline"}
                                    </Button>
                                  </div>
                                )}
                            </div>
                          )}
                        </div>
                      )
                    ) : (
                      // <div className="m-[20px] flex justify-start" >
                      //     <div className="flex gap-2 items-center bg-[#FAFAFB] border border-[rgba(183, 183, 183, 0.7)] rounded-[11px] py-3 px-6 max-w-[380px]">
                      //         <Image src='/svg/icon/message-deleted-blue.svg' alt='img' width={20} height={20} className="w-[20px] h-[20px]" />
                      //         <em>This message was deleted</em>
                      //     </div>
                      // </div>
                      DeleteFnc(index)
                    )
                  ) : (
                    <div
                      className="m-[20px] flex justify-end relative "
                      // onMouseEnter={() => setIsHovered(item._id)}
                      // onMouseLeave={() => setIsHovered('')}
                    >
                      {item.deletedAt === null ? (
                        !messageInfo?.status ? (
                          <div
                            className="bg-btncolor border border-btncolor text-[#fff] rounded-tl-[21px] rounded-tr-[21px] rounded-bl-[21px] px-6 py-3 max-w-[380px] group flex flex-col items-end "
                            ref={
                              index === messages.length - 1
                                ? lastMessageRef
                                : null
                            }
                          >
                            {messageInfo?.content || "Deleted"}
                            {/* <div className="absolute top-0 right-0 cursor-pointer z-[999] group-hover:block hidden p-2 rounded-[11px] bg-btncolor w-[40px] h-[40px]">
                                                                    <DropDown
                                                                        img="/svg/icon/whitedownarrow.svg"
                                                                        data={[{ text: 'Delete', fnc: () => DeleteFun(messageInfo._id) }]}
                                                                        className="flex justify-end w-full w-[20px] h-[20px]"
                                                                        width="100px"
                                                                    />
                                                                </div> */}
                            <div className="flex items-center">
                              <p className="font-[rgba(183, 183, 183, 0.7)] text-[10px]">
                                {TimeFormat(item?.createdAt, "msg")}
                              </p>
                              <DoubleTick
                                fill={messageInfo?.seen ? "#3ABEF9" : "#fff"}
                              />
                            </div>
                          </div>
                        ) : (
                          (messageInfo?.status === "Bidded" ||
                            messageInfo?.status === "Accepted" ||
                            messageInfo?.status === "Declined") && (
                            <div
                              className={` bg-btncolor rounded-[21px] boxShadow-shadowbox  p-5 flex flex-col gap-4 items-center `}
                            >
                              <div className="flex gap-2 items-center justify-center">
                                <p className="text-[15px] font-[700] leading-[22px] text-[#fff]">
                                  {" "}
                                  {messageInfo?.status === "Bidded"
                                    ? "Custom Price Offer"
                                    : messageInfo?.status}
                                </p>
                                {messageInfo?.status === "Accepted" && (
                                  <Image
                                    alt="img"
                                    src="/svg/icon/verified.svg"
                                    width={800}
                                    height={800}
                                    className="w-[20px] h-[20px]"
                                  />
                                )}
                                {messageInfo?.status === "Declined" && (
                                  <Image
                                    alt="img"
                                    src="/svg/icon/decline.svg"
                                    width={800}
                                    height={800}
                                    className="w-[20px] h-[20px]"
                                  />
                                )}
                              </div>
                              <p className="text-[30px] font-[700] leading-[22px] text-[#fff]">
                                € {messageInfo?.content || "Deleted"}
                              </p>
                            </div>
                          )
                        )
                      ) : (
                        // <div className="bg-btncolor flex gap-2 items-center border border-btncolor text-[#fff] rounded-[11px] py-3 px-6  max-w-[380px]">
                        //     <Image src='/svg/icon/message-deleted.svg' alt='img' className="w-[20px] h-[20px] " width={20} height={20} />
                        //     <em>This message was deleted</em>
                        // </div>
                        DeleteFnc(index)
                      )}
                    </div>
                  )}
                </Fragment>
              );
            })
          ) : (
            <EmptyPage
              image="/svg/icon/nomsg.svg"
              text={i18?.NEW?.NO_CHAT_HISTORY_FOUND || "No Chat History Found!"}
            />
          )}
        </div>
        <div className="sticky bottom-0 flex flex-row md:flex-col gap-4 bg-[#fff] p-[10px]">
          {Accepted === "" ? (
            <Button
              className="flex items center p-5 bg-btncolor rounded-full w-full text-[#fff] "
              onClick={() =>
                setModal("CounterOffer", {
                  fare: "",
                  Parcel_id: clickedchat?.postId,
                  Trip_id: clickedchat?.tripId,
                  flow: true,
                })
              }
            >
              <p className="text-center w-full">
                {i18?.NEW?.SEND_CUSTOM_OFFER || "Send Custom Offer"}
              </p>
            </Button>
          ) : Declined === " " ? (
            <Button
              className="flex items center p-5 bg-btncolor rounded-full w-full text-[#fff] "
              onClick={() =>
                setModal("CounterOffer", {
                  fare: "",
                  Parcel_id: clickedchat?.postId,
                  Trip_id: clickedchat?.tripId,
                  flow: true,
                })
              }
            >
              <p className="text-center w-full">
                {i18?.NEW?.SEND_CUSTOM_OFFER || "Send Custom Offer"}
              </p>
            </Button>
          ) : (
            <></>
          )}

          <div className="p-3 border border-1 border-btncolor w-full rounded-[31px] bg-[#fff]">
            <form onSubmit={handleSubmit(handleMessage)}>
              <div className="flex w-full">
                <Controller
                  name="message"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "This field is required",
                    maxLength: {
                      value: 100,
                      message: "Max length is 100 characters",
                    },
                  }}
                  render={({ field }: any) => (
                    <>
                      <input
                        {...field}
                        className="w-[100%] outline-none"
                        aria-label="chat-message"
                        placeholder="type...."
                        onChange={(e: any) => {
                          field.onChange(e);
                          setMessage(e.target.value);
                        }}
                      />
                    </>
                  )}
                />
                <button type="submit">
                  <Image
                    width={800}
                    height={800}
                    src="/svg/icon/sendinchat.svg"
                    alt="svg"
                    className="w-[40px] h-[40px]"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Singlemessage;
