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
    })
    .required();

const ForgotForm = () => {
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
            navigate("/login");
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
            url: { apiUrl: APICONSTANT.forgotPassword },
            body: { email: data.email, verifyFrom: "FORGETPASSWORD", verifyBy: "email", userType: "ADMIN" },
        });
        console.log("bodydata", data)

        //   dispatch(handleLogin(true));
        //   setTimeout(() => {
        //     navigate("/login");
        //   }, 1500);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <Cryptodeviceid />
            <Textinput
                name="email"
                label="email"
                // defaultValue={users[0].email}
                type="email"
                register={register}
                error={errors.email}
                className="h-[48px]"
                rules={{ required: true }}
                onChange={(e) => {
                    setValue("email", e.target.value, { shouldValidate: true });
                }}
            />


            <div className="flex justify-end">

                <Link
                    to="/login"
                    className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
                >
                    Sign in
                </Link>
            </div>

            <button className="btn btn-dark block w-full text-center">Submit</button>
        </form>
    );
};

export default ForgotForm;
