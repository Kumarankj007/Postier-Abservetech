
// store/store.ts
import { FetchLocation, FetchParcelLocation } from '@/interface';
import { create } from 'zustand';
import { API } from '../tools/apitools';
import Store from './store';
import useLoaderStore from '../hooks/loader';



const LocationStore = create<FetchLocation>((set) => ({
  countryId: '',
  setCountryId: (newCountryId: any) => set({ countryId: newCountryId }),

  stateId: '',
  setStateId: (newCountryId: any) => set({ countryId: newCountryId }),

  cityId: '',
  setCityId: (newCountryId: any) => set({ countryId: newCountryId }),

  country: [],
  Reccountry: [],
  FetchCountry: async (type?: any) => {
    try {
      const response = await API.GET('common/list/country');
      const res = await response.data.countries;
      if (type === 'sender') {
        set({ country: res });
      }
      else if (type === 'receiver') {
        set({ Reccountry: res });
      } else {
        set({ country: res });
        set({ Reccountry: res });
      }
    } catch (error) {
      console.error('Failed to fetch parcel location', error);
    }
  },

  state: [],
  Recstate: [],
  FetchState: async (id: any, type?: any) => {
    const { setLoading } = useLoaderStore.getState();
    setLoading(true)
    try {
      const response = await API.GET(`common/list/state/${id}`);
      const res = await response.data.states;
      if (type === 'sender') {
        set({ state: res });
      }
      else if (type === 'receiver') {
        set({ Recstate: res });
      } else {
        set({ state: res });
        set({ Recstate: res });
      }
    } catch (error) {
      console.error('Failed to fetch parcel location', error);
    } finally {
      setLoading(false); // End loading
    }
  },

  city: [],
  Reccity: [],
  FetchCity: async (cid: any, sid: any, type?: any) => {
    const { setLoading } = useLoaderStore.getState();
    setLoading(true)
    try {
      const response = await API.GET(`common/list/city/${cid}/${sid}`);
      const res = await response.data.cities;
      if (type === 'sender') {
        set({ city: res });
      }
      else if (type === 'receiver') {
        set({ Reccity: res });
      } else {
        set({ city: res });
        set({ Reccity: res });
      }
    } catch (error) {
      console.error('Failed to fetch parcel location', error);
    } finally {
      setLoading(false); // End loading
    }
  },

  FavLocation: [],
  FetchFavLocation: async () => {
    const { setLoading } = useLoaderStore.getState();
    setLoading(true)
    try {
      const response = await API.GET('common/favouriteLocation');
      const res = await response.data.locations;
      set({ FavLocation: res });
    } catch (error) {
      console.error('Failed to fetch parcel location', error);
    } finally {
      setLoading(false); // End loading
    }
  },

  Routes: [],
  FetchRoutes: async (data: any) => {
    const { setLoading } = useLoaderStore.getState();
    setLoading(true)
    const val = {
      pickupLat: data?.startCoords[1],
      pickupLng: data?.startCoords[0],
      dropLat: data?.endCoords[1],
      dropLng: data?.endCoords[0]
    }
    try {
      const response = await API.GET('common/getRoutes', val);
      const res = await response.data.routePathData;
      set({ Routes: res });
    } catch (error) {
      console.error('Failed to fetch parcel location', error);
    } finally {
      setLoading(false); // End loading
    }
  },

  SingleRoutes: [],
  FetchSingleRoutes: async (wayPointId: any) => {
    const { setLoading } = useLoaderStore.getState();
    setLoading(true)
    try {
      
      const response = await API.GET(`common/getRoute/${wayPointId}`);
      const res = await response?.data?.routePathData;
      set({ SingleRoutes: res });
    } catch (error) {
      console.error('Failed to fetch parcel location', error);
    } finally {
      setLoading(false); // End loading
    }
  }
}));

export default LocationStore;
