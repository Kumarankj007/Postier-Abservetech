
// store/store.ts
import { FetchLocation, FetchParcelLocation } from '@/interface';
import { create } from 'zustand';
import { API } from '../tools/apitools';
import Store from './store';
import useLoaderStore from '../hooks/loader';



const Utils = create<any>((set:any) => ({

Deliverparcelby:[],
 FetchDeliverparcelby: async()=>{
  const { setLoading } = useLoaderStore.getState();
  setLoading(true)
    try {
      const response = await API.GET('common/deliverParcelType');
      const res = await response.data.deliverParcelType;
      set({ Deliverparcelby: res });
    } catch (error) {
      console.error('Failed to fetch parcel location', error);
    } finally {
      setLoading(false); // End loading
    }
 },

 parcelType:[],
 FetchparcelType: async()=>{
  const { setLoading } = useLoaderStore.getState();
  setLoading(true)
    try {
      const response = await API.GET('common/parcelType');
      const res = await response.data.parcelType;
      set({ parcelType: res });
    } catch (error) {
      console.error('Failed to fetch parcel location', error);
    } finally {
      setLoading(false); // End loading
    }
 },

 Estimation:{},
 FetchEstimation: async (data: any) => {
   const { setLoading } = useLoaderStore.getState();
   setLoading(true)
   try {
     const response = await API.POST('common/post/estimation', data);
     const res = await response.data;
     set({ Estimation: res });
    //  console.log("Estimation11", res);
      // localStorage.setItem('estimation', JSON.stringify(res));
     return res; // Return the response to the caller
     
   } catch (error) {
     console.error('Failed to fetch parcel location', error);
     return null;
   } finally {
     setLoading(false); // End loading
   }
 },

 EstimationTrip:{},
 FetchEstimationTrip:async(data:any)=>{
  const { setLoading } = useLoaderStore.getState();
  setLoading(true)
    try {
      
      const response = await API.POST('common/trip/estimation',data);
      const res = await response.data;
      set({ EstimationTrip: res });
      return res;
    } catch (error) {
      console.error('Failed to fetch parcel location', error);
    } finally {
      setLoading(false); // End loading
    }
 }
}));

export default Utils;
