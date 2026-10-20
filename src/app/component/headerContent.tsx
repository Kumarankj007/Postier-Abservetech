"use client";
import React, { useContext, useEffect } from "react";
import { Avatar, Badge } from "@mui/material";
import PopoverComponent from "./popover";
import { useState } from "react";
import { notifyContent } from "../../../content";
import UseLoadingRouter from "../hooks/useLoadingRoutes";
import { usePathname } from "next/navigation";
import {
  Bag,
  Dashboard,
  Login,
  Message,
  Notification,
  Parcel,
  Post,
  Seacrh,
  Search,
  Sendparcel,
} from "../../../public/svg/svgcomponent";
import useScreenWidth from "../hooks/usescreenwidth";
import { Burger } from "./burgerIcon/burger";
import BurgerIcon from "./burgerIcon/burgericon";
import Store from "../store/store";
import UserStore from "../store/profile";
import { useMutation } from "@tanstack/react-query";
import { API } from "../tools/apitools";
import useSnackbarStore from "../store/toaster";
import { Logout } from "../tools/mutatefn/auth";
import TypeStore from "../store/typeStore";
import { getCookie, setCookie } from "@/utils";
import PageContext from "../providers/pagecontext";
import Link from "next/link";
import Image from "next/image";
import RoleStore from "../store/RoleStore";
import Button from "./button";
import GlobalLink from "./globalLink";
import useLoaderStore from "../hooks/loader";
import ThreeDotLoader from "./threedotloader";

