import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/ButtonComp";
import { getApiMethos } from "@/components/services/gobal";
import usePutMutation from "@/hooks/usePutMuation";
import { APICONSTANT } from "@/components/services/config";
import usePostMutation from "@/hooks/usePostMuation";

const FormValidationSchema = yup.object({}).required();
const EditTranslation = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");
  const { groupId, interpret } = location.state || {}; // Safely access the state

  console.log("groupId", groupId, interpret);
  const { data } = useQuery({
    queryKey: ["SingleTranslation", APICONSTANT.singleTranslation + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id,
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });
  console.log("languagesdata", data);
  const editData = data?.data?.languages?.reduce((acc, item) => {
    if (item.transcribe.describe) {
      acc[item.name] = item.transcribe.describe; // Use `name` as key, adjust as needed
    }
    return acc;
  }, {});

  useEffect(() => {
    if (data) {
      console.log("editData", editData);
      reset(editData);
    }
  }, [data]);

  const postMutation = usePostMutation("/Translations");

  const onSubmit = (formData) => {
    console.log("formData", formData);

    const transcribe = data?.data?.languages?.map((item) => ({
      language: item._id,
      describe: formData[item.name],
    }));

    postMutation
      .mutateAsync({
        url: { apiUrl: APICONSTANT.singleTranslation + "/" + id },
        body: {
          translationId: id,
          interpret: interpret,
          group: groupId,
          isGroup: true,
          transcribe,
        },
      })
      .then((response) => {
        console.log("Trip updated successfully", response);
      })
      .catch((error) => {
        console.error("Error updating trip", error);
      });
  };

  return (
    <Card
      title={"Edit Translation"}
      footer={<Button formId="editTranslation" />}
      backIcon={true}
    >
      <form
        id={"editTranslation"}
        onSubmit={handleSubmit(onSubmit)}
        className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
      >
        {data?.data?.languages?.map((item) => (
          <Textinput
            key={item._id} // Ensure unique key for React
            label={item.name} // Display the label as the language name
            type="text"
            placeholder={`Enter ${item.name}`} // Optional: more descriptive placeholder
            name={item.name} // Use the language name as the field name
            register={register} // Register the input for react-hook-form
            defaultValue={item.transcribe.describe || ""} // Pre-fill the input if data exists
          />
        ))}
      </form>
    </Card>
  );
};

export default EditTranslation;
