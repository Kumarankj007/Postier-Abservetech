import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query"
import { APICONSTANT } from "../../components/services/config";
import { getApiMethos } from "@/components/services/gobal";
import usePostMutation from "@/hooks/usePostMuation";
import { Button } from "@/components/ui/ButtonComp";

const FormValidationSchema = yup.object({
    group: yup.string().required("Group is required"),
    description: yup.string().required("Description is required"),
})

const ValidationTypes = () => {
    const { data: datas } = useQuery({
        queryKey: ["MenuList", APICONSTANT.getMenuList],
        queryFn: getApiMethos,
        return: 0,
    })
    const [menuList, setMenuList] = useState([]);

    useEffect(() => {
        if (datas?.data?.menuList) {
            setMenuList(datas.data.menuList);
        }
    }, [datas]);

    // console.log(datas);
    const {
        register,
        formState: { errors },
        handleSubmit,
        // watch,
        reset,
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
        mode: "all",
    })

    // const watchField = watch();

    const postMutation = usePostMutation("/adminGroup");

    const onSubmit = (data) => {
        const payload = {
            url: { apiUrl: APICONSTANT.addAdminGroup },
            body: {
                group: data?.group,
                description: data?.description,
                permission: data?.menuList,
            },
        };

        console.log('Submitting payload:', payload);

        postMutation.mutateAsync(payload)
            .then(response => {
                console.log('Response:', response);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        reset(datas?.data)
    }, [datas])

    const handleParentToggle = (event, parentIndex) => {
        const isChecked = event.target.checked;

        // Update local state
        const updatedMenuList = menuList.map((menu, index) => {
            if (index === parentIndex) {
                return {
                    ...menu,
                    status: isChecked,
                    subMenuList: menu.subMenuList.map((subMenu) => ({
                        ...subMenu,
                        status: isChecked,
                    })),
                };
            }
            return menu;
        });

        setMenuList(updatedMenuList);
    };


    return (
        <Card
            title={"Add Admin Group"}
            footer={<Button formId="addAdminGroupForm" />
            }
            backIcon={true}
        >
            <form
                id={"addAdminGroupForm"}
                onSubmit={handleSubmit(onSubmit)}
                className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6">
                <Textinput
                    label="Group"
                    type="text"
                    placeholder="Group"
                    name="group"
                    register={register}
                    error={errors.group}
                />
                <Textinput
                    label="Description"
                    type="text"
                    placeholder="Description"
                    name="description"
                    register={register}
                    error={errors.description}
                />
                {/* {JSON.stringify(watchField)} */}
                <div>
                    <div className="mb-4">Menu Permission</div>
                    {/* {datas?.data?.menuList?.map((menuPermission, index) => {
                        console.log(menuPermission, "menuPermission");
                        return (
                            <div key={index} className="mb-4 lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6">
                                <div className="flex justify-between">
                                    <label className="mr-2">{menuPermission?.menu}</label>
                                    <ToggleSwitch
                                        name={`menuList[${index}].status`}
                                        register={register}
                                        defaultChecked={menuPermission?.status}
                                    />
                                </div>
                                {menuPermission?.subMenu && menuPermission?.subMenuList?.length > 0 && (
                                    <div className="ml-4">
                                        {menuPermission.subMenuList.map((subMenu, subIndex) => (
                                            <div key={subIndex} className="flex justify-between mb-4">
                                                <label className="mr-2">{subMenu?.menu}</label>
                                                <ToggleSwitch
                                                    name={`menuList[${index}].subMenuList[${subIndex}].status`}
                                                    register={register}
                                                    defaultChecked={subMenu?.status}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            // <></>
                        )
                    })} */}
                    {menuList.map((menuPermission, index) => (
                        <div key={index} className="mb-4 lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6">
                            <div className="flex justify-between">
                                <label className="mr-2">{menuPermission?.menu}</label>
                                <ToggleSwitch
                                    name={`menuList[${index}].status`}
                                    defaultChecked={menuPermission?.status}
                                    onChange={(e) => handleParentToggle(e, index)}
                                    register={register}
                                />
                            </div>
                            {menuPermission?.subMenu && menuPermission?.subMenuList?.length > 0 && (
                                <div className="ml-4">
                                    {menuPermission.subMenuList.map((subMenu, subIndex) => (
                                        <div key={subIndex} className="flex justify-between mb-4">
                                            <label className="mr-2">{subMenu?.menu}</label>
                                            <ToggleSwitch
                                                name={`menuList[${index}].subMenuList[${subIndex}].status`}
                                                defaultChecked={subMenu?.status}
                                                disabled={menuPermission.status === false}
                                                register={register}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}



                </div>
            </form>
        </Card>
    )
}

export default ValidationTypes;