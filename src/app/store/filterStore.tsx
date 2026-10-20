import { UnifiedState } from '@/interface';
import { create } from 'zustand';



const useStore = create<{
    value: UnifiedState;
    setValue: (newState: Partial<UnifiedState> , norepeat?: boolean) => void;
}>((set) => ({
    // Initial state
    value: {
        pickupLng: '0',
        pickupLat: '0',
        pickupAddress: '',
        dropLng: '0',
        dropLat: '0',
        dropAddress: '',
        pickupDate: '',
        radius: '',
        sortby: '',
        pickupTime: '',
        deliveryTime: '',
        deliveryType: '',
        vehicleType: '',
        rating: '',
        minHeight: '',
        maxHeight: '',
        minWeight: '',
        maxWeight: '',
    },

    // Action to update the unified state
    setValue: (newState:any,norepeat: boolean = false) =>

    {
        // console.log('newState',newState)
        set((state) => {
            const prevValue:any = {...state.value};
            if(Object.keys(newState).length===1) {
                
                const key = Object.keys(newState)[0];
                if(!norepeat && prevValue[key] && prevValue[key] === newState[key]) {
                    delete newState[key];
                    delete prevValue[key];
                }
            }
            // console.log('storevalue', {
            //     ...prevValue,
            //     ...newState,
            // })
            return {
            value: {
                ...prevValue,
                ...newState,
            },
        }
    })

    },
    deleteValue: (key:string) => {
            set((state:any) => {
                const data = {...state.value};
                delete data[key]
                return data;
            });
        }
}));

export default useStore;

