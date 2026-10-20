'use client'

import React, { useContext } from 'react';
import StepperComponent from '@/app/component/stepper';
import SendparcelForm from './form1';
import Store from '@/app/store/store';
import PageContext from '@/app/providers/pagecontext';

const Sendparcel = () => {
   const { step, stepper }: any = Store()
   const { i18 } = useContext(PageContext);

   const Formsteps = [
      { label: i18?.PARCELSEND?.SENDER || 'Sender' },
      { label: i18?.PARCELSEND?.PARCELINFORMATION || 'Parcel information' },
      { label: i18?.PARCELSEND?.RECEIVER || 'Receiver' },
      { label: i18?.PARCELSEND?.PUBLISH || 'Publish' }
   ];

   return (
      <>
         <div className='m-auto flex flex-col justify-center text-center max-w-[600px] gap-6 my-20 p-5'>
            <p className='font-bold text-[50px] leading-[65px]'>{i18?.PARCELSEND?.SENDPARCEL || 'Send Parcel'}</p>
            <p className='font-normal text-[16px] leading-[40px]'>{i18?.PARCELSEND?.PARCELDEC || 'we are committed to providing a seamless and reliable parcel delivery experience. From the moment you book to the moment your parcel arrives, we strive to ensure your satisfaction every step of the way.'} </p>
         </div>
         <StepperComponent stepperState={stepper} type='form' steps={Formsteps} />
         <SendparcelForm />
      </>
   );
};

export default Sendparcel;
