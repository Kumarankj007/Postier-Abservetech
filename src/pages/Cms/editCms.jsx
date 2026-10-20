import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
// import Button from "../../components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import TinyMce from "@/components/ui/TinyMceEditor";
import Icon from "@/components/ui/Icon";
import { useLocation, useNavigate } from "react-router-dom";
import TinyCmeEditor from "@/TinyCme/tinyEditor";
import { APICONSTANT } from "@/components/services/config";
import { getApiMethos } from "@/components/services/gobal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import usePutMutation from "@/hooks/usePutMuation";
import * as yup from "yup";

import { Button } from "@/components/ui/ButtonComp";

const FormValidationSchema = yup
  .object({
    title: yup.string().required("title is required"),
    type: yup.string().required("type is required"),
  })
  .required();
const EditCms = () => {
  const navigate = useNavigate();
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

  const changeInVal = (val) => {
    console.log("Value from Tiny MCE --> ", val);
    setInpValue1(val);
  };

  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const id = search.get("id");
  const { data, error, isLoading } = useQuery({
    queryKey: ["editcms", APICONSTANT.viewCMS + "/" + id],
    queryFn: getApiMethos,
    retry: 0,
    enabled: !!id, // Ensures the query runs only if `id` is truthy
  });

  console.log("editcms", data, data?.data?.cms[0]?.content);
  const [inpValue1, setInpValue1] = useState("");

  useEffect(() => {
    if (data?.data?.cms?.length > 0) {
      setInpValue1(data.data.cms[0].content || "");
    }
  }, [data]);

  const editData = {
    title: data?.data?.cms[0]?.title ? data?.data?.cms[0].title : "",
    type: data?.data?.cms[0]?.type ? data?.data?.cms[0].type : "",
    inpValue1: data?.data?.cms[0]?.content ? data?.data?.cms[0].content : "",
    // code: data?.data?.countries[0]?.code ? data?.data?.countries[0].code : "",
    // phonecode: data?.data?.countries[0]?.phonecode
    //   ? data?.data?.countries[0].phonecode
    //   : "",
  };
  useEffect(() => {
    reset(editData);
  }, [data, inpValue1]);

  const putMutation = usePutMutation("/pages");

  const onSubmit = (data) => {
    // debugger
    console.log("viewCMSdata", data);
    putMutation.mutateAsync({
      url: { apiUrl: APICONSTANT.viewCMS + "/" + id },
      body: {
        title: data.title,
        content: inpValue1,
        // phonecode: data.phonecode,
      },
    });
  };

  return (
    <>
      <div>
        <Card
          title={"CMS Edit"}
          footer={<Button formId="editCmsForm" />}
          backIcon={true}
        >
          {/* <div className="flex items-center mb-3">
            <button className="" onClick={() => navigate(-1)}>
              <Icon icon="heroicons-outline:arrow-sm-left" className="w-[30px] h-[30px] mr-5" />
            </button>
            <h5 className="">CMS Edit</h5>
          </div> */}

          <form
            id={"editCmsForm"}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-wrap justify-between"
          >
            <div className="w-[48%]">
              <Textinput
                label="Title"
                type="text"
                placeholder=""
                name="title"
                register={register}
                error={errors.title}
              />
            </div>
            {/* <div className="w-[48%]">
              <Textinput
                label="Type"
                type="text"
                placeholder=""
                name="type"
                register={register}
                error={errors.type} />
            </div> */}
            {/* <TinyMce /> */}
            <div className="w-[100%] mt-5">
              <TinyCmeEditor value={inpValue1} changeInVal={changeInVal} />
            </div>
            {/* <Button
                // icon="heroicons-outline:plus"
                text="Apply"
                className="btn-dark bg-slate-800 text-sm font-normal mt-5"
                iconClass=" text-lg"
                onClick={handleTaC}
              /> */}
          </form>
        </Card>
      </div>
    </>
  );
};

export default EditCms;
