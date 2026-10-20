import { Transaction, User, UserState } from "@/interface";
import { create } from "zustand";
import { API } from "../tools/apitools";

interface VehicleStore {
  TypeOfVehicle: [];
  fetchTypeOfVehicle: () => void;
  Make: [];
  fetchMake: () => void;
  Model: [];
  fetchModel: (id: any) => void;
  Vehicle: [];
  fetchVehicle: () => void;
  VehicleDoc: [];
  fetchVehicleDoc: (user_id: any, vehicle_id: any) => void;
  SingleVehicle: [];
  fetchSingleVehicle: (id: any) => void;
}

const VehicleStore = create<VehicleStore>((set) => ({
  TypeOfVehicle: [],
  fetchTypeOfVehicle: async () => {
    try {
      const response = await API.GET("creteria/serviceType/list");
      const data = await response.data.ServiceType;
      set({ TypeOfVehicle: data });
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  },

  Make: [],
  fetchMake: async () => {
    try {
      const val: any = {
        limit: 10,
        page: 1,
      };
      const response = await API.GET("common/list/makes", val);
      const data = await response.data.makes;
      set({ Make: data });
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  },

  Model: [],
  fetchModel: async (id) => {
    try {
      const val: any = {
        limit: 10,
        page: 1,
      };
      const response = await API.GET(`common/list/models/${id}`, val);
      const data = await response.data.models;
      set({ Model: data });
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  },

  Vehicle: [],
  fetchVehicle: async () => {
    try {
      const response = await API.GET("creteria/vehicle/user");
      const data = await response.data.Vehicle;
      set({ Vehicle: data });
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  },
  SingleVehicle: [],
  fetchSingleVehicle: async (id: any) => {
    try {
      const response = await API.GET(`creteria/vehicle/${id}`);
      const data = await response.data.Vehicle;
      set({ SingleVehicle: data });
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  },
  VehicleDoc: [],
  fetchVehicleDoc: async (user_id: any, vehicle_id: any) => {
    try {
      const response = await API.GET(
        `common/document/vehicle/${user_id}/${vehicle_id}`
      );
      const data = await response.data.documents;
      set({ VehicleDoc: data });
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  },
}));

export default VehicleStore;