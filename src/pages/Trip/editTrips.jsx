import React, { useEffect, useMemo, useState } from 'react';
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { APICONSTANT } from "../../components/services/config";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/ButtonComp";
import { getApiMethos } from "@/components/services/gobal";
import usePutMutation from '@/hooks/usePutMuation';
import Select from "react-select";
import DatePickerComponent from "@/components/ui/input/DatePicker";
import MapComponent from "@/components/ui/GoogleMap/MapComponent"; // Import your MapComponent
import ApiTable from '@/components/ui/Table/ApiTable';
import useActionPopover from '@/components/ui/Table/useActionPopover';
const pageDetails = {
    listAPI: "postbyTrips",
    title: "Post By Tripid",
    addPage: "add-post",
    ViewPage: "view-post",
    deleteAPI: "deletePost",
    dataApiName: "post",
};
// Validation Schema
const FormValidationSchema = yup.object({
    // title: yup.string().required("Title is required"),
    // description: yup.string().required("Description is required"),
    // email: yup.string().required("Email is required"),
    // capacity: yup.string().required("Capacity is required"),
    // avgPrice: yup.string().required("Average price is required"),
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

const EditTrips = () => {

    const navigate = useNavigate();
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
        mode: "all",
    });
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
        queryKey: ["SingleTrip", APICONSTANT.viewTrips + "/" + id],
        queryFn: getApiMethos,
        retry: 0,
        enabled: !!id,
    });

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true, // Use 24-hour format
            timeZone: "UTC", // Optional: Adjust timezone if needed
        }).format(new Date(date));
    };


    useEffect(() => {
        if (data) {
            const trip = data?.data?.trip[0];
            console.log("trippp", trip)
            reset({
                uniCode: trip?.uniCode || "",
                pickUp: trip?.location?.pickUp || "",
                drop: trip?.location?.drop || "",
                fname: trip?.postier?.fname || "",
                lname: trip?.postier?.lname || "",
                phone: trip?.postier?.phone || "",
                to: trip?.location?.drop || "",
                status: trip?.status || "",
                type: trip?.type || ""
            });

            setSelectedStatus(trip?.status ? { value: trip.status, label: trip.status } : null);

            // const types = trip?.type?.map(type => ({
            //     value: type,
            //     label: type,
            // })) || [];

            // setSelectedTripTypes(types);

            if (trip?.pickupDate) {
                const parsedDate = new Date(trip.pickupDate);
                setStartDate(parsedDate);
            }

            if (trip?.deliveryDate) {
                const parsedEndDate = new Date(trip.deliveryDate);
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



    const handleTripMenuChange = (selectedOptions) => {
        setSelectedTripTypes(selectedOptions);
    };

    const handleStatusChange = (selectedOption) => {
        setSelectedStatus(selectedOption);
    };

    const putMutation = usePutMutation("/trip");
    const onSubmit = (formData) => {
        console.log("formData", formData)
        const tripTypeString = selectedTripTypes.map(type => type.value).join(',');
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
                type: tripTypeString,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                pickup: "Kalavasal",
                pickupLng: pickupLng,
                pickupLat: pickupLat,
                drop: "Theni",
                dropLng: dropLng,
                dropLat: dropLat,
            }
        })
            .then((response) => {
                // Handle success response
                console.log("Trip updated successfully", response);
            })
            .catch((error) => {
                // Handle error response
                console.error("Error updating trip", error);
            });
    };

    const COLUMNS = [
        {
            header: "Reference No",
            accessorKey: "referenceNo",
            id: "referenceNo",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            header: "Full Name",
            accessorKey: "consignor.firstName",
            id: "firstName",
            cell: (info) => {
                const { firstName, lastName } = info.row.original.consignor || {};
                return firstName && lastName ? `${firstName} ${lastName}` : "N/A"
            },
        },


        {
            header: "Pick Up",
            accessorKey: "location.pickUp",
            id: "pickUp",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            header: "Drop",
            accessorKey: "location.drop",
            id: "drop",
            cell: (info) => info.getValue() || "N/A",
        },

        {
            header: "Fare",
            accessorKey: "parcel.fare",
            id: "fare",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            header: "Delivery Date",
            accessorKey: "parcel.deliveryDate",
            id: "deliveryDate",
            cell: (info) => formatDate(info.getValue()),
        },


        {
            header: "Status",
            accessorKey: "status",
            id: "status",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            header: "Action",
            accessorKey: "action",
            id: "action",
            cell: (cell) => ActionElement(cell.row.original._id),
        },
    ];

    const columns = useMemo(() => COLUMNS, []);
    const additionalSchema = useMemo(
        () => ({
            myfilter: {
                type: "string",
                default: "",
            },
        }),
        []
    );
    const actions = useMemo(
        () => [
            {
                name: "View",
                icon: "heroicons:pencil-square",
                doit: (e) => {
                    {
                        if (e.target.dataset.id) {
                            const id = e.target.dataset.id;
                            setOpen(false);
                            navigate(`${pageDetails.ViewPage}?id=${id}`, {
                                state: { type: "View", id: id },
                            });
                        }
                    }
                },
            },
            {
                name: "delete",
                doit: async (e) => {
                    if (e.target.dataset.id) {

                        const id = e.target.dataset.id;
                        console.log("idddd", id)
                        // modalRef.current.openModal(id);
                        const res = await deleteApiMethod({
                            id: id, //id should be passed here
                            url: APICONSTANT[pageDetails.listAPI],
                        });
                        if (res.type == "success") {
                            await queryClient.invalidateQueries({
                                queryKey: [pageDetails.listAPI],
                            });
                            toast.success(res.message);
                        }
                    }
                },
            },
        ],
        []
    );
    const { setOpen, ActionPopover, ActionElement } = useActionPopover({
        actions,
    });


    return (
        <>
            <Card
                title={"View Trip"}
                // footer={<Button formId="editTripForm" />}
                backIcon={true}
            >
                <form
                    id={"editTripForm"}
                    onSubmit={handleSubmit(onSubmit)}
                    className="lg:grid-cols-2 grid gap-5 grid-cols-1 pt-6"
                >
                    <Textinput
                        label="UniCode"
                        type="text"
                        placeholder="Type UniCode"
                        name="uniCode"
                        register={register}
                        error={errors.uniCode}
                    />
                    <Textinput
                        label="Pick Up"
                        type="text"
                        placeholder="Type Pick Up"
                        name="pickUp"
                        register={register}
                        error={errors.pickUp}
                    />
                    <Textinput
                        label="Drop"
                        type="text"
                        placeholder="Type Drop"
                        name="drop"
                        register={register}
                        error={errors.drop}
                    />
                    <Textinput
                        label="First Name"
                        type="text"
                        placeholder="Type First Name"
                        name="fname"
                        register={register}
                        error={errors.fname}
                    />
                    <Textinput
                        label="Last Name"
                        type="text"
                        placeholder="Type Last Name"
                        name="lname"
                        register={register}
                        error={errors.lname}
                    />
                    <Textinput
                        label="Phone Number"
                        type="text"
                        placeholder="Type Phone Number"
                        name="phone"
                        register={register}
                        error={errors.phone}
                    />


                    <div className='flex justify-between'>
                        <DatePickerComponent
                            selectedDate={startDate}
                            onDateChange={setStartDate}
                            label="Pick-Up Date"
                            placeholder="Select Pick-Up Date"
                            id="pickupDate"
                        />
                        <DatePickerComponent
                            selectedDate={endDate}
                            onDateChange={setEndDate}
                            label="Delivery Date"
                            placeholder="Select Delivery Date"
                            id="deliveryDate"
                        />
                    </div>

                    <Textinput
                        label="Status"
                        type="text"
                        placeholder="Status"
                        name="status"
                        register={register}
                        error={errors.status}
                    />

                </form>

            </Card>
            <Card>
                <ApiTable
                    columns={columns}
                    title={pageDetails.title}
                    listAPI={pageDetails.listAPI}
                    addPage={pageDetails.addPage}
                    additionalSchema={additionalSchema}
                    dataApiName={pageDetails.dataApiName}
                />
                {ActionPopover}

            </Card>
        </>
    );
};

export default EditTrips;
