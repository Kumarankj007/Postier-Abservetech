import React, { useState } from 'react'
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import Card from '@/components/ui/Card'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { APICONSTANT } from "../../components/services/config";
import usePostMutation from "@/hooks/usePostMuation";
import { Button } from "@/components/ui/ButtonComp";

const parcelTypeStatus = [
  { value: "true", label: "True" },
  { value: "false", label: "False" }
]

const FormValidationSchema = yup.object({
  name: yup.string().required("Name is required"),
})

const selectStyles = {
  option: (provided) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const ValidationTypes = () => {
  const [parcelStatus, setParcelStatus] = useState(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  })

  const postMutation = usePostMutation("/parcelType");

  console.log(parcelStatus);

  const onSubmit = (data) => {
    const payload = {
      url: { apiUrl: APICONSTANT.addParcelType },
      body: {
        name: data?.name,
        // status: parcelStatus?.value,
      }
    };
    console.log("Submitting payload:", payload);
    postMutation.mutateAsync(payload)
  }

  return (
    <Card
      title={"Add Parcel Type"}
      footer={<Button formId="addParcelTypeForm" />}
      backIcon={true}
    >
      <form
        id={"addParcelTypeForm"}
        onSubmit={handleSubmit(onSubmit)}
        className='lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6'
      >
        <Textinput
          label="Name"
          type="text"
          placeholder="Name"
          name="name"
          register={register}
          error={errors.name}
        />
      </form>
    </Card>
  )
}

export default ValidationTypes
