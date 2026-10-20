'use client'
import { ReactNode, useEffect, useRef, useState } from "react";
import FormContext from "./FormCotext";
import Footer from "./components/footer";
import StoreParcel from "../store/store-parcel";
import Header from "./components/header";
import { PriceProvider } from "../providers/pricecontext";

export default function FormProvider({
    children,
  }: {
    children: ReactNode;
  }) {
     const [disable,setDisable] = useState(true)
    const {  clearAllParcelData } = StoreParcel();
     const [step,setStep] = useState(0)
     
     const handleSave = () =>{
        setStep((prev:any)=> prev + 1)
     }
      
     const handleBack = () =>{
      setStep((prev:any)=> prev - 1)
   }
  //  useEffect(()=>{
  //   clearAllParcelData()
  //  },[])
    return(
        <FormContext.Provider value={{
            disable,setDisable,step,handleSave,handleBack,setStep
        }}>
        <PriceProvider>
            <Header/>
             <div className='Createheight overflow-y-auto'>
             {children}
             </div>
            <Footer/>
        </PriceProvider>
        </FormContext.Provider>
    )
  }