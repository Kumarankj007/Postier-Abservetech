import Utils from "@/app/store/utils"
import { useContext, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { useFormContext } from "../../FormCotext"
import StoreParcel from "@/app/store/store-parcel"
import BpCheckbox from "@/app/component/checkbox"
import PageContext from "@/app/providers/pagecontext"
import { usePathname, useSearchParams } from "next/navigation"
import ParcelStore from "@/app/store/parcel"
import ThreeDotLoader from "@/app/component/threedotloader"
import useLoaderStore from "@/app/hooks/loader"
import ContentTooptip from "@/app/component/contentTooptip"
import { ParcelContent } from "@/app/(profileDetails)/accountsettings/content"

export default function Category({ type }: any) {
    const path = usePathname()
    const { loading } = useLoaderStore()
    const { setDisable }: any = useFormContext()
    const { MyTripsDetails, MyParcelsDetails }: any = ParcelStore()
    const params = useSearchParams()
    const Suggestion_id = params.get('id')
    const { i18 } = useContext(PageContext);
    const { setPacelData, Parceldata } = StoreParcel()
    const { parcelType, FetchparcelType } = Utils()
    const [indices, setIndex] = useState<any>([])

    const handleCheckboxChange = (type: any, name: any) => {
        const existingIndex = indices.findIndex((item: any) => item.name === name);

        let updatedIndices;
        // if (existingIndex >= 0) {
        //     updatedIndices = indices.filter((item: any) => item.name !== name);
        // } else {
        // }
        updatedIndices = [{ type, name }];

        setIndex(updatedIndices);
        setPacelData('category', updatedIndices);
    }
    // console.log('indices', indices)
    useEffect(() => {
        if (Suggestion_id === null)
            FetchparcelType()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useLayoutEffect(() => {
        if (Parceldata?.category && Parceldata?.category.length > 0) {
            setDisable(false)
        }
        else {
            setDisable(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata])
    useEffect(() => {
        if (Parceldata?.category)
            setIndex(Parceldata?.category && Parceldata?.category)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const ParcelCategory = useMemo(() => {
        // 
        return (path === '/chooseparcel/' ? MyTripsDetails?.type : MyParcelsDetails?.parcel?.type)
            ?.split(',')
            .map((type: string) => ({ name: type.trim() }));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [MyTripsDetails, params, MyParcelsDetails]);
    // console.log('ParcelCategory', ParcelCategory)

    return (
        <div className="flex flex-col gap-6 items-center h-full mt-[40px]">
            <h3 className="text-[30px] px-[20px] md:text-[50px] font-bold max-w-[700px] text-center leading-[37px] md:leading-[65px]">
                {type === 'trip' ? (
                    <>
                        {i18?.NEW?.PROVIDEPARCELSHIPPINGTYPE2 || 'Specify the type of parcels you can deliver'}
                        <span className="inline-flex">
                            <ContentTooptip value={ParcelContent()} />
                        </span>
                    </>
                ) : (
                    <>
                        {i18?.NEW?.PROVIDEPARCELSHIPPINGTYPE || 'Please provide the type of parcel shipping'}
                        <span className="inline-flex">
                            <ContentTooptip value={ParcelContent()} />
                        </span>
                    </>
                )}
            </h3>

            {
                loading ?
                    <ThreeDotLoader />
                    :
                    (Suggestion_id === null ? parcelType?.length : ParcelCategory?.length) > 0 ?
                        <div className="flex flex-col gap-6 w-full  md:max-w-[500px] p-5">
                            {
                                Array.isArray(Suggestion_id === null ? parcelType : ParcelCategory) && (Suggestion_id === null ? parcelType : ParcelCategory).map((items: any, index: any) => {
                                    return (
                                        <div key={index}>
                                            {/* <div className={`border ${indices.some((item: any) => item.name === items.name) ? 'border-2' : 'border-1'} border-btncolor p-4 rounded-[7px] w-full cursor-pointer flex justify-between`} onClick={() => {
                                                handleCheckboxChange(items._id, items.name)
                                            }}>
                                                <p>{items.name}</p>
                                                <BpCheckbox
                                                    checked={indices.some((item: any) => item.name === items.name)}
                                                />
                                            </div> */}

                                            <div className={`border ${indices.some((item: any) => item.name === items.name) ? 'ring-1 ring-btncolor' : 'border'}  border-btncolor p-4 rounded-[7px] w-full cursor-pointer`} onClick={() => {
                                                handleCheckboxChange(items._id, items.name)
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
                            {i18?.NEW?.NO_DATA_FOUND || "no data found"}
                        </div>
            }

        </div>
    )
}