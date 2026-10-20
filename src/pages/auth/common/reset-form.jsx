import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { handleLogin } from "./store";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { APICONSTANT } from "../../../components/services/config";
import { postApiMethod, setToken } from "../../../components/services/gobal";
import { addAlert } from "./alert";
import { handleDarkMode } from "../../../store/layout";
import Cryptodeviceid from "./crypto";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const ResetForm = () => {
  const dispatch = useDispatch();
  //   const { users } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    //
    mode: "all",
  });
  const navigate = useNavigate();

  // Mutations
  const mutation = useMutation({
    mutationFn: postApiMethod,
    onSuccess: (data) => {
      toast.success(data.data.message);
      dispatch(handleLogin(true));
      navigate("/dashboard");
      //   dispatch(addAlert(data.message));
      // console.log("tokenn", data.data.token);
      setToken(data.data.token);
    },

    onError: (error) => {
      toast.error(error.message);
      console.log("Error posting data:", error);
    },
  });

  const onSubmit = (data) => {
    // dispatch(handleDarkMode(true));
    mutation.mutateAsync({
      url: { apiUrl: APICONSTANT.login },
      body: { oldpassword: data.oldpassword },
    });

    //   dispatch(handleLogin(true));
    //   setTimeout(() => {
    //     navigate("/dashboard");
    //   }, 1500);
  };

  const [checked, setChecked] = useState(false);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
      <Cryptodeviceid />


      <Textinput
        name="oldpassword"
        label="Old Password"
        type="password"
        value={formData.password}
        onChange={(e) => {
          setValue("oldpassword", e.target.value, { shouldValidate: true });
        }}
        register={register}
        error={errors.oldpassword}
        className="h-[48px]"
        rules={{ required: true }}
        hasicon
      />

      <Textinput
        name="newpassword"
        label="New Password"
        type="password"
        value={formData.password}
        onChange={(e) => {
          setValue("newpassword", e.target.value, { shouldValidate: true });
        }}
        register={register}
        error={errors.newpassword}
        className="h-[48px]"
        rules={{ required: true }}
        hasicon
      />

      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          to="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link>
      </div>

      <button className="btn btn-dark block w-full text-center">Reset Password</button>
    </form>
  );
};

export default ResetForm;
