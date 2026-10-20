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
  let countriesList = [];
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const [country, setCountry] = useState();
  const id = search.get("id");
  const { data, error, isLoading } = useQuery({
    queryKey: ["SingleCountryList", APICONSTANT.editState + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id, // Ensures the query runs only if `id` is truthy
  });
  const {
    data: countryList,
    isLoading: countryIsLoading,
    error: countryError,
  } = useQuery({
    queryKey: ["CountryList", APICONSTANT.viewCountry],
    queryFn: getApiMethos,
    retry: 0,
  });

  countriesList = countryList?.data?.countries.map((each) => {
    return {
      label: each?.name,
      value: each?._id,
    };
  });
  // console.log("log == == >", data.data);
  const Data = {
    name: data?.data?.states[0]?.name ? data?.data?.states[0].name : "",
    code: data?.data?.states[0]?.code ? data?.data?.states[0].code : "",
  };

  // const getSelectedCountryList = () => {
  //   const selCountry = data?.data?.states[0]?.country_id;
  //   const allCountryList = countryList?.countries;
  //   const newSelCountry = allCountryList?.filter(
  //     (each) => each._id === selCountry._id
  //   );
  //   return newSelCountry[0];
  // };

  const getSelectedCountryList = () => {
    const selCon = [
      {
        value: data?.data?.states[0]?.country_id?._id,
        label: data?.data?.states[0]?.country_id?.name,
      },
    ];
    return selCon;
  };

  useEffect(() => {
    reset(Data);
    setCountry(
      data?.data?.states[0]?.country_id ? getSelectedCountryList() : {}
    );
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
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: putApiMethod,
    onSuccess: (data) => {
      // console.log("data--", data.message);
      navigate("/state");
      toast.success(data.message);
    },
    onError: (err) => {
      console.log("err", err);
      toast.error(err.message);
    },
  });

  const onSubmit = (data) => {
    mutation.mutateAsync({
      url: { apiUrl: APICONSTANT.editState + "/" + id },
      body: {
        name: data.name,
        code: data.code,
        country_id: country?.value,
        // phonecode: data.phonecode,
      },
    });
  };

  return (
    <Card
      title={"Edit State"}
      footer={<Button formId="editstateForm" />}
      backIcon={true}
    >
      {/* {isLoading ? (
        <Loading />
      ) : ( */}
      <form
        id={"editstateForm"}
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
        //   setValue={setValue}
        />
        <Textinput
          label="Code"
          type="text"
          placeholder="Type Country Code"
          name="code"
          register={register}
          error={errors.code}
        //   setValue={setValue}
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
      </form>
      {/* )} */}
    </Card>
  );
};

export default ValidationTypes;
