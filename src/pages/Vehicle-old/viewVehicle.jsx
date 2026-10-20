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
  listAPI: "viewVehicle",
  title: "Vehicle",
  addPage: "add-vehicle",
  editPage: "edit-vehicle",
  deleteAPI: "deleteVehicle",
  dataApiName: "vehicleCategory",
};
const ViewAdmin = () => {
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
  // Table Actions and Columns
  const COLUMNS = [
    {
      header: "name",
      accessorKey: "name",
      id: "name",
    },
    {
      header: "image",
      cell: (cell) => (
        <div className="w-[100px]">
          <img
            src={`${import.meta.env.VITE_API_URL}${cell?.row?.original?.image}`}
            alt="vehicleImage"
          />
        </div>
      ),
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
      {/* only one popover for whole table, avoid popover bloating by providing inside each row*/}
      {ActionPopover}
    </>
  );
};

export default ViewAdmin;
