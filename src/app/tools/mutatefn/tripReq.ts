import PostDetailsStore from "@/app/store/parcelDetails";
import { API } from "../apitools";

export const UserparcelRequest = async (data: any) => {
  try {
    const value:any = {} 
    if(data?.data?.distance !== null){
      value.distance = data?.data?.distance 
    }
    if(data?.amount){
      value.amount = data?.amount 
    }
    // console.log(value)
    const res = await API.POST(`common/request/${data?.data?.tripId}/${data?.data?.postId}`, { ...value });
    const val = await res;
    return val
  }
  catch (err) {
    throw err
  }
}

export const PostierparcelRequest = async (data: any) => {
  try {
    const res = await API.PUT(`common/request/${data?.data?.tripId}/${data?.data?.postId}`, {
      distance: data?.data?.distance,
      status: data?.data?.status,
      amount: data?.amount
    });
    const val = await res;
    return val
  }
  catch (err) {
    throw err
  }
}

export const Tracking = async (data: any) => {
  try {
    const res = await API.PUT(`common/trackingStatus/${data?.tripId}/${data?.postId}`, { status: data?.val });
    const val = await res;
    return val
  }
  catch (err) {
    throw err
  }
}

export const Review = async (data: any) => {
  try {
    const res = await API.POST(`common/reviews/`, data);
    const val = await res;
    return val
  }
  catch (err) {
    throw err
  }
}

export const FinishTrip = async (data: any) => {
  try {
    const value:any = {};
    if(data?.status){
      value.status = data?.status
    }
    const res = await API.PUT(`common/tripStatus/${data?.tripId}`,value);
    const val = await res;
    return val
  }
  catch (err) {
    throw err
  }
}