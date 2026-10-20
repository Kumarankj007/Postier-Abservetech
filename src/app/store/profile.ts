// store/store.ts
import { User, UserState } from '@/interface';
import { create } from 'zustand';
import { API } from '../tools/apitools';
import TypeStore from './typeStore';


const UserStore = create<UserState>((set) => ({
  user: {},
  setUser: (user: User) => set({ user }),
  clearUser: () => set({ user: {} }),
  fetchProfile: async () => {
    const User_id = (typeof window !== "undefined" && window.localStorage.getItem('appUserId') !== '') ? window.localStorage.getItem('appUserId') : null
    if (User_id !== null && User_id !== undefined && User_id !== '') {

      const response = await API.GET(`common/user/profile/${User_id}`);
      // console.log(response, 'response')
      const data = await response?.data?.profile;
      set({ user: data })

    }
  },
  UploadDocument: [],
  FetchUploadDocument: async () => {
    const User_id = (typeof window !== "undefined" && window.localStorage.getItem('appUserId') !== '') ? window.localStorage.getItem('appUserId') : null
    if (User_id !== null && User_id !== undefined && User_id !== '') {

      const response = await API.GET(`common/document/user/${User_id}`);
      const data = await response?.data?.documents;
      set({ UploadDocument: data })
    }
  },

}));

export default UserStore;
