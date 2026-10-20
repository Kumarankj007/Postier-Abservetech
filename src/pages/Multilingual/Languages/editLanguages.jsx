import React, { useEffect, useState } from "react";
import { Textinput, Fileinput } from "@components/ui/input";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, QueryClient, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import { Routes } from "@routesConfig";
import useReactMutation from "@/hooks/useReactMutation";
import usePutMutation from "@/hooks/usePutMuation";
import { Button } from "@/components/ui/ButtonComp";
import { APICONSTANT } from "@/components/services/config";
import { getApiMethos } from "@/components/services/gobal";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const FormValidationSchema = yup.object({
  name: yup.string().required("Name is required"),
  indexName: yup.string().required("Index Name is required"),
  file: yup.string().required("File is required"),
  status: yup.string().required("Status is required"),
});

const EditLanguages = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");
  console.log(id, "id");
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
  console.log("setvalueee", setValue);

  const [selectedFile, setSelectedFile] = useState(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ["singlePricing", APICONSTANT.viewLanguages + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id,
  });
  console.log("viewLanguages", data);
  const languagestatus =
    data?.data?.language?.map((item) => ({
      value: item?.group?._id,
      label: item?.group?.group,
    })) || [];

  const editData = {
    name: data?.data?.language[0]?.name,
    indexName: data?.data?.language[0]?.indexName,
    file: data?.data?.language[0]?.file,
    status: languagestatus[0]?.value,
  };
  useEffect(() => {
    reset(editData);
  }, [data]);

  const putMutation = usePutMutation("/Languages");

  const onSubmit = (data) => {
    console.log("onSubmitdata", data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("indexName", data.indexName);
    formData.append("file", data.file);
    formData.append("status", data.status);
    console.log("formData", formData);

    putMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.viewLanguages + "/" + id },
      body: formData,
    });
  };

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <Card
      title={"Edit Languages"}
      footer={<Button formId="editlanguagesForm" />}
      backIcon={true}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <form
          id={"editlanguagesForm"}
          onSubmit={handleSubmit(onSubmit)}
          // className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
          className="flex justify-between flex-wrap"
        >
          <div className="md:w-[48%] mr-2 mb-4">
            <Textinput
              label="Name"
              type="text"
              placeholder="Type Name"
              name="name"
              register={register}
              error={errors.name}
            />
          </div>
          <div className="md:w-[48%]">
            <Textinput
              label="Index Name"
              type="indexName"
              placeholder="Type Index Name"
              name="indexName"
              register={register}
              error={errors.indexName}
            />
          </div>
          <div className="md:w-[48%] mr-2 mb-4">
            <Textinput
              label="File"
              type="file"
              placeholder="Type File"
              name="file"
              register={register}
              error={errors.file}
            />
          </div>
          <div className="md:w-[48%] flex items-center mt-[40px]">
            <label className="mb-5 mr-5">Status</label>
            <ToggleSwitch
              name={`status`}
              register={register}
              defaultChecked={data?.data?.language[0].status}
              className="mb-0"
            />
          </div>
        </form>
      )}
    </Card>
  );
};

export default EditLanguages;
