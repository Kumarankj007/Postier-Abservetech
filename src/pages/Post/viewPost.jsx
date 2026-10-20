import React, { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { APICONSTANT } from "@components/services/config";
import { deleteApiMethod } from "@components/services/gobal";
import { toast } from "react-toastify";
import ApiTable from "@/components/ui/Table/ApiTable";
import useActionPopover from "@/components/ui/Table/useActionPopover";
import Modal from "@components/ui/modal/deleteModal";
import { useQueryClient } from "@tanstack/react-query";

const pageDetails = {
  listAPI: "getPost",
  title: "Post",
  addPage: "add-post",
  ViewPage: "view-post",
  deleteAPI: "deletePost",
  dataApiName: "posts",
};
const ViewUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const modalRef = useRef();


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
  // Table Actions and Columns
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

export default ViewUser;
