import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import Fileinput from "@/components/ui/Fileinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, QueryClient, useQuery } from "@tanstack/react-query";
import { postApiMethod } from "../../components/services/gobal";
import { APICONSTANT } from "../../components/services/config";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
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
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
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
      navigate("/vehicle");
      toast.success(data.message);
    },
    onError: (err) => {
      console.log("err", err);
      toast.error(err.message);
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("file", selectedFile);

    mutation.mutateAsync({
      url: { apiUrl: APICONSTANT.addVehicle },
      body: formData,
    });
  };
  // console.log(selectedFile);
  return (
    <Card
      title={"Add Vehicle"}
      footer={<Button formId="addVehicleForm" />}
      backIcon={true}
    >
      <form
        id={"addVehicleForm"}
        onSubmit={handleSubmit(onSubmit)}
        className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
      >
        <Textinput
          label="Name"
          type="text"
          placeholder="Type Vehicle Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <div>
          <label className="form-label">Profile</label>
          <Fileinput
            name="basic"
            selectedFile={selectedFile}
            preview
            onChange={handleFileChange}
          />
        </div>
      </form>
    </Card>
  );
};

export default ValidationTypes;
