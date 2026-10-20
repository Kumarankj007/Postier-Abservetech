import React, { useEffect, useState } from "react";
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

const deliveryTypeStatus = [
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
    const [deliveryParcelStatus, setDeliveryParcelStatus] = useState(null);
    const { data } = useQuery({
        queryKey: ["SingleDeliveryParcelType", APICONSTANT.viewDeliverParcel + "/" + id],
        queryFn: getApiMethos,
        retry: 0,
        enabled: !!id,
    })
    const editData = {
        name: data?.data?.deliverParcelType[0]?.name ? data?.data?.deliverParcelType[0]?.name : "",
    }

    useEffect(() => {
        reset(editData);
        const statusOption = deliveryTypeStatus.find(option => option.value === String(editData.status))
        setDeliveryParcelStatus(statusOption);
    }, [data])

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        // setValue,
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
        mode: 'all',
    })

    const putMutation = usePutMutation("/deliverParcelType")
    const onSubmit = (data) => {
        putMutation.mutateAsync({
            url: { apiUrl: APICONSTANT.editDeliverParcel + "/" + id },
            body: {
                name: data?.name,
                status: data?.status,
            },
        })
    }
    return (
        <>
            <Card
                title={"Edit Deleivery Parcel"}
                footer={<Button formId="editDeliveryParcelForm" />}
                backIcon={true}
            >
                <form
                    id={"editDeliveryParcelForm"}
                    onSubmit={handleSubmit(onSubmit)}
                    className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
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
                            defaultChecked={data?.data?.deliverParcelType[0].status}
                            className="mb-0"
                        />
                    </div>
                </form>

            </Card>
        </>
    )
}

export default validationTypes