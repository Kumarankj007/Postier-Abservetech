import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
// import Textinput from "../helper/input";
import Fileinput from "@/components/ui/Fileinput";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, QueryClient, useQuery } from "@tanstack/react-query";
import { postApiMethod } from "../../components/services/gobal";
import { APICONSTANT } from "../../components/services/config";
import { getApiMethos } from "../../components/services/gobal";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import useReactMutation from "@/hooks/useReactMutation";
import usePostMutation from "@/hooks/usePostMuation";
import { Button } from "@/components/ui/ButtonComp";

const FormValidationSchema = yup
  .object({
    name: yup.string().required("name is required"),
    code: yup.string().required("code is required"),
    phonecode: yup.string().required("phonecode is required"),
  })
  .required();

const selectStyles = {
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const ValidationTypes = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const postMutation = usePostMutation("/country");

  const onSubmit = (data) => {
    postMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.addCountry },
      body: {
        name: data.name,
        code: data.code,
        phonecode: data.phonecode,
      },
    });
  };

  return (
    <Card
      title={"Add Country"}
      footer={<Button formId="addCountryForm" />}
      backIcon={true}
    >
      <form
        id={"addCountryForm"}
        onSubmit={handleSubmit(onSubmit)}
        className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
      >
        <Textinput
          label="Name"
          type="text"
          placeholder="Type Country Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <Textinput
          label="Code"
          type="text"
          placeholder="Type Country Code"
          name="code"
          register={register}
          error={errors.code}
        />
        <Textinput
          label="Phone Code"
          type="text"
          placeholder="Type Country Phonecode"
          name="phonecode"
          register={register}
          error={errors.phonecode}
        />
      </form>
    </Card>
  );
};

export default ValidationTypes;
