import React, { useMemo, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import ApiTable from "@/components/ui/Table/ApiTable";
import useActionPopover from "@/components/ui/Table/useActionPopover";
import { deleteApiMethod } from '@/components/services/gobal';
import { APICONSTANT } from '@/components/services/config';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const pageDetails = {
    listAPI: "viewPricing",
    title: "Pricing Type",
    viewPage: "view-Pricing",
    addPage: "add-Pricing",
    dataApiName: "Pricing",
}

const viewPricing = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const modalRef = useRef();
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
            header: "Service Type",
            accessorKey: "serviceId.name",
            id: "servicetype",
            cell: (info) => info.getValue() || "N/A",
        },
        // {
        //     header: "Weight Fare",
        //     accessorKey: "weightFare",
        //     id: "weightFare",
        //     cell: (info) => info.getValue() || "N/A",
        // },
        // {
        //     header: "Booking Fare",
        //     accessorKey: "bookingFare",
        //     id: "bookingFare",
        //     cell: (info) => info.getValue() || "N/A",
        // },
        // {
        //     header: "Time Fare",
        //     accessorKey: "timeFare",
        //     id: "timeFare",
        //     cell: (info) => info.getValue() || "N/A",
        // },
        // {
        //     header: "Minimum Fare",
        //     accessorKey: "minimumFare",
        //     id: "minimumFare",
        //     cell: (info) => info.getValue() || "N/A",
        // },
        // {
        //     header: "Commision",
        //     accessorKey: "commision",
        //     id: "commision",
        //     cell: (info) => info.getValue() || "N/A",
        // },

        // {
        //     header: "Pricing Fare",
        //     accessorKey: "fare.value",
        //     id: "fare.value",
        //     cell: (info) => { console.log("Data: ", info.row.original); return info.getValue() || "N/A" },
        // },
        // {
        //     header: "Cancellation Fare (Postier)",
        //     accessorKey: "cancelationFare.postier",
        //     id: "cancelationFare.postier",
        //     cell: (info) => { console.log("Data: ", info.row.original); return info.getValue() || "N/A" },
        // },
        // {
        //     header: "Cancellation Fare (User)",
        //     accessorKey: "cancelationFare.user",
        //     id: "cancelationFare.user",
        //     cell: (info) => { console.log("Data: ", info.row.original); return info.getValue() || "N/A" },
        // },
        // {
        //     header: "Waiting Fare (allowed min)",
        //     accessorKey: "waitingFare.allowedMin",
        //     id: "waitingFare.allowedMin",
        //     cell: (info) => { console.log("Data: ", info.row.original); return info.getValue() || "N/A" },
        // },
        // {
        //     header: "Waiting Fare (fare)",
        //     accessorKey: "waitingFare.fare",
        //     id: "waitingFare.fare",
        //     cell: (info) => { console.log("Data: ", info.row.original); return info.getValue() || "N/A" },
        // },
        // {
        //     header: "Tax Fare",
        //     accessorKey: "taxFare.fare",
        //     id: "taxFare.fare",
        //     cell: (info) => { console.log("Data: ", info.row.original); return info.getValue() || "N/A" },
        // },

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

export default viewPricing
