import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
// import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";
import { ToastContainer } from "react-toastify";

// image import
import LogoWhite from "@/assets/images/logo/logo-white.svg";
// import Logo from "@/assets/images/logo/logo.svg";
import Logo from "@/assets/images/logo/postiernew.png";
import Illustration from "@/assets/images/auth/ils1.svg";
import ResetForm from "./common/reset-form";

const Reset = () => {
    const currentYear = new Date().getFullYear();
    const [isDark] = useDarkMode();
    return (
        <>
            <ToastContainer />
            <div className="loginwrapper">
                <div className="lg-inner-column">
                    <div className="left-column relative z-[1]">
                        <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
                            <Link to="/">
                                <img src={isDark ? Logo : Logo} alt="" className="mb-5" />
                            </Link>
                            <h4>
                                Unlock your Project
                                <span className="text-slate-800 dark:text-slate-400 font-bold pl-4">
                                    performance
                                </span>
                            </h4>
                        </div>
                        <div className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]">
                            <img
                                src={Illustration}
                                alt=""
                                className="h-full w-full object-contain"
                            />
                        </div>
                    </div>
                    <div className="right-column relative">
                        <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
                            <div className="auth-box h-full flex flex-col justify-center">
                                <div className="mobile-logo text-center mb-6 lg:hidden block">
                                    <Link to="/">
                                        <img
                                            src={isDark ? LogoWhite : Logo}
                                            alt=""
                                            className="mx-auto"
                                        />
                                    </Link>
                                </div>
                                <div className="text-center 2xl:mb-10 mb-4">
                                    <h4 className="font-medium">Reset Password</h4>

                                </div>
                                <ResetForm />


                            </div>
                            <div className="auth-footer text-center">
                                Copyright {currentYear}, Postier All Rights Reserved.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reset;
