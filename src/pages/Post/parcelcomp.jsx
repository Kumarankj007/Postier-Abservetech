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

export default function ParcelDetails(data) {
    console.log("ParcelDetailsdata", data)
    const values = data?.data?.data?.post ? data?.data?.data?.post?.parcel : {}
    console.log("ParcelDetails", data?.data?.data)
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
    const Data = {
        description: values?.description ? values?.description : "",
        date: values?.deliveryDate ? values?.deliveryDate : "",
        weight: values?.weight ? values?.weight : "",
        width: values?.width ? values?.width : "",
        height: values?.height ? values?.height : "",
        length: values?.length ? values?.length : "",
        desc: values?.desc ? values?.desc : "",
        image: values?.image[0] ? values?.image[0] : [],
        type: values?.type ? values?.type : "",
        dimensionType: values?.dimensionType ? values?.dimensionType : "",
    };
    console.log('Data123', Data)
    useEffect(() => {
        reset(Data);
        if (Data.type) {
            setSelectedMenus(Data?.type)
        }
        if (Data.image) {
            setSelectedFile(Data.image)
            console.log("imgaeee", Data.image)
        }
    }, [values]);
    console.log('values', values)
    return (
        <>
            <form
                id={"editpostForm"}
                onSubmit={handleSubmit(onSubmit)}
                className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
            >

                <Textinput
                    label="Type"
                    type="text"
                    placeholder="Type "
                    name="type"
                    register={register}
                    error={errors.description}
                />
                <Textinput
                    label="Parcel Weight"
                    type="number"
                    placeholder="Weigth"
                    name="weight"
                    register={register}
                    error={errors.weight}
                />
                <Textinput
                    label="Parcel Height"
                    type="number"
                    placeholder="Height"
                    name="height"
                    register={register}
                    error={errors.height}
                />
                <Textinput
                    label="Parcel Width"
                    type="number"
                    placeholder="Width"
                    name="width"
                    register={register}
                    error={errors.width}
                />
                <Textinput
                    label="Parcel Length"
                    type="number"
                    placeholder="Length"
                    name="length"
                    register={register}
                    error={errors.length}
                />
                <Textinput
                    label="Desc"
                    type="text"
                    placeholder="Desc"
                    name="desc"
                    register={register}
                    error={errors.desc}
                />
                <DatePickerComponent
                    selectedDate={Data.date}
                    // onDateChange={(date) => handleDateChange(date, field)}
                    label="Delivery Date"
                    placeholder="Select Delivery Date"
                    id="deliveryDate"
                    className="w-full"

                />
                {
                    !parcelTypeLoading &&
                    <div>
                        {/* <label className="form-label">Parcel Type</label>
                        <Select
                            value={parcelType[selectedType]}
                            options={parcelType}
                            styles={selectStyles}
                            className="react-select"
                            classNamePrefix="select"
                            onChange={handleMenuChange}
                        /> */}
                        <Textinput
                            label="Parcel Type"
                            type="text"
                            placeholder="Parcel Type"
                            name="type"
                            register={register}
                            error={errors.parcelType}
                        />
                    </div>
                }
                {
                    !DeliveryparcelTypeLoading &&
                    <Textinput
                        label="Dimension Type"
                        type="text"
                        placeholder="Dimension Type"
                        name="dimensionType"
                        register={register}
                        error={errors.dimensionType}
                    />
                    // <div>
                    //     <label className="form-label">Delivery Type</label>
                    //     <Select
                    //         defaultValue={DeliveryParcelType[selectedMenus]}
                    //         options={DeliveryParcelType}
                    //         styles={selectStyles}
                    //         className="react-select"
                    //         classNamePrefix="select"
                    //         onChange={handleMenuChange}
                    //     />
                    // </div>
                }
                {
                    <div className=""></div>
                }
                <div>
                    <label className="form-label">Parcel Image</label>
                    <Fileinput preview multiple selectedFiles={selectedFile ? selectedFile : Data.image} onChange={handleFileChange} />
                </div>
            </form>
        </>
    )
}