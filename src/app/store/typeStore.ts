// store.ts

import { TypeStoreInteface } from '@/interface';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the Zustand store with persist middleware
const TypeStore = create<TypeStoreInteface>()(
  persist(
    (set) => ({
      Type: 'sendparcel',
      setType: (newType: string) => set({ Type: newType }),
    }),
    {
      name: 'app-Type', // Key name for localStorage
      storage: createJSONStorage(() => localStorage), // Persist to localStorage
    }
  )
);

export default TypeStore;