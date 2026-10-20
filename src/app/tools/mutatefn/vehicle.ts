import { API } from "../apitools";

export const AddVehicleAPI = async (data: any) => {
    try{
        const res = await API.POST("creteria/vehicle", { ...data });
        const val = await res;
        return val
    }
    catch(err){
        throw err
    }
};

export const DeleteVehicleAPI = async (vehicleId: any) => {
    try{
        const res = await API.DELETE(`creteria/vehicle/${vehicleId}`);
        const val = await res;
        return val
    }
    catch(err){
        throw err
    }
};
export const UpdateVehicleAPI = async (values:any) => {
    try{
        const res = await API.PUT(`creteria/vehicle/${values?.Vehicle_id}`, { ...values?.value });
        const val = await res;
        return val
    }
    catch(err){
        throw err
    }
};
export const AddVehicleImgAPI = async (data: any) => {
    const User_id = (typeof window !== "undefined" && window.localStorage.getItem('appUserId') !== '') ? window.localStorage.getItem('appUserId') : null
    try{
        const res = await API.POST(`common/document/vehicle/${User_id}/${data?.Vehicle_id}`,  data?.formData );
        const val = await res;
        return val
    }
    catch(err){
        throw err
    }
};
