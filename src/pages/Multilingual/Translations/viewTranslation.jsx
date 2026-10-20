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
    listAPI: "viewTranslation",
    title: "Translation",
    viewPage: "view-translation",
    dataApiName: "translations",
}

const viewTranslation = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const modalRef = useRef();
    const [deletetype, setdeletetype] = useState(false)

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
        }
    };

    const actions = useMemo(
        () => [
            {
                name: "Edit",
                icon: "heroicons:pencil-square",
                doit: (e) => {
                    console.log("dataserrr", e);
                    // debugger
                    if (e.target.dataset.id) {
                        const data = JSON.parse(e.target.dataset.id);
                        console.log("dataaid", e.target.dataset.id)
                        const id = data.data_id;
                        const groupId = data.data_groupid;
                        const interpret = data.interpret
                        console.log(id, groupId, "groupsid")
                        setOpen(false);
                        navigate(`${pageDetails.viewPage}?id=${id}`, {
                            state: { type: "View", id, groupId, interpret },
                        });
                    }
                },
            },
            {
                name: "delete",
                doit: async (e) => {
                    if (e.target.dataset.id) {
                        const id = e.target.dataset.id;
                        modalRef.current.openModal(id);
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
            header: "Group",
            accessorKey: "group",
            id: "group",
            cell: (info) => {
                const group = info.row.original.group;
                return group?.interpret || "N/A"
            },
        },
        {
            header: "Interpret",
            accessorKey: "interpret",
            id: "interpret",
            cell: (info) => info.getValue() || "N/A",
        },

        {
            header: "Action",
            accessorKey: "action",
            id: "action",
            cell: (cell) =>

            // ActionElement(cell.row.original._id),
            {
                const row = cell.row.original;
                const _id = row._id; // The main ID
                const groupId = row.group?._id || null; // Group ID if it exists
                const interpret = row.interpret
                return (
                    <ActionElement
                        data_id={_id} // Include the main ID
                        data_groupid={groupId}
                        interpret={interpret}// Include the group ID
                    />
                );
            }

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

export default viewTranslation
