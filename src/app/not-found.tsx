import Image from "next/image";
import EmptyPage from "./component/emptydatapage";
import Link from "next/link";

export default function RedirectPage() {
    return (
        <div className="flex items-center justify-center h-screen mx-[80px]">
            <div className="flex-col  items-center">
                <Image src='/svg/icon/Page-not-found.svg' alt="image" width={650} height={650} />
                <p className="font-semibold text-[20px] text-center">Oops!</p>
                <p className="font-semibold text-[20px] text-center"> {"We can't seem to find the page you're looking for."}</p>
                <div className="text-center mt-6 text-btncolor underline cursor-pointer">
                <Link href={'/'} >Back To Home</Link>
                </div>
            </div>
        </div>
    )
}