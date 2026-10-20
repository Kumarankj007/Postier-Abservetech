import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
// import Textinput from "../helper/input";
import Fileinput from "@/components/ui/Fileinput";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const search = new URLSearchParams(location.search);
  const id = search.get("id");
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
  const { data, error, isLoading } = useQuery({
    queryKey: ["SingleCountryList", APICONSTANT.viewMakes + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id, // Ensures the query runs only if `id` is truthy
  });

  console.log("makesdata", data?.data?.makes[0]?.name)

  const editData = {
    name: data?.data?.makes[0]?.name ? data?.data?.makes[0].name : "",

  };
  useEffect(() => {
    reset(editData);
  }, [data]);



  const putMutation = usePutMutation("/makes");

  const onSubmit = (data) => {
    putMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.viewMakes + "/" + id },
      body: {
        name: data.name,
      },
    });
  };

  return (
    <Card
      title={"Edit Makes"}
      footer={<Button formId="editMakesForm" />}
      backIcon={true}
    >
      <form
        id={"editMakesForm"}
        onSubmit={handleSubmit(onSubmit)}
        className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
      >
        <Textinput
          label="Name"
          type="text"
          placeholder="Type Name"
          name="name"
          register={register}
          error={errors.name}
        />

      </form>
    </Card>
  );
};

export default ValidationTypes;
