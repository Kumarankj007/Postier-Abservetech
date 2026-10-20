// store/store.ts
import { PostDetailsState, User, UserState } from '@/interface';
import { create } from 'zustand';
import { API } from '../tools/apitools';
import useLoaderStore from '../hooks/loader';


const PostDetailsStore = create<PostDetailsState>((set) => ({
  postDetails: null,
  setPostDetails: (postDetails: any) => set({ postDetails }),
  fetchPostDetails: async (id: any) => {
    
    if (typeof window !== "undefined") {
      try {
        if (id) {
          const response = await API.GET(`common/post/${id}`);
          const data = await response.data;
          set({ postDetails: data?.posts[0] })
        }
      } catch (error) {
        console.error('Failed to fetch parcel location', error);
      } 
    }
  },

  ParcelDetails: null,
  setParcelDetails: (ParcelDetails: any) => set({ ParcelDetails }),
  fetchParcelDetails: async (status: any,sortOrder?:any,page?:any,limit?:any) => {
    if (typeof window !== "undefined") {
      try {
        const response = await API.GET(`common/post`, { status,sortOrder,page,limit });
        const data = await response.data;
        set({ ParcelDetails: data })
      } catch (error) {
        console.error('Failed to fetch parcel location', error);
      } 
    }
  },

  ParcelDetailsPostier: null,
  setParcelDetailsPostier: (ParcelDetailsPostier: any) => set({ ParcelDetailsPostier }),
  fetchParcelDetailsPostier: async (id?:any,sortOrder?:any,page?:any,limit?:any) => {
    if (typeof window !== "undefined") {
      let response;
      try {
        if(id){
          response = await API.GET(`common/trip/${id}`);
        }else{
          response = await API.GET(`common/trip`, {sortOrder,page,limit});
        }
        const data = await response.data;
        set({ ParcelDetailsPostier: data })
      } catch (error) {
        console.error('Failed to fetch parcel location', error);
      } 
    }
  },

  findPost: null,
  fetchfindPost: async (tripId?:any) => {
    if (typeof window !== "undefined") {
      try {
        const response = await API.GET(`common/findPosts/${tripId}`);
        const data = await response.data;
        set({ findPost: data })
      } catch (error) {
        console.error('Failed to fetch parcel location', error);
      } 
    }
  }
}))

export default PostDetailsStore;
