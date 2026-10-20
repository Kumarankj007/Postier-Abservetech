import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { useFormContext } from "../../FormCotext"
import StoreParcel from "@/app/store/store-parcel"
import Utils from "@/app/store/utils"
import BpCheckbox from "@/app/component/checkbox"
import Suggestions from "../suggestionautocomplete"
import Image from "next/image"
import PageContext from "@/app/providers/pagecontext";

const data = [{}]

export default function StopPoint() {
    const { i18 } = useContext(PageContext);
    const { setDisable }: any = useFormContext()
    const { setPacelData, Parceldata } = StoreParcel()
    const [indices, setIndex] = useState<any>([])
    const [section, setSection] = useState<any>(1)
    const [stopPointError, setStopPointError] = useState("");
    const [data, setData] = useState<any[]>([]);
    const handleDeleteStopPoint = (name: string) => {
        setData((prev) => prev.filter((item) => item.name !== name));
    };

    const handleCheckboxChange = (value: any) => {

        const existingIndex = indices.findIndex((item: any) => item.name === value.name);

        let updatedIndices;
        if (existingIndex >= 0) {
            updatedIndices = indices.filter((item: any) => item.name !== value.name);
        } else {
            updatedIndices = [...indices, value];
        }

        setIndex(updatedIndices);
        setPacelData('stopPointsArr', updatedIndices);
    };


    const handleStopPoint = (val: any) => {
        const exists = data.some(
            (item: any) => item.name === val?.primaryAddress && item.city === val?.city
        );

        if (!exists) {
            data.push({
                name: val?.primaryAddress,
                city: val?.city,
                lng: val?.lng,
                lat: val?.lat,
            });
            setStopPointError("");
            setSection(1);
        } else {
            setStopPointError("This stop point already exists.");
        }
    };



    useLayoutEffect(() => {
        setDisable(false)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata])

    useEffect(() => {

        if (Parceldata?.stopPointsArr?.length > 0) {
            setIndex(Parceldata?.stopPointsArr)
            Parceldata?.stopPointsArr.forEach((item: any) => {
                if (!data.some((existingItem: any) => existingItem.name === item?.name)) {
                    data.push({
                        name: item?.name,
                        city: item?.city,
                        lng: item?.coords?.coordinates[0],
                        lat: item?.coords?.coordinates[1],
                    });
                }
            });

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    // console.log('data', data)
    return (
        <div className="flex flex-col gap-6 items-center h-full ">
            {section === 1 && (
                <div className="flex flex-col items-center mt-[40px]">
                    <h3 className="text-[50px] font-bold max-w-[600px] text-center mb-8">
                        {i18?.NEW?.STOP_POINTS || "Add stop points to get more parcel"}
                    </h3>

                    {/* {data.length > 0 ? ( */}
                    <div className="flex flex-col gap-6 w-full md:max-w-[500px] p-5">
                        {Array.isArray(data) &&
                            data.map((item: any, index: number) => (
                                item?.name && (
                                    <div key={index} className="relative">
                                        <div
                                            className={`border ${indices.some(
                                                (selectedItem: any) => selectedItem.name === item.name
                                            )
                                                ? 'border-2'
                                                : 'border-1'
                                                } border-btncolor p-4 rounded-[7px] w-full cursor-pointer flex justify-between items-center`}
                                            onClick={() => handleCheckboxChange(item)}
                                        >
                                            <p>{item?.name}</p>
                                            <BpCheckbox
                                                checked={indices.some(
                                                    (selectedItem: any) => selectedItem?.name === item?.name
                                                )}
                                            />
                                        </div>
                                        <div
                                            className="absolute top-[23%] right-[-16%] cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteStopPoint(item.name);
                                            }}
                                        >
                                            <Image src='/svg/icon/trash.svg' width={800} height={800} alt="img" className="w-[28px] h-[28px]" />
                                        </div>
                                    </div>
                                )
                            ))}

                        <button
                            className="flex justify-center items-center w-[100px] mx-auto h-[40px] rounded-[10px] bg-btncolor text-[17px] font-semibold text-[#fff]"
                            onClick={() => setSection(2)}
                        >
                            Add city
                        </button>
                    </div>
                    {/* // ) : (
                    //     <div className="text-center text-gray-500">No data found</div>
                    // )} */}
                </div>
            )}

            {
                section === 2 && (
                    <div className="flex items-center justify-center h-full">
                        <div className=" flex flex-col gap-3 w-[500px]">
                            <div className="flex items-center gap-3">
                                <Image src="/svg/icon/previouspagination.svg" alt="img" width={800} height={800} className="w-[15px] h-[15px] cursor-pointer" onClick={() => setSection(1)} />
                                <div className="w-full">
                                    <Suggestions type='stoppoint' stoppoint={true} handleStopPoint={handleStopPoint} />
                                </div>
                            </div>
                            {stopPointError && <p className="text-[#eb1700] font-medium text-[16px]">{stopPointError}</p>}
                        </div>
                    </div>
                )
            }
        </div>
    )
}