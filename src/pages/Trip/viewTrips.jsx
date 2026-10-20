import React, { useMemo } from 'react'
import { useNavigate } from "react-router-dom";
import ApiTable from "@/components/ui/Table/ApiTable";
import useActionPopover from "@/components/ui/Table/useActionPopover";
import { deleteApiMethod } from '@/components/services/gobal';
import { APICONSTANT } from '@/components/services/config';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const pageDetails = {
    listAPI: "viewTrips",
    title: "Trips",
    viewPage: "edit-trips",
    addPage: "add-trip",
    dataApiName: "trips",
}

const viewTrips = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
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
    const actions = useMemo(
        () => [
            {
                name: "View",
                icon: "heroicons:pencil-square",
                doit: (e) => {
                    {
                        console.log("iddddd", e.target.dataset.id)
                        if (e.target.dataset.id) {
                            const id = e.target.dataset.id;
                            setOpen(false);
                            navigate(`${pageDetails.viewPage}?id=${id}`, {

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


    const COLUMNS = [
        {
            header: "UniCode",
            accessorKey: "uniCode",
            id: "uniCode",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            header: "Full Name",
            accessorKey: "postier.fname",
            id: "firstName",
            cell: (info) => {
                const { fname, lname } = info.row.original.postier || {};
                return fname && lname ? `${fname} ${lname}` : "N/A";
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



        // {
        //     header: "Phone Number",
        //     accessorKey: "postier.phone",
        //     id: "phone",
        //     cell: (info) => info.getValue() || "N/A",
        // },

        // {
        //     header: "Pick-Up Date",
        //     accessorKey: "pickupDate",
        //     id: "pickupDate",
        //     cell: (info) => formatDate(info.getValue()),
        // },
        {
            header: "Delivery Date",
            accessorKey: "deliveryDate",
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
        }), [])
    return (
        <>
            <ApiTable
                columns={columns}
                title={pageDetails.title}
                listAPI={pageDetails.listAPI}
                addPage={pageDetails.addPage}
                additionalSchema={additionalSchema}
                dataApiName={pageDetails.dataApiName}
            />
            {ActionPopover}
        </>
    )
}

export default viewTrips
