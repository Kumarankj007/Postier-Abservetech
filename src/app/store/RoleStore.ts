import { TypeStoreInteface } from "@/interface";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { API } from "../tools/apitools";
import { setCookie } from "@/utils";
import UseLoadingRouter from "../hooks/useLoadingRoutes";

interface Switch {
  RoleSwitch: any;
  setRole: (newType: any) => void;
  FetchRoleSwitch: (router:any) => void;
}
const RoleStore = create<Switch>()(
  persist(
    (set) => ({
      // State for RoleSwitch
      RoleSwitch: null,
      setRole: (newType: string) => set({ RoleSwitch: newType }),
      FetchRoleSwitch: async (router:any) => {
        const User_id =
          typeof window !== "undefined" &&
          window.localStorage.getItem("appUserId") !== ""
            ? window.localStorage.getItem("appUserId")
            : null;

        if (User_id) {
          try {
            const response = await API.GET(`common/user/switch`);
            const data = response?.data?.data;
            setCookie("RoleSwitch", data?.type);
            set({ RoleSwitch: data?.type });
            // window.location.reload();
            router.push("/");
          } catch (error) {
            console.error("Error fetching role switch:", error);
          }
        }
      },
    }),
    {
      name: "app-Role", // Single key for localStorage
      storage: createJSONStorage(() => localStorage), // Persist to localStorage
    }
  )
);

export default RoleStore;
