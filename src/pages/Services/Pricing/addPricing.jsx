import React, { useState } from 'react'
import Textinput from "@/components/ui/Textinput";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query"
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/ButtonComp";
import Select from "react-select";
import DatePickerComponent from "@/components/ui/input/DatePicker";
import { getApiMethos, postApiMethod } from '@/components/services/gobal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { APICONSTANT } from '@/components/services/config';

// Validation Schema
const FormValidationSchema = yup.object({
    baseFare: yup.string().required("BaseFare is required"),
    bookingFare: yup.string().required("BookingFare is required"),
    minimumFare: yup.string().required("MinimumFare is required"),
    weightFare: yup.string().required("WeightFare is required"),
    faretype: yup.string().required("Faretype is required"),
    farevalue: yup.string().required("Farevalue is required"),
    timeFare: yup.string().required("TimeFare is required"),
    commision: yup.string().required("Commision is required"),
    taxFare: yup.string().required("TaxFare is required"),
    postier: yup.string().required("Postier is required"),
    user: yup.string().required("User is required"),
    allowedMin: yup.string().required("AllowedMin is required"),
    waitingFare: yup.string().required("WaitingFare is required"),
    servicetype: yup.string().required("servicetype is required"),
});

const faretypes = [
    { value: "unitRate", label: "Unit Rate" },
    { value: "flatRate", label: "Flat Rate" },
];

const tripTypes = [
    { value: "Food Parcel", label: "Food Parcel" },
    { value: "Fragile", label: "Fragile" },
    { value: "Workshop Materials", label: "Workshop Materials" },
    { value: "Furnitures", label: "Furnitures" },
    { value: "Electron", label: "Electron" },
];

const selectStyles = {
    option: (provided) => ({
        ...provided,
        fontSize: "14px",
    }),
};

