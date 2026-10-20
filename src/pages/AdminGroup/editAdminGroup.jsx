import React, { useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query"
import { APICONSTANT } from "../../components/services/config";
import { useLocation } from "react-router-dom"
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/ButtonComp";
import { getApiMethos } from "@/components/services/gobal";
import usePutMutation from "@/hooks/usePutMuation";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const FormValidationSchema = yup
    .object({
        group: yup.string().required("Group is required"),
        description: yup.string().required("Description is required"),
    })

const ValidationTypes = () => {
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const id = search.get("id");
    const { data } = useQuery({
        queryKey: ["SingleAdminGroup", APICONSTANT.viewAdminGroup + "/" + id],
        queryFn: getApiMethos,
        retry: 0,
        enabled: !!id,
    })
    console.log(data);

    // const { data: datas } = useQuery({
    //     queryKey: ["MenuList", APICONSTANT.getMenuList],
    //     queryFn: getApiMethos,
    //     return: 0,
    // })
    // console.log(datas);
    useEffect(() => {
        reset(editData);
    }, [data])

    const editData = {
        group: data?.data?.adminGroup[0]?.group ? data?.data?.adminGroup[0].group : "",
        description: data?.data?.adminGroup[0]?.description ? data?.data?.adminGroup[0].description : "",
        permission: data?.data?.adminGroup[0]?.permission || [],
    }
    console.log(editData);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
        mode: "all",
    })

    // const watchField = watch();

    const putMutation = usePutMutation("/adminGroup");

    const onSubmit = (data) => {
        console.log(data);
        putMutation.mutateAsync({
            url: { apiUrl: APICONSTANT.addAdminGroup + "/" + id },
            body: {
                group: data?.group,
                description: data?.description,
                permission: data?.permission,
            }
        })
    }
    return (
        <Card
            title={"Edit Admin Group"}
            footer={<Button formId="editAdminGroupForm" />}
            backIcon={true}
        >
            <form
                id={"editAdminGroupForm"}
                onSubmit={handleSubmit(onSubmit)}
                className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6">
                <Textinput
                    label="Group"
                    type="text"
                    placeholder="Type Group Name"
                    name="group"
                    register={register}
                    error={errors.group}
                />
                <Textinput
                    label="Description"
                    type="text"
                    placeholder="Type Group Description"
                    name="description"
                    register={register}
                    error={errors.description}
                />
                {/* {JSON.stringify(watchField)} */}
                <div>
                    <div className="mb-4">Menu Permission</div>
                    {data?.data?.adminGroup[0]?.permission?.map((menuPermission, index) => {
                        return (
                            <div key={index} className="mb-4 lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6">

                                <div className="flex justify-between">
                                    <label>{menuPermission.menu}</label>
                                    <ToggleSwitch
                                        name={`permission[${index}].status`}
                                        register={register}
                                        defaultChecked={menuPermission.status}
                                    />
                                </div>
                                {menuPermission.subMenu && menuPermission.subMenuList.length > 0 && (
                                    <div className="ml-4">
                                        {menuPermission?.subMenuList?.map((subMenu, subIndex) => {
                                            return (
                                                <div key={subIndex} className="flex justify-between mb-4">
                                                    <label classMenu="mr-2">{subMenu?.menu}</label>
                                                    <ToggleSwitch name={`permission[${index}].subMenuList[${subIndex}].status`}
                                                        register={register}
                                                        defaultChecked={subMenu?.status}
                                                    />

                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </form>
        </Card>
    );
};
export default ValidationTypes;