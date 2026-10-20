import { API } from "../apitools";

export const RequestFor = async (data:any) => {
    try {
      const res = await API.POST(`common/request/${data?.Trip_id}/${data?.Parcel_id}`,data?.data);
      const val = await res;
      return val
    }
    catch (err) {
      throw err
    }
  }

  export const RequestForUpdate = async (data:any) => {
    try {
      const res = await API.PUT(`common/request/${data?.Trip_id}/${data?.Parcel_id}`,data?.data);
      const val = await res;
      return val
    }
    catch (err) {
      throw err
    }
  }

  export const Tracking = async (data:any) => {
    try {
      const res = await API.PUT(`common/trackingStatus/${data?.Trip_id}/${data?.Parcel_id}`,data?.data);
      const val = await res;
      return val
    }
    catch (err) {
      throw err
    }
  }