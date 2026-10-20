import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
// import Textinput from "../helper/input";
import Fileinput from "@/components/ui/Fileinput";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
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
    modelname: yup.string().required("name is required"),
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
  const [makesdata, setMakesData] = useState(null);
  const id = search.get("id");
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset, control
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ["SingleCountryList", APICONSTANT.viewModels + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id,
  });

  const { data: makes } = useQuery({
    queryKey: ["ViewMakes", APICONSTANT.viewMakes],
    queryFn: getApiMethos,
    retry: 0,
  });


  const putMutation = usePutMutation("/models");

  const onSubmit = (data) => {

    putMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.viewModels + "/" + id },
      body: {
        name: data.modelname,
        year: data.modelyear,
        make_id: data.makename
      },
    });
  };


  const makesData = makes?.data?.makes?.map(item => ({
    value: item._id,
    label: item.name
  })) || [];

  const singlemodelData = data?.data?.models?.map(item => ({
    value: item.make_id,
    label: item.name
  })) || [];


  console.log("makesData1", makesData)
  console.log("singlemodelData", singlemodelData)


  const editData = {
    modelname: data?.data?.models[0]?.name ? data?.data?.models[0].name : "",
    makename: singlemodelData[0]?.value,
    modelyear: data?.data?.models[0]?.year ? data?.data?.models[0].year : "",

  };

  useEffect(() => {
    reset(editData);
  }, [data]);

  return (
    <Card
      title={"Edit Makes"}
      footer={<Button formId="editModelsForm" />}
      backIcon={true}
    >
      <form
        id={"editModelsForm"}
        onSubmit={handleSubmit(onSubmit)}
        className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
      >
        {/* <div>
          <label className="form-label">Make Name</label>
          <Select
            options={makesData}
            label={"Make Name"}
            name="makename"
            className="react-select"
            classNamePrefix="select"
            value={makesdata}
            onChange={(e) => {
              setMakesData(e);
            }}
          />
        </div> */}

        <div className='md:w-[48%] mb-4'>
          <label className="form-label">Make Name</label>
          <Controller
            name="makename"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={makesData}
                onChange={(option) => setValue("makename", option.value)}
                value={makesData.find(option => option.value === field.value)}
                styles={selectStyles}
                className="react-select"
                classNamePrefix="select"
              />
            )}
          />
          {errors.makename && <p className="error mt-2 text-danger-500 block text-sm">{errors.makename.message}</p>}
        </div>

        <Textinput
          label="Model Name"
          type="text"
          placeholder="Type Model Name"
          name="modelname"
          register={register}
          error={errors.modelname}
        />
        <Textinput
          label="Model Year"
          type="text"
          placeholder="Type Model Year"
          name="modelyear"
          register={register}
          error={errors.modelyear}
        />

      </form>
    </Card>
  );
};

export default ValidationTypes;
