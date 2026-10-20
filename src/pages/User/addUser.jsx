import React, { useState } from "react";
import { Textinput } from "@components/ui/input/index";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { postApiMethod } from "@components/services/gobal";
import { APICONSTANT } from "@components/services/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@components/ui/Card";
import { Button } from "@components/ui/ButtonComp";
import usePostMutation from "@/hooks/usePostMuation";

const FormValidationSchema = yup
  .object({
    Firstname: yup.string().required("First name is required"),
    Lastname: yup.string().required("Last name is required"),
    Number: yup.number().required("Phone number is required").positive(),
    Email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required").min(8),
    confirmPassword: yup.string().required("Incorrect confirmPassword").min(8),
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

const AddUser = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const [selectedMenus, setSelectedMenus] = useState([adminTypes[0]]);
  const handleMenuChange = (value) => {
    setSelectedMenus(value);
  };

  const postMutation = usePostMutation("/user");

  const onSubmit = (data) => {
    postMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.addUser },
      body: {
        fname: data.Firstname,
        lname: data.Lastname,
        email: data.Email,
        phone: data.Number.toString(),
        phoneCode: "+91",
        password: data.password,
        confirmPassword: data.confirmPassword,
        type: "User",
      },
    });
  };

  return (
    <Card
      title={"Add User"}
      footer={<Button formId="addUserForm" />}
      backIcon={true}
    >
      <form
        id={"addUserForm"}
        onSubmit={handleSubmit(onSubmit)}
        className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
      >
        <Textinput
          label="First Name"
          type="text"
          placeholder="Type your User Name"
          name="Firstname"
          register={register}
          error={errors.Firstname}
        />
        <Textinput
          label="Last Name"
          type="text"
          placeholder="Type your User Name"
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
        <Textinput
          label="Phone Number"
          type="text"
          placeholder="Phone Number"
          name="Number"
          register={register}
          error={errors.Number}
        />
        <Textinput
          label="Password"
          type="password"
          placeholder="8+ characters, 1 Capital letter"
          name="password"
          register={register}
          error={errors.password}
        />
        <Textinput
          label="ConfirmPassword"
          type="confirmPassword"
          placeholder="Re-enter password"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
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
      </form>
    </Card>
  );
};

export default AddUser;
