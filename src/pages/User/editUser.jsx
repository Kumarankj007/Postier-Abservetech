import React, { useEffect, useState } from "react";
import { Textinput } from "@components/ui/input";
import Select from "react-select";
import { useForm } from "react-hook-form";
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
  const [phone, setPhone] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
  });
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");
  const { data, error, isLoading } = useQuery({
    queryKey: ["singleUserData", APICONSTANT.getUser + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id, // Ensures the query runs only if `id` is truthy
  });

  const navigate = useNavigate();

  const usersStatus = usePatchMutation("/user");
  const handleUpdateUsersStatus = async (status) => {
    try {
      console.log(status);
      const data = { status };
      await usersStatus.mutateAsync({
        url: { apiUrl: `${APICONSTANT.userStatus}/${id}` },
        body: data,
      });
    } catch (error) {
      console.error(error);
    }
  };
  const changePasswordOption = {
    label: "Change Password",
    value: "ChangePassword",
    icon: "heroicons-solid:lock-closed",
    onClick: () => handleOpen(),
  };
  const statusOptions = {
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
      changePasswordOption,
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
      changePasswordOption,
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
      changePasswordOption,
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
      changePasswordOption,
    ],
  };

  const currentStatus = data?.data?.user[0]?.status || "Pending";
  console.log(data?.data?.user[0]?.status);

  const items = statusOptions[currentStatus] || [];

  const Data = {
    fname: data?.data?.user[0]?.fname ? data?.data?.user[0]?.fname : "",
    lname: data?.data?.user[0]?.lname ? data?.data?.user[0]?.lname : "",
    phone: data?.data?.user[0]?.phone ? data?.data?.user[0]?.phone : "",
    email: data?.data?.user[0]?.email ? data?.data?.user[0]?.email : "",
  };

  useEffect(() => {
    reset(Data);
  }, [data]);

  const [selectedMenus, setSelectedMenus] = useState([adminTypes[0]]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleMenuChange = (value) => {
    setSelectedMenus(value);
  };

  const putMutation = usePutMutation("/user");

  const onSubmit = (data) => {
    const value = {
      fname: data.fname,
      lname: data.lname,
      email: data.email,
      phone: data.phone,
      userId: id,
    };
    putMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.editUser },
      body: value,
    });
  };

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
            <span>Edit User</span>

            <Dropdown
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
            />
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
              label="First Name"
              type="text"
              placeholder="Type your User Name"
              name="fname"
              register={register}
              error={errors.fname}
            />
            <Textinput
              label="Last Name"
              type="text"
              placeholder="Type your User Name"
              name="lname"
              register={register}
              error={errors.lname}
            />
            <Textinput
              label="Email"
              type="email"
              placeholder="Email"
              name="email"
              register={register}
              error={errors.email}
            />
            <PhoneInput
              country={"us"}
              value={phone}
              onChange={(phone) => setPhone(phone)}
              inputStyle={{ width: "300px" }}
            />
            <Textinput
              label="Phone Number"
              type="text"
              placeholder="Phone Number"
              name="phone"
              register={register}
              error={errors.phone}
            />
            <div>
              <label className="form-label">Type</label>
              <Select
                defaultValue={selectedMenus}
                options={adminTypes}
                styles={selectStyles}
                className="react-select"
                classNamePrefix="select"
                onChange={handleMenuChange}
              />
            </div>
            {/* <div className="lg:col-span-2 col-span-1">
              <div
                onClick={handleOpen}
                className="btn btn-dark justify-center h-[38px] w-[300px] flex items-center cursor-pointer mt-[30px]"
              >
                Change Password
              </div>
            </div> */}
          </form>
        )}
        <Modal
          title="Change Password"
          labelclassName="btn-outline-dark"
          activeModal={open}
          onClose={handleClose}
        >
          <form onSubmit={handleSubmit(handlepassword)} className="space-y-4">
            <Textinput
              label="Password"
              type="password"
              placeholder="8+ characters"
              name="password"
              register={register}
              error={errors.password}
              setValue={setValue}
            />
            <div className="lg:col-span-2 col-span-1">
              <div className="ltr:text-right rtl:text-left">
                <button type="submit" className="btn btn-dark text-center">
                  Update
                </button>
              </div>
            </div>
          </form>
        </Modal>
      </Card>
      <UserDocuments userId={id} />
    </>
  );
};

export default EditUser;
