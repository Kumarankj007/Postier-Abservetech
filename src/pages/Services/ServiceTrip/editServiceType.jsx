import React, { useEffect, useState } from 'react';
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/ButtonComp";
import { getApiMethos } from "@/components/services/gobal";
import usePutMutation from '@/hooks/usePutMuation';
import Select from "react-select";
import DatePickerComponent from "@/components/ui/input/DatePicker";
import MapComponent from "@/components/ui/GoogleMap/MapComponent"; // Import your MapComponent
import { APICONSTANT } from '@/components/services/config';

// Validation Schema
const FormValidationSchema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    email: yup.string().required("Email is required"),
    capacity: yup.string().required("Capacity is required"),
    avgPrice: yup.string().required("Average price is required"),
});

const tripStatus = [
    { value: "Pending", label: "Pending" },
    { value: "Published", label: "Published" },
    { value: "Transit", label: "Transit" },
    { value: "Finished", label: "Finished" },
    { value: "Cancelled", label: "Cancelled" }
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

const EditServiceType = () => {
    const location = useLocation();
    const search = new URLSearchParams(location.search);
    const id = search.get("id");

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedTripTypes, setSelectedTripTypes] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState();

    const [pickupLat, setPickupLat] = useState(null);
    const [pickupLng, setPickupLng] = useState(null);
    const [dropLat, setDropLat] = useState(null);
    const [dropLng, setDropLng] = useState(null);

    const { data } = useQuery({
        queryKey: ["Singleservicetype", APICONSTANT.viewServiceType + "/" + id],
        queryFn: getApiMethos,
        retry: 0,
        enabled: !!id,
    });

    useEffect(() => {
        if (data) {
            const trip = data?.data?.admin[0];
            reset({
                name: trip?.name || "",
                description: trip?.description || "",
                order: trip?.order || "",
                capacity: trip?.capacity || "",
                weight: trip?.weight || "",
                from: trip?.location?.pickUp || "",
                to: trip?.location?.drop || "",
                status: trip?.status || "",
                type: trip?.type || ""
            });

            setSelectedStatus(trip?.status ? { value: trip.status, label: trip.status } : null);

            const types = trip?.features?.map(type => ({
                value: type,
                label: type,
            })) || [];
            setSelectedTripTypes(types);

            if (trip?.createdAt) {
                const parsedDate = new Date(trip.createdAt);
                setStartDate(parsedDate);
            }

            if (trip?.updatedAt) {
                const parsedEndDate = new Date(trip.updatedAt);
                setEndDate(parsedEndDate)
            }

            if (trip?.pickupLat && trip?.pickupLng) {
                setPickupLat(trip.pickupLat);
                setPickupLng(trip.pickupLng);
            }

            if (trip?.dropLat && trip?.dropLng) {
                setDropLat(trip.dropLat);
                setDropLng(trip.dropLng);
            }
        }
    }, [data]);

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
        mode: "all",
    });

    const handleTripMenuChange = (selectedOptions) => {
        setSelectedTripTypes(selectedOptions);
    };

    const handleStatusChange = (selectedOption) => {
        setSelectedStatus(selectedOption);
    };

    const putMutation = usePutMutation("/trip");
    const onSubmit = (formData) => {
        // Format trip types as a comma-separated string
        const tripTypeString = selectedTripTypes.map(type => type.value).join(',');

        // Format dates as 'YYYY-MM-DD'
        const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
        const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

        putMutation.mutateAsync({
            url: { apiUrl: APICONSTANT.addTrips + "/" + id },
            body: {
                title: formData?.title,
                description: formData?.description,
                email: formData?.email,
                capacity: formData?.capacity,
                avgPrice: formData?.avgPrice,
                status: selectedStatus?.value,
                type: tripTypeString, // Use comma-separated string for types
                startDate: formattedStartDate, // Use formatted date
                endDate: formattedEndDate, // Use formatted date
                pickup: "Kalavasal", // You can replace with dynamic value if needed
                pickupLng: pickupLng,
                pickupLat: pickupLat,
                drop: "Theni", // You can replace with dynamic value if needed
                dropLng: dropLng,
                dropLat: dropLat,
            }
        })
            .then((response) => {
                console.log("Trip updated successfully", response);
            })
            .catch((error) => {
                console.error("Error updating trip", error);
            });
    };


    return (
        <Card
            title={"View Service Type"}
            // footer={<Button formId="editTripForm" />}
            backIcon={true}
        >
            <form
                id={"editTripForm"}
                onSubmit={handleSubmit(onSubmit)}
                className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
            >
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
                    type="order"
                    placeholder="Type order"
                    name="order"
                    register={register}
                    error={errors.order}
                />
                <Textinput
                    label="Capacity"
                    type="text"
                    placeholder="Type Capacity"
                    name="capacity"
                    register={register}
                    error={errors.capacity}
                />
                {/* <Textinput
                    label="Trip From"
                    type="text"
                    placeholder="From"
                    name="from"
                    register={register}
                    error={errors.from}
                />
                <Textinput
                    label="Trip To"
                    type="text"
                    placeholder="To"
                    name="to"
                    register={register}
                    error={errors.to}
                /> */}
                <Textinput
                    label="Weight"
                    type="number"
                    placeholder="Type Weight"
                    name="weight"
                    register={register}
                    error={errors.weight}
                />
                <Textinput
                    label="Status"
                    type="text"
                    placeholder="Status"
                    name="status"
                    register={register}
                    error={errors.status}
                />
                <div>
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
                </div>

            </form>
        </Card>
    );
};

export default EditServiceType;
