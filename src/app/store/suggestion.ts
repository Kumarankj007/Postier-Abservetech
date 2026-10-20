// store/store.ts
import { create } from 'zustand';
import { API } from '../tools/apitools';

interface suggestion {
    SuggestionData:[]
    GetSuggestion:(Seacrh?:any)=>void
}

 const Suggestion = create<suggestion>((set) => ({

    SuggestionData:[],

    GetSuggestion:async(Seacrh?:any) => {
        const params = {
            search: Seacrh || '',
          }
          try{
            const response = await API.GET('common/suggestion',params)
            const data = await response?.data;
            set({ SuggestionData: data?.suggestion })
          }catch(err){
            console.error('Failed to fetch', err);
          }
    }

}))

export default Suggestion