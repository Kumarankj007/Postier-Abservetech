import React, { useEffect, useMemo, useState } from "react";
import { Textinput } from "@components/ui/input";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { postApiMethod } from "@components/services/gobal";
import { APICONSTANT } from "@components/services/config";
import { getApiMethos } from "@components/services/gobal";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "@components/Loading";
import { toast } from "react-toastify";
import Modal from "@components/ui/Modal";
import Card from "@/components/ui/Card";
import { Button } from "@components/ui/ButtonComp";
import usePutMutation from "@/hooks/usePutMuation";
import usePostMutation from "@/hooks/usePostMuation";
import DatePickerComponent from "@/components/ui/input/DatePicker";
import Image from "@/components/ui/Image";
import Fileinput from "@/components/ui/Fileinput";
import ParcelDetails from "./parcelcomp";
import SenderDetails from "./sendercomp";
import ReceiverDetails from "./receivercomp";

const FormValidationSchema = yup
  .object({
    fname: yup.string().required("First name is required"),
    type: yup.string().required("Last name is required"),
    description: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]+$/, "Phone number must be only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number can't be more than 15 digits"),
    email: yup.string().email("Invalid email").required("Email is required"),
  })
  .required();


const EditPost = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");
  const { data, error, isLoading } = useQuery({
    queryKey: ["singlepostdata", APICONSTANT.getPost + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id, // Ensures the query runs only if `id` is truthy
  });

  const navigate = useNavigate();

  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
  });

  const [selectedMenus, setSelectedMenus] = useState(0);
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

  const putMutation = usePutMutation("/post");

  const onSubmit = (data) => {
    const value = {
      fname: data.fname,
      type: data.type,
      email: data.email,
      description: data.description,
      postId: id,
    };
    putMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.editpost },
      body: value,
    });
  };

  // const password = useMutation({
  //   mutationFn: postApiMethod,
  //   onSuccess: (data) => {
  //     setOpen(false);
  //     toast.success(data.message);
  //     setValue("password", "");
  //   },
  //   onError: (err) => {
  //     console.log("err", err);
  //     toast.error(err.message);
  //   },
  // });
  console.log('selectedMenus', selectedMenus)
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
    <Card title={'View Post'} backIcon={true}>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-[40px]">
          <Card title={"Parcel Details"}>
            <ParcelDetails data={data} />
          </Card>

          <Card title={"User Details"}>
            <SenderDetails data={data} />
          </Card>

          {/* <Card title={"Receiver Details"}>
            <ReceiverDetails data={data} />
          </Card> */}
        </div>
      )}
    </Card>
  );
};

export default EditPost;
