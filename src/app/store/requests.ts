import { create } from 'zustand';
import { API } from '../tools/apitools';

interface Request {
    TripRequest: [],
    total: 0,
    FetchRequest: (id: any, type: any, requestid: any) => void

    ParcelRequest: [],
    Parceltotal: 0,
    FetchParcelRequest: (id: any, type: any, requestid: any) => void

    myrequest: [],
    myrequestTotal:0,
    FetchMyRequest: (type: any) => void
}
const TripandParcelRequests = create<Request>((set) => ({
    TripRequest: [],
    total: 0,
    FetchRequest: async (id: any, type?: any, requestid?: any) => {
        try {
            let response;
            if (requestid === undefined) {
                response = await API.GET(`common/findTrips/${id}`, type);
                const res = await response?.data?.tripLists
                set({ TripRequest: res })
            }
            else {
                response = await API.GET(`common/findTrips/${id}/${requestid}`, type);
                const res = await response?.data?.tripLists[0]
                set({ TripRequest: res })
            }
            set({ total: response?.data?.total })
        } catch (error) {
            console.error('Failed to fetch parcel location', error);
        }
    },

    ParcelRequest: [],
    Parceltotal: 0,
    FetchParcelRequest: async (id: any, type: any, requestid?: any) => {
        try {
            let response;
            if (requestid === undefined) {
                response = await API.GET(`common/findPosts/${id}`, type);
                const res = await response?.data?.postLists
                set({ ParcelRequest: res })
            }
            else {
                response = await API.GET(`common/findPosts/${id}/${requestid}`, type);
                const res = await response?.data?.postLists[0]
                set({ ParcelRequest: res })
            }
            set({ Parceltotal: response?.data?.total })
        } catch (error) {
            console.error('Failed to fetch parcel location', error);
        }
    },

    myrequest: [],
    myrequestTotal:0,
    FetchMyRequest: async (type: any) => {
        try {
            const response = await API.GET(`common/requests`, type)
            const res = await response?.data?.requests
            set({ myrequest: res })
            set({ myrequestTotal: response?.data?.total })
        }
        catch (error) {
            console.error('Failed to fetch', error);
        }
    }
}));

export default TripandParcelRequests;