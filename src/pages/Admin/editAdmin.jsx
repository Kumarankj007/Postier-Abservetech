import React, { useEffect, useState } from "react";
import { Textinput, Fileinput } from "@components/ui/input";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, QueryClient, useQuery } from "@tanstack/react-query";
import { postApiMethod, putApiMethod } from "../../components/services/gobal";
import { APICONSTANT } from "../../components/services/config";
import { getApiMethos } from "../../components/services/gobal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import { Routes } from "@routesConfig";
import useReactMutation from "@/hooks/useReactMutation";
import usePutMutation from "@/hooks/usePutMuation";
import { Button } from "@/components/ui/ButtonComp";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const FormValidationSchema = yup
  .object({
    fname: yup.string().required("First name is required"),
    lname: yup.string().required("Last name is required"),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must be only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number can't be more than 15 digits"),
    email: yup.string().email("Invalid email").required("Email is required"),
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

const EditAdmin = () => {
  const location = useLocation();
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [dialCode, setDialCode] = useState("");
  const search = new URLSearchParams(location.search);
  const id = search.get("id");
  const navigate = useNavigate();
  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMenus, setSelectedMenus] = useState([
    adminMenus[0],
    adminMenus[1],
  ]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["singleAdminData", APICONSTANT.getAdmin + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id, // Ensures the query runs only if `id` is truthy
  });
  const { data: admingroup } = useQuery({
    queryKey: ["admingroup", APICONSTANT.viewAdminGroup],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id, // Ensures the query runs only if `id` is truthy
  });

  const admingrouptype =
    admingroup?.data?.adminGroup?.map((item) => ({
      value: item._id,
      label: item.group,
    })) || [];

  const getapigrouptype =
    data?.data?.admin?.map((item) => ({
      value: item?.group?._id,
      label: item?.group?.group,
    })) || [];

  console.log("getapigrouptype", getapigrouptype);

  const editData = {
    fname: data?.data?.admin[0]?.fname ? data?.data?.admin[0]?.fname : "",
    lname: data?.data?.admin[0]?.lname ? data?.data?.admin[0]?.lname : "",
    phone: data?.data?.admin[0]?.phone ? data?.data?.admin[0]?.phone : "",
    email: data?.data?.admin[0]?.email ? data?.data?.admin[0]?.email : "",
    group: getapigrouptype[0]?.value,
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleMenuChange = (value) => setSelectedMenus(value);

  const putMutation = usePutMutation("/admin");

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("fname", data.fname);
    formData.append("lname", data.lname);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("country", data.phonecode);
    formData.append("userId", id);
    formData.append("file", selectedFile);
    formData.append("group", data.group);
    putMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.editAdmin },
      body: formData,
    });
  };

  useEffect(() => {
    if (data?.data?.admin?.[0]) {
      const user = data.data.admin[0];
      const phoneValue = `+${user.phoneCode}${user.phone}`;

      reset({
        fname: user.fname || "",
        lname: user.lname || "",
        email: user.email || "",
        phone: phoneValue,
        group: user.group?._id || "",
      });
    }
  }, [data]);

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <Card
      title={"Edit Admin"}
      footer={<Button formId="editadminForm" />}
      backIcon={true}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <form
          id={"editadminForm"}
          onSubmit={handleSubmit(onSubmit)}
          // className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
          className="flex justify-between flex-wrap"
        >
          <div className="md:w-[48%] mb-4">
            <Textinput
              label="First Name"
              type="text"
              placeholder="Type your User Name"
              name="fname"
              register={register}
              error={errors.fname}
            />
          </div>
          <div className="md:w-[48%] mb-4">
            <Textinput
              label="Last Name"
              type="text"
              placeholder="Type your User Name"
              name="lname"
              register={register}
              error={errors.lname}
            />
          </div>
          <div className="md:w-[48%] mb-4">
            <Textinput
              label="Email"
              type="email"
              placeholder="Email"
              name="email"
              register={register}
              error={errors.email}
            />
          </div>
          <div className="md:w-[48%] mt-8">
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  {...field}
                  country={"in"} // or dynamically: getCountryCodeByPhoneCode(user.phoneCode)
                  value={field.value}
                  onChange={field.onChange}
                  inputStyle={{ width: "100%" }}
                />
              )}
            />
          </div>
          <div className="md:w-[48%] mb-4">
            <Textinput
              label="Phone Number"
              type="text"
              placeholder="Phone Number"
              name="phone"
              register={register}
              error={errors.phone}
            />
          </div>

          <div className="md:w-[100%] mb-4">
            <label className="form-label">Admin Type</label>
            <Controller
              name="group"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={admingrouptype}
                  onChange={(option) => field.onChange(option.value)} // use field.onChange
                  value={admingrouptype.find(
                    (option) => option.value === field.value
                  )}
                  styles={selectStyles}
                  className="react-select"
                  classNamePrefix="select"
                />
              )}
            />

            {errors.group && (
              <p className="error mt-2 text-danger-500 block text-sm">
                {errors.group.message}
              </p>
            )}
          </div>
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
          <div className="w-[48%]">
            <label className="form-label">Profile</label>
            <Fileinput
              name="profile"
              selectedFile={selectedFile}
              onChange={handleFileChange}
              preview
            />
          </div>
        </form>
      )}
    </Card>
  );
};

export default EditAdmin;
