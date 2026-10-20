import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/ButtonComp";
import Select from "react-select";
import DatePickerComponent from "@/components/ui/input/DatePicker";
import { getApiMethos, postApiMethod } from "@/components/services/gobal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { APICONSTANT } from "@/components/services/config";
import languageOptions from "@/data/language.json";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const FormValidationSchema = yup.object({
  name: yup.string().required("Name is required"),
  indexName: yup.string().required("Index Name is required"),
  file: yup.string().required("File is required"),
  status: yup.string().required("Status is required"),
});

const selectStyles = {
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const addLanguages = () => {
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
    defaultValues: {
      status: true,
    },
  });
  const [file, setFile] = useState(null); // File state to hold binary file

  function handleChange(event) {
    const selectedFile = event.target.files[0]; // Get the selected file
    setFile(selectedFile); // Store the file in the state

    // Convert the file to binary (ArrayBuffer)
    const reader = new FileReader();
    reader.onloadend = function () {
      const binaryData = reader.result; // This is the binary data of the file
      const binaryBlob = new Blob([binaryData], { type: selectedFile.type }); // Create a Blob from binary data
      setFile(binaryBlob); // Update the state with the Blob (binary)
    };
    reader.readAsArrayBuffer(selectedFile); // Read file as ArrayBuffer
  }

  const mutation = useMutation({
    mutationFn: postApiMethod,
    onSuccess: (data) => {
      console.log("onSuccess", data);
      navigate("/Languages");
      toast.success(data.message);
    },
    onError: (err) => {
      console.log("err", err);
      toast.error(err.message);
    },
  });

  const langStatus = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const onSubmit = (data) => {
    console.log("onSubmitdata", data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("indexName", data.indexName);
    formData.append("file", file);
    formData.append("status", data.status);
    console.log("formData", formData);
    mutation.mutateAsync({
      url: { apiUrl: APICONSTANT.viewLanguages },
      body: formData,
    });
    postMutation.mutateAsync(payload);
  };

  return (
    <Card
      title={"Add Language"}
      footer={<Button formId="addLanguageForm" />}
      backIcon={true}
    >
      <form
        id={"addLanguageForm"}
        onSubmit={handleSubmit(onSubmit)}
        // className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
        className="flex justify-between flex-wrap"
      >
        <div className="md:w-[48%] mr-2 mb-4">
          <label className="form-label">Language</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={languageOptions}
                placeholder="Select Language"
                onChange={(option) => {
                  field.onChange(option?.label);
                  setValue("indexName", option?.value);
                }}
                value={languageOptions.find(
                  (option) => option.label === field.value,
                )}
                className="react-select"
                classNamePrefix="select"
              />
            )}
          />
          {errors.name && (
            <p className="error mt-2 text-danger-500 block text-sm">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="md:w-[48%]">
          <Textinput
            label="Index Name"
            type="text"
            placeholder="Auto-filled Index Name"
            name="indexName"
            register={register}
            error={errors.indexName}
            disabled
          />
        </div>
        <div className="md:w-[48%] mr-2 mb-4">
          <Textinput
            accept=".json"
            label="File"
            type="file"
            placeholder="Type File"
            name="file"
            register={register}
            error={errors.file}
            onChange={handleChange}
          />
        </div>

        <div className="md:w-[48%] flex items-center mt-[40px]">
          <label className="mb-5 mr-5">Status</label>
          <ToggleSwitch
            name="status"
            register={register}
            defaultChecked={true}
            onChange={(e) => setValue("status", e.target.checked)}
          />
        </div>
      </form>
    </Card>
  );
};

export default addLanguages;
