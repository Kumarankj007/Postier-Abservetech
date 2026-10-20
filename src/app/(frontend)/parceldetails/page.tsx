import dynamic from "next/dynamic";


const ParcelRequest = dynamic(() => import('@/app/component/parceldetails'), { ssr: false });
export default function parceldetails() {
    return(
        <div>
            <ParcelRequest/>
        </div>
    )
}