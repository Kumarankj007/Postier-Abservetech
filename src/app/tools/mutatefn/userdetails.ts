import { API } from "../apitools";

export const UserUpdate = async (data: any) => {
    const User_id = (typeof window !== "undefined" && window.localStorage.getItem('appUserId') !== '') ? window.localStorage.getItem('appUserId') : null
    try {
        if (User_id !== null && User_id !== undefined && User_id !== '') {
          // console.log(data, 'data')
        const res = await API.PUT(`common/user/${User_id}`, data);
        const val = await res;
        return val
        }
      }
      catch (err) {
        throw err
      }
};

export const DeteleUser = async (data: any) => {
  const User_id = (typeof window !== "undefined" && window.localStorage.getItem('appUserId') !== '') ? window.localStorage.getItem('appUserId') : null
  try {
      if (User_id !== null && User_id !== undefined && User_id !== '') {
      const res = await API.DELETE(`common/user/${User_id}`, data);
      const val = await res;
      return val
      }
    }
    catch (err) {
      throw err
    }
};

export const verifyFn = async(data:any) => {
    try {
        const res = await API.POST('common/user/verification',data)
        const val = await res;
        return val
      }
      catch (err) {
        throw err
      }
}

export const UserVerifyAdress = async (data: any) => {

    const User_id = (typeof window !== "undefined" && window.localStorage.getItem('appUserId') !== '' )? window.localStorage.getItem('appUserId') : null
    try {
        if (User_id !== null && User_id !== undefined && User_id !== '') {
        const res = await API.POST(`common/document/user/${User_id}`, data);
        const val = await res;
        return val
        }
      }
      catch (err) {
        throw err
      }
};

export const DeleteFavAddress = async (data : any) => {
  try {
    const response = await API.DELETE('common/favouriteLocation', { favLocationId: data });
    const val = await response;
    return val
    }
  catch (err) {
    throw err
  }
}

export const SetPassword = async (data : any) => {
  try {
    const response = await API.POST('common/user/setPassword', data );
    const val = await response;
    return val
    }
  catch (err) {
    throw err
  }
}
export const ChangePassword = async (data : any) => {
  try {
    const response = await API.POST('common/user/changePassword', data );
    const val = await response;
    return val
    }
  catch (err) {
    throw err
  }
}