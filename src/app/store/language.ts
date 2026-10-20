// store/store.ts
import { LanguageState, } from '@/interface';
import { create } from 'zustand';
import { API } from '../tools/apitools';
import TypeStore from './typeStore';


const LangStore = create<LanguageState>((set) => ({
  
  Languages: [],
  FetchLanguages: async () => {
      const response = await API.GET(`module/languages/user`);
      const data = await response?.data?.language;
      set({ Languages: data })
  },

}));

export default LangStore;
