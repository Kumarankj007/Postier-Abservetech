// store/store.ts
import { ReviewStore } from '@/interface';
import { create } from 'zustand';
import { API } from '../tools/apitools';
import Store from './store';

const ReviewData = create<ReviewStore>((set) => ({
  Reviews: null,
  FetchReviews: async (data: any) => {
    const { TrackingsetStepper } = Store.getState();
    try {
      const value: any = {};
      if (data.page) {
        value.page = data.page;
      }
      if (data.limit) {
        value.limit = data.limit;
      }
      if (data.options) {
        value.options = data.options;
      }
      if (data.moduleType) {
        value.moduleType = data.moduleType;
      }
      if (data.moduleId) {
        value.moduleId = data.moduleId;
      }
      const res = await API.GET(`common/reviews`, value);
      const val = res?.data?.rating;
      set({ Reviews: val });
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  },

  Notifications: null,
  FetchNotifications: async (data?: any) => {
    try {
      const res = await API.GET(`common/notifications`);
      const val = res?.data?.notification;
      set({ Notifications: val });
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    }
  },
}));

export default ReviewData;
