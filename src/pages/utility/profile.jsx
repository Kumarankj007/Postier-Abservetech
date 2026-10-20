import React, { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
// import BasicArea from "../chart/appex-chart/BasicArea";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
// import { getUser, getManager } from "../auth/common/store";
// import images
import ProfileImage from "@/assets/images/users/user-1.jpg";
import { useEffect } from "react";
// import { decryptData } from "../../HelperFunction/helper";
// import { replaceStarsInMobileNumber ,replaceStarsInEmailAddress} from "@/HelperFunction/helper";

const profile = () => {
  const [loginType, setLoginType] = useState("");
  const { profile } = useSelector((state) => state.commonSlice);
  const dispatch = useDispatch();
  // console.log("inside profile",loginUserDetails);
  const navigate = useNavigate();

  return (
    <div>
      <div className="space-y-5 profile-page">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"></div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
                <div className="flex items-center justify-center border-2  bg-white md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  {loginType === "MANAGER" ? (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}${loginUserDetails?.profileImage}`}
                      alt="Store Image"
                      className="w-[130px] h-[130px] "
                    />
                  ) : (
                    <h1 className="text-center text-red-900 text-6xl">
                      {/* {profileLetter ? profileLetter[0].toUpperCase() : ""} */}
                      {/* {profileLetter1 ? profileLetter1[0].toUpperCase() : ""} */}
                    </h1>
                  )}
                  {/* <Link
                    to="#"
                    className="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
                  >
                    <Icon icon="heroicons:pencil-square" />
                  </Link> */}
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {profile?.fname || "F-Name"} {profile?.lname || "L-Name"}
                  {/* {loginUserDetails.managerName} */}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                  {/* {profileLetter && <p>ADMIN</p>} */}
                  {/* {profileLetter1 && <p>MANAGER</p>} */}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                $32,400
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Total Balance
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                200
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Board Card
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                3200
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Calender Events
              </div>
            </div>
          </div> */}
        </div>
        <div className="grid grid-cols-12 gap-6 w-full">
          <div className="col-span-12 w-full">
            <Card className="w-full" title="Info">
              <ul className="flex flex-col list space-y-8 w-full">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      EMAIL
                    </div>
                    <a
                      href="mailto:someone@example.com"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {profile?.email || "Email"}
                      {/* {replaceStarsInEmailAddress(loginUserDetails.email)} */}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      PHONE
                    </div>
                    <a
                      href="tel:0189749676767"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {profile?.phone || "Phone"}
                      {/* {replaceStarsInMobileNumber(loginUserDetails.phone)} */}
                    </a>
                  </div>
                </li>
                <li className="self-end">
                  <Button
                    // icon="heroicons-outline:plus"
                    text="Edit Admin"
                    className="btn-dark dark:bg-slate-800  h-min text-sm font-normal"
                    iconClass=" text-lg"
                    onClick={() => navigate("/edit-admin")}
                  />
                </li>

                {/* <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:map" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      LOCATION
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                      Home# 320/N, Road# 71/B, Mohakhali, Dhaka-1207, Bangladesh
                    </div>
                  </div>
                </li> */}
              </ul>
            </Card>
          </div>
          {/* <div className="lg:col-span-8 col-span-12">
            <Card title="User Overview">
              <BasicArea height={190} />
            </Card>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default profile;
