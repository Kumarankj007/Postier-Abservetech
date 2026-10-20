import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { APICONSTANT } from "@components/services/config";
import { deleteApiMethod } from "@components/services/gobal";
import { toast } from "react-toastify";
import ApiTable from "@/components/ui/Table/ApiTable";
import useActionPopover from "@/components/ui/Table/useActionPopover";
import { Textinput } from "@components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

const pageDetails = {
  listAPI: "viewRating",
  title: "Rating",
  addPage: "add-rating",
  editPage: "edit-rating",
  deleteAPI: "deleteRating",
  dataApiName: "rating",
};
const ViewRating = () => {
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
              url: APICONSTANT[pageDetails.deleteAPI],
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
      header: "Reference No",
      accessorKey: "moduleId.referenceNo",
      id: "moduleId.referenceNo",
    },
    {
      header: "comments",
      accessorKey: "comments",
      id: "comments",
    },
    {
      Header: "rating",
      accessorKey: "rating",
      id: "rating",
      cell: (cell) => <span className="normal-case">{cell.getValue()}</span>,
    },
    // {
    //   header: "reviewed",
    //   cell: (cell) => (
    //     <span className="normal-case">
    //       {`${cell?.row?.original?.reviewed?.fname} ${cell?.row?.original?.reviewed?.lname}`}
    //     </span>
    //   ),
    // },
    // {
    //   header: "reviewee",
    //   cell: (cell) => (
    //     <span className="normal-case">
    //       {`${cell?.row?.original?.reviewee?.fname} ${cell?.row?.original?.reviewee?.lname}`}
    //     </span>
    //   ),
    // },
    {
      Header: "Action",
      accessorKey: "action",
      id: "action",
      // read this documentation: https://tanstack.com/table/latest/docs/guide/cells
      cell: (cell) => ActionElement(cell.row.original._id),
    },
  ];

  const columns = useMemo(() => COLUMNS, []);
  // Just an example for additional filter handling
  // Pls Note
  // object as props always should be useMemo
  // function as props always should be useCallback
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
  );
};

export default ViewRating;
