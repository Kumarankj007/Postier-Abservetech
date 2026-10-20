"use client";

import { useContext, useEffect } from "react";
import TypeStore from "../store/typeStore";
import PageContext from "../providers/pagecontext";
import Store from "../store/store";
import RoleStore from "../store/RoleStore";
import UseLoadingRouter from "../hooks/useLoadingRoutes";

export default function ToggleButton() {
  const { i18 } = useContext(PageContext);
  const { Type, setType } = TypeStore();
  const router = UseLoadingRouter();
  const { setModal } = Store();
  const { FetchRoleSwitch, RoleSwitch } = RoleStore();
  // You can search the parcel. it must be switched to a postier.
  // You can search for the postier. it must be switched to a user.
  const Toggle = [
    {
      name: "sendparcel",
      text: i18?.HOMEPAGE?.TOGGLEBTN?.TOGGLE1 || "Search Postier",
    },
    {
      name: "deliverparcel",
      text: i18?.HOMEPAGE?.TOGGLEBTN?.TOGGLE2 || "Search Parcel",
    },
  ];

  useEffect(() => {
    if (RoleSwitch == "user") {
      setType("sendparcel");
    } else if (RoleSwitch == "postier") {
      setType("deliverparcel");
    }
  }, [RoleSwitch, setType]);

  const handleSwitch = (name: string) => {
    if (
      (RoleSwitch === "postier" && name == "sendparcel") ||
      (RoleSwitch === "user" && name == "deliverparcel")
    ) {
      setModal("confirmDelete", {
        heading:
          RoleSwitch === "postier"
            ? "You can search for the postier. it must be switched to a user."
            : "You can search the parcel. it must be switched to a postier.",
        fncD: () => {
          FetchRoleSwitch(router);
          setModal("");
        },
      });
    } else {
      setType(name);
    }
  };

  return (
    <div
      className="flex justify-center"
      role="tablist"
      aria-label="Parcel Search Type"
    >
      <div className="bg-togglebg rounded-full flex shadow">
        {Toggle.map((item, index) => {
          const isActive = Type === item.name;
          return (
            <button
              key={item.name}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleSwitch(item.name)}
              className={`px-7 py-5 rounded-full text-[14px] sm:text-[17px] leading-[22px] cursor-pointer outline-none transition-colors duration-200 ${
                isActive
                  ? "bg-btncolor text-white font-bold"
                  : "bg-transparent text-black font-medium"
              }`}
            >
              {item.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
