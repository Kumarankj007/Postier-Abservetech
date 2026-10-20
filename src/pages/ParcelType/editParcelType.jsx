import React, { useEffect, useState } from "react";
import Textinput from "@/components/ui/Textinput";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
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

const parcelTypeStatus = [
    { value: "true", label: "True" },
    { value: "false", label: "False" }
]

const FormValidationSchema = yup
    .object({
        name: yup.string().required("Name is required")
    })
const selectStyles = {
    option: (provided) => ({
        ...provided,
        fontSize: "14px",
    }),
};

const validationTypes = () => {
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const id = search.get("id");
    const [parcelStatus, setParcelStatus] = useState(null);
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset, control, setValue
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
        mode: 'all',
        defaultValues: {
            status: parcelTypeStatus[0]?.value, // Set initial status
        },
    })
    const { data } = useQuery({
        queryKey: ["SingleParcelType", APICONSTANT.viewParcelType + "/" + id],
        queryFn: getApiMethos,
        retry: 0,
        enabled: !!id,
    })

    console.log("parcelTypesingledata", parcelTypesingledata, data)
    const editData = {
        name: data?.data?.parcelType[0]?.name ? data?.data?.parcelType[0]?.name : "",
    }

    useEffect(() => {
        reset(editData);
        const statusOption = parcelTypeStatus.find(option => option.value === String(editData.status))
        setParcelStatus(statusOption);
    }, [data])



    const putMutation = usePutMutation("/parcelType")
    const onSubmit = (data) => {
        console.log("editParcelType", data)
        putMutation.mutateAsync({
            url: { apiUrl: APICONSTANT.editParcelType + "/" + id },
            body: {
                name: data?.name,
                status: data?.status,
            },
        })
    }
    return (
        <>
            <Card
                title={"Edit Parcel Type"}
                footer={<Button formId="editParcelTypeForm" />}
                backIcon={true}
            >
                <form
                    id={"editParcelTypeForm"}
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
                    <div className='flex items-center mt-[40px]'>
                        <label className="mb-5 mr-5">Status</label>
                        <ToggleSwitch
                            name={`status`}
                            register={register}
                            defaultChecked={data?.data?.parcelType[0].status}
                            className="mb-0"
                        />
                    </div>

                </form>
            </Card>
        </>
    )
}

export default validationTypes