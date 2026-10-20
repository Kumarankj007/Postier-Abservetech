import { API } from "../apitools";


export const LoginData = async (data: any) => {
    try{
        const res = await API.POST("common/login/user", { ...data });
        const val = await res;
        return val
    }
    catch(err){
        throw err
    }
};


export const RegisterData = async (data: any) => {
    try{
        const res = await API.POST("common/user", { ...data, type: "user" });
        const val = await res;
        return val
    }
    catch(err){
        throw err
    }
};


export const UserExist = async (data: any) => {
    try{
        const res = await API.GET("common/user/exists", { ...data });
        const val = await res;
        return val
    }
    catch(err){
        throw err
    }
};

export const FaceBookLogin = async (data: any) => {
    try{
        const res = await API.PUT("common/login/facebook", { accessToken: data });
        const val = await res;
        return val
    }
    catch(err){
        throw err
    }
};

export async function Logout() {
    try{
        const res = await API.PATCH("common/logout");
        const val = await res;
        return val
    }
    catch(err){
        throw err
    }
}

export async function ChangePassword(data: any) {
    const id = window.localStorage.getItem('appUserId')
    try{
        if(data?.verifyFrom === 'FORGETPASSWORD'){
            const res = await API.POST("common/user/resetPassword", { ...data });
        const val = await res;
        return val
        }else{
            const res = await API.POST("common/user/changePassword", { ...data, verifyFrom: 'CHANGEPASSWORD', _id: id });
        const val = await res;
        return val
        }
    }
    catch(err){
        throw err
    }
}

export const SendOtpApi = async (data: any) => {
    try{
        const res = await API.POST("common/sendOtp", {...data });
        const val = await res;
        return val
    }
    catch(err){
        throw err
    }
};