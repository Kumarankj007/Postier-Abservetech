import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
// import Textinput from "../helper/input";
import Fileinput from "@/components/ui/Fileinput";
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
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);

  let countriesList;
  let stateList;
  let Data;

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
      country
        ? APICONSTANT.viewState + "/" + `?countryId=${country?.value}`
        : "",
    ],
    queryFn: getApiMethos,
    retry: 0,
    // {
    //   enabled: !!country, // Enable the query only if country is not null
    //   retry: 0,
    // }
  });

  const {
    data: singleCityDatas,
    isLoading: singleCityIsLoading,
    error: singleCityError,
  } = useQuery({
    queryKey: ["SingleCityList", APICONSTANT.viewCity + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
  });

  const setFormData = () => {
    Data = {
      name: singleCityDatas?.data?.cities[0]?.name
        ? singleCityDatas?.data?.cities[0]?.name
        : "",
      code: singleCityDatas?.data?.cities[0]?.code
        ? singleCityDatas?.data?.cities[0]?.code
        : "",
    };
  };
  // if (singleCityDatas) {
  //   console.log(singleCityDatas?.data?.cities[0]?.name, "singleCityDatas");
  //   Data = {
  //     name: singleCityDatas?.data?.cities[0]?.name,
  //     code: singleCityDatas?.data?.cities[0]?.code,
  //   };

  // }

  if (datas) {
    countriesList = datas?.data?.countries?.map((each) => {
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
    reset,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const mutation = useMutation({
    mutationFn: putApiMethod,
    onSuccess: (data) => {
      navigate("/view-city");
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

  const getSelectedCountry = () => {
    const selCountry = {
      label: singleCityDatas?.data?.cities[0]?.country_id?.name,
      value: singleCityDatas?.data?.cities[0]?.country_id?._id,
    };
    return selCountry;
  };

  const getSelectedState = () => {
    const selState = {
      label: singleCityDatas?.data?.cities[0]?.state_id?.name,
      value: singleCityDatas?.data?.cities[0]?.state_id?._id,
    };
    return selState;
  };

  useEffect(() => {
    if (singleCityDatas) {
      setFormData();
      setCountry(
        singleCityDatas?.data?.cities[0]?.country_id ? getSelectedCountry() : ""
      );
      setState(
        singleCityDatas?.data?.cities[0]?.state_id ? getSelectedState() : ""
      );
    }
    reset(Data);
  }, [singleCityDatas]);

  return (
    <Card
      title={"Edit City"}
      footer={<Button formId="editCityForm" />}
      backIcon={true}
    >
      <form
        id={"editCityForm"}
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
              setState(null);
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

        {/* <div className="lg:col-span-2 col-span-1">
          <div className="w-full border-t border-gray-200 my-4"></div>
          <div className="ltr:text-right rtl:text-left">
            <button className="btn btn-dark text-center">Submit</button>
          </div>
        </div> */}
      </form>
    </Card>
  );
};

export default ValidationTypes;
