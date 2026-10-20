import { Post } from "./../../../../public/svg/svgcomponent";
import { API } from "../apitools";
import Store from "@/app/store/store";

export const PostParcel = async ({ formData, PostId }: any) => {
  try {
    let res;
    if (PostId !== null) {
      res = await API.POST(`common/createPost/${PostId}`, formData);
    } else {
      res = await API.POST("common/createPost", formData);
    }
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};

export const UdateParcelDetails = async ({ formData, PostId }: any) => {
  try {
    const res = await API.PUT(`common/updatePost/${PostId}`, formData);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};

export const PublishParcel: any = async ( PostId : any) => {
  try {
    const res = await API.PUT(`common/publishPost/${PostId}`);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};

export const PublishTrip: any = async ( TripId : any) => {
  
  try {
    const res = await API.PUT(`common/publishTrip/${TripId}`);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};
export const PostParcelPostier = async (Data: any) => {
  try {
    const res = await API.POST("common/trip", Data);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};

export const CreateParcel = async (Data: any) => {
  try {
    const res = await API.POST("common/post", Data);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};
export const UpdateParcel = async (Data: any) => {
  try {
    
    const res = await API.PUT(`common/post/${Data?.Parcel_id}`, Data.formData);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};
export const CreateTrip = async (Data: any) => {
  try {
    const res = await API.POST("common/trip", Data);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};
export const UpdateTrip = async (Data: any) => {
  try {
    const res = await API.PUT(`common/trip/${Data?.Trip_id}`, Data.values);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};
export const DeletePost = async (PostId: any) => {
  try {
    const res = await API.DELETE(`common/post/${PostId}`);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};

export const DeleteTrip = async (TripId: any) => {
  try {
    const res = await API.DELETE(`common/trip/${TripId}`);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};
export const Suggestions = async (Data: any) => {
  try {
    const res = await API.POST("common/suggestion", Data);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};
export const Participants = async (Data: any) => {
  
  try {
    const res = await API.PUT(`common/participants/${Data?.Parcel_id}`, Data.value);
    const val = await res;
    return val;
  } catch (err) {
    throw err;
  }
};




