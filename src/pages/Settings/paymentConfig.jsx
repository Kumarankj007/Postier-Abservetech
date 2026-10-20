import React, { Fragment, useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon.jsx";
import { useNavigate } from "react-router-dom";
import { APICONSTANT } from "@/components/services/config";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getApiMethos } from "@/components/services/gobal";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import usePostMutation from "@/hooks/usePostMuation";
import usePutMutation from "@/hooks/usePutMuation";

const generateDynamicSchema = (fields) => {
    const schemaShape = {};

    fields.forEach((field) => {
        switch (field.type) {
            case "text":
                schemaShape[field.indexName] = yup
                    .string()
                    .required(`${field.name} is required`);
                break;
            case "url":
                schemaShape[field.indexName] = yup
                    .string()
                    .url(`${field.name} must be a valid URL`)
                    .required(`${field.name} is required`);
                break;
            case "file":
                schemaShape[field.indexName] = yup
                    .mixed()
                    .required(`${field.name} is required`);
                break;
            default:
                schemaShape[field.indexName] = yup
                    .string()
                    .required(`${field.name} is required`);
        }
    });

    return yup.object().shape(schemaShape);
};

const PaymentConfig = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [dynamicSchema, setDynamicSchema] = useState(yup.object());

    const buttons = ["Cancel", "Update"]

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(dynamicSchema),
        mode: "all",
    });

    const { data, error, isLoading } = useQuery({
        queryKey: ['paymentGateway', APICONSTANT.getPaymentGateway],
        queryFn: getApiMethos,
        retry: 0
    });

    useEffect(() => {
        if (selectedGateway) {

            const defaultValues = {};
            selectedGateway?.fields?.forEach((field) => {
                defaultValues[field.indexName] = field.value || "";
            });
            reset(defaultValues);

            const schema = generateDynamicSchema(selectedGateway?.fields);
            setDynamicSchema(schema);
            reset();

        }
    }, [selectedGateway, reset]);

    const putMutation = usePutMutation("");

    const handleToggle = async (gatewayName) => {
        try {
            const gateway = data?.data?.enabledGateway.find((item) => item.indexName === gatewayName);
            if (!gateway) {
                console.error("Gateway not found");
                return;
            }

            const params = new URLSearchParams({
                paymentGateway: gateway.indexName,
                status: gateway.isActive === "true" ? "false" : "true",
            });

            const response = await putMutation.mutateAsync({
                url: { apiUrl: APICONSTANT.statusPaymentGateway },
                body: params.toString(),
            });

            if (response?.type === "success") {
                await queryClient.invalidateQueries({
                    queryKey: ['paymentGateway', APICONSTANT.getPaymentGateway]
                });
                // Alternatively, you can trigger a refetch explicitly after updating the status
                // queryClient.refetchQueries({ queryKey: [`${APICONSTANT.getPaymentGateway}`] });
            }
        } catch (error) {
            console.error("Error updating gateway:", error);
        }
    };

    const handleUpdate = (gatewayName) => {
        const selected = data?.data?.enabledGateway.find((gateway) => gateway.name === gatewayName);
        setSelectedGateway(selected);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedGateway(null);
    };

    const postMutation = usePostMutation("");

    const handleSubmitUpdate = async (data) => {
        try {
            const formData = {};

            Object.keys(data).forEach((key) => {
                if (data[key] instanceof FileList) {
                    const file = data[key][0];
                    console.log(file);
                    formData[key] = file ? file.name : "";
                } else {
                    formData[key] = data[key];
                }
            });

            formData["paymentGateway"] = selectedGateway?.indexName;

            const urlEncodedData = new URLSearchParams(formData).toString();

            const response = await postMutation.mutateAsync({
                url: { apiUrl: APICONSTANT.updatePaymentGateway },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: urlEncodedData,
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error updating gateway:", error);
        }
    };


    return (
        <>
            <Card bodyClass='flex items-center px-[24px] py-[16px]'>
                <div className="cursor-pointer" onClick={() => navigate(-1)}>
                    <Icon
                        icon="heroicons-outline:arrow-sm-left"
                        className="w-[30px] h-[30px] mr-4"
                    />
                </div>
                <span>Payment Gateway</span>
            </Card>
            <div className="grid lg:grid-cols-2 gap-x-[30px] gap-y-[20px] mt-[20px]">
                {data?.data?.enabledGateway?.map((gateway) => (
                    <Card key={gateway?.id} bodyClass="px-[24px] py-[16px]">
                        <div className="flex items-center justify-between">
                            <p>{gateway?.name}</p>
                            <div className="flex items-center justify-end">
                                <span
                                    className={`ml-4 text-[12px] font-semibold px-3 py-1 rounded ${gateway.isActive === true
                                        ? "bg-[#00d68f] text-white"
                                        : "bg-[#d60035] text-white"
                                        }`}
                                >
                                    {gateway?.isActive === true ? "ACTIVE" : "INACTIVE"}
                                </span>

                                <div className="lg:ml-6 relative">
                                    <Menu as="div" className="relative inline-block text-left">
                                        <Menu.Button>
                                            <Icon
                                                icon="heroicons-outline:dots-vertical"
                                                className="w-6 h-6 text-gray-500 cursor-pointer hover:text-gray-700"
                                            />
                                        </Menu.Button>
                                        <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className={`w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-100" : ""}`}
                                                        onClick={() => handleUpdate(gateway.name)}
                                                    >
                                                        <Icon
                                                            icon="heroicons-outline:pencil"
                                                            className="inline-block w-4 h-4 mr-2"
                                                        />
                                                        Edit
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            {/* DO NOT REMOVE BELOW COMMENT, TEMPORARY COMMENTED  */}
                                            {/* <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className={`w-full text-left px-4 py-2 text-sm ${active ? "bg-gray-100" : ""}`}
                                                        onClick={() => handleToggle(gateway?.indexName)}
                                                    >
                                                        <Icon
                                                            icon={`heroicons-outline:${gateway.isActive === "true" ? "x-circle" : "check-circle"}`}
                                                            className={`inline-block w-4 h-4 mr-2 ${gateway.isActive === "true" ? "text-red-500" : "text-green-500"}`}
                                                        />
                                                        {gateway.isActive === "true" ? "Inactive" : "Active"}
                                                    </button>
                                                )}
                                            </Menu.Item> */}
                                        </Menu.Items>
                                    </Menu>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[99999]" onClose={handleCloseModal}>
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
                    <div className="fixed inset-0 flex justify-center items-center">
                        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-2xl w-full">

                            <Dialog.Title className="text-lg font-semibold text-gray-700 mb-4">
                                Update Payment Gateway
                            </Dialog.Title>

                            <form onSubmit={handleSubmit(handleSubmitUpdate)}>
                                <div className="max-h-[78vh] overflow-auto" style={{
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}>
                                    {selectedGateway?.fields?.map((field) => (

                                        <div className="mb-4" key={field?.indexName}>
                                            {field?.type === "file" ? (
                                                <>
                                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                                        {field?.name}
                                                        <a
                                                            href={`${import.meta.env.VITE_API_URL}${field.value}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-500 ml-2 underline"
                                                        >
                                                            View
                                                        </a>
                                                    </label>
                                                    <input
                                                        type="file"
                                                        {...register(field.indexName)}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black-900 focus:border-black-900 sm:text-sm"
                                                    />
                                                    {errors[field.indexName] && (
                                                        <p className="text-red-500 text-sm mt-1">
                                                            {errors[field.indexName].message}
                                                        </p>
                                                    )}
                                                </>
                                            ) : (
                                                <Textinput
                                                    label={field?.name}
                                                    type={field?.type}
                                                    placeholder={`Please enter ${field?.indexName}`}
                                                    name={field?.indexName}
                                                    register={register}
                                                    error={errors[field?.indexName]}
                                                />
                                            )}
                                        </div>

                                    ))}
                                </div>

                                <div className="flex justify-end space-x-2 mt-4">
                                    {buttons?.map((btn) => {
                                        return (
                                            <button
                                                key={btn}
                                                type={btn === "Cancel" ? "button" : "submit"}
                                                onClick={btn === "Cancel" ? handleCloseModal : null}
                                                className={`px-4 py-2 ${btn === "Cancel" ? "bg-gray-300 text-gray-700" : "bg-black-900 text-white rounded"} rounded`}
                                            >
                                                {btn === "Cancel" ? "Cancel" : "Update"}
                                            </button>
                                        )
                                    })}
                                </div>

                            </form>

                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default PaymentConfig;
