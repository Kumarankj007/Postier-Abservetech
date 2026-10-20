import { Tracking } from "./../tools/mutatefn/tripReq";
import { StoreInterface } from "@/interface";
import { create } from "zustand";

const Store = create<StoreInterface>((set) => ({
  email: "",
  setEmail: (newEmail: any) => set({ email: newEmail }),

  Phonecode: 0,
  setPhonecode: (newPhonecode: any) => set({ Phonecode: newPhonecode }),

  Phone: 0,
  setPhone: (newPhone: any) => set({ Phone: newPhone }),

  otp: "",
  setOtp: (newOtp: any) => set({ otp: newOtp }),

  token: false,
  setToken: (newToken: any) => set({ token: newToken }),

  modal: {str: "", data: {}},
  setModal: (newModal: any, value?: any) =>
    set({ modal: { str: newModal, data: value } }),

  postId: "",
  setPostId: (newModal: any) => set({ postId: newModal }),

  step: 1,
  setStep: (newModal: any) => set({ step: newModal }),

  stepper: 0,
  setStepper: (newModal: any) => set({ stepper: newModal }),

  Trackingstepper: -1,
  TrackingsetStepper: (newModal: any) => set({ Trackingstepper: newModal }),

  TrackingStep: -1,
  setTrackingStep: (newModal: any) => set({ TrackingStep: newModal }),

  Modalstepper: 0,
  setModalStepper: (newModal: any) => set({ Modalstepper: newModal }),

  ModalStep: 1,
  setModalStep: (newModal: any) => set({ ModalStep: newModal }),

  rememberMe: false,
  setRememberMe: (newModal: any) => set({ rememberMe: newModal }),

  loader: false,
  setLoader: (newModal: any) => set({ loader: newModal }),

  Page: 1,
  setPage: (newModal: any) => set({ Page: newModal }),

  Limit: 5,
  setLimit: (newModal: any) => set({ Limit: newModal }),

  CON64File: null,
  setCON64File: (newModal: any) => set({ CON64File: newModal }),

  ToggleButton: 0,
  setToggleButton: (newModal: any) => set({ ToggleButton: newModal }),

  RouteIndex: 0,
  setRouteIndex: (newModal: any) => set({ RouteIndex: newModal }),

  GooglemapLoader: false,
  setGooglemapLoader: (GooglemapLoader: any) => set({ GooglemapLoader: GooglemapLoader }),

  // next: 0,
  // setNext: (newModal:any) => set({ next: newModal }),
  // incrementNext: () => set((state) => ({ next: state.next + 1 })),
  // decrementNext: () => set((state) => ({ next: state.next - 1 })),
}));

export default Store;
