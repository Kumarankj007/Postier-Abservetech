import ChatData from "@/app/store/chat";
import { API } from "../apitools";
import { DeletedMsg } from "@/utils";


  export const CreateChannel = async (data: any) => {
    try {
        const response = await API.POST('module/chat/channel',{...data});
        if (response.type !== 'success') {
          throw new Error('Failed to delete channel');
        }
        const val = await response; 
        return val;
      } catch (error) {
        console.error('Failed to fetch parcel location', error);
        throw error; 
      }
  };

  export const DeleteChannel = async (channelId: any) => {
    try {
      const response = await API.DELETE(`module/chat/channel/${channelId}`);
      if(response.type === 'success'){
        DeletedMsg(channelId,'channel')
      }
      const data = await response; 
      return data;
    } catch (error) {
      console.error('Failed to delete channel', error);
      throw error; 
    }
  };
  