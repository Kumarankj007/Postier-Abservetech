"use client";
import React, { useContext, useEffect, useState } from "react";
import Button from "./button";
import HeaderContent from "./headerContent";
import { getCookie } from "@/utils";
import Store from "../store/store";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../tools/queryfn/fetch";
import UserStore from "../store/profile";
import TypeStore from "../store/typeStore";
import PageContext from "../providers/pagecontext";
import Image from "next/image";
import RoleStore from "../store/RoleStore";
import UseLoadingRouter from "../hooks/useLoadingRoutes";
import LinearLoader from "./linearLoader";
import LabeledInput from "@/app/component/input";

export default function Header({ helpCenter = false }: { helpCenter?: boolean }) {
  const { setToken, token } = Store();
  const { i18 } = useContext(PageContext);
  const { setType } = TypeStore();
  const store = UserStore();
  const { user, fetchProfile } = UserStore();
  const { RoleSwitch, setRole } = RoleStore();
  const router = UseLoadingRouter();
  const [srch, setSrch] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["user", token],
    queryFn: fetchUser,
    retry: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  //   const FetchProfile = async () => {
  //     const res: any = await fetchUser()
  //     if (res) {
  //       store.setUser(res.profile)
  //     }
  // }
  const handleNavigate = () => {
    router.push(`/account/register?auth=signup`);
  };
  useEffect(() => {
    const auth = getCookie("appToken");
    if (auth !== "") {
      setToken(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (token) {
      if (!isLoading) {
        fetchProfile();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!isLoading]);
  // useEffect(()=>{
  //   if(localStorage.getItem('app-Type')){
  //     const value:any = localStorage.getItem('app-Type') ? localStorage.getItem('app-Type') : null
  //     const json = JSON.parse(value)
  //     setType(json.state.Type)
  //   }
  //   if(localStorage.getItem('app-Role')){
  //
  //     const value:any = localStorage.getItem('app-Type') ? localStorage.getItem('app-Role') : null
  //     const json = JSON.parse(value)
  //     if(json?.state?.RoleSwitch !== null ){
  //       setRole(json?.state?.RoleSwitch)
  //     }else if(user?.type){
  //       setRole(user?.type)
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // },[user])

  useEffect(() => {
    if (user?.type) {
      // window.localStorage.setItem("role", user?.type);
      setRole(user?.type);
      setType(user?.type === "user" ? "sendparcel" : "deliverparcel");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // console.log("RoleSwitch", RoleSwitch);

  return (
    <div className=" shadow-md sticky top-0 bg-[#fff] z-[999]">
      <div className="container m-auto w-full  ">
        {!isLoading ? (
          <div className="md:px-10 px-3 flex justify-between w-full shadow-shadowbox ">
            <Image
              width={100}
              height={100}
              src="/svg/postier.svg"
              alt=""
              aria-hidden="true"
              priority
              onClick={() => router.push("/")}
              className="cursor-pointer"
            />
            <div className="flex items-center gap-6">
              {helpCenter ? (
                <LabeledInput
                  value={srch}
                  placeholder="Search"
                  borderStyle={{ borderRadius: "200px", borderWidth: "1px"}}
                  inputStyle={{ padding: "2px", paddingLeft: "6px", color: "#222" }}
                  rootStyle={{padding: "7px"}}
                  className={"text-[17px] font-normal text-[#222]"}
                  onChange={(e) => setSrch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.2}
                        stroke="#004080"
                        className="lg:size-[30px] size-[25px]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    ),
                  }}
                />
              ) : (
                <>
                  <HeaderContent />
                  {!token && (
                    <Button
                      className="px-6 border rounded-lg bg-btncolor font-medium text-[15px] text-[#fff]  h-[60px] hidden md:block"
                      onClick={handleNavigate}
                    >
                      {" "}
                      {i18?.LOGIN?.BUTTON || "Login / Register"}{" "}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="px-10 py-3 flex justify-between w-full shadow-shadowbox h-[70px]"></div>
          </>
        )}
      </div>
      <LinearLoader />
    </div>
  );
}
