import React, { useMemo } from 'react';
import { APICONSTANT } from '@/components/services/config';
import { deleteApiMethod } from '@/components/services/gobal';
import ApiTable from '@/components/ui/Table/ApiTable';
import useActionPopover from '@/components/ui/Table/useActionPopover';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const pageDetails = {
    listAPI: "getEmailTemplate",
    title: "Template",
    addPage: "email-TemplateForm",
    editPage: "email-TemplateForm",
    deleteAPI: "deleteEmailTemplate",
    dataApiName: "documents",
}

const emailTemplate = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const actions = useMemo(
        () => [
            {
                name: "edit",
                icon: "heroicons:pencil-square",
                doit: (e) => {
                    {
                        if (e.target.dataset.id) {
                            const id = e.target.dataset.id;
                            setOpen(false);
                            navigate(`${pageDetails.editPage}?id=${id}`, {
                                state: { type: "edit", id: id },
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
                        setOpen(false);
                        const res = await deleteApiMethod({
                            id: id, //id should be passed here
                            url: APICONSTANT[pageDetails.listAPI],
                        });
                        if (res.type == "success") {
                            queryClient.invalidateQueries({
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
    // Table Actions and Columns
    const COLUMNS = [
        {
            header: "Title",
            accessorKey: "subject",
            id: "title",
        },
        {
            Header: "Type",
            accessorKey: "description",
            id: "type",
            cell: (cell) => <span className="normal-case">{cell.getValue()}</span>,
        },
        {
            Header: "Action",
            accessorKey: "action",
            id: "action",
            // read this documentation: https://tanstack.com/table/latest/docs/guide/cells
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

    return (
        <>
            <ApiTable
                columns={columns}
                title={pageDetails.title}
                // apiKey from APICONSTANT, and key should be unique
                listAPI={pageDetails.listAPI}
                addPage={pageDetails.addPage}
                additionalSchema={additionalSchema}
                dataApiName={pageDetails.dataApiName}
            />
            {ActionPopover}
        </>
    )
}

export default emailTemplate
