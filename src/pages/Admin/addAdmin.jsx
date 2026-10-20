import React, { useState } from "react";
import { Fileinput, Textinput } from "@components/ui/input/index";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { APICONSTANT } from "@components/services/config";
import Card from "@components/ui/Card";
import usePostMutation from "@/hooks/usePostMuation";
import { Button } from "@components/ui/ButtonComp";
import { useQuery } from "@tanstack/react-query";
import { getApiMethos } from "@/components/services/gobal";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import PhoneInputComponent from "@/components/PhoneInput";

const FormValidationSchema = yup
  .object({
    Firstname: yup.string().required("First name is required"),
    Lastname: yup.string().required("Last name is required"),
    Number: yup
      .number()
      .required("Phone number is required")
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .typeError("Please enter a valid number")
      .positive(),
    phoneCode: yup
      .number()
      .required("Phone code is required")
      .transform((value, originalValue) =>
        originalValue === "" ? undefined : value,
      )
      .typeError("Please enter a valid number")
      .positive(),
    Email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required").min(8),
  })
  .required();

const adminTypes = [
  { value: "Admin", label: "Admin" },
  { value: "Super Admin", label: "Super Admin" },
  { value: "Billing Admin", label: "Billing Admin" },
  { value: "Dispatcher Admin", label: "Dispatcher Admin" },
];

const adminMenus = [
  { value: "Dashboard", label: "Dashboard" },
  { value: "Admin", label: "Admin" },
  { value: "User", label: "User" },
  { value: "Approval List", label: "Approval List" },
  { value: "Company", label: "Company" },
  { value: "Trips", label: "Trips" },
  { value: "Reviews", label: "Reviews" },
  { value: "Report", label: "Report" },
  { value: "Offers", label: "Offers" },
  { value: "Lost Management", label: "Lost Management" },
  { value: "Utility", label: "Utility" },
  { value: "Static Pages", label: "Static Pages" },
  { value: "Settings", label: "Settings" },
];

const selectStyles = {
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const ValidationTypes = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMenus, setSelectedMenus] = useState([
    adminMenus[0],
    adminMenus[1],
  ]);
  const [phone, setPhone] = useState("");

  const postMutation = usePostMutation("/admin");

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    control,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleMenuChange = (value) => {
    setSelectedMenus(value);
  };
  const { data: admingroup } = useQuery({
    queryKey: ["admingroup", APICONSTANT.viewAdminGroup],
    queryFn: getApiMethos,
    retry: 0,
  });
  console.log("admingroup", admingroup);
  const admingrouptype =
    admingroup?.data?.adminGroup?.map((item) => ({
      value: item._id,
      label: item.group,
    })) || [];

  const onSubmit = (data) => {
    console.log("gropuuu", data);
    const formData = new FormData();
    formData.append("fname", data?.Firstname?.trim());
    formData.append("lname", data?.Lastname?.trim());
    formData.append("email", data?.Email);
    formData.append("phone", data?.Number?.toString());
    formData.append("phoneCode", "91");
    formData.append("password", data?.password);
    formData.append("file", selectedFile);
    formData.append("group", data?.group);

    postMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.addAdmin },
      body: formData,
    });
  };

  return (
    <Card
      title={"Add Admin"}
      footer={<Button formId="addadminForm" />}
      backIcon={true}
    >
      <form
        id="addadminForm"
        onSubmit={handleSubmit(onSubmit)}
        className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
      >
        <Textinput
          label="First Name"
          type="text"
          autoFocus
          placeholder="Type your First Name"
          name="Firstname"
          register={register}
          error={errors.Firstname}
        />
        <Textinput
          label="Last Name"
          type="text"
          placeholder="Type your Last Name"
          name="Lastname"
          register={register}
          error={errors.Lastname}
        />
        <Textinput
          label="Email"
          type="email"
          placeholder="Email"
          name="Email"
          register={register}
          error={errors.Email}
        />
        {/* <PhoneInput
          country={"us"}
          value={phone}
          onChange={(phone) => setPhone(phone)}
          inputStyle={{ width: "300px" }}
        /> */}

        <div className="w-full flex flex-col gap-2">
          <Controller
            name="Number"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <>
                  <label className={`block capitalize}`}>Phone Number</label>
                  <PhoneInputComponent
                    {...field}
                    country={"us"}
                    errors={!!error}
                    onPhoneChange={(number, code, isValid) => {
                      setValue("Number", code + number);
                      setValue("phoneCode", code);
                      if (!isValid) {
                        setError("Number", {
                          type: "manual",
                          message: "Invalid phone number for selected country",
                        });
                      } else {
                        clearErrors("Number");
                      }
                    }}
                    inputId="consigneePhoneInput"
                    labelId="consigneePhone-label"
                  />
                </>
              );
            }}
          />
          {/* {errors.Number && (
            <span className="text-red-700">{errors?.Number?.message}</span>
          )} */}
          {errors?.Number && (
            <div className={` mt-2 ${" text-danger-500 block text-sm"}`}>
              {errors?.Number?.message}
            </div>
          )}
        </div>
        {/* <Textinput
          label="Phone Number"
          type="text"
          placeholder="Phone Number"
          name="Number"
          register={register}
          error={errors.Number}
        /> */}
        <Textinput
          label="Password"
          type="password"
          placeholder="8+ characters, 1 Capital letter"
          name="password"
          hasicon
          register={register}
          error={errors.password}
        />
        {/* <div>
          <label className="form-label">Admin Type</label>
          <Select
            defaultValue={adminTypes[0]}
            options={adminTypes}
            styles={selectStyles}
            className="react-select"
            classNamePrefix="select"
          />
        </div> */}
        {/* <div>
          <label className="form-label">Admin Menu</label>
          <Select
            isMulti
            value={selectedMenus}
            styles={selectStyles}
            options={adminMenus}
            className="react-select"
            classNamePrefix="select"
            onChange={handleMenuChange}
          />
        </div> */}

        <div className="md:w-[100%] mb-4">
          <label className="form-label">Admin Type</label>
          <Controller
            name="group"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={admingrouptype}
                onChange={(option) => setValue("group", option.value)}
                value={admingrouptype.find(
                  (option) => option.value === field.value,
                )}
                styles={selectStyles}
                className="react-select"
                classNamePrefix="select"
              />
            )}
          />
          {errors.faretype && (
            <p className="error mt-2 text-danger-500 block text-sm">
              {errors.faretype.message}
            </p>
          )}
        </div>

        <div>
          <label className="form-label">Profile</label>
          <Fileinput
            name="basic"
            selectedFile={selectedFile}
            preview
            onChange={handleFileChange}
          />
        </div>
      </form>
    </Card>
  );
};

export default ValidationTypes;
