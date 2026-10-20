'use client'
import { useContext, useEffect, useState } from "react"
import VechicleCate from "../store/getapi"
import Image from "next/image"
import PageContext from "../providers/pagecontext";

export default function VehicleCategory({onData,value}:any) {
    const { i18 } = useContext(PageContext);
    // console.log('value',value)
    const [click, setClick] = useState<string>()
    const {FetchVehicleCate,vehicleCate} = VechicleCate()
    useEffect(()=>{
        FetchVehicleCate()
        if(value !== ''){
            setClick(value)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[value])
    // console.log('vehicleCate',vehicleCate)
    return (

        <div>
            <h3 className="font-bold  text-2xl mb-2">{i18?.NEW?.PROFILEVEH||'Select the vehicle you’ll driving with'}</h3>
            <p className="font-medium  mb-[30px]">{i18?.NEW?.NOTE||"Note:"}<span className="font-normal"> {i18?.NEW?.PROFILEVEH2||"Please select the vehicle you’ll driving with to deliver the parcels with"}</span></p>
            <div className='flex flex-wrap gap-4 items-center max-w-[1000px] cursor-pointer'>
                {Array.isArray(vehicleCate) && vehicleCate.map((item: any, index: any) => {
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                setClick(item._id)
                                onData(item._id)
                                // setValue('size', item.value, { shouldDirty: true, shouldValidate: true })
                            }}
                            className={`border border-btncolor p-4 rounded-[11px] flex flex-col  w-[300px] h-[200px] items-center justify-center ${click === item._id ? 'border-[2px]' : ''
                                }`}
                        >
                            <Image width={500} height={500} className="w-[116px] h-[100px]" src={process.env.NEXT_PUBLIC_IMAGE_URL + item.image} alt="Image"/>
                            <p className={` ${click === item._id ? 'text-btncolor' : 'text-[#000]'}`} >{item.name}</p>
                        </div>
                    );
                })}
            </div>
        </div>

    )
}