import React, { useState } from 'react'
import Textinput from "@/components/ui/Textinput";
import Fileinput from "@/components/ui/Fileinput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query"
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/ButtonComp";
import Select from "react-select";
import DatePickerComponent from "@/components/ui/input/DatePicker";
import { postApiMethod } from '@/components/services/gobal';
import { APICONSTANT } from '@/components/services/config';
import usePostMutation from "@/hooks/usePostMuation";
import { toast } from 'react-toastify';
import { Navigate, useNavigate } from 'react-router-dom';


// Validation Schema
const FormValidationSchema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    order: yup.string().required("Order is required"),
    gender: yup.string().required("Gender is required"),
    features: yup
        .array()
        .of(yup.string())
        .min(1, "At least one feature is required"),
    weight: yup.string().required("Weight is required"),
    capacity: yup.string().required("Capacity is required"),
    file1: yup
        .mixed()
        .required("File is required")
        // .test("fileSize", "File size too large", value => value && value.size <= 5 * 1024 * 1024)  // Max 5MB
        .test("fileType", "Unsupported file type", value =>
            value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
        ),
    file2: yup
        .mixed()
        .required("File2 is required")
        // .test("fileSize", "File size too large", value => value && value.size <= 5 * 1024 * 1024)  // Max 5MB
        .test("fileType", "Unsupported file type", value =>
            value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)
        ),
}).required();

const serviceFeatures = [
    { value: "Pending", label: "Pending" },
    { value: "Published", label: "Published" },
    { value: "Transit", label: "Transit" },
    { value: "Finished", label: "Finished" },
    { value: "Cancelled", label: "Cancelled" }
];

const genderTypes = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Others", label: "Others" },
];

const selectStyles = {
    option: (provided) => ({
        ...provided,
        fontSize: "14px",
    }),
};

const addServiceType = () => {

    const navigate = useNavigate();
    const [selectedServiceFeatures, setSelectedServiceFeatures] = useState(null);
    const [selectedGenderTypes, setselectedGenderTypes] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);



    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
        watch, control, setValue
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
        mode: "all",
        defaultValues: { features: [] },
    })
    console.log("errors", errors)
    const handleFeaturesChange = (selectedOption) => {
        setSelectedServiceFeatures(selectedOption)
    }

    const handleGenderChange = (selectedOptions) => {
        setselectedGenderTypes(selectedOptions?.value || null);
    }

    const [selectedFile1, setSelectedFile1] = useState(null);
    const [selectedFile2, setSelectedFile2] = useState(null);



    //   const postMutation = usePostMutation("/creteria/serviceType");


    const handleFileChange1 = (e) => {
        const file = e.target.files[0];
        setSelectedFile1(file);
        setValue("file1", file);  // Set the file in form state
    };
    const handleFileChange2 = (e) => {
        const file = e.target.files[0];
        setSelectedFile2(file);
        setValue("file2", file);  // Set the file in form state
    };



    const mutation = useMutation({
        mutationFn: postApiMethod,
        onSuccess: (data) => {
            console.log("onSuccess", data)
            navigate("/servicetype");
            toast.success(data.message);
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err.message);
        },
    });

    const onSubmit = (data) => {
        console.log(data, "onsubmitdata");
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("order", data.order);
        formData.append("gender", data.gender);
        formData.append("features", data.features);
        formData.append("weight", data.weight);
        formData.append("file1", selectedFile1);
        formData.append("file2", selectedFile2);
        formData.append("capacity", data.capacity);
        console.log("formdataa", formData)
        mutation.mutateAsync({
            url: { apiUrl: APICONSTANT.addServiceType },
            body: formData,
        });
        postMutation.mutateAsync(payload)

    }

    // const onSubmit = (data) => {
    //     const formData = new FormData();
    //     formData.append("name", data.name);
    //     formData.append("file", selectedFile);

    //     mutation.mutateAsync({
    //       url: { apiUrl: APICONSTANT.addVehicle },
    //       body: formData,
    //     });
    //   };

    return (
        <Card
            title={"Add Service Type"}
            footer={<Button formId="addServiceTypeForm" />}
            backIcon={true}
        >
            <form
                id={"addServiceTypeForm"}
                onSubmit={handleSubmit(onSubmit)}
                className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6">
                <Textinput
                    label="Name"
                    type="text"
                    placeholder="Type Name"
                    name="name"
                    register={register}
                    error={errors.name}
                />
                <Textinput
                    label="Description"
                    type="text"
                    placeholder="Type Description"
                    name="description"
                    register={register}
                    error={errors.description}
                />
                <Textinput
                    label="Order"
                    type="number"
                    placeholder="Type order"
                    name="order"
                    register={register}
                    error={errors.order}
                />

                <div>
                    <label className="form-label">Features</label>
                    <Controller
                        name="features"
                        control={control}
                        render={({ field }) => (

                            <Select
                                {...field}
                                isMulti
                                options={serviceFeatures}
                                onChange={(selectedOptions) => {
                                    // Set selected features as an array of strings
                                    setValue("features", selectedOptions ? selectedOptions.map(option => option.value) : []);
                                }}
                                value={serviceFeatures.filter(option =>
                                    field.value?.includes(option.value)
                                )}
                                styles={selectStyles}
                                className="react-select"
                                classNamePrefix="select"
                            />
                        )}
                    />
                    {errors.features && <p className="error mt-2 text-danger-500 block text-sm">{errors.features.message}</p>}
                </div>


                <div>
                    <label className="form-label">Gender</label>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={genderTypes}
                                onChange={(option) => setValue("gender", option.value)}
                                value={genderTypes.find(option => option.value === field.value)}
                                styles={selectStyles}
                                className="react-select"
                                classNamePrefix="select"
                            />
                        )}
                    />
                    {errors.gender && <p className="error mt-2 text-danger-500 block text-sm">{errors.gender.message}</p>}
                </div>

                <Textinput
                    label="Weight"
                    type="number"
                    placeholder="Type Weight"
                    name="weight"
                    register={register}
                    error={errors.weight}
                />

                <div>
                    <label className="form-label">File1</label>
                    <Controller
                        name="file1"
                        control={control}
                        render={({ field }) => (
                            <>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        handleFileChange1(e);
                                        field.onChange(e.target.files[0]);  // Update Controller field
                                    }}
                                />
                                {selectedFile1 && (
                                    <img
                                        src={URL.createObjectURL(selectedFile1)}
                                        alt="Preview"
                                        style={{ width: "100px", height: "auto", marginTop: "10px" }}
                                    />
                                )}
                            </>
                        )}
                    />
                    {errors.file1 && <p className="error mt-2 text-danger-500 block text-sm">{errors.file1.message}</p>}
                </div>

                <div>
                    <label className="form-label">File2</label>
                    <Controller
                        name="file2"
                        control={control}
                        render={({ field }) => (
                            <>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        handleFileChange2(e);
                                        field.onChange(e.target.files[0]);  // Update Controller field
                                    }}
                                />
                                {selectedFile2 && (
                                    <img
                                        src={URL.createObjectURL(selectedFile2)}
                                        alt="Preview"
                                        style={{ width: "100px", height: "auto", marginTop: "10px" }}
                                    />
                                )}
                            </>
                        )}
                    />
                    {errors.file2 && <p className="error mt-2 text-danger-500 block text-sm">{errors.file2.message}</p>}
                </div>
                <Textinput
                    label="Capacity"
                    type="number"
                    placeholder="Capacity"
                    name="capacity"
                    register={register}
                    error={errors.capacity}
                />
            </form>

        </Card>
    )
}

export default addServiceType
