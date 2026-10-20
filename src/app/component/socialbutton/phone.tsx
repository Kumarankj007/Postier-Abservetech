import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import Image from "next/image";
import { useContext } from "react";

export default function Phone({ type }: any) {
     const  router  = UseLoadingRouter();
    const { i18 } = useContext(PageContext);
    const handleroutes = () => {
        router.push('/account/login/?with=phone')
    }
    return (
        <div>
            <div className="flex justify-between p-6 border-b border-[#999999] cursor-pointer" onClick={handleroutes}>
                <p className="font-normal	 text-[15px] md:text-[20px]">
                    {/* {i18?.LOGIN?.CONTINUEEMAIL||'Continue with Email'} */}
                   {i18?.NEW?.CONTINUEWITHPHONE || "Continue with Phone"}
                </p>
                <div className="flex gap-10 items-center">
                    <Image width={20} height={20} src='/svg/icon/phone.svg' alt='svg' className="w-5 h-5" />
                    <Image width={10} height={10} src='/svg/icon/rightarrow.svg' alt='svg'className="w-4 h-4" />
                </div>
            </div>

        </div>
    )
}