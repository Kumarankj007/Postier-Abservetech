import { API } from "../apitools";

export const AddCard = async (data: any) => {
    try {
       const res = await API.POST(`module/payment/methods/stripe/card`, data);
      const val = await res;
      return val;
    } catch (err) {
      throw err;
    }
  };
  export const DeleteCard = async (data: any) => {
    try {
       const res = await API.DELETE(`module/payment/methods/stripe/card`, data);
      const val = await res;
      return val;
    } catch (err) {
      throw err;
    }
  };
  export const MakePayment = async (data: any) => {
    try {
       const res = await API.POST(`common/makePayment`, data);
      const val = await res;
      return val;
    } catch (err) {
      throw err;
    }
  };
