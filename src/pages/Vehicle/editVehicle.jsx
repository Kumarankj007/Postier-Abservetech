import React, { useEffect, useState } from "react";
import { Textinput } from "@components/ui/input";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { getApiMethos } from "@components/services/gobal";
import { APICONSTANT } from "@components/services/config";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "@components/Loading";
import { toast } from "react-toastify";
import Modal from "@components/ui/Modal";
import Card from "@/components/ui/Card";
import { Button } from "@components/ui/ButtonComp";
import Icon from "@/components/ui/Icon";
import usePutMutation from "@/hooks/usePutMuation";
import usePostMutation from "@/hooks/usePostMuation";
import UserDocuments from "./userDocuments";
import Dropdown from "@/components/ui/Dropdown";
import usePatchMutation from "@/hooks/usePatchMuation";

const FormValidationSchema = yup
  .object({
    vehicleno: yup.string().required("Vehicleno is required"),
    // lname: yup.string().required("Last name is required"),
    // phone: yup
    //   .string()
    //   .required("Phone number is required")
    //   .matches(/^[0-9]+$/, "Phone number must be only digits")
    //   .min(10, "Phone number must be at least 10 digits")
    //   .max(10, "Phone number can't be more than 15 digits"),
    // email: yup.string().email("Invalid email").required("Email is required"),
  })
  .required();

const adminTypes = [
  { value: "User", label: "User" },
  { value: "Postier", label: "Postier" },
];

