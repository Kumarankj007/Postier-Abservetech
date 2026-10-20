// store/store.ts
import { FetchParcelLocation } from "@/interface";
import { create } from "zustand";
import { API } from "../tools/apitools";
import Store from "./store";
import useLoaderStore from "../hooks/loader";

const ParcelStore = create<FetchParcelLocation>((set) => ({
  parcel: null,
  FetchParcelLocation: async (val: any, Type?: any) => {
    const data: any = {};
    if (
      val?.pickupLat !== "0" &&
      val?.pickupLat !== undefined &&
      val?.pickupLa !== ""
    ) {
      data.startLat = val?.pickupLat;
    }
    if (
      val?.pickupLng !== "0" &&
      val?.pickupLng !== undefined &&
      val?.pickupLng !== ""
    ) {
      data.startLng = val?.pickupLng;
    }
    if (
      val?.dropLat !== "0" &&
      val?.dropLat !== undefined &&
      val?.dropLat !== ""
    ) {
      data.endLat = val?.dropLat;
    }
    if (
      val?.dropLng !== "0" &&
      val?.dropLng !== undefined &&
      val?.dropLng !== ""
    ) {
      data.endLng = val?.dropLng;
    }
    try {
      let response;
      let res;
      if (Type === "deliverparcel") {
        set({ parcel: null });
        response = await API.GET("common/recentPosts", data);
        res = await response?.data?.post;
        set({ parcel: res });
      } else {
        set({ parcel: null });
        response = await API.GET("common/recentTrips", data);
        res = await response?.data?.trip;
        set({ parcel: res });
      }
    } catch (error) {
      console.error("Failed to fetch parcel location", error);
    }
  },

  NearestMatches: null,
  FetchNearestMatches: async (id: any, page?: any, limit?: any) => {
    const params = {
      page: page || 1,
      limit: limit || 5,
    };
    try {
      const response = await API.GET(`common/findTrips/${id}`, params);
      const data = await response?.data;
      set({ NearestMatches: data });
    } catch (error) {
      console.error("Failed to fetch parcel location", error);
    }
  },
  //  AcceptDelivery : null,
  //  GetAcceptDelivery : async(postid:any,tripid:any,val:any)=>{
  //   try {
  //     const response = await API.POST(`common/request/${tripid}/${postid}`,{distance:val});
  //     const data = await response.data.NearbyParcel;
  //     set({ AcceptDelivery: data })
  //   } catch (error) {
  //     console.error('Failed to fetch parcel location', error);
  //   }
  //  }
  Details: null,
  FetchDetails: async (id: any, type: any) => {
    try {
      let response;
      let res;
      if (type === "sendparcel") {
        response = await API.GET(`common/tripReview/${id}`);
        res = await response?.data;
      } else {
        response = await API.GET(`common/postReview/${id}`);
        res = await response?.data;
      }
      set({ Details: res });
    } catch (error) {
      console.error("Failed to fetch parcel location", error);
    }
  },

  MyParcels: [],
  total: 0,
  FetchMyparcels: async (data) => {
    try {
      const response = await API.GET("common/post", data);
      const res = await response?.data?.posts;
      const Total = await response?.data?.total;

      set({ MyParcels: res });
      set({ total: Total });
    } catch (error) {
      console.error("Failed to fetch parcel location", error);
    }
  },

  MyParcelsDetails: {},
  totalCount: 0,
  FetchMyparcelsDetails: async (id: any, type: any) => {
    try {
      let response;
      if (type === null) {
        response = await API.GET(`common/post/${id}`);
      } else {
        response = await API.GET(`common/post/detail/${id}`);
      }
      const res =
        (await type) === null ? response?.data?.post : response?.data?.post;
      const Total = await response?.data?.total;

      set({ MyParcelsDetails: res });
      set({ totalCount: Total });
    } catch (error) {
      console.error("Failed to fetch parcel location", error);
    }
  },

  MyTrips: [],
  Triptotal: 0,
  FetchMyTrips: async (data) => {
    try {
      const response = await API.GET("common/trip", data);
      const res = await response?.data?.trips;
      const Total = await response?.data?.total;

      set({ MyTrips: res });
      set({ Triptotal: Total });
    } catch (error) {
      console.error("Failed to fetch parcel location", error);
    }
  },

  MyTripsDetails: {},
  TriptotalCount: 0,
  FetchMyTripsDetails: async (
    id: any,
    type: any,
    droplat: any,
    droplng: any
  ) => {
    try {
      let response;
      if (type === null) {
        response = response = await API.GET(`common/trip/${id}`);
      } else {
        const data: any = {};
        if (droplng) {
          data.dropLng = droplng;
        }
        if (droplat) {
          data.droplat = droplat;
        }
        response = await API.GET(`common/trip/detail/${id}`, data);
      }
      const res =
        (await type) === null ? response?.data?.trip : response?.data?.trip;
      const Total = await response?.data?.total;

      set({ MyTripsDetails: res });
      set({ TriptotalCount: Total });
    } catch (error) {
      console.error("Failed to fetch parcel location", error);
    }
  },

  SearchTrip: [],
  SearchTripCount: 0,
  FetchSearchTrip: async (data: any) => {
    try {
      const response = await API.GET("common/trip/search", data);
      const res = await response?.data?.trips;
      const Total = await response?.data?.total;
      // temprory filter
      const scheduleLater = res.filter((items: any) => {
        let schedule =
          items?.scheduleLater?.status && items?.scheduleLater?.time
            ? new Date(items?.scheduleLater?.time).getTime()
            : false;
        if (!schedule) {
          return true;
        } else {
          const date = new Date().getTime();
          return schedule < date;
        }
      });
      set({ SearchTrip: scheduleLater });
      set({ SearchTripCount: scheduleLater.length }); //Total})
    } catch (error) {
      console.error("Failed to fetch parcel location", error);
    }
  },

  SearchParcel: [],
  SearchParcelCount: 0,
  FetchSearchParcel: async (data: any) => {
    try {
      const response = await API.GET("common/post/search", data);
      const res = await response?.data?.posts;
      const Total = await response?.data?.total;
      // temprory filter
      const scheduleLater = res.filter((items: any) => {
        let schedule =
          items?.scheduleLater?.status && items?.scheduleLater?.time
            ? new Date(items?.scheduleLater?.time).getTime()
            : false;
        if (!schedule) {
          return true;
        } else {
          const date = new Date().getTime();
          return schedule < date;
        }
      });
      set({ SearchParcel: scheduleLater });
      set({ SearchParcelCount: scheduleLater.length }); //Total})
    } catch (error) {
      console.error("Failed to fetch parcel location", error);
    }
  },
}));

export default ParcelStore;
