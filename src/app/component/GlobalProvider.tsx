'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CustomSnackbar from './toast';
import GoogleLogin from './googlelogin';
import GlobalModals from './globalModals';
import PageContext from '../providers/pagecontext';
import useSocketStore from '../hooks/socket';
import { useEffect, useState } from 'react';
import { getDictionary } from './dictionaries';

const GlobalProvider = ({ children, i18: initialI18 }: any) => {
    const queryClient = new QueryClient()
    // console.log(i18, 'i18')
  const [i18, setI18] = useState(initialI18);
    return (
        <PageContext.Provider value={{
            "i18": i18, 'setI18': setI18
        }} >
            <QueryClientProvider client={queryClient}>
                {children}
                <CustomSnackbar />
                <GoogleLogin />
                <GlobalModals />
            </QueryClientProvider>
        </PageContext.Provider>
    )
}
export default GlobalProvider;