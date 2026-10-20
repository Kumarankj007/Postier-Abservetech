
// store/store.ts
import { Chat, FetchParcelLocation, vehicleCategory } from '@/interface';
import { create } from 'zustand';
import { API } from '../tools/apitools';
import Store from './store';
import useLoaderStore from '../hooks/loader';
import { DeletedMsg } from '@/utils';
import SocketStore from '../hooks/socket';



const ChatData = create<Chat>((set) => ({
  loader: false,
  setLoader: (newModal: any) => set({ loader: newModal }),
  singleloader: false,
  setSingleLoader: (newModal: any) => set({ singleloader: newModal }),
  Chat: null,
  clickedchat: null,
  setChat: (data: any) => set({ Chat: data }),
  FetchChat: async (data?: any) => {

    const val: any = {}
    if (data?.page) {
      val.page = data?.page
    }
    if (data?.limit) {
      val.limit = data?.limit
    }
    if (data?.search) {
      val.search = data?.search
    }
    if (data?.channelId) {
      val.channelId = data?.channelId
    }

    try {
      let response;
      if (data?.channelId !== null) {
        set({ loader: false })
        response = await API.GET(`module/chat/channel/${data?.channelId}`);
        const res = await response.data.channels[0];
        set({ clickedchat: res });
      }
      else {
        set({ loader: true })
        response = await API.GET('module/chat/channel', { ...val });
        const res = await response.data.channels;
        set({ Chat: res });
      }

      if (response.type === 'success') {
        set({ loader: false })
      }

    } catch (error) {
      console.error('Failed to fetch parcel location', error);
      set({ loader: false })
    }
  },
  ChatModal: false,
  setChatModal: (newModal: any) => set({ ChatModal: newModal }),

  SingleChat: null,
  FetchSingleChat: async (data: any) => {
    set({ singleloader: true })
    const { setRoom, SeenMessage, setChat, pushChat } = SocketStore.getState()
    try {
        const val:any = {}
        if (data?.page) {
          val.page = data?.page
        }
      val.limit = data?.limit ? data?.limit: 50;
      const response = await API.GET(`module/chat/messages/${data?.channelId}`,{...val}); 
      const res = await response.data.messages;
      if(response.type === 'success'){
        set({ singleloader: false })
        set({ ChatModal: true });
        setRoom(data?.channelId)
        SeenMessage(data?.channelId)
      }
      if(val.page===1) {
        set({ singleloader: false })
        set({ SingleChat: res }); //replace message
        setChat(res) // replace message
      } else {
        set((state) => ({
          SingleChat: {
            ...res,
            ...state.SingleChat
          }
        }))
        pushChat(res) // push message
      }
      return res;
      set({ singleloader: false })
    } catch (error) {
      set({ singleloader: false })
      set({ ChatModal: false });
      console.error('Failed to fetch parcel location', error);
    }
  },
  DeleteChat: async (id: any,channelId:any) => {
    try {
      const response = await API.DELETE(`module/chat/messages/${channelId}?messageIds=${id}`,);
      if (response.type === 'success') {
        DeletedMsg(id,'',channelId)
      }
      return response;
    } catch (error) {
      console.error('Failed to fetch parcel location', error);
    }
  },
 

  ResetMsg: async (id: any) => {
    try {
      const response = await API.PATCH(`common/user/chat/messages?receiverId=${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch parcel location', error);
    }
  },

  onlineId: null,
  setOnlineId: (data: any) => set({ onlineId: data }),

}));

export default ChatData;
