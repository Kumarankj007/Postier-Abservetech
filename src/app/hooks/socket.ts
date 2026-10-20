
// src/store/socketStore.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { SocketState } from '@/interface';
import ChatData from '../store/chat';
import { DeletedMsg } from '@/utils';
import Store from '../store/store';

const SocketStore = create<SocketState>((set) => {
  let socket: Socket;
  const token = typeof window !== "undefined" && window.localStorage.getItem('appToken')
  return {
    socket: null,
    messages: [],
    onlineUser: [],
    lastBidding: '',
    Accepted:'',
    Declined:'',
    setlastBidding: (data: any) => set({ lastBidding: data }),
    onlineStatus: false,
    typing: false,
    lastMessageTime: Date.now(),
    TriggerScrollBottom: () => set({ lastMessageTime: Date.now() }), // replace
    setChat: (messages: any) => set(((state)=>{
      let biddingId = '';
      let AcceptedId = '';
      let DeclinedId = '' ;
      for (let i = messages.length - 1; i >= 0; --i) {
        
        if (messages[i].messageInfo.status === 'Bidded') {
          biddingId = messages[i].messageInfo._id;     
          break;
        }
         if(messages[i].messageInfo.status === 'Accepted'){
          AcceptedId = messages[i].messageInfo._id;  
          break;
        }
        if(messages[i].messageInfo.status === 'Declined'){
          DeclinedId = messages[i].messageInfo._id;  
          break;
        }
      }

      return { messages, lastBidding: biddingId , Accepted:AcceptedId, Declined:DeclinedId };
    })), // replace
    pushChat: (messages: any) => set((state) => {
      // return state;
      return { messages: [...messages, ...state.messages] }
    }),
    setOnlineStatus: (onlineStatus: any) => set({ onlineStatus }),
    connect: (url: string,token:string) => {
      socket = io(url, {
        auth: {
          "x-authorization": token,
        },
        transports: ["websocket"],
        upgrade: false,
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 4,
      });

      socket.on('connect', () => {
        console.log('Socket connected');
        set({ socket });
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        set({ socket: null });
      });
      socket.on('messageSawBroadcast', (data) => {
        const { messages } = SocketStore.getState()
        if (data?.data?.userId) {

          for (let i = 0; i < messages.length; ++i) {
            const item = messages[i];
            if (item?.receiverId === data?.data?.userId && !item.messageInfo.seen) {
              messages[i] = {
                ...messages[i],
                messageInfo: {
                  ...messages[i].messageInfo,
                  seen: true
                }
              };
            }
          }
          set(() => ({ messages: messages }))
        }
      });
      socket.on('messageBroadcast', (data: any) => {

        const { SeenMessage, TriggerScrollBottom } = SocketStore.getState()
        if (data?.data?.messages) {
          SeenMessage(data?.data?.messages[0]?.messageInfo?.channelId)
          TriggerScrollBottom()
        }
        
        set((state) => {
          let biddingId = '';
          let AcceptedId = '';
          let DeclinedId = ''
          const messages = [...state.messages, ...data?.data?.messages];
          for (let i = messages.length - 1; i > 0; --i) {
            if (messages[i].messageInfo.status === 'Bidded') {
              biddingId = messages[i].messageInfo._id;     
              break;
            }
             if(messages[i].messageInfo.status === 'Accepted'){
              AcceptedId = messages[i].messageInfo._id;  
              break;
            }
            if(messages[i].messageInfo.status === 'Declined'){
              DeclinedId = messages[i].messageInfo._id;  
              break;
            }
          }

          return { messages, lastBidding: biddingId ,Accepted:AcceptedId, Declined:DeclinedId}
        });

        // ----------------- TO GET LAST MESSAGE ------------------------------
        const { Chat }: any = ChatData.getState()
        const index: any = Chat?.findIndex((item: any) => item?.receiverData[0]?._id == data?.data?.messages[data?.data?.messages?.length - 1]?.receiverId || localStorage.getItem('appUserId') === data?.data?.messages[data?.data?.messages?.length - 1]?.senderId)
        if (index !== -1) {
          Chat[index] = {
            ...Chat[index],
            messages: [
              {
                ...Chat[index].messages[0],
                message: [
                  {
                    content: data?.data?.messages[data?.data?.messages?.length - 1]?.messageInfo?.content,
                    type: data?.data?.messages[data?.data?.messages?.length - 1]?.messageInfo?.type,
                  }
                ]
              }
            ]
          };
        }

      }),

        // socket.on('participants', (data) => {
        //   const { setChat } = ChatData.getState()
        //   setChat(data)
        // })
        // socket.on('onlineUsers', (data) => {
        //   set({ onlineUser: data })
        // })
        // socket.on('deleteMessage', (data) => {
        //   if (data.status) {
        //     DeletedMsg(data.messageId)
        //   }
        // })
        // socket.on('typing', () => {
        //   set({ typing: true })
        // })
        // socket.on('stopTyping', () => {
        //   set({ typing: false })
        // })
        set({ socket });
    },
    disconnect: () => {
      if (socket) {
        socket.disconnect();
        set({ socket: null });
      }
    },
    sendMessage: (data: any) => {
      if (socket) {
        // {
        //   userId: userId,
        //   userType: role,
        //   channelId: channelId,
        //   type: type,
        //   content: message,
        //   // context: contextid
        // }
        socket.emit('sendMessage', { ...data });
      }
    },

    // Online:(id:any)=>{
    //   if(id){
    //     socket.emit('onlineStatus',id)
    //   };
    // },
    // DeleteMsg: (msgid: any, recvrid: any) => {
    //   if (msgid && recvrid) {
    //     socket.emit('deleteMessage', msgid, recvrid)
    //   };
    // },
    setRoom: (id: any) => {
      console.log('setRoom');
      if (socket) {
        socket.emit('connectChatRequest', { channelId: id });

      }
    },
    // Typing: (recvrid: any) => {
    //   if (recvrid) {
    //     socket.emit('typing', recvrid);
    //   }
    // },
    // ActiveUser: (userId:any,recvrid: any) => {
    //   if (recvrid) {
    //     socket.emit('activeUser', {userId:userId,receiverId:recvrid});
    //   }
    // },
    // InActiveUser: (userId:any,recvrid: any) => {
    //   if (recvrid) {
    //     socket.emit('inactiveUser', {userId:userId,receiverId:recvrid});
    //   }
    // },
    // stopTyping: (recvrid: any) => {
    //   if (recvrid) {
    //     socket.emit('stopTyping', recvrid);
    //   }
    // },
    SeenMessage: (channelId: any) => {
      if (channelId) {
        socket.emit('seenMessage', { channelId: channelId });
      }
    }
    // Participants: () => {
    //   const { setChat } = ChatData.getState()
    //   socket.on('participants',(data)=>{
    //     setChat(data)
    //   })
    // }
  };
});

export default SocketStore;
