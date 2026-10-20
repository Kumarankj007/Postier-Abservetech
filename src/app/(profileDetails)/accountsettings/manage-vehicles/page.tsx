"use client";
import CustomBreadCrumb from "@/app/component/breadcrumbs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AddVehicleComp from "./add-vehicle/addvehicle";
import VehicleStore from "@/app/store/vehicle";
import { useContext, useEffect } from "react";
import Button from "@/app/component/button";
import VehicleImgCarousel from "./vehicleimgCarousel";
import useScreenDetector from "@/app/hooks/useresize";
import UseLoadingRouter from "@/app/hooks/useLoadingRoutes";
import PageContext from "@/app/providers/pagecontext";
import ContentTooptip from "@/app/component/contentTooptip";
import { VehicleContent } from "../content";
import { useMutation } from "@tanstack/react-query";
import { DeleteVehicleAPI } from "@/app/tools/mutatefn/vehicle";
import useSnackbarStore from "@/app/store/toaster";

export default function ManageVehicle() {
  const { i18 } = useContext(PageContext);
  const PathName = usePathname();
  const screen = useScreenDetector();
  const router = UseLoadingRouter();
  const showSnackbar = useSnackbarStore((state) => state.showSnackbar);
  const { fetchVehicle, Vehicle } = VehicleStore();
  const rightSection = [
    {
      img: "/svg/icon/truck.svg",
      head: i18?.NEW?.ADD_VEHICLES || "Add Vehicles",
      para:
        i18?.NEW?.VEHICLES ||
        "Easily list your vehicles for  transport or delivery services. Reach more customers and manage your vechiles effortlessly.",
    },
    {
      img: "/svg/icon/globe.svg",
      head:
        i18?.NEW?.TRANSPORT_PARCELS_WORLDWIDE || "Transport Parcels World-wide",
      para:
        i18?.NEW?.TRANSPORT_PARCELS ||
        "Ship parcels across the globe with trusted logistics partners. Fast, secure, and reliable delivery—no matter the destination.",
    },
  ];

  // console.log("Vehicle", Vehicle);

  useEffect(() => {
    fetchVehicle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const DeleteVehicle = useMutation({
    mutationFn: DeleteVehicleAPI,
    onSuccess: (data) => {
      showSnackbar(data.data.message, "success");
      fetchVehicle();
    },
    onError: (err) => {
      showSnackbar(err.message, "error");
    },
  });
  return (
    <div className="mt-[20px] m-[40px] md:m-[70px] h-full">
      <div className="flex flex-col gap-3 mb-[30px]">
        {/* <CustomBreadCrumb pathSegments={i18?.NEW?.MYPROFILE||'My Profile'} /> */}
        <CustomBreadCrumb
          pathSegments="Manage Vehicles"
          pathSegments2={
            PathName === "/accountsettings/manage-vehicles/add-vehicle/"
              ? "Add a vehicle"
              : null
          }
          link={
            PathName === "/accountsettings/manage-vehicles/add-vehicle/"
              ? "/accountsettings/manage-vehicles/"
              : null
          }
        />
        <div className="flex items-center">
          <p className="text-[34px] font-[700] leading-[44px] ">
            {PathName === "/accountsettings/manage-vehicles/add-vehicle/"
              ? "Add a Vehicle"
              : "Manage Vehicles"}
          </p>
          <ContentTooptip value={VehicleContent()} />
        </div>
      </div>

      <div className="flex gap-[20px]">
        <div className=" w-full md:w-3/4">
          {PathName === "/accountsettings/manage-vehicles/add-vehicle/" ? (
            <>
              <AddVehicleComp />
            </>
          ) : (
            <>
              <div className="flex flex-col gap-6">
                {Vehicle?.length > 0 &&
                  Array.isArray(Vehicle) &&
                  Vehicle?.map(
                    (items: any, index) =>
                      items?.deletedAt === null && (
                        <div
                          key={index}
                          className="border border-1 border-btncolor rounded-[7px] p-8 w-full "
                        >
                          <div className="flex flex-col lg:flex-row justify-between items-center">
                            <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
                              {items.way === "road" && (
                                <VehicleImgCarousel
                                  VehicleDoc={items?.document}
                                  baseurl={true}
                                />
                              )}
                              <div className="flex flex-col gap-2">
                                <p className="text-[17px] font-[700] leading-[22px]">
                                  {i18?.NEW?.TYPE || "Type"}:{" "}
                                  <span className="text-[17px] font-[400] leading-[22px]">
                                    {items?.servicetypename}
                                  </span>
                                </p>
                                {items.way === "road" && (
                                  <>
                                    <p className="text-[17px] font-[700] leading-[22px]">
                                      {i18?.NEW?.BRAND || "Brand"}:{" "}
                                      <span className="text-[17px] font-[400] leading-[22px]">
                                        {items?.makename}
                                      </span>
                                    </p>
                                    <p className="text-[17px] font-[700] leading-[22px]">
                                      {i18?.NEW?.MODEL || "Model"}:{" "}
                                      <span className="text-[17px] font-[400] leading-[22px]">
                                        {items?.modelname}
                                      </span>
                                    </p>
                                    <p className="text-[17px] font-[700] leading-[22px]">
                                      {i18?.NEW?.YEAR || "Year"}:{" "}
                                      <span className="text-[17px] font-[400] leading-[22px]">
                                        {items?.year}
                                      </span>
                                    </p>
                                    <p className="text-[17px] font-[700] leading-[22px]">
                                      {i18?.NEW?.COLOR || "color"}:{" "}
                                      <span className="text-[17px] font-[400] leading-[22px]">
                                        {items?.color}
                                      </span>
                                    </p>
                                  </>
                                )}
                                <p className="text-[17px] font-[700] leading-[22px]">
                                  {i18?.NEW?.LICENSE_PLATE || "License Plate"}:{" "}
                                  <span className="text-[17px] font-[400] leading-[22px]">
                                    {items?.registrationnumber}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-4 items-center  mt-5">
                              <Button
                                onClick={() => {
                                  VehicleStore.setState({ SingleVehicle: [] });
                                  router.push(
                                    `/accountsettings/manage-vehicles/add-vehicle?vehicle_id=${items._id}`
                                  );
                                }}
                                className="bg-btncolor px-[30px] py-[15px] rounded-full text-[#fff]"
                              >
                                {i18?.NEW?.UPDATE || "Update"}
                              </Button>
                              <Button
                                onClick={() => DeleteVehicle.mutate(items._id)}
                                className="bg-[#FF0000] px-[30px] py-[15px] rounded-full text-[#fff]"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                  )}
              </div>
              <Button
                onClick={() => {
                  VehicleStore.setState({ SingleVehicle: [] });
                  router.push(`/accountsettings/manage-vehicles/add-vehicle`);
                }}
                className="border border-1 border-btncolor rounded-[7px] p-8 w-full flex gap-4 cursor-pointer mt-6"
              >
                <Image
                  src="/svg/icon/plus-circle.svg"
                  alt="img"
                  width={800}
                  height={800}
                  className="w-[30px] h-[30px]"
                />
                <p className="text-[17px] font-[700] leading-[22px] flex items-center">
                  {i18?.NEW?.ADD_A_VEHICLE || "Add a Vehicle"}
                </p>
              </Button>
            </>
          )}
        </div>
        {screen === "desktop" && (
          <div className="w-1/2 flex  justify-center">
            <div className="flex flex-col gap-6">
              {rightSection.map((items, index) => (
                <div
                  key={index}
                  className="border border-1 border-btncolor flex flex-col gap-6 p-5 rounded-[31px] w-full md:w-[350px]"
                >
                  <Image
                    width={800}
                    height={800}
                    src={items.img}
                    alt="svg"
                    className="w-[50px] h-[50px]"
                  />
                  <p className="text-[17px] font-[700] leading-[22px]">
                    {items.head}
                  </p>
                  <p className="text-[17px] font-[400] leading-[22px]">
                    {items.para}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}