import { getCookie } from "@/utils";
import { API } from "../apitools";


export const fetchUser = async ()=> {
  const Token = typeof window !== "undefined" && getCookie("appToken")
    const User_id = (typeof window !== "undefined" && window.localStorage.getItem('appUserId')!=='') ?  window.localStorage.getItem('appUserId') : null
    // console.log(User_id, 'User_id')
    if(User_id !== null && User_id !== undefined && User_id !== '' && Token){
      const response = await API.GET(`common/user/profile/${User_id}`);
      return response.data;
    }
  };


export const fetchPostDetails = async ({queryKey}:any)=> {
  const [, { PostId }] = queryKey;
    if(PostId){
      const response = await API.GET(`common/post/${PostId}`);
      return response?.data?.posts[0];
    }
  };
 

  export const FetchCms = async(queryKey:any) => {
    if(queryKey){
      const response = await API.GET(`common/help/article`,{type : queryKey});
      // console.log(response, 'response')
      return response?.data?.cms;
    }
  }

  export const FetchDynamicCalc = async(queryKey?:any) => {
    if(queryKey){
      const response = await API.POST(`common/dynamicCalculation`,queryKey);
      // console.log(response, 'response')
      return response;
    }
  }

  export const fetchTracking = async ({queryKey}:any)=> {
    // debugger
  const [, { TrackingId }] = queryKey;
  // console.log(TrackingId, 'TrackingId')
    if(TrackingId){
      const response = await API.GET(`common/receiverTracking?trackingId=${TrackingId}`);
      // console.log(response, 'v')
      return response
    }
  };