'use client';
import PageContext from '@/app/providers/pagecontext';
import Image from 'next/image';
import React, { useContext, useEffect } from 'react';
const globalWindow:any = typeof window!=='undefined'?window: {};
const AppleLogin: React.FC = () => {
  const { i18 } = useContext(PageContext);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.onload = () => {
      if (globalWindow.AppleID) {
        globalWindow.AppleID.auth.init({
          clientId: 'com.postier.ios.Postier2024',
          scope: 'name email',
          redirectURI: 'https://dfba-122-165-249-241.ngrok-free.app',
          usePopup: true
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAppleSignIn = async () => {
  
    globalWindow.AppleID.auth.signIn()
      .then((response:any) => {
        // console.log("response",response);
        const { authorization: { code,id_token }} = response;
        const identityToken = id_token

        // Call your backend to validate the token and fetch user details
        // axios.post('/api/auth/apple', { identityToken, code })
        //   .then(res => {
        //     console.log('User authenticated:', res.data);
        //   })
        //   .catch(err => {
        //     console.error('Error authenticating:', err);
        //   });
      })
      .catch((error:any) => {
        console.error('Apple Sign-In Error:', error);
      });
  };

  return (
     <div className="flex justify-between p-6 border-b border-[#999999] cursor-pointer" onClick={handleAppleSignIn}>
     <p className="font-normal text-[15px] md:text-[20px]">
       {i18?.NEW?.CONTINUEWITHAPPLE || "Continue with Apple"}
     </p>
     <div className="flex gap-10">
       <Image width={20} height={20} src='/svg/icon/apple.svg' alt='svg' />
       <Image width={10} height={10} src='/svg/icon/rightarrow.svg' alt='svg' />
     </div>
   </div>
  );
};

export default AppleLogin;
