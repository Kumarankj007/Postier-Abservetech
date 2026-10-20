import React, { useEffect, useState } from "react";
import { Textinput, Fileinput } from "@components/ui/input";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, QueryClient, useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import { Routes } from "@routesConfig";
import useReactMutation from "@/hooks/useReactMutation";
import usePutMutation from "@/hooks/usePutMuation";
import { Button } from "@/components/ui/ButtonComp";
import { APICONSTANT } from "@/components/services/config";
import { getApiMethos } from "@/components/services/gobal";

const FormValidationSchema = yup.object({
    baseFare: yup.string().required("BaseFare is required"),
    // bookingFare: yup.string().required("BookingFare is required"),
    // minimumFare: yup.string().required("MinimumFare is required"),
    // weightFare: yup.string().required("WeightFare is required"),
    // faretype: yup.string().required("Faretype is required"),
    // farevalue: yup.string().required("Farevalue is required"),
    // timeFare: yup.string().required("TimeFare is required"),
    // commision: yup.string().required("Commision is required"),
    // taxFare: yup.string().required("TaxFare is required"),
    // postier: yup.string().required("Postier is required"),
    // user: yup.string().required("User is required"),
    // allowedMin: yup.string().required("AllowedMin is required"),
    // waitingFare: yup.string().required("WaitingFare is required"),
});


const faretypes = [
    { value: "unitRate", label: "Unit Rate" },
    { value: "flatRate", label: "Flat Rate" },
];

const adminTypes = [
    { value: "Admin", label: "Admin" },
    { value: "Super Admin", label: "Super Admin" },
    { value: "Billing Admin", label: "Billing Admin" },
    { value: "Dispatcher Admin", label: "Dispatcher Admin" },
];

const adminMenus = [
    { value: "Dashboard", label: "Dashboard" },
    { value: "Admin", label: "Admin" },
    { value: "User", label: "User" },
    { value: "Approval List", label: "Approval List" },
    { value: "Company", label: "Company" },
    { value: "Trips", label: "Trips" },
    { value: "Reviews", label: "Reviews" },
    { value: "Report", label: "Report" },
    { value: "Offers", label: "Offers" },
    { value: "Lost Management", label: "Lost Management" },
    { value: "Utility", label: "Utility" },
    { value: "Static Pages", label: "Static Pages" },
    { value: "Settings", label: "Settings" },
];

const selectStyles = {
    option: (provided) => ({
        ...provided,
        fontSize: "14px",
    }),
};

const EditPricing = () => {
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const id = search.get("id");
    const navigate = useNavigate();
    const {
        register,
        formState: { errors, dirtyFields },
        handleSubmit,
        setValue,
        reset, control
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
        mode: "all",
    });
    console.log("setvalueee", setValue)

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedMenus, setSelectedMenus] = useState([
        adminMenus[0],
        adminMenus[1],
    ]);

    const { data, error, isLoading } = useQuery({
        queryKey: ["singlePricing", APICONSTANT.viewPricing + "/" + id],
        queryFn: getApiMethos,
        retry: 0,
        enabled: !!id,
    });



    const { data: servicedata } = useQuery({
        queryKey: ["Servicetype", APICONSTANT.viewServiceType],
        queryFn: getApiMethos,
        retry: 0,
    });

    console.log("servicetype", data?.data?.Pricing)

    const signalservicetypes = data?.data?.Pricing?.map(item => ({
        value: item.serviceId?._id,
        label: item.serviceId?.name
    })) || [];

    console.log("singlePricing", signalservicetypes)

    const servicetypes = servicedata?.data?.admin?.map(item => ({
        value: item._id,
        label: item.name
    })) || [];

    // useEffect(() => {
    //     if (signalservicetypes.length > 0) {
    //         setValue("servicetype", signalservicetypes[0].value);
    //     }
    // }, [setValue, signalservicetypes]);

    const editData = {
        baseFare: data?.data?.Pricing[0]?.baseFare,
        bookingFare: data?.data?.Pricing[0]?.bookingFare,
        minimumFare: data?.data?.Pricing[0]?.minimumFare,
        weightFare: data?.data?.Pricing[0]?.weightFare,
        faretype: data?.data?.Pricing[0]?.fare.type,
        farevalue: data?.data?.Pricing[0]?.fare.value,
        timeFare: data?.data?.Pricing[0]?.timeFare,
        commision: data?.data?.Pricing[0]?.commision,
        taxFare: data?.data?.Pricing[0]?.taxFare.fare,
        postier: data?.data?.Pricing[0]?.cancelationFare.postier,
        user: data?.data?.Pricing[0]?.cancelationFare.user,
        allowedMin: data?.data?.Pricing[0]?.waitingFare.allowedMin,
        waitingFare: data?.data?.Pricing[0]?.waitingFare.fare,
        servicetype: signalservicetypes[0]?.value
    };



    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

    const handleMenuChange = (value) => setSelectedMenus(value);

    const putMutation = usePutMutation("/pricing");

    const onSubmit = (data) => {
        console.log("formData", data)
        const formData = new FormData();
        formData.append("pricingId", id);
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

        putMutation.mutateAsync({
            url: { apiUrl: APICONSTANT.viewPricing },
            body: formData,
        });
    };

    useEffect(() => {
        reset(editData);
        // setSelectedFile(
        //     data?.data?.Pricing[0]?.profile ? data?.data?.Pricing[0]?.profile : ""
        // );
    }, [data]);

    if (isLoading)
        return (
            <div>
                <Loading />
            </div>
        );
    if (error) return <div>An error occurred: {error.message}</div>;

    return (
        <Card
            title={"Edit Pricing"}
            footer={<Button formId="editpricingForm" />}
            backIcon={true}
        >
            {isLoading ? (
                <Loading />
            ) : (
                <form
                    id={"editpricingForm"}
                    onSubmit={handleSubmit(onSubmit)}
                    // className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
                    className="flex justify-between flex-wrap"
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
                        {errors.faretype && <p className="error mt-2 text-danger-500 block text-sm">{errors.faretype.message}</p>}
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
                </form>
            )}
        </Card>
    );
};

export default EditPricing;
