import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import Fileinput from "@/components/ui/Fileinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, QueryClient, useQuery } from "@tanstack/react-query";
import { postApiMethod, putApiMethod } from "../../components/services/gobal";
import { APICONSTANT } from "../../components/services/config";
import { getApiMethos } from "../../components/services/gobal";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import { reset } from "../auth/common/alert";
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
  let newData;
  const navigate = useNavigate();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const {
    data: datas,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["singleVehicle", APICONSTANT.viewVehicle + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  useEffect(() => {
    if (datas) {
      const vehicleCategory = datas?.data?.vehicleCategory[0];
      setValue("name", vehicleCategory?.name || "");
      if (vehicleCategory?.image) {
        try {
          const newImage = `${vehicleCategory.image}`;
          // const objectURL = URL.createObjectURL(vehicleCategory.image);
          setSelectedFile(newImage);
        } catch (error) {
          console.error("Failed to create object URL:", error);
        }
      }
    }
  }, [datas, setValue]);

  const mutation = useMutation({
    mutationFn: putApiMethod,
    onSuccess: (data) => {
      // navigate("/view-vehicle");
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
      url: { apiUrl: APICONSTANT.editVehicle + "/" + id },
      body: formData,
    });
  };

  console.log("image file", selectedFile);
  return (
    <Card
      title={"Edit Vehicle"}
      footer={<Button formId="editVehicleForm" />}
      backIcon={true}
    >
      <form
        id={"editVehicleForm"}
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
          <label className="form-label">Image</label>
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
