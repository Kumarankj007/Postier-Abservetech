'use client'
import React, { useContext, useState } from 'react';
import DeliverparcelForm from './form';
import PageContext from '@/app/providers/pagecontext';

const Sendparcel = () => {
  const [stepperState, setStepperState] = useState(0)
  const { i18 } = useContext(PageContext);
  const formVal: any = () => {
    setStepperState(prevStep => prevStep + 1)
  }

  return (
    <>
      <div className='m-2 md:m-auto flex flex-col justify-center text-center max-w-[600px] gap-6 my-5'>
        <p className='font-bold text-[50px] leading-[65px]'>
          {i18?.POSTAPARCELDELIVERY?.HEADER?.HEADING || "Add a Trip"}</p>
        <p className='font-normal text-[16px] leading-[40px]'>
          {i18?.POSTAPARCELDELIVERY?.HEADER?.SUBHEADING || "Once you’re satisfied, save the trip details. You’ll receive a suggestion or request from user."}</p>
      </div>
      <DeliverparcelForm formVal={() => formVal()} />
    </>
  );
};

export default Sendparcel;
