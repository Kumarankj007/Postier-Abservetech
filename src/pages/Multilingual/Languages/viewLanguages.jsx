import React, { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ApiTable from "@/components/ui/Table/ApiTable";
import useActionPopover from "@/components/ui/Table/useActionPopover";
import { deleteApiMethod } from "@/components/services/gobal";
import { APICONSTANT } from "@/components/services/config";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const pageDetails = {
  listAPI: "viewLanguages",
  title: "Languages",
  viewPage: "Edit-Languages",
  addPage: "add-Languages",
  dataApiName: "language",
};

const viewLanguages = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const modalRef = useRef();
  const actions = useMemo(
    () => [
      {
        name: "Edit",
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
      // {
      //   name: "delete",
      //   doit: async (e) => {
      //     if (e.target.dataset.id) {
      //       const id = e.target.dataset.id;
      //       console.log("idddd", id);
      //       // modalRef.current.openModal(id);
      //       const res = await deleteApiMethod({
      //         id: id, //id should be passed here
      //         url: APICONSTANT[pageDetails.listAPI],
      //       });
      //       if (res.type == "success") {
      //         await queryClient.invalidateQueries({
      //           queryKey: [pageDetails.listAPI],
      //         });
      //         toast.success(res.message);
      //       }
      //     }
      //   },
      // },
    ],
    [],
  );

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  };

  const { setOpen, ActionPopover, ActionElement } = useActionPopover({
    actions,
  });

  const COLUMNS = [
    {
      header: "name",
      accessorKey: "name",
      id: "name",
      cell: (info) => info.getValue() || "N/A",
    },
    {
      header: "status",
      accessorKey: "status",
      id: "status",
      cell: (info) => {
        console.log("infooo", info.row.original.status);
        const status = info?.row?.original?.status;
        // info.getValue() || "N/A"
        return <span>{status === true ? "active" : "inactive"}</span>;
      },
    },
    {
      header: "createdAt",
      accessorKey: "createdAt",
      id: "createdAt",
      cell: (info) => {
        const date = new Date(info.getValue());
        return date ? formatDate(date) : "N/A";
      },
    },
    {
      header: "updatedAt",
      accessorKey: "updatedAt",
      id: "updatedAt",
      cell: (info) => {
        const date = new Date(info.getValue());
        return date ? formatDate(date) : "N/A";
      },
    },
    {
      header: "file",
      accessorKey: "file",
      id: "file",
      cell: (info) =>
        // info.getValue() || "N/A",
        {
          const fileUrl = info.getValue();
          const index = info.row.original.indexName;
          console.log(index, "index");
          if (fileUrl) {
            const handleDownload = async () => {
              const res = await fetch(import.meta.env.VITE_API_URL + fileUrl);
              const blob = await res.blob();

              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = (index || "file") + ".json";
              a.click();

              URL.revokeObjectURL(url);
            };
            return (
              <a
                onClick={handleDownload}
                // href={import.meta.env.VITE_API_URL + fileUrl}
                // download // Instructs the browser to download the file
                // target="_blank" // Optional: Opens in a new tab if needed
                // rel="noopener noreferrer" // Security for new tabs
                className="text-blue-500 underline cursor-pointer"
              >
                {/* {info.getValue()} */}
                download
              </a>
            );
          }
          return "N/A";
        },
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
    }),
    [],
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
      {ActionPopover}
    </>
  );
};

export default viewLanguages;