export default function HeaderContent(props: any) {
  const { i18 } = useContext(PageContext);
  const { loading } = useLoaderStore();
  const { FetchRoleSwitch, RoleSwitch, setRole } = RoleStore();
  const router = UseLoadingRouter();
  const screen: any = useScreenWidth();
  const { setToken, token } = Store();
  const { Type, setType } = TypeStore();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { user, setUser } = UserStore();
  const pathname = usePathname();
  const [previewImage, setPreviewImage] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [anchorEl2, setAnchorEl2] = useState<HTMLButtonElement | null>(null);
  const [anchorEl3, setAnchorEl3] = useState<HTMLButtonElement | null>(null);

  const dropdownData = [
    {
      label:
        RoleSwitch === "postier"
          ? i18?.HOMEPAGE?.NAVBAR?.SWITCHPARCEL || "Switch To Send Parcel"
          : i18?.HOMEPAGE?.NAVBAR?.SWITCHTRIP || "Switch To Parcel Delivery",
      onClick: "type",
    },
    // {
    //   label: 'My Profile',
    //   path: '/profileDetails'
    // },
    {
      label:
        RoleSwitch === "postier"
          ? i18?.HOMEPAGE?.NAVBAR?.MYTRIPS || "My Trips"
          : i18?.HOMEPAGE?.NAVBAR?.MYPARCEL || "My Parcel",
      path: RoleSwitch === "postier" ? "/mytrips/" : "/mypost/",
    },
    {
      label: i18?.NEW?.MYREQUEST || "My Request",
      path: "/myrequest/",
    },
    {
      label: i18?.HOMEPAGE?.NAVBAR?.ACCSET || "Account Settings",
      path: "/dashboard",
    },
    {
      label: i18?.HOMEPAGE?.NAVBAR?.LOGOUT || "Logout",
      onClick: "",
    },
  ];
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickNofitication = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClickBurger = (event: any) => {
    setAnchorEl3(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseNOtification = () => {
    setAnchorEl2(null);
  };
  const handleCloseBurger = () => {
    setAnchorEl3(null);
  };

  const open = Boolean(anchorEl);
  const notify = Boolean(anchorEl2);
  const burger = Boolean(anchorEl3);

  const LogoutMutation = useMutation({
    mutationFn: Logout,
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        setToken(false);
        setCookie("appToken", "", -1);
        setCookie("appUserId", "", -1);
        setCookie("RoleSwitch", "", -1);
        setUser({});
        setRole(null)
        showSnackbar(data.data.message, "success");
        // window.location.reload()
        router.push("/");
      }
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });

  const handleItemClick = (item: any) => {
    if (item.path) {
      router.push(item.path);
    } else if (item.onClick === "") {
      LogoutMutation.mutateAsync();
    } else {
      FetchRoleSwitch(router);
    }
    setAnchorEl(null);
  };
  const handleClickheader = (items: any, event: any) => {
    if (items.url) {
      router.push(items.url);
      setAnchorEl3(null);
    } else if (items.onclick === "") {
      handleClickNofitication(event);
    }
  };

  const AuthHeader = [
    // {
    //   img: <Dashboard />,
    //   text: i18?.HOMEPAGE?.NAVBAR?.DASHBOARD || "Dashboard",
    //   url: "/dashboard/",
    // },
    {
      img: RoleSwitch === "postier" ? <Parcel /> : <Sendparcel />,
      text:
        RoleSwitch === "postier"
          ? i18?.HOMEPAGE?.NAVBAR?.POSTAPARCEL || "Add a Trip"
          : i18?.HOMEPAGE?.NAVBAR?.SENDPARCEL1 || "Send a Parcel",
      url: RoleSwitch === "postier" ? "/createtrip/" : "/createparcel/",
    },
    {
      img: <Message />,
      text: i18?.HOMEPAGE?.NAVBAR?.MESSAGES || "Messages",
      url: "/message/",
    },
    // {
    //   img: <Post />,
    //   text: Type === "deliverparcel"
    //     ? i18?.HOMEPAGE?.NAVBAR?.MYTRIPS || "My Trips"
    //     :
    //     i18?.HOMEPAGE?.NAVBAR?.MYPOSTS || "My Posts",
    //   url: Type === "deliverparcel" ? "/mytrips/" : "/mypost/",
    // },

    {
      img: <Notification />,
      text: i18?.HOMEPAGE?.NAVBAR?.NONTIFICATIONS || "Notifications",
      url: "/notification/",
    },
    {
      img: <Search />,
      text: i18?.NEW?.SEARCH || "Search",
      url: "/search/",
    },
  ];
  const NoAuth = [
    {
      img: <Bag />,
      text: i18?.NEW?.POSTIERFORBUSINESS || "Postier For Business",
      url: "*",
    },
    {
      img: <Seacrh />,
      text: i18?.NEW?.SEARCH || "Search",
      url: "/search/",
    },
    ...(screen.width < 762
      ? [
          {
            img: <Login />,
            text: i18?.LOGIN?.BUTTON || "Login / Register",
            url: "/account/register?auth=signup/",
          },
        ]
      : []),
  ];
  const Header = token ? AuthHeader : NoAuth;
  useEffect(() => {
    if (user?.profile?.startsWith("https")) {
      setPreviewImage(user.profile);
    } else {
      setPreviewImage(
        user?.profile
          ? process.env.NEXT_PUBLIC_IMAGE_URL + user.profile
          : "/dustbin.jpg"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
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

  // console.log("Header", i18?.SENDPARCEL?.HEADING);
  return (
    <>
      <div className="flex gap-6 items-center ">
        <div>
          {screen.width < 1054 && (
            <div onClick={handleClickBurger}>
              <BurgerIcon
                color="#00427d"
                size={25}
                toggle={setAnchorEl3}
                toggled={anchorEl3}
              />
            </div>
          )}
          {screen.width > 1054 && (
            <nav
              aria-label="Main navigation"
              className="flex gap-6 items-center"
            >
              {Header.map((items: any, index: any) => (
                <div key={index}>
                  <GlobalLink
                    className="flex gap-3 cursor-pointer"
                    href={items?.url}
                    prefetch
                    aria-label={
                      items.text === (i18?.NEW?.SEARCH || "Search")
                        ? "Search"
                        : undefined
                    }
                  >
                    {items.img}
                    <span
                      className={
                        items.text === (i18?.NEW?.SEARCH || "Search")
                          ? "font-medium text-[17px]"
                          : pathname === items?.url
                          ? "text-[17px] font-extrabold text-btncolor"
                          : "font-medium text-[17px]"
                      }
                    >
                      {items.text}
                    </span>
                  </GlobalLink>
                </div>
              ))}
            </nav>
          )}
        </div>
        {token && (
          <div className="flex gap-2 cursor-pointer items-center" onClick={handleClick}>
            <Badge
              badgeContent=" "
              variant="dot"
              invisible
              sx={{
                "& .MuiBadge-badge": {
                  position: "absolute",
                  backgroundColor: "#00BC35!important",
                  top: "6px",
                  right: "6px",
                },
              }}
            >
              {loading ? (
                <div className="w-[50px] h-[50px] flex items-center justify-center bg-gray-200 rounded-full">
                  <ThreeDotLoader />
                </div>
              ) : previewImage && (
                <Image
                  alt="Profile"
                  src={previewImage}
                  width={50}
                  height={50}
                  className="rounded-full shadow-lg"
                />
              )}
            </Badge>
            <Image
              width={20}
              height={20}
              src="/svg/icon/downarrow.svg"
              className="w-5 h-5"
              alt="svg"
            />
          </div>
        )}
      </div>
      <PopoverComponent
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        width="200px"
      >
        <div>
          {dropdownData.map((item: any, index: any) => {
            return (
              <div
                key={index}
                className="p-5 border-b border-[#B7B7B7] cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <p className="font-normal text-[13px] leading-[16px]">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </PopoverComponent>

      {/* <PopoverComponent
        open={notify}
        anchorEl={anchorEl2}
        onClose={handleCloseNOtification}
        width="300px"
      >
        <div>
          <p className="font-bold text-[17px] p-4">Today</p>
          {notifyContent.map((item: any, index: any) => {
            return (
              <div
                key={index}
                className="p-5 border-b border-[#B7B7B7] cursor-pointer flex gap-4 items-center"
              >
                <Avatar
                  key={index}
                  alt={`Avatar ${index + 1}`}
                  src={item.img}
                  className="avathar"
                />
                <p className="font-normal text-[13px] leading-[16px] ">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </PopoverComponent> */}

      <PopoverComponent
        open={burger}
        anchorEl={anchorEl3}
        onClose={handleCloseBurger}
        width="300px"
        background="#00427d"
      >
        <div>
          {Header.map((items: any, index: any) => {
            return (
              <div key={index} className="">
                <div
                  className="flex gap-3 cursor-pointer menushow"
                  onClick={(event) => handleClickheader(items, event)}
                >
                  {React.cloneElement(items.img, { stroke: "#fff" })}
                  <span className="font-medium text-[17px]">{items.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverComponent>
    </>
  );
}
