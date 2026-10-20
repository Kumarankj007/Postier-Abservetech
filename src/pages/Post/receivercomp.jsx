import { APICONSTANT } from "@/components/services/config";
import Select from "react-select";
import { getApiMethos } from "@/components/services/gobal";
import Fileinput from "@/components/ui/Fileinput";
import { Textinput } from "@/components/ui/input";
import DatePickerComponent from "@/components/ui/input/DatePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const selectStyles = {
    option: (provided) => ({
        ...provided,
        fontSize: "14px",
    }),
};

const FormValidationSchema = yup
    .object({
        fname: yup.string().required("First name is required"),
        type: yup.string().required("Last name is required"),
        description: yup
            .string()
            .required("Phone number is required")
            .matches(/^[0-9]+$/, "Phone number must be only digits")
            .min(10, "Phone number must be at least 10 digits")
            .max(10, "Phone number can't be more than 15 digits"),
        email: yup.string().email("Invalid email").required("Email is required"),
    })
    .required();

export default function ReceiverDetails(data) {
    const values = data?.data?.data?.posts[0] ? data?.data?.data?.posts[0]?.receiver : {}
    const {
        register,
        formState: { errors, dirtyFields },
        handleSubmit,
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
    });

    const { data: parcelTypeData, error: parcelTypeError, isLoading: parcelTypeLoading } = useQuery({
        queryKey: ["viewParcelType", APICONSTANT.viewParcelType],
        queryFn: getApiMethos,
        retry: 0,
    });
    const { data: DeliveryParcelTypeData, error: DeliveryparcelTypeError, isLoading: DeliveryparcelTypeLoading } = useQuery({
        queryKey: ["SingleDeliveryParcelType", APICONSTANT.viewDeliverParcel],
        queryFn: getApiMethos,
        retry: 0,
    })
    const parcelType = useMemo(() => {
        return parcelTypeData?.data?.parcelType.map((item) => {
            const data = {};
            if (item?.name) {
                data.value = item.name;
                data.label = item.name;
            }
            return data;
        }) || [];
    }, [parcelTypeData]);

    const DeliveryParcelType = useMemo(() => {
        return DeliveryParcelTypeData?.data?.deliverParcelType.map((item) => {
            const data = {};
            if (item?.name) {
                data.value = item.name;
                data.label = item.name;
            }
            return data;
        }) || [];
    }, [DeliveryParcelTypeData]);

    const [selectedMenus, setSelectedMenus] = useState(0);
    const [selectedFile, setSelectedFile] = useState([]);
    const handleMenuChange = (value) => {
        setSelectedMenus(value);
    };

    const handleFileChange = (e) => {
        setSelectedFile((prev) => [...prev, ...Array.from(e.target.files ?? [])])
    };

    const Data = {
        fname: values?.firstName ? values?.firstName : "",
        lname: values?.lastName ? values?.lastName : "",
        email: values?.email ? values?.email : "",
        pinCode: values?.pinCode ? values?.pinCode : "",
        phone: values?.phone ? values?.phone : "",
        phoneCode: values?.phoneCode ? values?.phoneCode : "",
        address: values?.address ? values?.address : "",
    };
    console.log('Data', Data)
    const onSubmit = (data) => {
        const value = {
            fname: data.fname,
            type: data.type,
            email: data.email,
            description: data.description,
            postId: id,
        };
        putMutation.mutateAsync({
            url: { apiUrl: APICONSTANT.editpost },
            body: value,
        });
    };
    const selectedType = useMemo(() => {
        const val = (parcelType && selectedMenus) && parcelType.findIndex((item) => item.value === selectedMenus)
        return val
    }, [parcelType, selectedMenus])
    console.log('selectedType', selectedType)
    useEffect(() => {
        reset(Data);
        if (Data.type) {
            setSelectedMenus(Data?.type)
        }
        if (Data.image) {
            setSelectedFile(Data.image)
        }
    }, [values]);
    console.log('values', values)
    return (
        <>
            <form
                id={"editUserForm"}
                onSubmit={handleSubmit(onSubmit)}
                className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
            >
                <Textinput
                    label="First Name"
                    type="text"
                    placeholder="Type your User Name"
                    name="fname"
                    register={register}
                    error={errors.fname}
                />
                <Textinput
                    label="Last Name"
                    type="text"
                    placeholder="Type your User Name"
                    name="lname"
                    register={register}
                    error={errors.lname}
                />
                <Textinput
                    label="Email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    register={register}
                    error={errors.email}
                />
                <Textinput
                    label="Pin Code"
                    type="text"
                    placeholder="Pin Code"
                    name="pinCode"
                    register={register}
                    error={errors.pinCode}
                />
                <Textinput
                    label="Phone Code"
                    type="text"
                    placeholder="Phone Code"
                    name="phoneCode"
                    register={register}
                    error={errors.phoneCode}
                />
                <Textinput
                    label="Phone Number"
                    type="text"
                    placeholder="Phone Number"
                    name="phone"
                    register={register}
                    error={errors.phone}
                />
                <Textinput
                    label="Address"
                    type="text"
                    placeholder="Address"
                    name="address"
                    register={register}
                    error={errors.address}
                />

            </form>
        </>
    )
}