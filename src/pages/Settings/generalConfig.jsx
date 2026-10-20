import React, { useEffect, useState } from "react";
import { Textinput, Fileinput } from "@components/ui/input";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { postApiMethod, putApiMethod } from "../../components/services/gobal";
import { APICONSTANT } from "../../components/services/config";
import { getApiMethos } from "../../components/services/gobal";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import Card from "@/components/ui/Card";
import { Routes } from "@routesConfig";
import useReactMutation from "@/hooks/useReactMutation";
import usePutMutation from "@/hooks/usePutMuation";
import { Button } from "@/components/ui/ButtonComp";
import usePostMutation from "@/hooks/usePostMuation";

const FormValidationSchema = yup
    .object({
    })
    .required();

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


const GeneralConfig = () => {

    const queryClient = useQueryClient();
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

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFileFav, setSelectedFileFav] = useState(null);
    const [selectedMenus, setSelectedMenus] = useState([
        adminMenus[0],
        adminMenus[1],
    ]);

    const { data, error, isLoading } = useQuery({
        queryKey: ["singleSettings", APICONSTANT.settings],
        queryFn: getApiMethos,
        retry: 0,
    });


    const editData = {
        name: data?.data?.data?.app?.name ? data?.data?.data?.app?.name : "",
        language: data?.data?.data?.app?.language ? data?.data?.data?.app?.language : "",
        phoneCode: data?.data?.data?.app?.phoneCode ? data?.data?.data?.app?.phoneCode : "",
        currency: data?.data?.data?.app?.currency ? data?.data?.data?.app?.currency : "",
        baseurl: data?.data?.data?.app?.baseurl ? data?.data?.data?.app?.baseurl : "",

        mapId: data?.data?.data?.google?.mapId ? data?.data?.data?.google?.mapId : "",
        googleClientId: data?.data?.data?.google?.googleClientId ? data?.data?.data?.google?.googleClientId : "",
        googleClientSecret: data?.data?.data?.google?.googleClientSecret ? data?.data?.data?.google?.googleClientSecret : "",
        mapApiKey: data?.data?.data?.google?.mapApiKey ? data?.data?.data?.google?.mapApiKey : "",

        mapServerKey: data?.data?.data?.google?.mapServerKey ? data?.data?.data?.google?.mapServerKey : "",
        androidKey: data?.data?.data?.google?.androidKey ? data?.data?.data?.google?.androidKey : "",
        iosKey: data?.data?.data?.google?.iosKey ? data?.data?.data?.google?.iosKey : "",
    };



    const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
    const handleFileFavChange = (e) => setSelectedFileFav(e.target.files[0]);
    const handleMenuChange = (value) => setSelectedMenus(value);
    const postMutation = usePostMutation("/settings");

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("language", data.language);
        formData.append("phoneCode", data.phoneCode);
        formData.append("currency", data.currency);
        formData.append("baseurl", data.baseurl);

        formData.append("mapId", data.mapId);
        formData.append("googleClientId", data.googleClientId);
        formData.append("googleClientSecret", data.googleClientSecret);
        formData.append("mapApiKey", data.mapApiKey);

        formData.append("mapServerKey", data.mapServerKey);
        formData.append("androidKey", data.androidKey);
        formData.append("iosKey", data.iosKey);
        formData.append("logo", selectedFile);
        formData.append("favicon", selectedFileFav);
        const response = await postMutation.mutateAsync({
            url: { apiUrl: APICONSTANT.updatesettings },
            body: formData,
        });
        if (response.type === "success") {
            await new Promise((resolve) => setTimeout(resolve, 3000));
            queryClient.invalidateQueries(["singleSettings", APICONSTANT.settings]);
        }

    }

    useEffect(() => {
        reset(editData);
        setSelectedFile(
            data?.data?.data?.app?.logo ? data?.data?.data?.app?.logo : ""
        );
        setSelectedFileFav(
            data?.data?.data?.app?.favicon ? data?.data?.data?.app?.favicon : ""
        );
    }, [data]);

    if (isLoading)
        return (
            <div>
                <Loading />
            </div>
        );
    if (error) return <div>An error occurred: {error.message}</div>;

    return (
        <>
            <Card
                title={"general-settings"}
                footer={<Button formId="generalsettings" />}
                backIcon={true}
            >
                {isLoading ? (
                    <Loading />
                ) : (
                    <form
                        id={"generalsettings"}
                        onSubmit={handleSubmit(onSubmit)}
                        // className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
                        className="flex justify-between flex-wrap"
                    >
                        <div className='md:w-[100%] mb-10'><h6>App Settings</h6></div>

                        <div className='md:w-[48%] mb-4'>
                            <Textinput
                                label="Name"
                                type="text"
                                placeholder="Type your Name"
                                name="name"
                                register={register}
                                error={errors.name}
                            />
                        </div>
                        <div className='md:w-[48%] mb-4'>
                            <Textinput
                                label="Language"
                                type="text"
                                placeholder="Type language"
                                name="language"
                                register={register}
                                error={errors.language}
                            />
                        </div>
                        <div className='md:w-[48%] mb-4'>
                            <Textinput
                                label="phoneCode"
                                type="text"
                                placeholder="phoneCode"
                                name="phoneCode"
                                register={register}
                                error={errors.phoneCode}
                            /></div>
                        <div className='md:w-[48%] mb-4'>
                            <Textinput
                                label="Currency"
                                type="text"
                                placeholder="Currency"
                                name="currency"
                                register={register}
                                error={errors.currency}
                            /></div>



                        <div className="w-[48%]">
                            <label className="form-label">Logo</label>
                            <Fileinput
                                name="logo"
                                selectedFile={selectedFile}
                                onChange={handleFileChange}
                                preview
                            />
                        </div>

                        <div className="w-[48%]">
                            <label className="form-label">Favicon</label>
                            <Fileinput
                                name="favicon"
                                selectedFile={selectedFileFav}
                                onChange={handleFileFavChange}
                                preview
                            />
                        </div>


                        <div className='md:w-[48%] mb-4'>
                            <Textinput
                                label="Base URL"
                                type="text"
                                placeholder="baseurl"
                                name="baseurl"
                                register={register}
                                error={errors.baseurl}
                            /></div>
                        <div className='md:w-[100%] mb-10'><h6>Maps</h6></div>

                        <div className='flex flex-wrap justify-between'>
                            <div className='md:w-[48%] mb-4'>
                                <Textinput
                                    label="Map Id"
                                    type="text"
                                    placeholder="Type MapId"
                                    name="mapId"
                                    register={register}
                                    error={errors.mapId}
                                />
                            </div>
                            <div className='md:w-[48%] mb-4 '>
                                <Textinput
                                    label="Google ClientId"
                                    type="text"
                                    placeholder="Type GoogleClientId"
                                    name="googleClientId"
                                    register={register}
                                    error={errors.googleClientId}
                                />
                            </div>
                            <div className='md:w-[48%] mb-4'>
                                <Textinput
                                    label="Google Client Secret"
                                    type="text"
                                    placeholder="Type Google Client Secret"
                                    name="googleClientSecret"
                                    register={register}
                                    error={errors.googleClientSecret}
                                />
                            </div>
                            <div className='md:w-[48%] mb-4'>
                                <Textinput
                                    label="Map ApiKey"
                                    type="text"
                                    placeholder="Type Map ApiKey"
                                    name="mapApiKey"
                                    register={register}
                                    error={errors.mapApiKey}
                                />
                            </div>
                            <div className='md:w-[48%] mb-4'>
                                <Textinput
                                    label="Map ServerKey"
                                    type="text"
                                    placeholder="Type MapServerKey"
                                    name="mapServerKey"
                                    register={register}
                                    error={errors.mapServerKey}
                                />
                            </div>
                            <div className='md:w-[48%] mb-4'>
                                <Textinput
                                    label="Map ServerKey"
                                    type="text"
                                    placeholder="Type Map ServerKey"
                                    name="mapServerKey"
                                    register={register}
                                    error={errors.mapServerKey}
                                />
                            </div>
                            <div className='md:w-[48%] mb-4'>
                                <Textinput
                                    label="Ios Key"
                                    type="text"
                                    placeholder="Type iosKey"
                                    name="iosKey"
                                    register={register}
                                    error={errors.iosKey}
                                />
                            </div>
                        </div>

                    </form>
                )}
            </Card>
        </>
    );
};

export default GeneralConfig;
