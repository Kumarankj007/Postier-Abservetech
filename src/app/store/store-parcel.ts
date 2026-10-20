import { create } from 'zustand';

interface StoreState {
  Parceldata: Record<string, any>; 
  setPacelData: (key: string, value: any) => void;
  clearParcelData: (key: string) => void; 
  clearAllParcelData:() => void
}

const StoreParcel = create<StoreState>((set) => ({
  Parceldata: {},

  setPacelData: (key, value) => set((state) => ({
    Parceldata: { ...state.Parceldata, [key]: value },
  })),

  clearParcelData: (key) => set((state) => {
    const newData = { ...state.Parceldata };
    delete newData[key];
    return { Parceldata: newData };
  }),

  clearAllParcelData: () => set({ Parceldata: {} }),
}));

export default StoreParcel;
