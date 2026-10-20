import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import { generateGoogleOAuthUrl } from "@/utils"
import Image from "next/image";
import { useContext } from "react";

export default function Google() {
     const  router  = UseLoadingRouter();
    const { i18 } = useContext(PageContext);
    const AuthUrl = generateGoogleOAuthUrl()
    return (
        <div className="flex justify-between p-6 border-b border-[#999999] cursor-pointer" onClick={() => router.push(AuthUrl)}>
            <p className="font-normal text-[15px] md:text-[20px]">
           { i18?.LOGIN?.CONTINUEGOOGLE || 'Continue with Google'}
            </p>
            <div className="flex gap-10 items-center">
                <Image width={20} height={20} src='/svg/icon/google.svg' alt='svg' className="w-5 h-5" />
                <Image width={10} height={10} src='/svg/icon/rightarrow.svg' alt='svg' className="w-4 h-4" />
            </div>
        </div>
    )
}