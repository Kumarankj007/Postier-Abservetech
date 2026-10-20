'use client'

import UseLoadingRouter from "../hooks/useLoadingRoutes";
import Store from "../store/store"
import { API } from "../tools/apitools"
import { getAccessTokenFromCode, setCookie } from "@/utils"
import { useEffect, useState } from "react"
import useSnackbarStore from "../store/toaster"
import { useQueryClient } from "@tanstack/react-query"
import { fetchUser } from "../tools/queryfn/fetch"
import UserStore from "../store/profile"
import Cryptodeviceid from "../hooks/deviceid"
import UseCryptodeviceid from "../hooks/deviceid"

export default function GoogleLogin() {
    const { setToken } = Store()
    const { setUser } = UserStore()
    const deviceId:any = UseCryptodeviceid()
    const queryClient = useQueryClient()
    const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
     const  router  = UseLoadingRouter();
    const [code, setCode] = useState<string | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            setCode(params.get('code'))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const FetchProfile = async () => {
        const res: any = await fetchUser()
        if (res) {
            setUser(res.profile)
        }
    }
    const socialLogin = async (url: string, data: { accessToken: string }) => {
        if(deviceId){
            API.deviceId = deviceId
          }
        try {
            const res = await API.PUT(url, data)
            if (res.type === 'success' && typeof window !== "undefined") {
                setCookie('appToken',res.data.token)
                window.localStorage.setItem("appToken", res.data.token)
                API.token = res.data.token
                API.deviceId = deviceId
                setCookie('appUserId',res.data.user._id)
                window.localStorage.setItem("appUserId", res.data.user._id)
                window.localStorage.setItem("deviceId", deviceId);
                showSnackbar(res.data.message, 'success')
                if (res.data.token) {
                    setToken(true)
                    router.replace('/')
                }
                if (res.data.user._id) {
                    FetchProfile()
                }
            }
        } catch (error) {
            console.error('Error during social login:', error)
            showSnackbar('Error during social login:', 'error')
        }
    }

    useEffect(() => {
        if (code) {
            const fetchData = async () => {
                try {
                    const accessToken = await getAccessTokenFromCode(code)
                    if (accessToken) {
                        await socialLogin('common/login/google', { accessToken: accessToken })
                    }
                } catch (error) {
                    console.error('Error fetching access token:', error)
                }
            }
            fetchData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code])

    return null
}
