// src/store/loaderStore.ts
import {create} from 'zustand';

interface LoaderState {
  loading: boolean;
  setLoading: (isLoading: boolean) => void;

  RouterLoader: boolean,
  setRouterLoader: (RouterLoader : boolean) => void
}

const useLoaderStore = create<LoaderState>((set) => ({
  loading: false,
  setLoading: (isLoading) => set({ loading: isLoading }),

  RouterLoader: false,
  setRouterLoader: (newModal:boolean) => set({ RouterLoader: newModal }),
}));

export default useLoaderStore;
