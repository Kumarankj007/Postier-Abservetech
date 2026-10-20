
  // store/store.ts
  import { PaymentsMethods } from '@/interface';
  import { create } from 'zustand';
  import { API } from '../tools/apitools';
  
  
  const GetPaymentMethods = create<PaymentsMethods>((set) => ({
  
    PaymentsMethods : null,
    FetchPaymentsMethods : async () => {
      try{
            const res = await API.GET('module/payment/methods');
            const val = await res?.data
            set({PaymentsMethods:val})
      }
      catch(error){
          console.error('Failed to fetch parcel location', error);
      }
      }
  }));
  
  export default GetPaymentMethods
  