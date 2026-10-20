import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
// import Textinput from "../helper/input";
import Fileinput from "@/components/ui/Fileinput";
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
import Select from "react-select";
import { Button } from "@/components/ui/ButtonComp";

const FormValidationSchema = yup
  .object({
    name: yup.string().required("name is required"),
    code: yup.string().required("code is required"),
    // phonecode: yup.string().required("phonecode is required"),
  })
  .required();

const selectStyles = {
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const ValidationTypes = () => {
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);

  let countriesList;
  let stateList;
  const {
    data: datas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["CountryList", APICONSTANT.viewCountry],
    queryFn: getApiMethos,
    retry: 0,
  });

  const {
    data: stateDatas,
    isLoading: stateIsLoading,
    error: stateError,
  } = useQuery({
    queryKey: [
      "StateList",
      APICONSTANT.viewState + "/" + `?countryId=${country?.value}`,
    ],
    queryFn: getApiMethos,
    retry: 0,
  });

  if (datas) {
    countriesList = datas?.data?.countries.map((each) => {
      return {
        label: each?.name,
        value: each?._id,
      };
    });
  }
  if (stateDatas) {
    stateList = stateDatas?.data?.states?.map((each) => {
      return {
        label: each?.name,
        value: each?._id,
      };
    });
  }
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: postApiMethod,
    onSuccess: (data) => {
      navigate("/city");
      toast.success(data.message);
    },
    onError: (err) => {
      console.log("err", err);
      toast.error(err.message);
    },
  });

  const onSubmit = (data) => {
    mutation.mutateAsync({
      url: { apiUrl: APICONSTANT.addCity },
      body: {
        name: data.name,
        code: data.code,
        country_id: country?.value,
        state_id: state?.value,
      },
    });
  };
  console.log(country);
  return (
    <Card
      title={"Add City"}
      footer={<Button formId="addCityForm" />}
      backIcon={true}
    >
      <form
        id={"addCityForm"}
        onSubmit={handleSubmit(onSubmit)}
        className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
      >
        <Textinput
          label="Name"
          type="text"
          placeholder="Type City Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <Textinput
          label="Code"
          type="text"
          placeholder="Type City Code"
          name="code"
          register={register}
          error={errors.code}
        />
        <div>
          <label className="form-label">Select Country</label>
          <Select
            options={countriesList}
            label={"Select Country"}
            className="react-select"
            classNamePrefix="select"
            value={country}
            onChange={(e) => {
              setCountry(e);
            }}
          />
        </div>
        <div>
          <label className="form-label">Select State</label>
          <Select
            options={stateList}
            label={"Select State"}
            className="react-select"
            classNamePrefix="select"
            value={state}
            onChange={(e) => {
              setState(e);
            }}
          />
        </div>
        {/* <div className="w-full border-t border-gray-200 my-4"></div> */}
      </form>
    </Card>
  );
};

export default ValidationTypes;