const selectStyles = {
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const EditUser = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset, control
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
  });

  const [open, setOpen] = useState(false);
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");

  const { data, error, isLoading } = useQuery({
    queryKey: ["singleUserData", APICONSTANT.editVehicle + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id,
  });
  console.log("dataaa", data)

  // const makeid = data?.data?.Vehicle?.map((item) => ({
  //   value: item.makeid,
  //   label: item.makename,
  // }));

  // const servicetype = data?.data?.Vehicle?.map((item) => ({
  //   value: item.servicetype,
  //   label: item.servicetypename,
  // }));
  const makeid = data?.data?.Vehicle?.map(item => ({
    value: item.makeid,
    label: item.makename,
  })) || [];

  const servicetype = data?.data?.Vehicle?.map(item => ({
    value: item.servicetype,
    label: item.servicetypename,
  })) || [];

  const modelid = data?.data?.Vehicle?.map(item => ({
    value: item.model,
    label: item.modelname,
  })) || [];


  const [selectedMenus, setSelectedMenus] = useState([makeid[0]]);
  console.log("makeiddd", makeid, data)

  const Data = {
    color: data?.data?.Vehicle[0]?.color ? data?.data?.Vehicle[0]?.color : "",
    makedata: makeid[0]?.value,
    modeldata: modelid[0]?.value,
    servicetype: servicetype[0]?.value,
    vehicleno: data?.data?.Vehicle[0]?.registrationnumber
  };
  useEffect(() => {
    reset(Data);
  }, [data]);

  const usersStatus = usePatchMutation("/vehicle")
  const handleUpdateUsersStatus = async (status) => {
    try {
      console.log(status);
      const data = { status }
      await usersStatus.mutateAsync({
        url: { apiUrl: `${APICONSTANT.userStatus}/${id}` },
        body: data,
      })
    } catch (error) {
      console.error(error);
    }
  }

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleMenuChange = (value) => {
    setSelectedMenus(value);
  };

  const putMutation = usePutMutation("/vehicle");
  const passwordUpdateMutate = usePostMutation();
  const handlepassword = (data) => {
    passwordUpdateMutate.mutateAsync({
      url: { apiUrl: APICONSTANT.changePassword },
      body: {
        _id: id,
        password: data.password,
      },
    });
    setOpen(false);
  };
  const { data: servicedata } = useQuery({
    queryKey: ["Servicetype", APICONSTANT.viewServiceType],
    queryFn: getApiMethos,
    retry: 0,
  });
  console.log("servicedata", servicedata)

  const servicetypes = servicedata?.data?.admin?.map(item => ({
    value: item._id,
    label: item.name
  })) || [];

  const { data: makesdata } = useQuery({
    queryKey: ["ViewMakes", APICONSTANT.viewMakes],
    queryFn: getApiMethos,
    retry: 0,
  });
  const makestypes = makesdata?.data?.makes?.map(item => ({
    value: item._id,
    label: item.name
  })) || [];

  const { data: modlesdata } = useQuery({
    queryKey: ["ViewModles", APICONSTANT.viewModels],
    queryFn: getApiMethos,
    retry: 0,
  });
  console.log("modlesdata", modlesdata)
  const modeltypes = modlesdata?.data?.models?.map(item => ({
    value: item._id,
    label: item.name
  })) || [];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString(),
  }));

  const onSubmit = (data) => {
    // alert("l")
    console.log("data55", data)
    const value = {
      color: data?.color,
      makeid: data?.makedata,
      model: data?.modeldata,
      servicetype: data?.servicetype,
      registrationnumber: data?.vehicleno,
      year: data?.year
    };
    putMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.editVehicle + "/" + id },
      body: value,
    });
  };



  const statusOptions =
  {
    Pending: [
      {
        label: "Active",
        value: "Active",
        icon: "heroicons-solid:check-circle",
        onClick: () => handleUpdateUsersStatus("Active"),
      },
      {
        label: "Inactive",
        value: "Inactive",
        icon: "heroicons-solid:minus-circle",
        onClick: () => handleUpdateUsersStatus("Inactive"),
      },
      {
        label: "Blocked",
        value: "Blocked",
        icon: "heroicons-solid:ban",
        onClick: () => handleUpdateUsersStatus("Blocked"),
      },
    ],
    Active: [
      {
        label: "Inactive",
        value: "Inactive",
        icon: "heroicons-solid:minus-circle",
        onClick: () => handleUpdateUsersStatus("Inactive"),
      },
      {
        label: "Blocked",
        value: "Blocked",
        icon: "heroicons-solid:ban",
        onClick: () => handleUpdateUsersStatus("Blocked"),
      },
    ],
    Inactive: [
      {
        label: "Active",
        value: "Active",
        icon: "heroicons-solid:check-circle",
        onClick: () => handleUpdateUsersStatus("Active"),
      },
      {
        label: "Blocked",
        value: "Blocked",
        icon: "heroicons-solid:ban",
        onClick: () => handleUpdateUsersStatus("Blocked"),
      },
    ],
    Blocked: [
      {
        label: "Active",
        value: "Active",
        icon: "heroicons-solid:check-circle",
        onClick: () => handleUpdateUsersStatus("Active"),
      },
      {
        label: "Inactive",
        value: "Inactive",
        icon: "heroicons-solid:minus-circle",
        onClick: () => handleUpdateUsersStatus("Inactive"),
      },
    ]
  };

  const currentStatus = data?.data?.Vehicle[0]?.status || "Pending";
  console.log(data?.data?.Vehicle[0]?.status);

  const items = statusOptions[currentStatus] || [];



  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <>
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>Edit Vehicle</span>

            {/* <Dropdown
              label={
                <Icon
                  icon="heroicons-outline:dots-vertical"
                  className="w-[20px] h-[20px] ml-4 cursor-pointer"
                />
              }
              items={items}
              classItem="px-4 py-2"
              classMenuItems="mt-2 w-[160px]"
              wrapperClass="relative"
            /> */}
          </div>
        }

        footer={<Button formId="editUserForm" />}
        backIcon={true}
      >
        {isLoading ? (
          <Loading />
        ) : (
          <form
            id={"editUserForm"}
            onSubmit={handleSubmit(onSubmit)}
            className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
          >
            <Textinput
              label="Vehicle No / License Plate No"
              type="text"
              placeholder="Vehicle No / License Plate No"
              name="vehicleno"
              register={register}
              error={errors.vehicleno}
            />

            <div className='md:w-[48%] mb-4'>
              <label className="form-label">Make Name</label>
              <Controller
                name="makedata"
                control={control}
                render={({ field }) => (

                  <Select
                    {...field}
                    options={makestypes}
                    onChange={(option) => setValue("maketype", option.value)}
                    value={makestypes.find(option => option.value === field.value)}
                    styles={selectStyles}
                    className="react-select"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.makedata && (
                <p className="error mt-2 text-danger-500 block text-sm">
                  {errors.makedata.message}
                </p>
              )}
            </div>

            <div className='md:w-[48%] mb-4'>
              <label className="form-label">Model Name</label>
              <Controller
                name="modeldata"
                control={control}
                render={({ field }) => (

                  <Select
                    {...field}
                    options={modeltypes}
                    onChange={(option) => setValue("modeldata", option.value)}
                    value={modeltypes.find(option => option.value === field.value)}
                    styles={selectStyles}
                    className="react-select"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.modeldata && (
                <p className="error mt-2 text-danger-500 block text-sm">
                  {errors.modeldata.message}
                </p>
              )}
            </div>

            <div className='md:w-[48%] mb-4'>
              <label className="form-label">Service Type</label>
              <Controller
                name="servicetype"
                control={control}
                render={({ field }) => (

                  <Select
                    {...field}
                    options={servicetypes}
                    onChange={(option) => setValue("servicetype", option.value)}
                    value={servicetypes.find(option => option.value === field.value)}
                    styles={selectStyles}
                    className="react-select"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.servicetype && (
                <p className="error mt-2 text-danger-500 block text-sm">
                  {errors.servicetype.message}
                </p>
              )}
            </div>
            <Textinput
              label="Color"
              type="text"
              placeholder="Color"
              name="color"
              register={register}
              error={errors.color}
            />
            <div className='md:w-[48%] mb-4'>
              <label className="form-label">Year</label>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={yearOptions}
                    onChange={(option) => setValue("year", option.value)}
                    value={yearOptions.find(option => option.value === field.value)}
                    styles={selectStyles}
                    className="react-select"
                    classNamePrefix="select"
                  />
                )}
              />
              {errors.year && (
                <p className="error mt-2 text-danger-500 block text-sm">
                  {errors.year.message}
                </p>
              )}
            </div>


          </form>
        )}

      </Card>
      <UserDocuments userId={id} apidata={data} />
    </>
  );
};

export default EditUser;
