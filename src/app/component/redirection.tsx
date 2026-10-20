'use client';

import React, { ReactNode } from 'react';
import useTransitionStore from '../store/transition';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// {children}:{children: ReactNode}
const LoadingIndicator = () => {
  const { isPending } = useTransitionStore();
  
  // return isPending && <span className="loading-indicator">Loading...</span> ;
  return <Backdrop
  sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1, background: '#fff' })}
  open={isPending}
>
  <CircularProgress color="secondary" />
</Backdrop>
};

export default LoadingIndicator;
