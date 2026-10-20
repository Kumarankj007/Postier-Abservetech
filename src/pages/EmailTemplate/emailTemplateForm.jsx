import React, { useEffect } from 'react'
import { APICONSTANT } from '@/components/services/config';
import { getApiMethos } from '@/components/services/gobal';
import { Button } from '@/components/ui/ButtonComp';
import Card from '@/components/ui/Card';
import Textinput from '@/components/ui/Textinput';
import usePostMutation from '@/hooks/usePostMuation';
import usePutMutation from '@/hooks/usePutMuation';
import TinyCmeEditor from '@/TinyCme/tinyEditor';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import * as yup from "yup";

const formValidationSchema = yup.object({
  subject: yup.string().required("Subject is required"),
  description: yup.string().required("Description is required")
})

const EmailTemplateForm = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");

  const { data, error, isLoading } = useQuery({
    queryKey: ["editEmailTemplate", APICONSTANT.getEmailTemplate + '/' + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id,
  })

  const postMutation = usePostMutation("/emailTemplate");
  const putMutation = usePutMutation("/emailTemplate");

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(formValidationSchema),
    moe: "all",
  })

  useEffect(() => {
    if (data?.data?.documents[0]) {
      reset(data?.data?.documents[0]);
      setValue("body", data?.data?.documents[0]?.body || ""); // Reset TinyCmeEditor value
    }
  }, [data, reset, setValue]);
  const tinyValue = watch("body")

  const onSubmit = (data) => {
    const urlEncodedData = new URLSearchParams(data).toString();
    try {
      if (id) {
        const response = putMutation.mutateAsync({
          url: { apiUrl: APICONSTANT.getEmailTemplate + "/" + id },
          body: urlEncodedData,
        })
        console.log('====================================');
        console.log(response);
        console.log('====================================');
      } else {
        const response = postMutation.mutateAsync({
          url: { apiUrl: APICONSTANT.getEmailTemplate },
          body: urlEncodedData,
        })
        console.log('====================================');
        console.log(response);
        console.log('====================================');
      }
    } catch (error) {
      console.error("Error updating email templat", error);
    }
  }
  return (
    <>
      <Card
        title={`${id ? "Edit" : "Add"}` + " Email Template"}
        footer={<Button formId={`${id ? "edit" : "add"}` + "emailTemplate"} />}
        backIcon={true}
      >
        <form
          id={`${id ? "edit" : "add"}` + "emailTemplate"}
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-wrap justify-between"
        >
          <div className="w-[48%]">
            <Textinput
              label="Subject"
              type="text"
              placeholder=""
              name="subject"
              register={register}
              error={errors.subject}
            />
          </div>
          <div className="w-[48%]">
            <Textinput
              label="Description"
              type="text"
              placeholder=""
              name="description"
              register={register}
              error={errors.description}
            />
          </div>
          <div className={"w-[100%] mt-5"}>
            <TinyCmeEditor
              value={tinyValue}
              changeInVal={(body) => setValue("body", body)}
            />
          </div>
        </form>
      </Card>
    </>
  )
}

export default EmailTemplateForm;
