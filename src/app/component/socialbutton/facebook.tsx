'use client'
import React, { useContext, useEffect, useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import { API } from '@/app/tools/apitools';
import Store from '@/app/store/store';
import useSnackbarStore from '@/app/store/toaster';
import { StatusResponse, UserInfo } from '@/interface';
import { FaceBookLogin } from '@/app/tools/mutatefn/auth';
import { fetchUser } from '@/app/tools/queryfn/fetch';
import UserStore from '@/app/store/profile';
import { setCookie } from '@/utils';
import UseCryptodeviceid from '@/app/hooks/deviceid';
import PageContext from '@/app/providers/pagecontext';
import Image from 'next/image';
import UseLoadingRouter from '@/app/hooks/useLoadingRoutes';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const FacebookLogin: React.FC = () => {
   const  router  = UseLoadingRouter();
  const { i18 } = useContext(PageContext);
  const deviceId:any = UseCryptodeviceid()
  const [code, setCode] = useState('');
  const { setToken } = Store();
  const { setUser } = UserStore()
  const [isFbInitialized, setIsFbInitialized] = useState(false);
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);

  useEffect(() => {
    (function (d, s, id) {
      let js: HTMLScriptElement;
      const fjs = d.getElementsByTagName(s)[0] as HTMLScriptElement;
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        xfbml: true,
        version: 'v20.0'
      });

      setIsFbInitialized(true); // Set initialization state to true
    };
  }, []);

  const checkLoginState = () => {
    window.FB.getLoginStatus((response: StatusResponse) => {
      statusChangeCallback(response);
    });
  };

  const statusChangeCallback = (response: StatusResponse) => {
    if (response.status === 'connected') {
      // console.log('Successfully logged in with Facebook', response);
      setCode(response.authResponse.accessToken);
      window.FB.api('/me', { fields: 'name,email' }, (userInfo: UserInfo) => {
        // console.log('User info:', userInfo);
      });
    } else {
      // console.log('Failed to log in with Facebook', response);
    }
  };

  const handleFBLogin = () => {
    if (isFbInitialized) {
      window.FB.login(checkLoginState, { scope: 'public_profile,email' });
    } else {
      console.error('Facebook SDK is not initialized yet.');
    }
  };

  const FetchProfile = async () => {
    const res: any = await fetchUser()
    if (res) {
      setUser(res.profile)
    }
  }

  const facebooklogin = useMutation({
    mutationFn: FaceBookLogin,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem("appToken", data.data.token);
        setCookie('appToken',data.data.token)
        API.token = data.data.token;
        API.deviceId = deviceId;
        setCookie('appUserId',data.data.user._id)
        window.localStorage.setItem("appUserId", data.data.user._id);
        window.localStorage.setItem("deviceId", deviceId);
        if (data.data.token) {
          setToken(true);
        }
        if (data.data.user._id) {
          FetchProfile()
        }
        showSnackbar(data.data.message, "success");
        router.push("/");

      }
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });

  useEffect(() => {
    if(deviceId){
      API.deviceId = deviceId
    }
    if (code !== '') {
      facebooklogin.mutateAsync(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="flex justify-between p-6 border-b border-[#999999] cursor-pointer" onClick={handleFBLogin}>
      <p className="font-normal text-[15px] md:text-[20px]">
        {i18?.LOGIN?.CONTINUEFB||"Continue with Facebook"}
      </p>
      <div className="flex gap-10">
        <Image width={20} height={20} src='/svg/icon/fb.svg' alt='svg' />
        <Image width={10} height={10} src='/svg/icon/rightarrow.svg' alt='svg' />
      </div>
    </div>
  );
};

export default FacebookLogin;
