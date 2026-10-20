import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
// import Textinput from "../helper/input";
import Fileinput from "@/components/ui/Fileinput";
import Select from "react-select";
import { useForm } from "react-hook-form";
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
import usePutMutation from "@/hooks/usePutMuation";
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
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");
  const { data, error, isLoading } = useQuery({
    queryKey: ["SingleCountryList", APICONSTANT.viewCountry + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id, // Ensures the query runs only if `id` is truthy
  });

  const editData = {
    name: data?.data?.countries[0]?.name ? data?.data?.countries[0].name : "",
    code: data?.data?.countries[0]?.code ? data?.data?.countries[0].code : "",
    phonecode: data?.data?.countries[0]?.phonecode
      ? data?.data?.countries[0].phonecode
      : "",
  };
  useEffect(() => {
    reset(editData);
  }, [data]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const putMutation = usePutMutation("/country");

  const onSubmit = (data) => {
    putMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.addCountry + "/" + id },
      body: {
        name: data.name,
        code: data.code,
        phonecode: data.phonecode,
      },
    });
  };

  return (
    <Card
      title={"Edit Country"}
      footer={<Button formId="editCountryForm" />}
      backIcon={true}
    >
      <form
        id={"editCountryForm"}
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
