import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { APICONSTANT } from "@components/services/config";
import { deleteApiMethod } from "@components/services/gobal";
import { toast } from "react-toastify";
import ApiTable from "@/components/ui/Table/ApiTable";
import useActionPopover from "@/components/ui/Table/useActionPopover";
import { useQueryClient } from "@tanstack/react-query";

const pageDetails = {
  listAPI: "viewParcelType",
  title: "parcelType",
  addPage: "add-parcelType",
  editPage: "edit-parcelType",
  deleteAPI: "deleteParcelType",
  dataApiName: "parcelType",
}

const viewParcelType = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
              url: APICONSTANT[pageDetails.deleteAPI],
            });
            if (res.type == "success") {
              // debugger;
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
      header: "name",
      accessorKey: "name",
      id: "name",
    },

    {
      header: "status",
      accessorKey: "status",
      id: "status",
      cell: (cell) => <span>{cell?.original?.status === true ? 'active' : 'inactive'}</span>
    },

    {
      header: "Action",
      accessorKey: "action",
      id: "action",
      // read this documentation: https://tanstack.com/table/latest/docs/guide/cells
      cell: (cell) => ActionElement(cell.row.original._id),
    }
  ]

  const columns = useMemo(() => COLUMNS, []);
  // Just an example for additional filter handling
  // Pls Note
  // object as props always should be useMemo
  // function as props always should be useCallback
  console.log(columns);

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

export default viewParcelType
