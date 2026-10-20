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
    modelname: yup.string().required("modelname is required"),
    modelyear: yup.string().required("modelyear is required"),
  })
  .required();

const selectStyles = {
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const ValidationTypes = () => {

  const [makesdata, setMakesData] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const postMutation = usePostMutation("/models");

  const onSubmit = (data) => {
    console.log("onSubmitdata", data, makesdata)
    postMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.viewModels },
      body: {
        name: data.modelname,
        year: data.modelyear,
        make_id: makesdata.value
      },
    });
  };

  const { data: makes } = useQuery({
    queryKey: ["ViewMakes", APICONSTANT.viewMakes],
    queryFn: getApiMethos,
    retry: 0,
  });
  const makesData = makes?.data?.makes?.map(item => ({
    value: item._id,
    label: item.name
  })) || [];

  return (
    <Card
      title={"Add Makes"}
      footer={<Button formId="addModelsForm" />}
      backIcon={true}
    >
      <form
        id={"addModelsForm"}
        onSubmit={handleSubmit(onSubmit)}
        className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
      >
        <div>
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
              // setState(null);
            }}
          />
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
