import SelectC from "@/app/component/select";
import { MenuItem } from "@mui/material";
import { useContext, useLayoutEffect, useState } from "react";
import { useFormContext } from "../../FormCotext";
import VehicleStore from "@/app/store/vehicle";
import StoreParcel from "@/app/store/store-parcel";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import { usePathname, useSearchParams } from "next/navigation";
import PageContext from "@/app/providers/pagecontext";
import useLoaderStore from "@/app/hooks/loader";
import ThreeDotLoader from "@/app/component/threedotloader";

export default function TransportationType({step}:{step?: number}) {
    const { i18 } = useContext(PageContext);
    const router = UseLoadingRouter();
    const { loading } = useLoaderStore()
    let path = window.location.pathname.replace(/\/$/, ""); // remove trailing slash
    const search = window.location.search.trim();
    const separator = search ? "&" : "?";
    const redirectUrl = encodeURIComponent(`${path}${(search && search + "&") || "?"}step=${step}`);
    // console.log('redirectUrl', `${path}${search || "?"}step=${step}`)
    const { setDisable }: any = useFormContext()
    const { fetchVehicle, Vehicle } = VehicleStore()
    const { setPacelData, Parceldata } = StoreParcel()
    const [selectedValue, setSelectedValue] = useState(null)
    useLayoutEffect(() => {
        if (Parceldata?.vehicleId) {
            setSelectedValue(Parceldata?.vehicleId)
            setDisable(false)
        }
        else {
            setDisable(true)
        }
        fetchVehicle()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Parceldata])
    // console.log('Parceldata', Parceldata)
    return (
        <div className="flex flex-col gap-6 items-center h-full mt-[40px] p-5">
            <h3 className=" text-[30px] md:text-[50px] font-bold md:w-[770px] text-center">{i18?.NEW?.TRANSPORTATION_TYPE_DETAILS || "Specify the details about Transportation type"}</h3>
            <div className="flex w-full md:max-w-[600px]">
                <div className="flex flex-col gap-4 w-full items-center justify-center mb-[40px]">
                    {
                        Vehicle.length > 0 ?

                            Array.isArray(Vehicle) && Vehicle.map((items: any, index: any) => (
                                <div key={index}
                                    onClick={
                                        () => {
                                            setSelectedValue(index);
                                            setPacelData('vehicleId', items._id);
                                            setPacelData('vehicleIndex', index)
                                            setPacelData('Vcapacity', items?.capacity)
                                        }
                                    } className={`w-full md:max-w-[400px] border ${Parceldata?.vehicleId === items._id ? 'ring-1 ring-btncolor' : 'border-1'} border-btncolor rounded-[8px] p-4 cursor-pointer`}>
                                    <p>{items?.modelname} - {items?.registrationnumber}</p>
                                </div>
                            ))
                            :

                            loading ?
                                <ThreeDotLoader />
                                :
                                <button className="flex justify-center items-center w-[120px] mx-auto h-[40px] rounded-[10px] bg-btncolor text-[17px] font-semibold text-[#fff]"
                                    onClick={() => router.push(`/accountsettings/manage-vehicles/add-vehicle/?type=createTrip&redirectUrl=${redirectUrl}`)}
                                >
                                    {i18?.NEW?.ADD_VEHICLE || "Add Vehicle"}
                                </button>
                    }
                </div>

            </div>
        </div>
    )
}