const addServiceType = () => {
    const navigate = useNavigate();

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedTripTypes, setSelectedTripTypes] = useState(null);
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
    })
    console.log("useformerror", errors)

    const handleStatusChange = (selectedOption) => {
        setSelectedStatus(selectedOption)
    }

    const handleTripMenuChange = (selectedOptions) => {
        setSelectedTripTypes(selectedOptions)
    }

    const mutation = useMutation({
        mutationFn: postApiMethod,
        onSuccess: (data) => {
            console.log("onSuccess", data)
            navigate("/pricing");
            toast.success(data.message);
        },
        onError: (err) => {
            console.log("err", err);
            toast.error(err.message);
        },
    });

    const onSubmit = (data) => {
        console.log("onSubmitdata", data);
        // const formData = {
        //     baseFare: data.baseFare,
        //     bookingFare: data.bookingFare,
        //     minimumFare: data.minimumFare,
        //     weightFare: data.weightFare,
        //     fare: {
        //         type: data.faretype,
        //         value: data.farevalue
        //     },
        //     timeFare: data.timeFare,
        //     commision: data.commision,
        //     taxFare: {
        //         status: "true",
        //         fare: data.taxFare
        //     },
        //     cancelationFare: {
        //         postier: data.postier,
        //         user: data.user
        //     },
        //     waitingFare: {
        //         status: "true",
        //         allowedMin: data.allowedMin,
        //         fare: data.waitingFare
        //     }
        // }
        const formData = new FormData();
        formData.append("baseFare", data.baseFare);
        formData.append("bookingFare", data.bookingFare);
        formData.append("minimumFare", data.minimumFare);
        formData.append("weightFare", data.weightFare);
        formData.append("fare[type]", data.faretype);
        formData.append("fare[value]", data.farevalue);
        formData.append("timeFare", data.timeFare);
        formData.append("commision", data.commision);
        formData.append("taxFare[fare]", data.taxFare);
        formData.append("cancelationFare[partner]", data.postier);
        formData.append("cancelationFare[customer]", data.user);
        formData.append("waitingFare[allowedMin]", data.allowedMin);
        formData.append("waitingFare[fare]", data.waitingFare);
        formData.append("serviceId", data.servicetype);
        console.log("formData", formData)
        mutation.mutateAsync({
            url: { apiUrl: APICONSTANT.viewPricing },
            body: formData,
        });
        postMutation.mutateAsync(payload)
    }

    const { data: servicedata } = useQuery({
        queryKey: ["Servicetype", APICONSTANT.viewServiceType],
        queryFn: getApiMethos,
        retry: 0,
    });
    console.log("servicedata", servicedata)

    const servicetypes = servicedata?.data?.admin?.map(item => ({
        value: item._id,
        label: item.name
    })) || [];


    return (
        <Card
            title={"Add Pricing Type"}
            footer={<Button formId="addTripForm" />}
            backIcon={true}
        >
            <form
                id={"addTripForm"}
                onSubmit={handleSubmit(onSubmit)}
                // className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
                className='flex justify-between flex-wrap'
            >
                <div className='md:w-[48%] mr-2 mb-4'>
                    <Textinput
                        label="Base Fare"
                        type="number"
                        placeholder="Type Base Fare"
                        name="baseFare"
                        register={register}
                        error={errors.baseFare}
                    />
                </div>
                <div className='md:w-[48%]'>
                    <Textinput
                        label="Booking Fare"
                        type="number"
                        placeholder="Type Booking Fare"
                        name="bookingFare"
                        register={register}
                        error={errors.bookingFare}
                    />
                </div>
                <div className='md:w-[48%] mr-2 mb-4'>
                    <Textinput
                        label="Minimum Fare"
                        type="number"
                        placeholder="Type Minimum Fare"
                        name="minimumFare"
                        register={register}
                        error={errors.minimumFare}
                    />
                </div>
                <div className='md:w-[48%] mb-4'>
                    <Textinput
                        label="Weight Fare"
                        type="number"
                        placeholder="Type Weight Fare"
                        name="weightFare"
                        register={register}
                        error={errors.weightFare}
                    />
                </div>
                <div className='md:w-[48%] mb-4'>
                    <label className="form-label">Fare Type</label>
                    <Controller
                        name="faretype"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                options={faretypes}
                                onChange={(option) => setValue("faretype", option.value)}
                                value={faretypes.find(option => option.value === field.value)}
                                styles={selectStyles}
                                className="react-select"
                                classNamePrefix="select"
                            />
                        )}
                    />
                    {errors.gender && <p className="error mt-2 text-danger-500 block text-sm">{errors.gender.message}</p>}
                </div>
                <div className='md:w-[48%] mb-4'>
                    <label className="form-label">Service Type</label>
                    <Controller
                        name="servicetype"
                        control={control}
                        render={({ field }) => (

                            <Select
                                {...field}
                                options={servicetypes}
                                onChange={(option) => setValue("servicetype", option.value)}
                                value={servicetypes.find(option => option.value === field.value)}
                                styles={selectStyles}
                                className="react-select"
                                classNamePrefix="select"
                            />
                        )}
                    />
                    {errors.servicetype && (
                        <p className="error mt-2 text-danger-500 block text-sm">
                            {errors.servicetype.message}
                        </p>
                    )}
                </div>
                <div className='md:w-[48%] mb-4'>
                    <Textinput
                        label="Fare Value"
                        type="number"
                        placeholder="Fare Value"
                        name="farevalue"
                        register={register}
                        error={errors.farevalue}
                    />
                </div>
                <div className='md:w-[48%] mr-2 mb-4'>
                    <Textinput
                        label="timeFare"
                        type="number"
                        placeholder="Type Time Fare"
                        name="timeFare"
                        register={register}
                        error={errors.timeFare}
                    />
                </div>
                <div className='md:w-[48%] mb-4'>
                    <Textinput
                        label="commision"
                        type="number"
                        placeholder="Type Commision"
                        name="commision"
                        register={register}
                        error={errors.commision}
                    />
                </div>
                <div className='md:w-[48%] mr-2 mb-4'>
                    <Textinput
                        label="taxFare"
                        type="number"
                        placeholder="Type taxFare"
                        name="taxFare"
                        register={register}
                        error={errors.taxFare}
                    />
                </div>

                <div className='w-[100%]'>
                    <p className='my-5'>cancelation Fare</p>
                    <div className='flex justify-between'>
                        <div className='md:w-[48%] mr-2 mb-4'>
                            <Textinput
                                label="postier"
                                type="number"
                                placeholder="Type postier"
                                name="postier"
                                register={register}
                                error={errors.postier}
                            />
                        </div>
                        <div className='md:w-[48%] mb-4'>
                            <Textinput
                                label="user"
                                type="number"
                                placeholder="Type user"
                                name="user"
                                register={register}
                                error={errors.user}
                            />
                        </div>
                    </div>
                </div>

                <div className='w-[100%]'>
                    <p className='my-4'>Waiting Fare</p>
                    <div className='flex justify-between'>
                        <div className='md:w-[48%] mr-2 mb-4'>
                            <Textinput
                                label="allowedMin"
                                type="number"
                                placeholder="Type allowedMin"
                                name="allowedMin"
                                register={register}
                                error={errors.allowedMin}
                            />
                        </div>
                        <div className='md:w-[48%] mb-4'>
                            <Textinput
                                label="Fare"
                                type="number"
                                placeholder="Type Waiting Fare"
                                name="waitingFare"
                                register={register}
                                error={errors.waitingFare}
                            />
                        </div>
                    </div>
                </div>

                {/* <div>
                    <label className="form-label">Type</label>
                    <Select
                        isMulti
                        value={selectedTripTypes}
                        styles={selectStyles}
                        className="react-select"
                        classNamePrefix="select"
                    />
                </div>

                <div className='flex justify-between'>
                    <DatePickerComponent
                        selectedDate={startDate} // Ensure this is a Date object
                        onDateChange={setStartDate}
                        label="Start Date"
                        placeholder="Select a date"
                        id="startDate"
                    />
                    <DatePickerComponent
                        selectedDate={endDate}
                        onDateChange={setEndDate}
                        label="End Date"
                        placeholder="Select a date"
                        id="endDate"
                    />
                </div> */}
            </form>

        </Card>
    )
}

export default addServiceType
