import React, { useState } from "react";
import { Textinput } from "@components/ui/input/index";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getApiMethos, postApiMethod } from "@components/services/gobal";
import { APICONSTANT } from "@components/services/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@components/ui/Card";
import { Button } from "@components/ui/ButtonComp";
import usePostMutation from "@/hooks/usePostMuation";

const FormValidationSchema = yup
  .object({
    vehicleno: yup.string().required("Vehicle No is required"),
    // makedata: yup.string().required("Make Data is required"),
    servicetype: yup.string().required("Service Type is required"),
    color: yup.string().required("Color is required"),
    year: yup.string().required("Year is required"),
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

const AddVehicle = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue, control
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const [selectedMenus, setSelectedMenus] = useState([adminTypes[0]]);
  const handleMenuChange = (value) => {
    setSelectedMenus(value);
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

  const postMutation = usePostMutation("/vehicle");



  const onSubmit = (data) => {
    console.log("dataa", data)
    const payload = {
      url: { apiUrl: APICONSTANT.addVehicle },
      body: {
        registrationnumber: data.vehicleno,
        makeid: data.maketype,
        model: data.modeldata,
        year: data.year,
        color: data.color,
        servicetype: data.servicetype,
      },
    };

    console.log('Submitting payload:', payload);

    postMutation.mutateAsync(payload)
      .then(response => {
        console.log('Response:', response);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <Card
      title={"Add Vehicle"}
      footer={<Button formId="addVehicleForm" />}
      backIcon={true}
    >
      <form
        id={"addVehicleForm"}
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
    </Card>
  );
};

export default AddVehicle;
