
// store/store.ts
import { FetchParcelLocation, vehicleCategory } from '@/interface';
import { create } from 'zustand';
import { API } from '../tools/apitools';
import Store from './store';
import useLoaderStore from '../hooks/loader';



const VechicleCate = create<vehicleCategory>((set) => ({
 vehicleCate:null,
 FetchVehicleCate: async()=>{
        try {
          const response = await API.GET('common/vehicleCategory');
          const res = await response.data.vehicleCategory;
          set({ vehicleCate: res });
        } catch (error) {
          console.error('Failed to fetch parcel location', error);
        } 
 }

}));

export default VechicleCate;
