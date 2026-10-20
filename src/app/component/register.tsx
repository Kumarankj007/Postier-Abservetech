/* eslint-disable @next/next/no-img-element */
'use client'
import Google from './socialbutton/google'
import FacebookLogin from './socialbutton/facebook'
import Email from './socialbutton/email'
import { useContext, useState } from 'react'
import PageContext from '../providers/pagecontext'
import Link from 'next/link'
import Phone from './socialbutton/phone'
import AppleLogin from './socialbutton/applelogin'
import UseLoadingRouter from '../hooks/useLoadingRoutes'

export default function Register({ type }: any) {
   const  router  = UseLoadingRouter();
  const { i18 } = useContext(PageContext);

  const handleNavigation = (val:any) => {
    if(val === 'log'){
      router.push(`/account/register/?auth=login`)
    }
    else{
      router.push(`/account/register/?auth=signup`)
    }
  }



  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col gap-3 md:gap-10 p-5 w-[900px]">
        <div>
          <h2 className="font-bold text-[18px] sm:text-[30px]	md:text-[50px] leading-[20px] sm:leading-[45px] md:leading-[65px] text-center md:min-w-[768px]">
            {
              type === 'signup' ? i18?.LOGIN?.HEADING || 'Ready to get started? Sign up now!' : i18?.NEW?.LETSGONOW || "Let's Go! Login Now!"

            }

          </h2>
        </div>
        <div>
          <Email type={type} />
          {type === 'login' && <Phone type={type}/>}
          <Google />
          {/* <FacebookLogin />
          <AppleLogin/> */}
        </div>
        {
          type === 'signup' ?
            <div>
              <p className="font-normal	text-[15px] md:text-[17px]">
                {'Already a member?'} <span className="font-extrabold cursor-pointer	text-[#004080]  text-[15px] md:text-[17px]" onClick={()=>handleNavigation('log')}>{i18?.LOGIN?.LOG || 'Login'}</span>
              </p>

            </div>
            :
            <div>
            <p className="font-normal	text-[15px] md:text-[17px]">
              {'Not Yet A Member?'} <span className="font-extrabold cursor-pointer	text-[#004080] text-[15px] md:text-[17px]" onClick={()=>handleNavigation('reg')}>{ 'Register'}</span>
            </p>

          </div>
        }

        {
          type === 'signup' &&
          <div>
            <p className="font-normal	text-[15px] md:text-[17px]">
              {i18?.LOGIN?.POLICY || ' By Signing up, You are aggreging to our '}&nbsp;<Link href={'/cms/terms_condition'} className="font-extrabold	text-[#004080] text-[15px] md:text-[17px] cursor-pointer underline">{i18?.LOGIN?.TNC || 'terms and conditions'}</Link > and <Link href={'/cms/privacy_policy'} className="font-extrabold	text-[#004080] text-[15px] md:text-[17px] underline cursor-pointer">{i18?.LOGIN?.PRIVACY || 'privacy policy'}</Link>
            </p>
          </div>
        }
      </div>
    </div>
  );
}
