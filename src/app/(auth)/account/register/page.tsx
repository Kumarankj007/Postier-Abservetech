'use client'
import Register from "@/app/component/register";
import { useSearchParams } from 'next/navigation'

export default function RegisterPage(){
    const searchParams = useSearchParams()
 
    const search = searchParams.get('auth')
    return(
        <div className="h-full">
           <Register type={search === 'signup' ?  'signup' : 'login'}/>
        </div>
    )
}