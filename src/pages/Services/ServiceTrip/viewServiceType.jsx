import React, { useMemo, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import ApiTable from "@/components/ui/Table/ApiTable";
import useActionPopover from "@/components/ui/Table/useActionPopover";
import Modal from '@/components/ui/modal/deleteModal';
import { deleteApiMethod } from '@/components/services/gobal';
import { toast } from 'react-toastify';
import { APICONSTANT } from '@/components/services/config';
import { useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';

const pageDetails = {
    listAPI: "viewServiceType",
    title: "Service Type",
    viewPage: "view-servicetype",
    addPage: "add-servicetype",
    dataApiName: "admin",
}

const viewServiceType = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const modalRef = useRef();
    const [deleteid, setdeleteid] = useState(false)
    const [modal, setModal] = useState(false)
    const delAction = async (id) => {
        const res = await deleteApiMethod({
            id: id, //id should be passed here
            url: APICONSTANT[pageDetails.listAPI],
        });
        if (res.type == "success") {
            await queryClient.invalidateQueries({
                queryKey: [pageDetails.listAPI],
            });
            toast.success(res.message);
            setModal(false)
        }
    };

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
                        setdeleteid(id)
                        // modalRef.current.openModal(id);
                        setModal(true)
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
            header: "Name",
            accessorKey: "name",
            id: "name",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            header: "Description",
            accessorKey: "description",
            id: "description",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            header: "Order",
            accessorKey: "order",
            id: "order",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            header: "Gender",
            accessorKey: "gender",
            id: "gender",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            header: "Capacity",
            accessorKey: "capacity",
            id: "capacity",
            cell: (info) => info.getValue() || "N/A",
        },
        {
            header: "Weight",
            accessorKey: "weight",
            id: "weight",
            cell: (info) => info.getValue() || "N/A",
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
    console.log('modalRef', modalRef.current)
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
            <Modal
                ref={modalRef}
                title="Service Type"
                activeModal={modal}
                onClose={() => setModal(false)}
                footerContent={
                    <Button
                        text="Yes"
                        className="btn-dark "
                        onClick={() => delAction(deleteid)}
                    />
                }
            >
                Are you sure want to delete?
            </Modal>
        </>
    )
}

export default viewServiceType
