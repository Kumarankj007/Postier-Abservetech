// store/store.ts
import { Transaction, User, UserState } from '@/interface';
import { create } from 'zustand';
import { API } from '../tools/apitools';


const TransactionStore = create<Transaction>((set) => ({
  Transaction:[],
  fetchTransaction: async (props:any) => {
    const {mode,onYear,onMonth} = props;
    try{
        const response = await API.GET('module/payment/myAccount/transactions',{mode:mode,onYear:onYear,onMonth:onMonth});
        const data = await response.data   ;
        set({Transaction:data});
    }
    catch(error){
        console.error('Failed to fetch transactions', error);
    }
  },
}));

export default TransactionStore;