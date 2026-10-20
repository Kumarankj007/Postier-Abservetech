import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APICONSTANT } from "@components/services/config";
import { deleteApiMethod } from "@components/services/gobal";
import { toast } from "react-toastify";
import ApiTable from "@/components/ui/Table/ApiTable";
import useActionPopover from "@/components/ui/Table/useActionPopover";
import { useQueryClient } from "@tanstack/react-query";
import Modal from "@components/ui/modal/deleteModal";
import Button from "@/components/ui/Button";
import { handleImageError } from "@/Helper";

const pageDetails = {
  listAPI: "getAdmin",
  title: "Admin",
  addPage: "add-admin",
  editPage: "edit-admin",
  deleteAPI: "deleteAdmin",
  dataApiName: "admin",
};
const ViewAdmin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const modalRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const delAction = async (id) => {
    const res = await deleteApiMethod({
      id: id, //id should be passed here
      url: APICONSTANT[pageDetails.deleteAPI],
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
      // {
      //   name: "delete",
      //   doit: async (e) => {
      //     if (e.target.dataset.id) {
      //       const id = e.target.dataset.id;
      //       console.log("idddd", id);
      //       modalRef.current.openModal(id);
      //       // const res = await deleteApiMethod({
      //       //   id: id,
      //       //   url: APICONSTANT[pageDetails.listAPI],
      //       // });
      //       // if (res.type == "success") {
      //       //   await queryClient.invalidateQueries({
      //       //     queryKey: [pageDetails.listAPI],
      //       //   });
      //       //   toast.success(res.message);
      //       // }
      //     }
      //   },
      // },
    ],
    [],
  );

  const { setOpen, ActionPopover, ActionElement } = useActionPopover({
    actions,
  });
  // Table Actions and Columns
  const COLUMNS = [
    {
      header: "fname",
      accessorKey: "fname",
      id: "fname",
    },

    {
      Header: "lname",
      accessorKey: "lname",
      id: "lname",
    },
    {
      Header: "email",
      accessorKey: "email",
      id: "email",
      cell: (cell) => <span className="normal-case">{cell.getValue()}</span>,
    },
    {
      Header: "phone",
      accessorKey: "phone",
      id: "phone",
    },
    {
      Header: "profile",
      accessorKey: "profile",
      id: "profile",
      cell: (cell) => (
        <div>
          <span className="inline-flex items-center">
            <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
              <img
                src={import.meta.env.VITE_API_URL + cell.getValue()}
                alt=""
                className="object-cover w-full h-full rounded-full"
                onError={handleImageError}
              />
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
              {cell.row.original.fname} {cell.row.original.lname}
            </span>
          </span>
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
    [],
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
      {/* <Modal
        ref={modalRef}
        delAction={delAction}
        uncontrol
        title="Delete"
        showModal={showModal}
        setShowModal={setShowModal}
        footerContent={
          <Button
            text="Accept"
            className="btn-dark"
            onClick={() => {
              delStore(storeid)
            }}
          />
        }
      /> */}
      {/* <Modal ref={modalRef} delAction={delAction} /> */}
      {({ filter, setFilter }) => (
        <>
          {/* This is Just an example for adding filters to Table, you can safely comment this filter code after review */}
          {/* <Textinput
              type="search"
              placeholder="myFilter"
              value={filter.myfilter}
              onChange={(e) => {
                setFilter((prev) => ({
                  ...prev,
                  page: 1,
                  myfilter: e.target.value,
                }));
              }}
            /> */}
        </>
      )}
    </>
  );
};

export default ViewAdmin;
