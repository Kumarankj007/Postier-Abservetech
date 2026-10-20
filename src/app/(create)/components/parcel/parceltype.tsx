'use client'

import StoreParcel from "@/app/store/store-parcel"
import Utils from "@/app/store/utils"
import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { useFormContext } from "../../FormCotext"
import PageContext from "@/app/providers/pagecontext"
import useLoaderStore from "@/app/hooks/loader"
import ThreeDotLoader from "@/app/component/threedotloader"
import ContentTooptip from "@/app/component/contentTooptip"
import { DeliveryTypeContent } from "@/app/(profileDetails)/accountsettings/content"

export default function ParcelTypes() {
    const { i18 } = useContext(PageContext)
    const { setDisable }: any = useFormContext()
    const { loading } = useLoaderStore()
    const { setPacelData, Parceldata } = StoreParcel()
    const [indices, setIndex] = useState(-1)
    const { FetchDeliverparcelby, Deliverparcelby } = Utils()
    useEffect(() => {
        FetchDeliverparcelby()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useLayoutEffect(() => {
        // 
        if (Parceldata?.deliveryType) {
            setDisable(false)
        } else if (indices !== -1) {
            setDisable(true)
        }
        else {
            setDisable(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata, indices])
    useEffect(() => {
        setIndex(Deliverparcelby.findIndex((items: any) => items.name === Parceldata?.deliveryType))
    }, [Parceldata?.deliveryType, Deliverparcelby])
    // console.log('index', indices)
    return (
        <div className="flex flex-col gap-6 justify-center items-center py-10 px-3 ">
            <h3 className="px-[20px] text-[30px] md:text-[50px] font-bold max-w-[650px] text-center leading-[37px] md:leading-[65px]">{i18?.NEW?.DELIVERY_TYPE_QUESTION || "What’s the delivery type you are looking for?"}

                <span className="inline-flex">
                    <ContentTooptip value={DeliveryTypeContent()} />
                </span>
            </h3>
            {
                Deliverparcelby.length > 0 ?
                    <div className="flex flex-col gap-6 w-full  md:max-w-[500px] p-5">
                        {
                            loading ?
                                <ThreeDotLoader />
                                :
                                Array.isArray(Deliverparcelby) && Deliverparcelby.map((items: any, index) => {
                                    // 
                                    return (
                                        <div key={index}>
                                            <div className={`border ${indices === index ? 'ring-1 ring-btncolor' : 'border-1'} border-btncolor p-4 rounded-[7px] w-full cursor-pointer`} onClick={() => {
                                                setIndex(index)
                                                // setPacelData('parcelBy', items?._id);
                                                setPacelData('deliveryType', items?.name);
                                            }}>
                                                <p>{items.name}</p>
                                            </div>
                                        </div>
                                    )
                                })
                        }
                    </div>
                    :
                    <div>
                        {i18?.NEW?.NO_DATA_FOUND || "No data found"}
                    </div>
            }
            <p className="text-[16px] font-[500] max-w-[700px] leading-[31px] text-center">
                {i18?.NEW?.DELIVERYTYPECONTENT || "Select the delivery type that best fits your needs. Whether you need Standard Delivery for a cost-effective solution, or Express Delivery for faster service, Postier has you covered."}
            </p>
        </div>
    )
}