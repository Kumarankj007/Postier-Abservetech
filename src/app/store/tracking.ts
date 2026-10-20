import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TrackingState = {
  trackingData: any;
  setTrackingData: (data: any) => void;
};

const useTrackingStore = create<TrackingState>()(
  persist(
    (set) => ({
      trackingData: null,
      setTrackingData: (data) => set({ trackingData: data }),
    }),
    { name: 'tracking-store' }
  )
);

export default useTrackingStore;
